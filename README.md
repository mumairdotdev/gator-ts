# Gator

Gator is a command-line RSS feed aggregator backed by PostgreSQL.

## Requirements

- Node.js `22.15.0` (see `.nvmrc`)
- PostgreSQL
- A PostgreSQL connection URL for a database you can use locally

## Install

```bash
npm install
```

## Configure

Create `~/.gatorconfig.json` in your home directory. Replace the connection URL with your PostgreSQL database URL:

```json
{
  "db_url": "postgres://postgres:postgres@localhost:5432/gator",
  "current_user_name": ""
}
```

`db_url` is required. `current_user_name` is updated automatically by `register` and `login`, so it can start as an empty string.

Run the database migrations after the database exists and the config file is in place:

```bash
npm run migrate
```

## Run Gator

The CLI is started through the npm script:

```bash
npm run start -- <command> [arguments]
```

For example, create a user and make that user current:

```bash
npm run start -- register alice
```

## Commands

List all registered users:

```bash
npm run start -- users
```

Log in as an existing user:

```bash
npm run start -- login alice
```

Add an RSS feed. This also follows the feed for the current user:

```bash
npm run start -- addfeed "Hacker News" "https://news.ycombinator.com/rss"
```

List available feeds:

```bash
npm run start -- feeds
```

Follow or unfollow a feed by URL:

```bash
npm run start -- follow "https://news.ycombinator.com/rss"
npm run start -- unfollow "https://news.ycombinator.com/rss"
```

List the feeds followed by the current user:

```bash
npm run start -- following
```

Fetch feeds continuously at a specified interval. Durations use a number followed by `ms`, `s`, `m`, or `h`; press `Ctrl-C` to stop:

```bash
npm run start -- agg 10s
```

Browse posts from feeds followed by the current user. The default is two posts; provide a positive number to change it:

```bash
npm run start -- browse
npm run start -- browse 10
```

Reset all application data:

```bash
npm run start -- reset
```

## Development

Type-check the project without emitting JavaScript:

```bash
npx tsc --noEmit
```
