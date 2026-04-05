import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Example data loader for users
export const createUserLoader = () => {
  return new DataLoader(async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: ids.map(id => parseInt(id)),
        },
      },
    });
    const userMap = new Map(users.map(user => [user.id.toString(), user]));
    return ids.map(id => userMap.get(id) || null);
  });
};

// Add more loaders as needed