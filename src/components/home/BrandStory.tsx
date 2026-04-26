'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function BrandStory() {
  return (
    <section className="py-20 lg:py-28 bg-cream overflow-hidden">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Görsel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=85"
              alt="ScarletX Atölyesi"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Dekoratif çerçeve */}
            <div className="absolute -bottom-4 -right-4 w-3/4 h-3/4 border border-gold/30 pointer-events-none" />
          </motion.div>

          {/* Metin */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="space-y-6"
          >
            <p className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-gold">
              Hikayemiz
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl text-charcoal leading-tight">
              Her Detayda
              <br />
              <em>Mükemmellik</em>
            </h2>
            <span className="gold-divider mx-0" />
            <p className="text-sm font-sans font-light text-stone leading-relaxed">
              ScarletX Lingerie, lüksün gerçekten sessiz olduğu inancıyla doğdu.
              Fransız atelyeleriyle ortaklık kurarak seçilen dantellerden,
              İtalyan ipek satenlere uzanan bir yolculuk.
            </p>
            <p className="text-sm font-sans font-light text-stone leading-relaxed">
              Her parça, özgüveni ve zarafeti bir arada hissetmeniz için
              titizlikle tasarlanır. Gösterişsiz, ancak hissettirici.
            </p>
            <Link href="/hakkimizda" className="btn-outline inline-flex mt-2">
              Daha Fazla Keşfet <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
