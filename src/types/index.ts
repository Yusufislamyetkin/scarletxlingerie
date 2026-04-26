// ─── Product ──────────────────────────────────────────────────────────────────

export interface ProductVariant {
  id: string
  sku: string
  size: string
  color: string
  colorHex: string
  price: number
  compareAtPrice?: number
  stock: number
  images: string[]
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  category: string
  collectionId?: string
  variants: ProductVariant[]
  material: string
  careInstructions: string
  modelMeasurements?: string
  isFeatured: boolean
  isNew: boolean
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  ogImage?: string
  createdAt: string
  updatedAt: string
}

// ─── Collection ───────────────────────────────────────────────────────────────

export interface Collection {
  id: string
  slug: string
  name: string
  description?: string
  image: string
  seoTitle?: string
  seoDescription?: string
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string
  variantId: string
  name: string
  size: string
  color: string
  colorHex: string
  price: number
  image: string
  quantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  couponCode?: string
}

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refund_requested'
  | 'refunded'

export interface OrderAddress {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  district: string
  postalCode: string
  country: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  items: CartItem[]
  shippingAddress: OrderAddress
  billingAddress: OrderAddress
  status: OrderStatus
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  couponCode?: string
  giftNote?: string
  giftWrapping: boolean
  trackingNumber?: string
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  createdAt: string
  updatedAt: string
}

// ─── Customer ─────────────────────────────────────────────────────────────────

export type CustomerTier = 'standard' | 'gold' | 'platinum' | 'scarlet_elite'

export interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  tier: CustomerTier
  totalSpent: number
  orderCount: number
  addresses: OrderAddress[]
  createdAt: string
}

// ─── Campaign / Marketing ─────────────────────────────────────────────────────

export interface AnnouncementBar {
  id: string
  text: string
  link?: string
  isActive: boolean
  bgColor: string
  textColor: string
}

export interface HeroBanner {
  id: string
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  image: string
  mobileImage?: string
  isActive: boolean
  order: number
}

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrderAmount?: number
  maxUses?: number
  usedCount: number
  customerTiers?: CustomerTier[]
  isFirstOrderOnly: boolean
  expiresAt?: string
  isActive: boolean
}
