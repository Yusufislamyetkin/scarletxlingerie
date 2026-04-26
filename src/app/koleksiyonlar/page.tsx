import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import SectionTitle from '@/components/ui/SectionTitle'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { mockCollections } from '@/lib/mock-data'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://scarletxlingerie.com'

export const metadata: Metadata = {
  title:       'Koleksiyonlar',
  description: 'ScarletX Lingerie koleksiyonlarını keşfedin. Velvet Noir, Ivory Reverie, Scarlet Romance ve daha fazlası.',
  alternates:  { canonical: `${BASE_URL}/koleksiyonlar` },
}

export default function CollectionsPage() {
  return (
    <>
    <BreadcrumbJsonLd items={[
      { name: 'Ana Sayfa',     href: '/' },
      { name: 'Koleksiyonlar', href: '/koleksiyonlar' },
    ]} />
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-16">
      <SectionTitle
        eyebrow="Tüm Koleksiyonlar"
        title="Duygu Dolu Koleksiyonlar"
        subtitle="Her biri farklı bir anı ve hissi yansıtan koleksiyonlarımızı keşfedin."
        className="mb-14"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockCollections.map((col) => (
          <Link key={col.id} href={`/koleksiyonlar/${col.slug}`} className="group block relative overflow-hidden aspect-[2/3] bg-cream">
            <Image src={col.image} alt={col.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="font-serif text-2xl text-ivory">{col.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </>
  )
}
