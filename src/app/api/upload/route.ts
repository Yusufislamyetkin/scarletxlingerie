import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { uploadProductImage } from '@/lib/cloudinary'
import { checkRateLimit } from '@/lib/utils/rate-limit'

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(req: NextRequest) {
  try {
    // Cloudinary yapılandırma kontrolü
    if (
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET ||
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    ) {
      return NextResponse.json(
        { error: 'Görsel yükleme henüz yapılandırılmadı. Cloudinary bilgilerini Vercel ortam değişkenlerine ekleyin.' },
        { status: 503 }
      )
    }

    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const rl = checkRateLimit(`upload:${session.user.id}`, { windowMs: 60_000, max: 20 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Çok fazla istek, 1 dakika bekleyin.' }, {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rl.resetTime - Date.now()) / 1000)) },
      })
    }

    const formData = await req.formData()

    // Çoklu dosya desteği: 'files' (array) veya tekil 'file'
    const rawFiles = formData.getAll('files') as File[]
    const files    = rawFiles.length > 0 ? rawFiles : [formData.get('file') as File].filter(Boolean)

    if (!files.length) {
      return NextResponse.json({ error: 'Dosya bulunamadı.' }, { status: 400 })
    }

    // Tüm dosyaları paralel yükle
    const results = await Promise.all(
      files.map(async (file) => {
        if (file.size > MAX_SIZE_BYTES) {
          throw new Error(`"${file.name}" 5 MB sınırını aşıyor.`)
        }
        if (!file.type.startsWith('image/')) {
          throw new Error(`"${file.name}" geçerli bir görsel dosyası değil.`)
        }
        const bytes  = await file.arrayBuffer()
        const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString('base64')}`
        return uploadProductImage(base64)
      })
    )

    // Tek dosya → { url, publicId } | Çoklu dosya → { results: [...] }
    return NextResponse.json(files.length === 1 ? results[0] : { results })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Görsel yüklenirken hata oluştu.'
    console.error('[upload]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
