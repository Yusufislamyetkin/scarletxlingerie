'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import type { Collection } from '@/types'

interface Props {
  collections: Collection[]
}

export default function CollectionsGrid({ collections }: Props) {
  return (
    <section className="py-20 lg:py-28 bg-warm-white">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Dünyamıza Hoş Geldiniz"
          title="Koleksiyonlar"
          subtitle="Her koleksiyon, farklı bir duyguyu ve anı yansıtmak için tasarlandı."
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {collections.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
            >
              <Link href={`/koleksiyonlar/${col.slug}`} className="group block relative overflow-hidden aspect-[2/3] bg-cream">
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl text-ivory mb-1">{col.name}</h3>
                  {col.description && (
                    <p className="text-xs font-sans font-light text-ivory/70 leading-relaxed mb-3 line-clamp-2">
                      {col.description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-gold group-hover:gap-3 transition-all">
                    İncele <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
