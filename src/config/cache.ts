import Redis from 'ioredis';
import envVars from './envVars.js';

export const redis = new Redis({
  host: envVars.REDIS_HOST,
  port: parseInt(envVars.REDIS_PORT),
  lazyConnect: true,
});

// Cache helper functions
export const cache = {
  async get(key: string): Promise<string | null> {
    return redis.get(key);
  },
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await redis.setex(key, ttl, value);
    } else {
      await redis.set(key, value);
    }
  },
  async del(key: string): Promise<void> {
    await redis.del(key);
  },
};