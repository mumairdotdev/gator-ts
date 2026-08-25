import {db} from "..";
import {users, feeds, feed_follows} from "../schema";
import {eq, and} from "drizzle-orm";

export async function createFeed(name: string, url: string, userId: string) {
    const [feed] = await db.insert(feeds).values({name: name, url: url, userId: userId}).returning();
    return feed;
}

export async function getFeeds() {
    const feed = await db.select().from(feeds);
    return feed;
}

export async function getFeedByUrl(feedUrl: string) {
    const [feed] = await db.select().from(feeds).where(eq(feeds.url, feedUrl)).limit(1);
    return feed;
}