import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { uploadProductImage } from '@/lib/cloudinary'
import { checkRateLimit } from '@/lib/utils/rate-limit'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  // Rate limit: 20 uploads per minute per admin
  const rl = checkRateLimit(`upload:${session.user.id}`, { windowMs: 60_000, max: 20 })
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Çok fazla istek' }, {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil((rl.resetTime - Date.now()) / 1000)) },
    })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString('base64')}`

  const result = await uploadProductImage(base64)
  return NextResponse.json(result)
}
