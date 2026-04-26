'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionTitle from '@/components/ui/SectionTitle'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

interface Props {
  products: Product[]
  title?: string
  eyebrow?: string
  viewAllHref?: string
}

export default function FeaturedProducts({
  products,
  title = 'Öne Çıkanlar',
  eyebrow = 'Editörün Seçimleri',
  viewAllHref = '/koleksiyonlar',
}: Props) {
  return (
    <section className="py-20 lg:py-28 bg-ivory">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <SectionTitle eyebrow={eyebrow} title={title} align="left" />
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-xs font-sans font-medium tracking-widest uppercase text-stone hover:text-scarlet transition-colors flex-shrink-0"
          >
            Tümünü Gör <ArrowRight size={12} />
          </Link>
        </div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 2} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
