import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ProductGrid from '@/components/product/ProductGrid'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { mockCollections, mockProducts } from '@/lib/mock-data'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://scarletxlingerie.com'

export async function generateStaticParams() {
  return mockCollections.map((c) => ({ slug: c.slug }))
}

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const col = mockCollections.find((c) => c.slug === slug)
  if (!col) return {}
  return {
    title:       col.name,
    description: col.description,
    alternates:  { canonical: `${BASE_URL}/koleksiyonlar/${slug}` },
    openGraph: {
      type:        'website',
      url:         `${BASE_URL}/koleksiyonlar/${slug}`,
      title:       col.name,
      description: col.description,
      images:      [{ url: col.image, alt: col.name }],
    },
  }
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params
  const collection = mockCollections.find((c) => c.slug === slug)
  if (!collection) notFound()

  const products = mockProducts.filter((p) => p.collectionId === collection.id)

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Ana Sayfa',     href: '/' },
        { name: 'Koleksiyonlar', href: '/koleksiyonlar' },
        { name: collection.name, href: `/koleksiyonlar/${collection.slug}` },
      ]} />
      {/* Hero */}
      <div className="relative w-full h-48 lg:h-72 overflow-hidden bg-cream">
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold">
            Koleksiyon
          </p>
          <h1 className="font-serif text-3xl lg:text-5xl text-ivory">{collection.name}</h1>
          {collection.description && (
            <p className="text-sm font-sans font-light text-ivory/70 max-w-md text-center px-4">
              {collection.description}
            </p>
          )}
        </div>
      </div>

      <ProductGrid products={products} />
    </>
  )
}
