import { db } from '../../lib/db';
import { users, type User, type NewUser } from '../../db/schema';
import { eq } from 'drizzle-orm';

export class UserService {
    // Get all users
    public getAllUsers = async (): Promise<User[]> => {
        return await db.select().from(users);
    }

    // Get user by ID
    public getUserById = async (id: number): Promise<User | undefined> => {
        const result = await db.select().from(users).where(eq(users.id, id));
        return result[0];
    }

    // Get user by email
    public getUserByEmail = async (email: string): Promise<User | undefined> => {
        const result = await db.select().from(users).where(eq(users.email, email));
        return result[0];
    }

    // Create a new user
    public createUser = async (data: NewUser): Promise<User> => {
        const result = await db.insert(users).values(data).returning();
        return result[0];
    }

    // Update a user
    public updateUser = async (id: number, data: Partial<NewUser>): Promise<User | undefined> => {
        const result = await db
            .update(users)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(users.id, id))
            .returning();
        return result[0];
    }

    // Delete a user
    public deleteUser = async (id: number): Promise<void> => {
        await db.delete(users).where(eq(users.id, id));
    }
}

export const userService = new UserService();
