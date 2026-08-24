
export type CommandHandler = (cmdName: string, ...args: string[]) => void;
export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommands(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void {
    if (registry[cmdName]) {
        throw new Error(`Command ${cmdName} is already registered`);
    }
    registry[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): void {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Command ${cmdName} not found`);
    }
    handler(cmdName, ...args);
}

