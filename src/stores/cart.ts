'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  open:  () => void
  close: () => void
  toggle: () => void
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  get total(): number
  get subtotal(): number
  get itemCount(): number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      open:   () => set({ isOpen: true }),
      close:  () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === newItem.variantId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === newItem.variantId
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
              isOpen: true,
            }
          }
          return { items: [...state.items, newItem], isOpen: true }
        }),

      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),

      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.variantId !== variantId)
              : state.items.map((i) =>
                  i.variantId === variantId ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [] }),

      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },
      get total() {
        return get().subtotal
      },
      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },
    }),
    {
      name: 'scarletx-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
