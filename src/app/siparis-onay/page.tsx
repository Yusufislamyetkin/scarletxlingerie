import { Suspense } from 'react'
import type { Metadata } from 'next'
import SiparisOnayContent from './SiparisOnayContent'

export const metadata: Metadata = {
  title: 'Sipariş Onayı',
  robots: { index: false, follow: false },
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-scarlet border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function SiparisOnayPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SiparisOnayContent />
    </Suspense>
  )
}
