import type { Metadata } from 'next'
import CheckoutClient from '@/components/checkout/CheckoutClient'

export const metadata: Metadata = {
  title: 'Güvenli Ödeme',
  robots: { index: false, follow: false },
}

export default function OdemePage() {
  return <CheckoutClient />
}
