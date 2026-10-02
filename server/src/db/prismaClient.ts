import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient | null {
  if (process.env.DATABASE_URL) {
    if (!prisma) {
      prisma = new PrismaClient();
    }
    return prisma;
  }
  return null;
}

export { prisma };
