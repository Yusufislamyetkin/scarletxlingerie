export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import ProductGallery from '@/components/product/ProductGallery'
import AddToCart from '@/components/product/AddToCart'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import ViewItemTracker from '@/components/analytics/ViewItemTracker'
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { getProductBySlug, getProducts } from '@/lib/db/products'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://scarletxlingerie.com'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  const image = product.variants[0]?.images[0]
  return {
    title:       product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.description,
    alternates:  { canonical: `${BASE_URL}/urun/${slug}` },
    openGraph: {
      type:        'website',
      url:         `${BASE_URL}/urun/${slug}`,
      title:       product.seoTitle ?? product.name,
      description: product.seoDescription ?? product.description,
      images:      image ? [{ url: image, alt: product.name }] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const [related] = await Promise.all([
    getProducts({ categorySlug: product.category.toLowerCase(), take: 4 }),
  ])
  const relatedFiltered = related.filter((p) => p.id !== product.id).slice(0, 4)
  const allImages = [...new Set(product.variants.flatMap((v) => v.images))]

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd items={[
        { name: 'Ana Sayfa',    href: '/' },
        { name: 'Koleksiyonlar', href: '/koleksiyonlar' },
        { name: product.name,   href: `/urun/${product.slug}` },
      ]} />
      <ViewItemTracker product={product} variant={product.variants[0]} />
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11px] font-sans font-light text-stone mb-8">
          <Link href="/" className="hover:text-charcoal transition-colors">Ana Sayfa</Link>
          <ChevronRight size={10} />
          <Link href="/koleksiyonlar" className="hover:text-charcoal transition-colors">Koleksiyonlar</Link>
          <ChevronRight size={10} />
          <span className="text-charcoal">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Galeri */}
          <ProductGallery images={allImages} productName={product.name} />

          {/* Detaylar */}
          <div className="space-y-6">
            <div>
              {product.isNew && (
                <span className="inline-block px-2 py-0.5 bg-charcoal text-ivory text-[10px] font-sans font-medium tracking-widest uppercase mb-3">
                  Yeni
                </span>
              )}
              <h1 className="font-serif text-3xl lg:text-4xl text-charcoal mb-2">{product.name}</h1>
              <p className="text-sm font-sans font-light text-stone leading-relaxed">{product.description}</p>
            </div>

            <span className="gold-divider mx-0" />

            <AddToCart product={product} />

            {/* Ürün detayları */}
            <div className="border-t border-border pt-6 space-y-4">
              {product.material && (
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-xs font-sans font-medium tracking-widest uppercase text-charcoal py-2">
                    Materyal
                    <ChevronRight size={13} className="transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="text-sm font-light text-stone mt-2 leading-relaxed">{product.material}</p>
                </details>
              )}
              {product.careInstructions && (
                <details className="group border-t border-border">
                  <summary className="flex items-center justify-between cursor-pointer text-xs font-sans font-medium tracking-widest uppercase text-charcoal py-2">
                    Bakım Talimatları
                    <ChevronRight size={13} className="transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="text-sm font-light text-stone mt-2 leading-relaxed">{product.careInstructions}</p>
                </details>
              )}
              {product.modelMeasurements && (
                <details className="group border-t border-border">
                  <summary className="flex items-center justify-between cursor-pointer text-xs font-sans font-medium tracking-widest uppercase text-charcoal py-2">
                    Model Ölçüleri
                    <ChevronRight size={13} className="transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="text-sm font-light text-stone mt-2 leading-relaxed">{product.modelMeasurements}</p>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* İlgili ürünler */}
      {relatedFiltered.length > 0 && (
        <FeaturedProducts
          products={relatedFiltered}
          title="Bunları da Beğenebilirsiniz"
          eyebrow="İlgili Ürünler"
          viewAllHref="/koleksiyonlar"
        />
      )}
    </>
  )
}
