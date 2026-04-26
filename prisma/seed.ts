import "dotenv/config"
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import { hash } from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma  = new PrismaClient({ adapter })

async function main() {
  const email    = process.env.ADMIN_EMAIL    ?? 'admin@scarletxlingerie.com'
  const password = process.env.ADMIN_PASSWORD ?? 'Admin1234!'

  const hashed = await hash(password, 12)

  const admin = await prisma.user.upsert({
    where:  { email },
    update: { password: hashed, role: 'ADMIN', name: 'Admin' },
    create: { email, password: hashed, role: 'ADMIN', name: 'Admin' },
  })

  console.log(`✅ Admin kullanıcı hazır:`)
  console.log(`   E-posta : ${admin.email}`)
  console.log(`   Şifre   : ${password}`)
  console.log(`   Rol     : ${admin.role}`)
}

main()
  .catch((e) => { console.error('❌ Seed hatası:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
