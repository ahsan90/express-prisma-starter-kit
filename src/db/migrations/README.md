# Database Migrations

This directory contains Drizzle ORM migration files generated from your schema.

## How it works

1. Define your schema in `src/db/schema.ts`
2. Run `npm run db:generate` to generate migration files
3. Run `npm run db:migrate` to apply migrations to your database

Migration files are automatically generated and should be committed to version control.
