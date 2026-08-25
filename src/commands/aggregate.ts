import {RSSItem, fetchFeed} from '../lib/rss';
import {getNextFeedToFetch, markFeedFetched} from '../lib/db/queries/feeds.js';
import { parseDuration } from '../lib/time';
import { Feed, NewPost } from '../lib/db/schema.js';
import { createPost } from '../lib/db/queries/posts.js';

export async function handleRSSCommand(commandName: string, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error(`Usage: ${commandName} <subcommand>`);
    }

    const timeArg = args[0];
    const duration = parseDuration(timeArg);
    if (duration === undefined) {
        throw new Error(`Invalid duration format: ${timeArg}`);
    }

    console.log(`Scraping feeds every ${duration} milliseconds...`);
    const intervalId = setInterval(async () => {
        try {
            await scrapeFeeds();
        } catch (error) {
            handleError(error);
        }
    }, duration);

    await new Promise<void>((resolve) => {
        process.on('SIGINT', () => {
            clearInterval(intervalId);
            console.log('Feed scraping stopped.');
            resolve();
        });
    });
}

async function scrapeFeeds() {
    const feed = await getNextFeedToFetch();
    if (!feed) {
        console.log('No feeds to fetch.');
        return;
    }
    
    console.log(`Next feed to fetch: ${feed.name} (${feed.url})`);
    const feedData = await fetchFeed(feed.url);
    await markFeedFetched(feed.id);

    for (const item of feedData.channel.item) {
        console.log(`Found post: ${item.title}`);

        const now = new Date();

        await createPost({
            title: item.title,
            url: item.link,
            description: item.description,
            publishedAt: new Date(item.pubDate),
            feedId: feed.id,
            createdAt: now,
            updatedAt: now,
        } as NewPost);
    }

    console.log(`Finished fetching feed: ${feed.name}`);
}

function handleError(error: unknown) {
    if (error instanceof Error) {
        console.error('Error scraping feed:', error.message);
    } else {
        console.error('Error scraping feed:', error);
    }
}