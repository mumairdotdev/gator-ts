import { getPostsForUsers } from "../lib/db/queries/posts";
import type { User } from "../lib/db/schema";

export async function handlerBrowse(
    cmdName: string,
    user: User,
    ...args: string[]
) {
    let limit = 2;
    if (args.length > 0) {
        const limitArg = args[0];
        const parsedLimit = parseInt(limitArg, 10);
        if (isNaN(parsedLimit) || parsedLimit <= 0) {
            throw new Error(`Invalid limit: ${limitArg}`);
        }
        limit = parsedLimit;
    }

    const posts = await getPostsForUsers(user.id, limit);
    console.log(`Found ${posts.length} posts for user ${user.name}:`);
    for (const post of posts) {
        console.log(`* ${post.title} (${post.url})`);
        console.log(`  Published at: ${post.publishedAt}`);
        console.log(`  Feed: ${post.feedName}`);
        console.log(`  Description: ${post.description}`);
    }
}