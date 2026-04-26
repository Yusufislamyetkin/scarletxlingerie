import { prisma } from './index'
import type { CustomerTier } from '@/generated/prisma/enums'

export async function getOrCreateCustomer(userId: string, data: {
  firstName: string
  lastName: string
  phone?: string
}) {
  return prisma.customer.upsert({
    where: { userId },
    update: {},
    create: { userId, ...data },
  })
}

export function getTierBySpend(totalSpent: number): CustomerTier {
  if (totalSpent >= 50000) return 'SCARLET_ELITE'
  if (totalSpent >= 15000) return 'PLATINUM'
  if (totalSpent >= 5000)  return 'GOLD'
  return 'STANDARD'
}

export async function updateCustomerTier(customerId: string, totalSpent: number) {
  const tier = getTierBySpend(totalSpent)
  return prisma.customer.update({
    where: { id: customerId },
    data: { totalSpent, tier },
  })
}
