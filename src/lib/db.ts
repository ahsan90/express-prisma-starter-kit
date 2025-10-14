import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';
import { env } from './env';

// Create a postgres connection
const queryClient = postgres(env.DATABASE_URL);

// Create a drizzle instance with the connection and schema
export const db = drizzle(queryClient, { schema });

// Export the connection client for raw queries if needed
export { queryClient };

// Type export for the database instance
export type Database = typeof db;
