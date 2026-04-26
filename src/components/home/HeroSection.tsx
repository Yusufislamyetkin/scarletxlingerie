'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: 'easeOut' },
  }),
}

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-screen flex items-center bg-cream overflow-hidden">
      {/* Arka plan görseli */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=1920&q=85"
          alt="ScarletX Hero"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/30 to-transparent" />
      </div>

      {/* İçerik */}
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-xl">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={variants}
            className="text-xs font-sans font-medium tracking-[0.25em] uppercase text-gold mb-4"
          >
            Yeni Koleksiyon 2026
          </motion.p>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={variants}
            className="font-serif text-ivory text-balance leading-none mb-6"
          >
            Sessiz Bir
            <br />
            <em>Lüksün</em> Adresi
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={variants}
            className="text-sm font-sans font-light text-ivory/80 leading-relaxed mb-8 max-w-sm"
          >
            El işçiliği dantel, saten ipek ve nadir dokularla hazırlanan koleksiyonlar.
            Her detay, kendinizi en güzel hissetmeniz için tasarlandı.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={variants}
            className="flex flex-wrap gap-4"
          >
            <Link href="/koleksiyonlar" className="btn-primary group">
              Koleksiyonu Keşfet
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/yeni-gelenler" className="btn-outline border-ivory text-ivory hover:bg-ivory hover:text-charcoal">
              Yeni Gelenler
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Alt dekorasyon */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-[10px] font-sans tracking-widest uppercase text-ivory/60">Keşfet</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-ivory/60 to-transparent"
        />
      </div>
    </section>
  )
}
