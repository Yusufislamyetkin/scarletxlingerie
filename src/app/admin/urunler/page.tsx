export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Eye, ToggleLeft } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'
import { prisma } from '@/lib/db'

async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category:   { select: { name: true } },
      collection: { select: { name: true } },
      variants:   { select: { price: true, stock: true, images: true }, where: { isActive: true } },
    },
  })
}

export default async function UrunlerPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Ürünler</h1>
          <p className="text-sm font-light text-stone mt-1">{products.length} ürün</p>
        </div>
        <Link href="/admin/urunler/yeni" className="flex items-center gap-2 btn-primary text-xs">
          <Plus size={14} />
          Yeni Ürün
        </Link>
      </div>

      {/* Filtreler — statik UI, arama gelecekte eklenecek */}
      <div className="bg-warm-white border border-border p-4 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Ürün ara..."
          className="flex-1 min-w-48 px-4 py-2 text-sm font-sans font-light border border-border bg-ivory text-charcoal placeholder:text-pebble focus:outline-none focus:border-charcoal transition-colors"
        />
        <select className="px-4 py-2 text-sm font-sans font-light border border-border bg-ivory text-charcoal focus:outline-none focus:border-charcoal">
          <option value="">Tüm Kategoriler</option>
          <option value="sutyen">Sütyen</option>
          <option value="takim">Takım</option>
          <option value="gecelik">Gecelik</option>
        </select>
        <select className="px-4 py-2 text-sm font-sans font-light border border-border bg-ivory text-charcoal focus:outline-none focus:border-charcoal">
          <option value="">Stok Durumu</option>
          <option value="in_stock">Stokta</option>
          <option value="low">Az Stok (≤3)</option>
          <option value="out">Tükendi</option>
        </select>
      </div>

      {/* Tablo */}
      <div className="bg-warm-white border border-border overflow-hidden">
        {products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-stone font-light text-sm">Henüz ürün eklenmemiş.</p>
            <Link href="/admin/urunler/yeni" className="inline-block mt-4 btn-primary text-xs">
              İlk Ürünü Ekle
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-cream">
                <th className="px-6 py-3 text-left text-[11px] font-sans font-medium tracking-widest uppercase text-stone">Ürün</th>
                <th className="px-6 py-3 text-left text-[11px] font-sans font-medium tracking-widest uppercase text-stone hidden lg:table-cell">Koleksiyon</th>
                <th className="px-6 py-3 text-right text-[11px] font-sans font-medium tracking-widest uppercase text-stone">Fiyat</th>
                <th className="px-6 py-3 text-center text-[11px] font-sans font-medium tracking-widest uppercase text-stone">Stok</th>
                <th className="px-6 py-3 text-center text-[11px] font-sans font-medium tracking-widest uppercase text-stone hidden md:table-cell">Etiketler</th>
                <th className="px-6 py-3 text-right text-[11px] font-sans font-medium tracking-widest uppercase text-stone">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => {
                const firstImage  = product.variants[0]?.images[0] ?? null
                const prices      = product.variants.map(v => v.price)
                const minPrice    = prices.length ? Math.min(...prices) : 0
                const maxPrice    = prices.length ? Math.max(...prices) : 0
                const totalStock  = product.variants.reduce((s, v) => s + v.stock, 0)
                const lowStock    = totalStock > 0 && totalStock <= 5

                return (
                  <tr key={product.id} className="hover:bg-cream/40 transition-colors">
                    {/* Ürün */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 bg-linen flex-shrink-0 overflow-hidden">
                          {firstImage && (
                            <Image src={firstImage} alt={product.name} fill sizes="40px" className="object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-sans font-medium text-charcoal">{product.name}</p>
                          <p className="text-xs font-light text-stone">{product.category?.name ?? '—'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Koleksiyon */}
                    <td className="px-6 py-4 text-sm font-light text-stone hidden lg:table-cell">
                      {product.collection?.name ?? '—'}
                    </td>

                    {/* Fiyat */}
                    <td className="px-6 py-4 text-right font-sans font-medium text-charcoal">
                      {prices.length === 0
                        ? '—'
                        : minPrice === maxPrice
                          ? formatPrice(minPrice)
                          : `${formatPrice(minPrice)}+`}
                    </td>

                    {/* Stok */}
                    <td className="px-6 py-4 text-center">
                      {totalStock === 0 ? (
                        <span className="px-2 py-0.5 text-[10px] font-sans font-medium tracking-widest uppercase bg-pebble/15 text-pebble">Tükendi</span>
                      ) : lowStock ? (
                        <span className="px-2 py-0.5 text-[10px] font-sans font-medium tracking-widest uppercase bg-amber-100 text-amber-700">{totalStock} Adet</span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-sans font-medium tracking-widest uppercase bg-green-50 text-green-700">{totalStock} Adet</span>
                      )}
                    </td>

                    {/* Etiketler */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex gap-1 justify-center">
                        {product.isNew && (
                          <span className="px-1.5 py-0.5 text-[9px] font-sans font-medium tracking-widest uppercase bg-charcoal/10 text-charcoal">Yeni</span>
                        )}
                        {product.isFeatured && (
                          <span className="px-1.5 py-0.5 text-[9px] font-sans font-medium tracking-widest uppercase bg-gold/20 text-gold-dark">Öne Çıkan</span>
                        )}
                      </div>
                    </td>

                    {/* İşlem */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/urun/${product.slug}`}
                          target="_blank"
                          className="p-1.5 text-stone hover:text-charcoal transition-colors"
                          title="Önizle"
                        >
                          <Eye size={15} strokeWidth={1.5} />
                        </Link>
                        <Link
                          href={`/admin/urunler/${product.id}`}
                          className="p-1.5 text-stone hover:text-charcoal transition-colors"
                          title="Düzenle"
                        >
                          <Pencil size={15} strokeWidth={1.5} />
                        </Link>
                        <button className="p-1.5 text-stone hover:text-pebble transition-colors" title="Pasife Al">
                          <ToggleLeft size={15} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
