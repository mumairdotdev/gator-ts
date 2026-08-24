import {registerCommands, runCommand, type CommandHandler} from './commands/commands.js';
import {handlerLogin, handlerRegister} from './commands/users.js';

async function main() {
    const commandsRegistry = {} as Record<string, CommandHandler>;

    await registerCommands(commandsRegistry, 'login', handlerLogin);
    await registerCommands(commandsRegistry, 'register', handlerRegister);

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