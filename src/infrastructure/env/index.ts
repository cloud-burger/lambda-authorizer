import Joi from 'joi';
import process from 'node:process';

interface EnvSchemaProps {
  PORT: string;
  DYNAMO_TABLE_CUSTOMERS: string;
}

export const envSchema = Joi.object({
  PORT: Joi.string().required(),
  DYNAMO_TABLE_CUSTOMERS: Joi.string().required(),
});

const { value } = envSchema.validate(process.env);

export const env = value as EnvSchemaProps;
