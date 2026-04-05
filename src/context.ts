import { PrismaClient } from '@prisma/client';
import { createUserLoader } from './config/dataLoader.js';
import { cache } from './config/cache.js';

export interface Context {
  prisma: PrismaClient;
  userLoader: ReturnType<typeof createUserLoader>;
  cache: typeof cache;
}

export const createContext = (): Context => ({
  prisma: new PrismaClient(),
  userLoader: createUserLoader(),
  cache,
});