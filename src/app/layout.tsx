import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import CartDrawer from '@/components/cart/CartDrawer'

const GTM_ID        = process.env.NEXT_PUBLIC_GTM_ID
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor:        '#FAF7F2',
  colorScheme:       'light',
  width:             'device-width',
  initialScale:      1,
  maximumScale:      5,
}

export const metadata: Metadata = {
  title: {
    default: 'ScarletX Lingerie — Premium İç Giyim',
    template: '%s | ScarletX Lingerie',
  },
  description:
    'Sessiz lüksün adresi. Özenle seçilmiş premium iç giyim koleksiyonu. Özgüveni ve zarafeti bir arada hisset.',
  keywords: ['iç giyim', 'lingerie', 'premium', 'sütyen', 'takım', 'lüks'],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'ScarletX Lingerie',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${jost.variable} h-full`} data-scroll-behavior="smooth">
      {GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}</Script>
      )}
      {META_PIXEL_ID && (
        <Script id="meta-pixel-init" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}</Script>
      )}
      <body className="min-h-full flex flex-col bg-ivory text-charcoal antialiased">
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Header />
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
        <Footer />
        <MobileNav />
        <CartDrawer />
      </body>
    </html>
  )
}
