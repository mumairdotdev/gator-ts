import {createFeed, getFeeds} from '../lib/db/queries/feeds.js';
import {createFeedFollow} from '../lib/db/queries/feed-follows.js';
import {getUserById, getUserByName} from '../lib/db/queries/users.js';
import type {Feed, User} from '../lib/db/schema.js';
import {readConfig} from '../config.js';
import { printFeedFollow } from './feed-follows.js';

function printFeed(feed: Feed, user: User): void {
    console.log('Feed:');
    console.log(`* id: ${feed.id}`);
    console.log(`* name: ${feed.name}`);
    console.log(`* url: ${feed.url}`);
    console.log(`* userId: ${feed.userId}`);
    console.log(`* userName: ${user.name}`);
    console.log(`* createdAt: ${feed.createdAt.toISOString()}`);
    console.log(`* updatedAt: ${feed.updatedAt.toISOString()}`);
}

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length < 2) {
        throw new Error(`Usage: ${cmdName} <feed_name> <feed_url>`);
    }
    const feedName = args[0];
    const feedUrl = args[1];

    const feed = await createFeed(feedName, feedUrl, user.id);
    if (!feed) {
        throw new Error(`Failed to create feed ${feedName}`);
    }

    const feedFollow = await createFeedFollow(feed.id, user.id);
    printFeedFollow(feedFollow.userName, feedFollow.feedName);

    console.log(`Feed ${feedName} created successfully for user ${user.name}`);
    printFeed(feed, user);
}

export async function handlerListFeeds(_: string): Promise<void> {
    const feeds = await getFeeds();
    if (feeds.length === 0) {
        console.log('No feeds found.');
        return;
    }

    for (const feed of feeds) {
        const user = await getUserById(feed.userId);
        if (!user) {
            console.log(`User with ID ${feed.userId} not found for feed ${feed.name}`);
            continue;
        }
        printFeed(feed, user);
    }
}

