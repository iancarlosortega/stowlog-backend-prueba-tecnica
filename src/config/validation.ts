import * as Joi from 'joi';

export const EnvSchema = Joi.object({
	ENVIRONMENT: Joi.string().default('DEVELOPMENT'),
	PORT: Joi.number().default(4000),
	DB_PASSWORD: Joi.string().required(),
	DB_HOST: Joi.string().required(),
	DB_PORT: Joi.number().required(),
	DB_NAME: Joi.string().required(),
	DB_USER: Joi.string().required(),
	JWT_SECRET: Joi.string().required(),
	SMTP_HOST: Joi.string(),
	SMTP_PORT: Joi.number(),
	SMTP_USER: Joi.string(),
	SMTP_PASS: Joi.string(),
	SMTP_FROM: Joi.string(),
});
