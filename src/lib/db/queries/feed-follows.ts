import {db} from "..";
import {users, feeds, feed_follows} from "../schema";
import {eq, and} from "drizzle-orm";

export async function createFeedFollow(feedId: string, userId: string) {
    const [newFeedFollow] = await db.insert(feed_follows).values({feedId: feedId, userId: userId}).returning();

    const [feedFollowWithNames] = await db.select({
        id: feed_follows.id,
        createdAt: feed_follows.createdAt,
        updatedAt: feed_follows.updatedAt,
        feedId: feed_follows.feedId,
        userId: feed_follows.userId,
        userName: users.name,
        feedName: feeds.name,
    }).from(feed_follows)
        .innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
        .innerJoin(users, eq(feed_follows.userId, users.id))
        .where(
            and(
                eq(feed_follows.id, newFeedFollow.id),
                eq(feed_follows.feedId, newFeedFollow.feedId)
            )
        )
        .limit(1);

    if (!feedFollowWithNames) {
        throw new Error('Failed to load created feed follow');
    }

    return feedFollowWithNames;
}

export async function getFeedFollowsForUser(userId: string) {
    const feedFollows = await db.select({
        id: feed_follows.id,
        createdAt: feed_follows.createdAt,
        updatedAt: feed_follows.updatedAt,
        feedId: feed_follows.feedId,
        userId: feed_follows.userId,
        userName: users.name,
        feedName: feeds.name,
    }).from(feed_follows)
        .innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
        .innerJoin(users, eq(feed_follows.userId, users.id))
        .where(eq(feed_follows.userId, userId));

    return feedFollows;
}

export async function deleteFeedFollow(feedId: string, userId: string) {
    const result = await db.delete(feed_follows)
        .where(
            and(
                eq(feed_follows.feedId, feedId),
                eq(feed_follows.userId, userId)
            )
        )
        .returning();

    return result;
}