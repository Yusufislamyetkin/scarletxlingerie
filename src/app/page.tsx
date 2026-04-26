import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import CollectionsGrid from '@/components/home/CollectionsGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import UspBar from '@/components/home/UspBar'
import BrandStory from '@/components/home/BrandStory'
import { OrganizationJsonLd } from '@/components/seo/JsonLd'
import { mockCollections, mockProducts } from '@/lib/mock-data'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://scarletxlingerie.com'

export const metadata: Metadata = {
  title:       'ScarletX Lingerie — Premium İç Giyim',
  description: 'Sessiz lüksün adresi. Özenle seçilmiş premium iç giyim koleksiyonu. Özgüveni ve zarafeti bir arada hisset.',
  alternates:  { canonical: BASE_URL },
  openGraph: {
    type:  'website',
    url:   BASE_URL,
    title: 'ScarletX Lingerie — Premium İç Giyim',
    description: 'Sessiz lüksün adresi. Özenle seçilmiş premium iç giyim koleksiyonu.',
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'ScarletX Lingerie' }],
  },
}

export default function HomePage() {
  const featured    = mockProducts.filter((p) => p.isFeatured)
  const newArrivals = mockProducts.filter((p) => p.isNew)

  return (
    <>
      <OrganizationJsonLd />
      <HeroSection />
      <UspBar />
      <CollectionsGrid collections={mockCollections} />
      <FeaturedProducts products={featured} />
      <BrandStory />
      <FeaturedProducts
        products={newArrivals}
        title="Yeni Gelenler"
        eyebrow="Taze Keşifler"
        viewAllHref="/yeni-gelenler"
      />
    </>
  )
}
