import {registerCommands, runCommand, type CommandHandler} from './commands/commands.js';
import {handlerLogin} from './commands/users.js';

function main() {
    const commandsRegistry = {} as Record<string, CommandHandler>;

    registerCommands(commandsRegistry, 'login', handlerLogin);

    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('No command provided');
        process.exit(1);
    }

    const cmdName = args[0];
    const cmdArgs = args.slice(1);

    try {
        runCommand(commandsRegistry, cmdName, ...cmdArgs);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
}

main();