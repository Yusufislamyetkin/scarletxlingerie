import type { Product } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://scarletxlingerie.com'

// ─── Organization ─────────────────────────────────────────────────────────────

export function OrganizationJsonLd() {
  const schema = {
    '@context':   'https://schema.org',
    '@type':      'Organization',
    name:         'ScarletX Lingerie',
    url:          BASE_URL,
    logo:         `${BASE_URL}/logo.png`,
    description:  'Sessiz lüksün adresi. Premium iç giyim koleksiyonu.',
    contactPoint: {
      '@type':       'ContactPoint',
      contactType:   'customer service',
      availableLanguage: 'Turkish',
    },
    sameAs: [],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ─── Product ──────────────────────────────────────────────────────────────────

export function ProductJsonLd({ product }: { product: Product }) {
  const firstVariant = product.variants[0]
  if (!firstVariant) return null

  const inStock    = product.variants.some((v) => v.stock > 0)
  const lowestPrice = Math.min(...product.variants.map((v) => v.price))
  const highestPrice = Math.max(...product.variants.map((v) => v.price))

  const schema: Record<string, unknown> = {
    '@context':   'https://schema.org',
    '@type':      'Product',
    name:         product.name,
    description:  product.description,
    image:        firstVariant.images,
    brand: {
      '@type': 'Brand',
      name:    'ScarletX Lingerie',
    },
    sku:      firstVariant.sku ?? firstVariant.id,
    material: product.material,
    offers: {
      '@type':           'AggregateOffer',
      priceCurrency:     'TRY',
      lowPrice:          lowestPrice,
      highPrice:         highestPrice,
      offerCount:        product.variants.length,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${BASE_URL}/urun/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name:    'ScarletX Lingerie',
      },
    },
  }

  if (firstVariant.compareAtPrice) {
    ;(schema.offers as Record<string, unknown>).priceValidUntil = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split('T')[0]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

interface BreadcrumbItem { name: string; href: string }

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context':       'https://schema.org',
    '@type':          'BreadcrumbList',
    itemListElement:  items.map((item, index) => ({
      '@type':   'ListItem',
      position:  index + 1,
      name:      item.name,
      item:      `${BASE_URL}${item.href}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
