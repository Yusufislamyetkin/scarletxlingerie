export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getProductBySlug } from '@/lib/db/products'
import UrunForm from './UrunForm'
import { toProduct } from '@/lib/db/products'

interface Props { params: Promise<{ id: string }> }

async function getProductById(id: string) {
  const p = await prisma.product.findUnique({
    where: { id },
    include: {
      variants:   { where: { isActive: true }, orderBy: { price: 'asc' } },
      category:   { select: { name: true, slug: true } },
      collection: { select: { name: true, slug: true } },
    },
  })
  return p ? toProduct(p) : null
}

export default async function UrunFormPage({ params }: Props) {
  const { id } = await params
  const isNew  = id === 'yeni'

  const [existing, allCollections] = await Promise.all([
    isNew ? null : getProductById(id),
    prisma.collection.findMany({
      where:   { isActive: true },
      orderBy: { order: 'asc' },
      select:  { id: true, name: true },
    }),
  ])

  if (!isNew && !existing) notFound()

  return (
    <UrunForm
      id={id}
      existing={existing}
      collections={allCollections}
    />
  )
}
