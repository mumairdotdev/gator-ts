import {desc, eq} from "drizzle-orm";
import {db} from "..";
import { feeds, NewPost, posts, feed_follows } from "../schema";

export async function createPost(post: NewPost) {
    const [createdPost] = await db.insert(posts).values(post).returning();
    return createdPost;
}

export async function getPostsForUsers(userId: string, limit: number) {
    const postsForUser = await db
        .select({
            id: posts.id,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
            title: posts.title,
            url: posts.url,
            description: posts.description,
            publishedAt: posts.publishedAt,
            feedId: posts.feedId,
            feedName: feeds.name,
        })
        .from(posts)
        .innerJoin(feed_follows, eq(posts.feedId, feed_follows.feedId))
        .innerJoin(feeds, eq(posts.feedId, feeds.id))
        .where(eq(feed_follows.userId, userId))
        .orderBy(desc(posts.publishedAt))
        .limit(limit);

    return postsForUser;
}