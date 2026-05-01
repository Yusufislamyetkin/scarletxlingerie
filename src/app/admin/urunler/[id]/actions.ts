'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { ProductVariant } from '@/types'

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function generateSku(base: string, size: string, color: string) {
  const b = base.replace(/-/g, '').slice(0, 6).toUpperCase()
  const s = size.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3)
  const c = color.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3)
  const r = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `${b}-${s}-${c}-${r}`
}

export interface SavePayload {
  name: string
  description: string
  category: string
  collectionId: string
  material: string
  careInstructions: string
  modelMeasurements: string
  isNew: boolean
  isFeatured: boolean
  seoTitle: string
  seoDescription: string
  images: string[]
  variants: Partial<ProductVariant>[]
}

export async function saveProduct(
  id: string,
  payload: SavePayload,
): Promise<{ ok: true; slug: string } | { ok: false; error: string }> {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return { ok: false, error: 'Yetkisiz erişim' }
    }

    const creating = id === 'yeni'

    // Category lookup by name (case-insensitive)
    let categoryId: string | null = null
    if (payload.category) {
      const cat = await prisma.category.findFirst({
        where: { name: { equals: payload.category, mode: 'insensitive' } },
        select: { id: true },
      })
      categoryId = cat?.id ?? null
    }

    const collectionId = payload.collectionId || null

    if (creating) {
      const slug = `${slugify(payload.name)}-${Date.now()}`

      const product = await prisma.product.create({
        data: {
          slug,
          name: payload.name,
          description: payload.description,
          categoryId,
          collectionId,
          material: payload.material,
          careInstructions: payload.careInstructions,
          modelMeasurements: payload.modelMeasurements || null,
          isNew: payload.isNew,
          isFeatured: payload.isFeatured,
          seoTitle: payload.seoTitle || null,
          seoDescription: payload.seoDescription || null,
        },
      })

      for (const v of payload.variants) {
        if (!v.size || !v.color) continue
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: generateSku(slug, v.size, v.color),
            size: v.size,
            color: v.color,
            colorHex: v.colorHex ?? '#1A1A1A',
            price: v.price ?? 0,
            compareAtPrice: v.compareAtPrice ?? null,
            stock: v.stock ?? 0,
            images: payload.images,
          },
        })
      }

      revalidatePath('/admin/urunler')
      revalidatePath('/')
      return { ok: true, slug: product.slug }
    }

    // Update existing product
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { slug: true },
    })
    if (!existing) return { ok: false, error: 'Ürün bulunamadı' }

    await prisma.product.update({
      where: { id },
      data: {
        name: payload.name,
        description: payload.description,
        categoryId,
        collectionId,
        material: payload.material,
        careInstructions: payload.careInstructions,
        modelMeasurements: payload.modelMeasurements || null,
        isNew: payload.isNew,
        isFeatured: payload.isFeatured,
        seoTitle: payload.seoTitle || null,
        seoDescription: payload.seoDescription || null,
      },
    })

    // Variant upsert
    const incomingIds = payload.variants.filter(v => v.id).map(v => v.id!)

    // Soft-delete removed variants
    if (incomingIds.length > 0) {
      await prisma.productVariant.updateMany({
        where: { productId: id, id: { notIn: incomingIds } },
        data: { isActive: false },
      })
    } else {
      await prisma.productVariant.updateMany({
        where: { productId: id },
        data: { isActive: false },
      })
    }

    for (const v of payload.variants) {
      if (v.id) {
        await prisma.productVariant.update({
          where: { id: v.id },
          data: {
            size: v.size ?? '',
            color: v.color ?? '',
            colorHex: v.colorHex ?? '#1A1A1A',
            price: v.price ?? 0,
            compareAtPrice: v.compareAtPrice ?? null,
            stock: v.stock ?? 0,
            images: payload.images,
            isActive: true,
          },
        })
      } else {
        if (!v.size || !v.color) continue
        await prisma.productVariant.create({
          data: {
            productId: id,
            sku: generateSku(existing.slug, v.size, v.color),
            size: v.size,
            color: v.color,
            colorHex: v.colorHex ?? '#1A1A1A',
            price: v.price ?? 0,
            compareAtPrice: v.compareAtPrice ?? null,
            stock: v.stock ?? 0,
            images: payload.images,
          },
        })
      }
    }

    revalidatePath('/admin/urunler')
    revalidatePath(`/admin/urunler/${id}`)
    revalidatePath(`/urun/${existing.slug}`)
    revalidatePath('/')

    return { ok: true, slug: existing.slug }
  } catch (err) {
    console.error('[saveProduct]', err)
    const msg = err instanceof Error ? err.message : 'Bilinmeyen hata'
    return { ok: false, error: msg }
  }
}
