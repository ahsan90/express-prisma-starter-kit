# Express-Drizzle Starter Kit - Quick Start Guide

This guide will help you get started with the Express-Drizzle API starter kit.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **PostgreSQL** (v13 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

## Quick Start

### 1. Clone the Repository

```bash
git clone -b express-drizzle-starter-kit <your-repo-url>
cd express-prisma-starter-kit
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:

- Express.js
- Drizzle ORM
- TypeScript
- And all other dependencies

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp env.example.txt .env
```

Edit `.env` with your configuration:

```env
PORT=5050
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/your_database
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
API_PREFIX=/api/v1
```

**Important:**

- Replace `username`, `password`, and `your_database` with your PostgreSQL credentials
- Generate secure random strings for JWT secrets
- Never commit `.env` to version control

### 4. Set Up PostgreSQL Database

Create a new database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE your_database;

# Exit psql
\q
```

Or use a GUI tool like pgAdmin, DBeaver, or TablePlus.

### 5. Define Your Schema (Optional)

The starter kit includes example schema. Edit `src/db/schema.ts` to define your tables:

```typescript
import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: text("name"),
  password: text("password").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### 6. Generate and Run Migrations

```bash
# Generate migration files from schema
npm run db:generate

# Apply migrations to database
npm run db:migrate
```

Or for quick development setup (bypasses migrations):

```bash
npm run db:push
```

### 7. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:5050`

You should see output like:

```
Server is running on port 5050
Database connected successfully
```

### 8. Test the API

Open your browser or use curl/Postman:

```bash
# Test endpoint
curl http://localhost:5050/api/v1/tests

# Expected response:
{
  "success": true,
  "data": [
    { "id": 1, "name": "Sample Test" },
    { "id": 2, "name": "Another Test" }
  ]
}
```

## Development Workflow

### Creating a New Module

Use the built-in module generator:

```bash
# Generate a basic module
npx g products

# Generate a full CRUD module
npx g products --crud
```

This creates:

- Controller
- Service
- Routes
- Types
- DTOs
- Validators
- Middleware
- Utils

And automatically registers routes in `src/api.ts`.

### Working with Database

#### View Database (Drizzle Studio)

```bash
npm run db:studio
```

Opens a web-based database browser at `https://local.drizzle.studio`

#### Making Schema Changes

1. Edit `src/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Apply migration: `npm run db:migrate`

#### Example: Add a New Table

```typescript
// src/db/schema.ts
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: integer("price").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
```

Then run:

```bash
npm run db:generate
npm run db:migrate
```

### Writing Database Queries

```typescript
// src/modules/user/user.service.ts
import { db } from "../../lib/db";
import { users } from "../../db/schema";
import { eq, and, like } from "drizzle-orm";

// Select all
const allUsers = await db.select().from(users);

// Select with where
const user = await db.select().from(users).where(eq(users.id, 1));

// Insert
const newUser = await db
  .insert(users)
  .values({
    email: "user@example.com",
    name: "John Doe",
    password: "hashed_password",
  })
  .returning();

// Update
const updated = await db
  .update(users)
  .set({ name: "Jane Doe" })
  .where(eq(users.id, 1))
  .returning();

// Delete
await db.delete(users).where(eq(users.id, 1));

// Complex queries
const activeUsers = await db
  .select()
  .from(users)
  .where(and(eq(users.isActive, true), like(users.email, "%@company.com")))
  .orderBy(desc(users.createdAt))
  .limit(10);
```

## Project Structure

```
├── src/
│   ├── api.ts                    # Express app setup
│   ├── server.ts                 # Server entry point
│   ├── db/
│   │   ├── schema.ts            # Database schema
│   │   └── migrations/          # Migration files
│   ├── lib/
│   │   ├── db.ts                # Drizzle client
│   │   ├── env.ts               # Environment config
│   │   └── node-cache.ts        # Cache setup
│   ├── modules/                 # Feature modules
│   │   ├── test/
│   │   └── user/
│   ├── common/
│   │   ├── errorHandler.ts     # Error handling
│   │   └── logger.middleware.ts # Logging
│   └── utils/                   # Shared utilities
├── logs/                        # Application logs
├── drizzle.config.ts           # Drizzle configuration
├── .env                        # Environment variables
└── package.json
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Database
npm run db:generate     # Generate migrations
npm run db:migrate      # Run migrations
npm run db:push         # Push schema (dev only)
npm run db:studio       # Open Drizzle Studio

# Module Generation
npx g <name>            # Generate module
npx g <name> --crud     # Generate CRUD module
npx g <name> --remove   # Remove module
```

## Troubleshooting

### Port Already in Use

If port 5050 is already in use, change `PORT` in `.env`:

```env
PORT=3000
```

### Database Connection Failed

1. Verify PostgreSQL is running:

   ```bash
   psql -U postgres -c "SELECT version();"
   ```

2. Check your `DATABASE_URL` in `.env`

3. Ensure database exists:
   ```bash
   psql -U postgres -l
   ```

### Migration Errors

If migrations fail:

1. Check schema syntax in `src/db/schema.ts`
2. Use `npm run db:push` for development (bypasses migrations)
3. Drop and recreate database if needed (development only)

### TypeScript Errors

1. Restart TypeScript server in VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"
2. Clean install: `rm -rf node_modules package-lock.json && npm install`

## Next Steps

1. **Customize the Schema**: Edit `src/db/schema.ts` for your data model
2. **Generate Modules**: Use `npx g <module-name> --crud` to create features
3. **Add Authentication**: Implement JWT auth in middleware
4. **Add Validation**: Use Joi/Zod validators in your routes
5. **Deploy**: Build and deploy to your hosting platform

## Additional Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)

## Support

- Check `MIGRATION_GUIDE.md` for Prisma to Drizzle migration
- Review example modules in `src/modules/`
- Open an issue on GitHub for bugs or questions

---

**Happy coding! 🚀**
