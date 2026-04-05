import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Define schema for environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string({
    required_error: 'DATABASE_URL is required in .env file',
  }),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
});

// Parse and validate environment variables
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid or missing environment variables:');
  parsed.error.errors.forEach(err => {
    console.error(`- ${err.path.join('.')}: ${err.message}`);
  });
  process.exit(1);
}

const envVars = parsed.data;

export default envVars;