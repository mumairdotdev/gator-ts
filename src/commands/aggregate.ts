import {RSSFeed, RSSItem, fetchFeed} from '../lib/rss';

export async function handleRSSCommand(commandName: string, ...args: string[]): Promise<void> {
    const feedURL = 'https://www.wagslane.dev/index.xml';
    try {
        const feed = await fetchFeed(feedURL);
        console.log(`Fetched RSS feed: ${feed.channel.title}`);
        console.log(`Link: ${feed.channel.link}`);
        console.log(`Description: ${feed.channel.description}`);
        console.log('Items:');
        feed.channel.item.forEach((item: RSSItem, index: number) => {
            console.log(`  ${index + 1}. ${item.title}`);
            console.log(`     Link: ${item.link}`);
            console.log(`     Description: ${item.description}`);
            console.log(`     Published Date: ${item.pubDate}`);
        });
    } catch (error) {
        console.error(`Error fetching RSS feed from ${feedURL}:`, error);
        throw error;
    }
}