'use client'

import { useEffect } from 'react'
import { gtmViewItem } from '@/lib/analytics/gtm'
import { pixelViewContent } from '@/lib/analytics/meta-pixel'
import type { Product, ProductVariant } from '@/types'

interface Props { product: Product; variant: ProductVariant }

export default function ViewItemTracker({ product, variant }: Props) {
  useEffect(() => {
    gtmViewItem(product, variant)
    pixelViewContent(product, variant)
    // Server-side CAPI için de event gönder
    fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'ViewContent',
        eventId:   `view_${variant.id}_${Date.now()}`,
        customData: {
          content_ids:  [variant.sku || variant.id],
          content_name: product.name,
          content_type: 'product',
          currency:     'TRY',
          value:        variant.price,
        },
      }),
    }).catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, variant.id])

  return null
}
