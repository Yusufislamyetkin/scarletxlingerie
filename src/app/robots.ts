import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://scarletxlingerie.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        disallow:  ['/admin/', '/hesabim/', '/odeme', '/siparis-onay', '/giris'],
      },
    ],
    sitemap:   `${BASE_URL}/sitemap.xml`,
    host:      BASE_URL,
  }
}
