import { setUser, readConfig } from '../config.js';
import { createUser, getUserByName, getAllUsers } from '../lib/db/queries/users.js';

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error(`Usage: ${cmdName} <username>`);
    }
    const username = args[0];
    const user = await getUserByName(username);
    if (!user) {
        throw new Error(`User ${username} does not exist`);
    }
    setUser(user.name);
    console.log(`Logged in as ${user.name}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error(`Usage: ${cmdName} <username>`);
    }
    const username = args[0];
    const existingUser = await getUserByName(username);
    if (existingUser) {
        throw new Error(`User ${username} already exists`);
    }
    const newUser = await createUser(username);
    setUser(newUser.name);
    console.log(`User ${newUser.name} has been created with ID ${newUser.id}`);
    
}

export async function handlerListUsers(cmdName: string, ...args: string[]): Promise<void> {
    const users = await getAllUsers();
    if (users.length === 0) {
        console.log('No users found');
        return;
    }
    console.log('List of users:');
    users.forEach(user => {
        console.log(`* ${user.name}${user.name === readConfig().currentUserName ? ' (current)' : ''}`);
    });
}