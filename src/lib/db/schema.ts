import {pgTable, timestamp, uuid, text, unique} from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    name: text('name').notNull().unique()
});

export type User = typeof users.$inferSelect;

export const feeds = pgTable('feeds', {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    name: text('name').notNull(),
    url: text('url').notNull().unique(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    lastFetchedAt: timestamp("last_fetched_at"),
});

export type Feed = typeof feeds.$inferSelect;

export const feed_follows = pgTable('feed_follows', {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    feedId: uuid('feed_id')
        .notNull()
        .references(() => feeds.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
}, (table) => ({
    uniqueFeedUser: unique().on(table.userId, table.feedId)
}));

export type FeedFollow = typeof feed_follows.$inferSelect;

export const posts = pgTable('posts', {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    title: text('title').notNull(),
    url: text('url').notNull().unique(),
    description: text('description'),
    publishedAt: timestamp('published_at').notNull(),
    feedId: uuid('feed_id')
        .notNull()
        .references(() => feeds.id, { onDelete: 'cascade' }),
});

export type NewPost = typeof posts.$inferSelect;