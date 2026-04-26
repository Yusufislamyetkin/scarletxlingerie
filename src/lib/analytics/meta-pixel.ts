import type { Product, ProductVariant, CartItem } from '@/types'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq: (...args: any[]) => void
    _fbq: unknown
  }
}

function track(event: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', event, data)
}

export function pixelPageView() {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', 'PageView')
}

export function pixelViewContent(product: Product, variant: ProductVariant) {
  track('ViewContent', {
    content_ids:  [variant.sku || variant.id],
    content_name: product.name,
    content_type: 'product',
    currency:     'TRY',
    value:        variant.price,
  })
}

export function pixelAddToCart(product: Product, variant: ProductVariant, quantity: number) {
  track('AddToCart', {
    content_ids:  [variant.sku || variant.id],
    content_name: product.name,
    content_type: 'product',
    currency:     'TRY',
    value:        variant.price * quantity,
    num_items:    quantity,
  })
}

export function pixelInitiateCheckout(items: CartItem[], value: number) {
  track('InitiateCheckout', {
    content_ids: items.map(i => i.variantId),
    currency:    'TRY',
    value,
    num_items:   items.reduce((s, i) => s + i.quantity, 0),
  })
}

export function pixelPurchase(
  items: CartItem[],
  value: number,
  orderId: string
) {
  track('Purchase', {
    content_ids:  items.map(i => i.variantId),
    content_type: 'product',
    currency:     'TRY',
    value,
    order_id:     orderId,
  })
}
