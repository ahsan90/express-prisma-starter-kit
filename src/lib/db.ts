import { PrismaClient } from '../generated/prisma';

let prisma: PrismaClient;

// For non-production environments, store PrismaClient in a global variable.
// This prevents multiple PrismaClient instances from being created during hot-reloading.
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    // In development, check if global.prisma already exists
    const globalForPrisma = global as typeof globalThis & { prisma?: PrismaClient };
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = new PrismaClient();
    }
    prisma = globalForPrisma.prisma;
}

// Export the single PrismaClient instance for use throughout the application
export { prisma };