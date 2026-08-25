import {registerCommands, runCommand, type CommandHandler} from './commands/commands.js';
import {handlerLogin, handlerRegister, handlerListUsers} from './commands/users.js';
import {handlerReset} from './commands/reset.js';
import {handleRSSCommand} from './commands/aggregate.js';
import { handlerAddFeed, handlerListFeeds } from './commands/feeds.js';
import { handlerFollow, handlerFollowing } from './commands/feed-follows.js';
import { handlerUnfollow } from './commands/feed-follows.js';
import { middlewareLoggedIn } from './middleware.js';
import { handlerBrowse } from './commands/browse.js';

async function main() {
    const commandsRegistry = {} as Record<string, CommandHandler>;

    await registerCommands(commandsRegistry, 'login', handlerLogin);
    await registerCommands(commandsRegistry, 'register', handlerRegister);
    await registerCommands(commandsRegistry, 'users', handlerListUsers);
    await registerCommands(commandsRegistry, 'reset', handlerReset);
    await registerCommands(commandsRegistry, 'agg', handleRSSCommand);
    await registerCommands(commandsRegistry, 'addfeed', middlewareLoggedIn(handlerAddFeed));
    await registerCommands(commandsRegistry, 'feeds', handlerListFeeds);
    await registerCommands(commandsRegistry, 'follow', middlewareLoggedIn(handlerFollow));
    await registerCommands(commandsRegistry, 'following', middlewareLoggedIn(handlerFollowing));
    await registerCommands(commandsRegistry, 'unfollow', middlewareLoggedIn(handlerUnfollow));
    await registerCommands(commandsRegistry, 'browse', middlewareLoggedIn(handlerBrowse));
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('No command provided');
        process.exit(1);
    }

    const cmdName = args[0];
    const cmdArgs = args.slice(1);

    try {
        await runCommand(commandsRegistry, cmdName, ...cmdArgs);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
    process.exit(0);
}

main();