'use client'

import { motion } from 'framer-motion'
import { Truck, RotateCcw, Lock, Star } from 'lucide-react'

const usps = [
  { icon: Truck,    title: 'Ücretsiz Kargo',       desc: '500 TL ve üzeri siparişlerde' },
  { icon: RotateCcw, title: '30 Gün İade',         desc: 'Koşulsuz iade garantisi' },
  { icon: Lock,     title: 'Güvenli Ödeme',         desc: '256-bit SSL şifrelemesi' },
  { icon: Star,     title: 'Premium Kalite',        desc: 'Özenle seçilmiş materyaller' },
]

export default function UspBar() {
  return (
    <section className="bg-charcoal py-12 lg:py-14">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {usps.map((usp, i) => (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left"
            >
              <div className="p-2.5 border border-graphite flex-shrink-0">
                <usp.icon size={18} strokeWidth={1.5} className="text-gold" />
              </div>
              <div>
                <h4 className="text-xs font-sans font-medium tracking-widest uppercase text-ivory mb-0.5">
                  {usp.title}
                </h4>
                <p className="text-xs font-sans font-light text-pebble">
                  {usp.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
