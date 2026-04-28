import Link from 'next/link'
import { Share2, Globe } from 'lucide-react'

const footerLinks = {
  shop: [
    { label: 'Yeni Gelenler', href: '/yeni-gelenler' },
    { label: 'Koleksiyonlar', href: '/koleksiyonlar' },
    { label: 'Sütyen', href: '/kategori/sutyen' },
    { label: 'Takım', href: '/kategori/takim' },
    { label: 'Gecelik', href: '/kategori/gecelik' },
    { label: 'Sale', href: '/sale' },
  ],
  help: [
    { label: 'Beden Rehberi', href: '/beden-rehberi' },
    { label: 'Sipariş Takibi', href: '/siparis-takibi' },
    { label: 'İade & Değişim', href: '/iade-degisim' },
    { label: 'Kargo Bilgileri', href: '/kargo' },
    { label: 'Sık Sorulan Sorular', href: '/sss' },
  ],
  company: [
    { label: 'Hakkımızda', href: '/hakkimizda' },
    { label: 'İletişim', href: '/iletisim' },
    { label: 'Gizlilik Politikası', href: '/gizlilik' },
    { label: 'Çerez Politikası', href: '/cerez' },
    { label: 'Kullanım Koşulları', href: '/kosullar' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory">
      {/* Newsletter */}
      <div className="border-b border-graphite">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="font-serif text-2xl lg:text-3xl text-ivory mb-2">
                Koleksiyona İlk Sen Ulaş
              </h3>
              <p className="text-sm text-ivory/60 font-light tracking-wide">
                Yeni gelenler, özel teklifler ve stil ilhamı için abone ol.
              </p>
            </div>
            <form className="flex w-full max-w-md gap-0">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-5 py-3.5 bg-graphite text-ivory placeholder:text-pebble text-sm font-light border border-graphite focus:border-gold focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-gold text-charcoal text-xs font-sans font-medium tracking-widest uppercase hover:bg-gold-light transition-colors flex-shrink-0"
              >
                Abone Ol
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl text-ivory">
                Scarlet<span className="text-gold">X</span>
              </span>
            </Link>
            <p className="text-xs text-ivory/60 font-light leading-relaxed tracking-wide mb-6">
              Sessiz lüksün adresi. Her dokunuşta kaliteyi hissettiren premium iç giyim.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="p-2 border border-graphite text-ivory/40 hover:text-gold hover:border-gold transition-colors" aria-label="Instagram">
                <Share2 size={16} strokeWidth={1.5} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="p-2 border border-graphite text-ivory/40 hover:text-gold hover:border-gold transition-colors" aria-label="Facebook">
                <Globe size={16} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-sans font-medium tracking-widest uppercase text-ivory/50 mb-5">Alışveriş</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-light text-ivory/65 hover:text-ivory transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-sans font-medium tracking-widest uppercase text-ivory/50 mb-5">Yardım</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-light text-ivory/65 hover:text-ivory transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-sans font-medium tracking-widest uppercase text-ivory/50 mb-5">Kurumsal</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-light text-ivory/65 hover:text-ivory transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-graphite">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-ivory/50 font-light tracking-wide">
              &copy; {new Date().getFullYear()} ScarletX Lingerie. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-3">
              {['Visa', 'Mastercard', 'Troy'].map((method) => (
                <span key={method} className="px-2 py-1 border border-graphite text-[10px] font-sans text-ivory/40 tracking-wide">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
