import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

// Fallback to primary Neon connection if process.env.DATABASE_URL is not provided by host
const FALLBACK_DATABASE_URL =
  'postgresql://neondb_owner:npg_S1l5YbpcdOhU@ep-fancy-field-b39c1fsy-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

export function getPrismaClient(): PrismaClient | null {
  const dbUrl = process.env.DATABASE_URL || FALLBACK_DATABASE_URL;
  if (dbUrl) {
    if (!prisma) {
      prisma = new PrismaClient({
        datasources: {
          db: {
            url: dbUrl
          }
        }
      });
    }
    return prisma;
  }
  return null;
}

export { prisma };

