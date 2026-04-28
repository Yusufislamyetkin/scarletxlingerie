import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createClient() {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    ''

  if (!url) throw new Error('DATABASE_URL tanımlı değil.')

  if (url.startsWith('prisma://')) {
    return new PrismaClient({ accelerateUrl: url })
  }

  // sslmode'u URL'den çıkar; ssl nesnesini açıkça ver (pg v8 sslmode=require'ı artık verify-full sayıyor)
  const cleanUrl = url.replace(/([?&])sslmode=[^&]*/g, '$1').replace(/[?&]$/, '')
  const pool = new Pool({ connectionString: cleanUrl, ssl: { rejectUnauthorized: false } })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
