import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import app from './api';
import { logger } from './common/logger.middleware';
import os from 'os';
import { env } from './lib/env';
import { prisma } from './lib/db';


function getSystemInfo() {
    return {
        osType: os.type(), // e.g., 'Linux', 'Darwin' (macOS), 'Windows_NT'
        osArch: os.arch(), // e.g., 'x64', 'arm64'
        totalMemoryMB: (os.totalmem() / (1024 * 1024)).toFixed(2), // Total system memory in MB
        freeMemoryMB: (os.freemem() / (1024 * 1024)).toFixed(2), // Free system memory in MB
        cpuCores: os.cpus().length, // Number of CPU cores
        cpuModel: os.cpus()[0].model, // Model of the first CPU (typically representative)
        hostname: os.hostname(),
        uptime: os.uptime(), // System uptime in seconds
    };
}

const startServer = async () => {
    try {
        const server = http.createServer(app);
        const io = new SocketIOServer(server);

        io.on('connection', (socket: Socket) => {
            logger.info(`New client connected: ${socket.id}`);

            socket.on('disconnect', () => {
                logger.info(`Client disconnected: ${socket.id}`);
            });
        });

        server.listen(env.PORT, () => {
            logger.info(`Server is running on port ${env.PORT}`);
            logger.info(`Environment: ${env.NODE_ENV}`);
            logger.info(`System Information: ${JSON.stringify(getSystemInfo(), null, 2)}`);
            prisma.$connect().then(() => {
                logger.info('Connected to the database successfully.');
            }).catch((err: any) => {
                logger.error(`Database connection error: ${err.message}`);
            });
        });
    } catch (error: any) {
        logger.error(`Error starting server: ${error.message}`);
    }
}
startServer();

// Graceful shutdown
process.on('SIGINT', () => {
    logger.info('Received SIGINT. Shutting down gracefully...');
    process.exit();
});

process.on('SIGTERM', () => {
    logger.info('Received SIGTERM. Shutting down gracefully...');
    process.exit();
});

process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    process.exit(1);
});