import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function cleanDbUrl(raw: string): string {
  return raw
    .replace(/([?&])pgbouncer=[^&]*/gi, '$1') // pg driver bu parametreyi bilmez
    .replace(/([?&])sslmode=[^&]*/gi, '$1')    // ssl nesnesini aşağıda açıkça veriyoruz
    .replace(/[?&]+$/, '')                      // sondaki ? veya & artıkları temizle
    .replace(/\?$/, '')
}

function createClient() {
  // Öncelik: pooler URL (POSTGRES_PRISMA_URL) > doğrudan bağlantı (NON_POOLING) > DATABASE_URL
  // Serverless ortamlarda pgbouncer transaction mode pooler kullanmak zorunludur;
  // session mode (NON_POOLING / doğrudan) her invocation'da bağlantı tüketir ve limiti zorlar.
  const raw =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL         ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL         ||
    ''

  if (!raw) throw new Error('Veritabanı URL tanımlı değil.')
  if (raw.startsWith('prisma://')) return new PrismaClient({ accelerateUrl: raw })

  const url  = cleanDbUrl(raw)
  // Serverless'ta her lambda farklı bir process olabileceğinden pool_size=1 tutulur;
  // bağlantı yönetimini pgbouncer üstlenir.
  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false }, max: 1 })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
