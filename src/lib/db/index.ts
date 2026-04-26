import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createClient() {
  const url = process.env.DATABASE_URL ?? ''
  if (url.startsWith('prisma://')) {
    // Prisma Accelerate (production)
    return new PrismaClient({ accelerateUrl: url })
  }
  // Direkt PostgreSQL — PG adapter (local dev)
  const adapter = new PrismaPg({ connectionString: url })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
