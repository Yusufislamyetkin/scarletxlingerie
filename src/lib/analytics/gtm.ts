import type { Product, ProductVariant, CartItem } from '@/types'

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

function push(event: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  // GA4 ecommerce için önceki veriyi temizle
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push(event)
}

function toGtmItem(product: Product, variant: ProductVariant, quantity = 1) {
  return {
    item_id:       variant.sku || variant.id,
    item_name:     product.name,
    item_category: product.category,
    item_variant:  `${variant.color} / ${variant.size}`,
    price:         variant.price,
    quantity,
  }
}

export function gtmViewItem(product: Product, variant: ProductVariant) {
  push({
    event: 'view_item',
    ecommerce: {
      currency: 'TRY',
      value:    variant.price,
      items:    [toGtmItem(product, variant)],
    },
  })
}

export function gtmAddToCart(product: Product, variant: ProductVariant, quantity: number) {
  push({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'TRY',
      value:    variant.price * quantity,
      items:    [toGtmItem(product, variant, quantity)],
    },
  })
}

export function gtmBeginCheckout(items: CartItem[], value: number) {
  push({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'TRY',
      value,
      items: items.map(i => ({
        item_id:       i.variantId,
        item_name:     i.name,
        item_variant:  `${i.color} / ${i.size}`,
        price:         i.price,
        quantity:      i.quantity,
      })),
    },
  })
}

export function gtmPurchase(
  orderNumber: string,
  items: CartItem[],
  value: number,
  shipping: number,
  couponCode?: string
) {
  push({
    event: 'purchase',
    ecommerce: {
      transaction_id: orderNumber,
      currency:       'TRY',
      value,
      shipping,
      coupon:         couponCode || undefined,
      items: items.map(i => ({
        item_id:       i.variantId,
        item_name:     i.name,
        item_variant:  `${i.color} / ${i.size}`,
        price:         i.price,
        quantity:      i.quantity,
      })),
    },
  })
}
