import express from 'express';
import { errorHandler } from './common/errorHandler';
import cookieParser from 'cookie-parser';
import { loggingMiddleware } from './common/logger.middleware';
import cors from 'cors';
import helmet from 'helmet';
import { testRoutes } from './modules/test/test.routes';
import { env } from './lib/env';

const app = express();
const isDev = process.env.NODE_ENV !== 'production';

// CORS Configuration
const corsOptions = {
    origin: isDev ? 'http://localhost:5050' : 'https://your-production-domain.com', // Adjust as needed
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    //allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));
loggingMiddleware(app);
app.use(cookieParser());
app.use(helmet())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use(env.API_PREFIX, testRoutes);


app.use(errorHandler);
export default app;
