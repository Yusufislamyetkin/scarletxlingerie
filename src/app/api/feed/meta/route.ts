import { NextResponse } from 'next/server'
import { mockProducts } from '@/lib/mock-data'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://scarletxlingerie.com'

export async function GET() {
  const items = mockProducts.flatMap((product) =>
    product.variants.map((variant) => ({
      id:           variant.sku || variant.id,
      title:        `${product.name} — ${variant.color} / ${variant.size}`,
      description:  product.description,
      link:         `${BASE_URL}/urun/${product.slug}`,
      image_link:   variant.images[0] ?? '',
      availability: variant.stock > 0 ? 'in stock' : 'out of stock',
      price:        `${variant.price.toFixed(2)} TRY`,
      sale_price:   variant.compareAtPrice
        ? `${variant.price.toFixed(2)} TRY`
        : undefined,
      brand:          'ScarletX Lingerie',
      google_product_category: '212',
      item_group_id: product.id,
      color:         variant.color,
      size:          variant.size,
      condition:     'new',
    }))
  )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>ScarletX Lingerie — Ürün Kataloğu</title>
    <link>${BASE_URL}</link>
    <description>Premium iç giyim koleksiyonu</description>
${items
  .map(
    (item) => `    <item>
      <g:id>${item.id}</g:id>
      <g:title><![CDATA[${item.title}]]></g:title>
      <g:description><![CDATA[${item.description}]]></g:description>
      <g:link>${item.link}</g:link>
      <g:image_link>${item.image_link}</g:image_link>
      <g:availability>${item.availability}</g:availability>
      <g:price>${item.price}</g:price>${item.sale_price ? `\n      <g:sale_price>${item.sale_price}</g:sale_price>` : ''}
      <g:brand>${item.brand}</g:brand>
      <g:google_product_category>${item.google_product_category}</g:google_product_category>
      <g:item_group_id>${item.item_group_id}</g:item_group_id>
      <g:color>${item.color}</g:color>
      <g:size>${item.size}</g:size>
      <g:condition>${item.condition}</g:condition>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
