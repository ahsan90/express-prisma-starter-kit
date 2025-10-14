# Migration Guide: Prisma to Drizzle

This document provides a comprehensive guide for the migration from Prisma ORM to Drizzle ORM in this starter kit.

## Overview

This branch (`express-drizzle-starter-kit`) has been converted from Prisma to Drizzle ORM, maintaining all functionality while leveraging Drizzle's advantages:

- **Type Safety**: Full TypeScript support with inferred types
- **Performance**: Lighter weight and faster query execution
- **SQL-like API**: More intuitive for SQL developers
- **Zero Dependencies**: Minimal runtime overhead
- **Migration Control**: Direct SQL migrations with full control

## Key Changes

### 1. Dependencies

**Removed:**

- `@prisma/client`
- `prisma`

**Added:**

- `drizzle-orm` - Core ORM library
- `drizzle-kit` - CLI tool for migrations
- `postgres` - PostgreSQL driver

### 2. Configuration Files

**Removed:**

- `prisma/schema.prisma`

**Added:**

- `drizzle.config.ts` - Drizzle configuration
- `src/db/schema.ts` - Database schema definition
- `src/db/migrations/` - Migration files directory

### 3. Database Connection

**Before (Prisma):**

```typescript
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
```

**After (Drizzle):**

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
const queryClient = postgres(DATABASE_URL);
const db = drizzle(queryClient, { schema });
```

### 4. Schema Definition

**Before (Prisma):**

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

**After (Drizzle):**

```typescript
import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### 5. Database Queries

**Before (Prisma):**

```typescript
// Find all
const users = await prisma.user.findMany();

// Find by ID
const user = await prisma.user.findUnique({ where: { id: 1 } });

// Create
const user = await prisma.user.create({
  data: { email: "user@example.com", name: "John" },
});

// Update
const user = await prisma.user.update({
  where: { id: 1 },
  data: { name: "Jane" },
});

// Delete
await prisma.user.delete({ where: { id: 1 } });
```

**After (Drizzle):**

```typescript
import { eq } from "drizzle-orm";

// Find all
const users = await db.select().from(users);

// Find by ID
const [user] = await db.select().from(users).where(eq(users.id, 1));

// Create
const [user] = await db
  .insert(users)
  .values({
    email: "user@example.com",
    name: "John",
  })
  .returning();

// Update
const [user] = await db
  .update(users)
  .set({ name: "Jane" })
  .where(eq(users.id, 1))
  .returning();

// Delete
await db.delete(users).where(eq(users.id, 1));
```

### 6. NPM Scripts

**Before (Prisma):**

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  }
}
```

**After (Drizzle):**

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

## Migration Steps

### For New Projects

1. **Clone this branch:**

   ```bash
   git clone -b express-drizzle-starter-kit <repo-url>
   cd express-prisma-starter-kit
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp env.example.txt .env
   # Edit .env with your database credentials
   ```

4. **Define your schema:**
   Edit `src/db/schema.ts` to define your tables

5. **Generate and run migrations:**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

6. **Start development:**
   ```bash
   npm run dev
   ```

### For Existing Projects

If you're migrating an existing Prisma project:

1. **Backup your database**

2. **Switch to this branch:**

   ```bash
   git checkout express-drizzle-starter-kit
   ```

3. **Install new dependencies:**

   ```bash
   npm install
   ```

4. **Convert your Prisma schema:**

   - Open your old `prisma/schema.prisma`
   - Convert each model to Drizzle table definitions in `src/db/schema.ts`
   - Use the examples in this guide as reference

5. **Generate migrations:**

   ```bash
   npm run db:generate
   ```

6. **Review generated migrations:**

   - Check `src/db/migrations/` for generated SQL
   - Verify migrations match your existing database structure

7. **Update service files:**

   - Replace Prisma Client imports with Drizzle
   - Update query syntax using examples above
   - Update type definitions

8. **Test thoroughly:**
   - Run your application
   - Test all database operations
   - Verify data integrity

## Common Query Patterns

### Select with Relations

**Drizzle:**

```typescript
import { eq } from "drizzle-orm";

const usersWithPosts = await db
  .select()
  .from(users)
  .leftJoin(posts, eq(posts.authorId, users.id));
```

### Filtering and Sorting

```typescript
import { eq, and, or, like, desc } from "drizzle-orm";

// Multiple conditions
const users = await db
  .select()
  .from(users)
  .where(and(eq(users.isActive, true), like(users.email, "%@example.com")))
  .orderBy(desc(users.createdAt));
```

### Pagination

```typescript
const page = 1;
const pageSize = 10;

const users = await db
  .select()
  .from(users)
  .limit(pageSize)
  .offset((page - 1) * pageSize);
```

### Aggregations

```typescript
import { count } from "drizzle-orm";

const result = await db.select({ count: count() }).from(users);
```

## Drizzle Studio

Access the visual database browser:

```bash
npm run db:studio
```

Features:

- Browse all tables
- View and edit data
- Execute custom queries
- Visual schema explorer

## Troubleshooting

### Connection Issues

If you experience connection issues:

1. Verify your `DATABASE_URL` in `.env`
2. Ensure PostgreSQL is running
3. Check network connectivity
4. Verify database credentials

### Migration Issues

If migrations fail:

1. Check migration files in `src/db/migrations/`
2. Verify schema syntax in `src/db/schema.ts`
3. Ensure database is accessible
4. Use `npm run db:push` for development (bypasses migrations)

### Type Errors

If you see TypeScript errors:

1. Ensure all imports are correct
2. Run `npm install` to install types
3. Restart TypeScript server in VS Code
4. Check that schema exports are correct

## Best Practices

### 1. Schema Organization

```typescript
// src/db/schema.ts
export const users = pgTable('users', { ... });
export const posts = pgTable('posts', { ... });
export const comments = pgTable('comments', { ... });

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### 2. Service Layer

```typescript
// src/modules/user/user.service.ts
import { db } from "../../lib/db";
import { users, type User, type NewUser } from "../../db/schema";

export class UserService {
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
}
```

### 3. Error Handling

```typescript
try {
  const user = await db.insert(users).values(data).returning();
  return user[0];
} catch (error) {
  if (error.code === "23505") {
    // Unique violation
    throw new Error("Email already exists");
  }
  throw error;
}
```

### 4. Transactions

```typescript
await db.transaction(async (tx) => {
  const [user] = await tx.insert(users).values(userData).returning();
  await tx.insert(posts).values({ ...postData, authorId: user.id });
});
```

## Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Drizzle with PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)
- [SQL Operators](https://orm.drizzle.team/docs/operators)

## Support

If you encounter issues during migration:

1. Check this guide first
2. Review Drizzle documentation
3. Check the example implementations in `src/modules/user/`
4. Open an issue on GitHub

---

**Note:** This migration maintains all functionality while providing better type safety, performance, and developer experience with Drizzle ORM.
