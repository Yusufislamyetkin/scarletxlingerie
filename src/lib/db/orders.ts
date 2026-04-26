import { prisma } from './index'
import type { OrderStatus } from '@/generated/prisma/enums'

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      customer: { include: { user: { select: { email: true } } } },
    },
  })
}

export async function getCustomerOrders(customerId: string) {
  return prisma.order.findMany({
    where: { customerId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status, updatedAt: new Date() },
  })
}

export function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `SX-${ts}-${rand}`
}
