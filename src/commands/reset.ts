import { deleteAllUsers } from '../lib/db/queries/users.js';

export async function handlerReset(_:string): Promise<void> {
    await deleteAllUsers();
    console.log(`All users have been deleted`);
}