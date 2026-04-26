import { MapPin, Plus } from 'lucide-react'

export default function AdreslerimPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[11px] font-sans font-medium tracking-widest uppercase text-stone">Kayıtlı Adresler</p>
        <button className="flex items-center gap-1.5 text-[11px] font-sans font-medium tracking-widest uppercase text-charcoal hover:text-scarlet transition-colors border border-charcoal hover:border-scarlet px-4 py-2">
          <Plus size={13} />
          Adres Ekle
        </button>
      </div>

      {/* Boş durum */}
      <div className="bg-cream border border-border p-12 flex flex-col items-center text-center gap-4">
        <MapPin size={36} strokeWidth={1} className="text-linen" />
        <p className="font-serif text-xl text-charcoal">Kayıtlı Adres Yok</p>
        <p className="text-sm font-light text-stone">
          Teslimat adresinizi kaydedin, bir sonraki alışverişinizde otomatik dolsun.
        </p>
      </div>
    </div>
  )
}
