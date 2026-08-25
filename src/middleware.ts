import type { CommandHandler, UserCommandHandler } from './commands/commands.js';
import { readConfig } from './config.js';
import { getUserByName } from './lib/db/queries/users.js';

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]): Promise<void> => {
        const currentUserName = readConfig().currentUserName;
        if (!currentUserName) {
            throw new Error(`No user is currently logged in. Please log in first.`);
        }

        const user = await getUserByName(currentUserName);
        if (!user) {
            throw new Error(`Current user ${currentUserName} does not exist`);
        }

        await handler(cmdName, user, ...args);
    };
}