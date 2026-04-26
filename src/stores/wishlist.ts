'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

interface WishlistStore {
  items: Product[]
  toggle: (product: Product) => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set) => ({
      items: [],
      toggle: (product) =>
        set((state) => ({
          items: state.items.some((p) => p.id === product.id)
            ? state.items.filter((p) => p.id !== product.id)
            : [...state.items, product],
        })),
    }),
    { name: 'scarletx-wishlist' }
  )
)
