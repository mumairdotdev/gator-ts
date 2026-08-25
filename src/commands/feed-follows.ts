import { getFeedByUrl } from '../lib/db/queries/feeds.js';
import { createFeedFollow, getFeedFollowsForUser, deleteFeedFollow } from '../lib/db/queries/feed-follows.js';
import { User } from '../lib/db/schema.js';

export async function handlerFollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error(`Usage: ${cmdName} <url>`);
    }
    const url = args[0];
    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`Feed with URL ${url} not found`);
    }

    const feedFollow = await createFeedFollow(feed.id, user.id);
    if (!feedFollow) {
        throw new Error(`Failed to follow feed with ID ${feed.id}`);
    }
    console.log(`Feed follow created successfully for user ${user.name}`);
    printFeedFollow(feedFollow.userName, feedFollow.feedName);
}

export async function handlerFollowing(_: string, user: User): Promise<void> {
    const feedFollows = await getFeedFollowsForUser(user.id);
    if (feedFollows.length === 0) {
        console.log(`User ${user.name} is not following any feeds.`);
        return;
    }

    console.log(`Feeds followed by ${user.name}:`);
    for (const feedFollow of feedFollows) {
        console.log(`* ${feedFollow.feedName}`);
    }
}

export function printFeedFollow(username: string, feedname: string) {
  console.log(`* User:          ${username}`);
  console.log(`* Feed:          ${feedname}`);
}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error(`Usage: ${cmdName} <url>`);
    }
    const url = args[0];
    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`Feed with URL ${url} not found`);
    }

    await deleteFeedFollow(feed.id, user.id);
    console.log(`User ${user.name} unfollowed ${feed.name}`);
}