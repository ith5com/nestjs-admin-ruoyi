import * as Joi from 'joi';

export const EnvValidationSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
});
