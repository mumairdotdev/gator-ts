import {db} from "..";
import {feeds} from "../schema";
import {eq, sql} from "drizzle-orm";

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

export async function markFeedFetched(feedId: string) {
  const result = await db
    .update(feeds)
    .set({
      lastFetchedAt: new Date(),
    })
    .where(eq(feeds.id, feedId))
    .returning();
  return result;
}

export async function getNextFeedToFetch() {
  const result = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} asc nulls first`)
    .limit(1);
  return result[0];
}