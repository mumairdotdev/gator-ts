import { setUser } from '../config.js';

export function handlerLogin(cmdName: string, ...args: string[]): void {
    if (args.length < 1) {
        throw new Error(`Usage: ${cmdName} <username>`);
    }
    const username = args[0];
    setUser(username);
    console.log(`User name has been set to ${username}`);
}