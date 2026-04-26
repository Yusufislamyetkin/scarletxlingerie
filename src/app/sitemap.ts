import type { MetadataRoute } from 'next'
import { mockCollections, mockProducts } from '@/lib/mock-data'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://scarletxlingerie.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url:             BASE_URL,
      lastModified:    new Date(),
      changeFrequency: 'weekly',
      priority:        1,
    },
    {
      url:             `${BASE_URL}/koleksiyonlar`,
      lastModified:    new Date(),
      changeFrequency: 'weekly',
      priority:        0.9,
    },
  ]

  const collectionPages: MetadataRoute.Sitemap = mockCollections.map((col) => ({
    url:             `${BASE_URL}/koleksiyonlar/${col.slug}`,
    lastModified:    new Date(),
    changeFrequency: 'weekly' as const,
    priority:        0.8,
  }))

  const productPages: MetadataRoute.Sitemap = mockProducts.map((product) => ({
    url:             `${BASE_URL}/urun/${product.slug}`,
    lastModified:    new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority:        0.7,
  }))

  return [...staticPages, ...collectionPages, ...productPages]
}
