'use client'

import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/stores/wishlist'
import ProductCard from '@/components/product/ProductCard'

export default function FavorilerimPage() {
  const items = useWishlistStore((s) => s.items)

  if (items.length === 0) {
    return (
      <div className="bg-cream border border-border p-12 flex flex-col items-center text-center gap-4">
        <Heart size={36} strokeWidth={1} className="text-linen" />
        <p className="font-serif text-xl text-charcoal">Favori Listeniz Boş</p>
        <p className="text-sm font-light text-stone">
          Ürün sayfalarındaki kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone mb-6">
        {items.length} Ürün
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
