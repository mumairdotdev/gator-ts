import { User } from '../lib/db/schema.js';

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommands(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void {
    if (registry[cmdName]) {
        throw new Error(`Command ${cmdName} is already registered`);
    }
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Command ${cmdName} not found`);
    }
    await handler(cmdName, ...args);
}

export type UserCommandHandler = (cmdName: string, user: User, ...args: string[]) => Promise<void> | void;