import {XMLParser} from 'fast-xml-parser';

export type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
}

export type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const response = await fetch(feedURL, {
        method: 'GET',
        headers: {
            'User-Agent': 'gator',
            accept: 'application/rss+xml',
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed from ${feedURL}: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();

    const xmlParser = new XMLParser({
        processEntities: false,
    });

    const rssFeed = xmlParser.parse(xmlText);

    const channel = rssFeed?.rss?.channel;
    if (!channel) {
        throw new Error('Invalid RSS feed format');
    }

    if (!channel.title || !channel.link || !channel.description || !channel.item) {
        throw new Error('Missing required channel fields in RSS feed');
    }
    const { title, link, description } = channel;

    const items: any[] = Array.isArray(channel.item) ? channel.item : [channel.item];
    
    const rssItems: RSSItem[] = [];

    for (const item of items) {
        if (!item.title || !item.link || !item.description || !item.pubDate) {
            console.warn('Skipping item with missing required fields:', item);
            continue;
        }
        rssItems.push({
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate,
        });
    }

    const rss: RSSFeed = {
        channel: {
            title,
            link,
            description,
            item: rssItems,
        },
    };

    return rss;
}