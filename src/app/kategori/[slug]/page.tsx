export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ProductGrid from '@/components/product/ProductGrid'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { getProducts } from '@/lib/db/products'
import { prisma } from '@/lib/db'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://scarletxlingerie.com'

interface Props { params: Promise<{ slug: string }> }

async function getCategory(slug: string) {
  return prisma.category.findUnique({ where: { slug } })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return {}
  return {
    title:       `${category.name} — ScarletX Lingerie`,
    description: `ScarletX Lingerie ${category.name} koleksiyonu. Premium iç giyim.`,
    alternates:  { canonical: `${BASE_URL}/kategori/${slug}` },
  }
}

export default async function KategoriPage({ params }: Props) {
  const { slug } = await params
  const [category, products] = await Promise.all([
    getCategory(slug),
    getProducts({ categorySlug: slug, take: 50 }),
  ])
  if (!category) notFound()

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Ana Sayfa',    href: '/' },
        { name: 'Koleksiyonlar', href: '/koleksiyonlar' },
        { name: category.name,  href: `/kategori/${slug}` },
      ]} />

      {/* Hero */}
      <div className="relative w-full h-36 lg:h-56 overflow-hidden bg-cream">
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold">
            Kategori
          </p>
          <h1 className="font-serif text-3xl lg:text-5xl text-ivory">{category.name}</h1>
        </div>
      </div>

      <ProductGrid products={products} />
    </>
  )
}
