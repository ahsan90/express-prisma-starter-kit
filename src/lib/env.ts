import dotenv from "dotenv";
import joi from "joi";

dotenv.config();

const envSchema = joi.object({
    PORT: joi.number().default(3000),
    NODE_ENV: joi.string().valid("development", "production", "test").default("development"),
    DATABASE_URL: joi.string().uri().required(),
    JWT_SECRET: joi.string().min(32).required(),
    JWT_REFRESH_SECRET: joi.string().min(32).required(),
    API_PREFIX: joi.string().default("/api/v1"),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
    PORT: envVars.PORT,
    NODE_ENV: envVars.NODE_ENV,
    DATABASE_URL: envVars.DATABASE_URL,
    JWT_SECRET: envVars.JWT_SECRET,
    JWT_REFRESH_SECRET: envVars.JWT_REFRESH_SECRET,
    API_PREFIX: envVars.API_PREFIX,
};