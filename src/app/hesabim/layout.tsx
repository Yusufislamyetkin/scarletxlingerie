import type { Metadata } from 'next'
import AccountSidebar from './AccountSidebar'

export const metadata: Metadata = {
  title: 'Hesabım',
  robots: { index: false, follow: false },
}

export default function HesabimLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <h1 className="font-serif text-3xl lg:text-4xl text-charcoal mb-8">Hesabım</h1>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <AccountSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
