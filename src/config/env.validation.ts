import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "test", "production")
    .default("development"),
  PORT: Joi.number().port().default(3000),
  DB_HOST: Joi.string().default("localhost"),
  DB_PORT: Joi.number().port().default(3306),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow("").default(""),
  DB_DATABASE: Joi.string().required(),
  DB_LOGGING: Joi.boolean().default(false),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_DAYS: Joi.number().integer().min(1).default(30),
});
