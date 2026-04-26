import { prisma } from './index'

export async function getProducts(opts?: {
  categorySlug?: string
  collectionSlug?: string
  isFeatured?: boolean
  isNew?: boolean
  take?: number
  skip?: number
}) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      ...(opts?.isFeatured !== undefined && { isFeatured: opts.isFeatured }),
      ...(opts?.isNew !== undefined && { isNew: opts.isNew }),
      ...(opts?.categorySlug && { category: { slug: opts.categorySlug } }),
      ...(opts?.collectionSlug && { collection: { slug: opts.collectionSlug } }),
    },
    include: {
      variants: { where: { isActive: true }, orderBy: { price: 'asc' } },
      category: { select: { name: true, slug: true } },
      collection: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: opts?.take ?? 20,
    skip: opts?.skip ?? 0,
  })
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      variants: { where: { isActive: true } },
      category: true,
      collection: true,
    },
  })
}

export async function getFeaturedProducts(take = 8) {
  return getProducts({ isFeatured: true, take })
}

export async function getNewArrivals(take = 8) {
  return getProducts({ isNew: true, take })
}
