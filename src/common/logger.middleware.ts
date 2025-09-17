import { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import fs from "fs";
//import cron from "node-cron";

// Detect Environment
const isDev = process.env.NODE_ENV !== "production";

// Ensure logs directory exists
const logDirectory = path.resolve("./", "logs");
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true }); // Create directory if it doesn't exist
}

const formatTimestamp = () => new Date().toLocaleString();

// Winston Logger with Colorized Console Logs
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            const colorizer = winston.format.colorize().colorize;
            const formattedTime = new Date(timestamp as Date).toLocaleString();
            return `${colorizer(level, `[${formattedTime}] [${level.toUpperCase()}]`)}: ${message}`;
        })
    ),
    transports: [
        // Console Logging (Colorized in Dev Mode)
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),

        // HTTP Request Log (Rotates Daily)
        new DailyRotateFile({
            filename: path.join(logDirectory, "requests-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxSize: "10m",  // Rotate after 10MB, adjust as needed
            maxFiles: "2d", // Keep logs for 2 days, adjust as needed
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp({ format: formatTimestamp || "YYYY-MM-DD HH:mm:ss" }),
                winston.format.json()
            ),
        }),

        // Error Log (Rotates Daily)
        new DailyRotateFile({
            filename: path.join(logDirectory, "errors-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxSize: "10m", // Rotate after 10MB, adjust as needed
            maxFiles: "2d", // Keep logs for 2 days, adjust as needed
            level: "error",
            format: winston.format.combine(
                winston.format.timestamp({ format: formatTimestamp || "YYYY-MM-DD HH:mm:ss" }),
                winston.format.json()
            ),
        }),
    ],
});

// Morgan Stream (Logs Requests to Winston)
const stream = {
    write: (message: string) => logger.info(message.trim()),
};

// Morgan Middleware (Logs HTTP Requests)
const requestLogger = morgan(isDev ? "dev" : "combined", { stream });

// Error Logging Middleware
const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        route: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });

    res.status(500).json({ error: "Internal Server Error" });
};

// Combined Middleware Function
const loggingMiddleware = (app: any) => {
    app.use(requestLogger);  // Attach HTTP Logger
    app.use(errorLogger);    // Attach Error Logger
};

export { logger, loggingMiddleware };