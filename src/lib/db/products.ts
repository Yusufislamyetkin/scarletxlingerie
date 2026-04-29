import { unstable_cache } from 'next/cache'
import { prisma } from './index'
import type { Product, ProductVariant, Collection } from '@/types'

const CACHE_TTL = 300 // 5 dakika

// ─── Raw Prisma types ──────────────────────────────────────────────────────────

type RawProduct = Awaited<ReturnType<typeof prisma.product.findMany<{
  include: {
    variants: true
    category: { select: { name: true; slug: true } }
    collection: { select: { name: true; slug: true } }
  }
}>>>[number]

// ─── Mappers ──────────────────────────────────────────────────────────────────

export function toProduct(p: RawProduct): Product {
  return {
    id:                p.id,
    slug:              p.slug,
    name:              p.name,
    description:       p.description,
    category:          p.category?.name ?? '',
    collectionId:      p.collectionId ?? undefined,
    material:          p.material ?? '',
    careInstructions:  p.careInstructions ?? '',
    modelMeasurements: p.modelMeasurements ?? undefined,
    isFeatured:        p.isFeatured,
    isNew:             p.isNew,
    tags:              p.tags as string[],
    seoTitle:          p.seoTitle ?? undefined,
    seoDescription:    p.seoDescription ?? undefined,
    ogImage:           p.ogImage ?? undefined,
    createdAt:         p.createdAt.toISOString(),
    updatedAt:         p.updatedAt.toISOString(),
    variants:          p.variants.map((v): ProductVariant => ({
      id:             v.id,
      sku:            v.sku,
      size:           v.size,
      color:          v.color,
      colorHex:       v.colorHex,
      price:          v.price,
      compareAtPrice: v.compareAtPrice ?? undefined,
      stock:          v.stock,
      images:         v.images as string[],
    })),
  }
}

// ─── Queries ──────────────────────────────────────────────────────────────────

const PRODUCT_INCLUDE = {
  variants:   { where: { isActive: true }, orderBy: { price: 'asc' as const } },
  category:   { select: { name: true, slug: true } },
  collection: { select: { name: true, slug: true } },
} as const

async function _getProducts(opts?: {
  categorySlug?: string
  collectionSlug?: string
  isFeatured?: boolean
  isNew?: boolean
  take?: number
  skip?: number
}): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(opts?.isFeatured !== undefined && { isFeatured: opts.isFeatured }),
      ...(opts?.isNew      !== undefined && { isNew: opts.isNew }),
      ...(opts?.categorySlug   && { category:   { slug: opts.categorySlug   } }),
      ...(opts?.collectionSlug && { collection: { slug: opts.collectionSlug } }),
    },
    include:  PRODUCT_INCLUDE,
    orderBy:  { createdAt: 'desc' },
    take:     opts?.take ?? 20,
    skip:     opts?.skip ?? 0,
  })
  return rows.map(toProduct)
}

export async function getProducts(opts?: Parameters<typeof _getProducts>[0]) {
  const key = JSON.stringify(opts ?? {})
  return unstable_cache(
    () => _getProducts(opts),
    ['products', key],
    { revalidate: CACHE_TTL }
  )()
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return unstable_cache(
    async () => {
      const p = await prisma.product.findUnique({
        where:   { slug, isActive: true },
        include: PRODUCT_INCLUDE,
      })
      return p ? toProduct(p) : null
    },
    ['product', slug],
    { revalidate: CACHE_TTL }
  )()
}

export async function getFeaturedProducts(take = 8) {
  return getProducts({ isFeatured: true, take })
}

export async function getNewArrivals(take = 8) {
  return getProducts({ isNew: true, take })
}

export async function getCollections(): Promise<Collection[]> {
  return unstable_cache(
    async () => {
      const cols = await prisma.collection.findMany({
        where:   { isActive: true },
        orderBy: { order: 'asc' },
      })
      return cols.map((c) => ({
        id:             c.id,
        slug:           c.slug,
        name:           c.name,
        description:    c.description ?? undefined,
        image:          c.image,
        seoTitle:       c.seoTitle ?? undefined,
        seoDescription: c.seoDescription ?? undefined,
      }))
    },
    ['collections'],
    { revalidate: CACHE_TTL }
  )()
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  return unstable_cache(
    async () => {
      const c = await prisma.collection.findUnique({ where: { slug, isActive: true } })
      if (!c) return null
      return {
        id:             c.id,
        slug:           c.slug,
        name:           c.name,
        description:    c.description ?? undefined,
        image:          c.image,
        seoTitle:       c.seoTitle ?? undefined,
        seoDescription: c.seoDescription ?? undefined,
      }
    },
    ['collection', slug],
    { revalidate: CACHE_TTL }
  )()
}
