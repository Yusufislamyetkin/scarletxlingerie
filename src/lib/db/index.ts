import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createClient() {
  // DATABASE_URL öncelikli; yoksa Vercel-Supabase entegrasyonunun non-pooling URL'ini kullan
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    ''

  if (!url) throw new Error('DATABASE_URL (veya POSTGRES_URL_NON_POOLING) tanımlı değil.')

  if (url.startsWith('prisma://')) {
    return new PrismaClient({ accelerateUrl: url })
  }

  const adapter = new PrismaPg({ connectionString: url })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
