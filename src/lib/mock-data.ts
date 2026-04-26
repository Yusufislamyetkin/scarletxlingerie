import type { Product, Collection } from '@/types'

export const mockCollections: Collection[] = [
  {
    id: '1', slug: 'velvet-noir',
    name: 'Velvet Noir',
    description: 'Karanlığın zarafetiyle buluşan kadifemsi koleksiyon',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
  },
  {
    id: '2', slug: 'ivory-reverie',
    name: 'Ivory Reverie',
    description: 'Fildişinin saf tonlarında bir rüya',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
  },
  {
    id: '3', slug: 'scarlet-romance',
    name: 'Scarlet Romance',
    description: 'Tutkuyu ve özgüveni bir arada taşıyan kırmızı',
    image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800&q=80',
  },
]

export const mockProducts: Product[] = [
  {
    id: '1', slug: 'velvet-noir-sutyen',
    name: 'Velvet Noir Sütyen',
    description: 'El yapımı Fransız danteliyle süslenmiş, mikrofibrik kadifemsi yüzey. Vücudunuza mükemmel uyum sağlayan yapısıyla tüm gün konfor sunar.',
    category: 'sutyen', collectionId: '1',
    material: '%65 Naylon, %25 Polyester, %10 Elastan',
    careInstructions: '30°C\'de hassas yıkama, düz serme',
    modelMeasurements: 'Model 90cm göğüs, 70B kullanmaktadır',
    isFeatured: true, isNew: true,
    tags: ['velvet', 'noir', 'dantel', 'sutyen'],
    variants: [
      { id: 'v1', sku: 'VN-S-70B', size: '70B', color: 'Siyah', colorHex: '#1A1A1A', price: 1290, compareAtPrice: 1590, stock: 5, images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80'] },
      { id: 'v2', sku: 'VN-S-75B', size: '75B', color: 'Siyah', colorHex: '#1A1A1A', price: 1290, compareAtPrice: 1590, stock: 3, images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80'] },
      { id: 'v3', sku: 'VN-S-80C', size: '80C', color: 'Siyah', colorHex: '#1A1A1A', price: 1290, compareAtPrice: 1590, stock: 0, images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80'] },
      { id: 'v4', sku: 'VN-I-75B', size: '75B', color: 'Fildişi', colorHex: '#FAF7F2', price: 1290, compareAtPrice: 1590, stock: 4, images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'] },
    ],
    createdAt: '2026-01-01', updatedAt: '2026-01-01',
  },
  {
    id: '2', slug: 'ivory-reverie-takim',
    name: 'Ivory Reverie Takım',
    description: 'Fransız tül danteliyle işlenmiş, narin ve zarif iki parça takım. Saten iç astarı sayesinde üst giysilerin altında iz bırakmaz.',
    category: 'takim', collectionId: '2',
    material: '%80 Polyamid, %20 Elastan, Fransız Dantel',
    careInstructions: '30°C\'de el yıkaması önerilir',
    modelMeasurements: 'Model 88cm göğüs, S beden kullanmaktadır',
    isFeatured: true, isNew: true,
    tags: ['ivory', 'dantel', 'takim', 'fransız'],
    variants: [
      { id: 'v5', sku: 'IR-T-XS', size: 'XS', color: 'Fildişi', colorHex: '#FAF7F2', price: 2190, compareAtPrice: undefined, stock: 6, images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'] },
      { id: 'v6', sku: 'IR-T-S',  size: 'S',  color: 'Fildişi', colorHex: '#FAF7F2', price: 2190, compareAtPrice: undefined, stock: 8, images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'] },
      { id: 'v7', sku: 'IR-T-M',  size: 'M',  color: 'Fildişi', colorHex: '#FAF7F2', price: 2190, compareAtPrice: undefined, stock: 5, images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'] },
      { id: 'v8', sku: 'IR-T-L',  size: 'L',  color: 'Fildişi', colorHex: '#FAF7F2', price: 2190, compareAtPrice: undefined, stock: 2, images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'] },
    ],
    createdAt: '2026-01-05', updatedAt: '2026-01-05',
  },
  {
    id: '3', slug: 'scarlet-romance-gecelik',
    name: 'Scarlet Romance Gecelik',
    description: 'İpek saten dokusuyla muhteşem bir düşüş. Vücudun doğal hatlarını takip eden kesimi ve ince askıları ile yaz gecelerinin vazgeçilmezi.',
    category: 'gecelik', collectionId: '3',
    material: '%95 İpek Saten, %5 Elastan',
    careInstructions: 'Kuru temizleme önerilir',
    modelMeasurements: 'Model 90cm göğüs, M beden kullanmaktadır',
    isFeatured: true, isNew: false,
    tags: ['saten', 'scarlet', 'gecelik', 'ipek'],
    variants: [
      { id: 'v9',  sku: 'SR-G-XS', size: 'XS', color: 'Kırmızı', colorHex: '#8B0000', price: 3490, compareAtPrice: 3990, stock: 3, images: ['https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800&q=80'] },
      { id: 'v10', sku: 'SR-G-S',  size: 'S',  color: 'Kırmızı', colorHex: '#8B0000', price: 3490, compareAtPrice: 3990, stock: 4, images: ['https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800&q=80'] },
      { id: 'v11', sku: 'SR-G-M',  size: 'M',  color: 'Kırmızı', colorHex: '#8B0000', price: 3490, compareAtPrice: 3990, stock: 0, images: ['https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800&q=80'] },
    ],
    createdAt: '2026-01-10', updatedAt: '2026-01-10',
  },
  {
    id: '4', slug: 'velvet-noir-takim',
    name: 'Velvet Noir Takım',
    description: 'Kadifemsi yüzeyi ve geometrik dantel detaylarıyla öne çıkan sofistike takım.',
    category: 'takim', collectionId: '1',
    material: '%70 Naylon, %30 Elastan',
    careInstructions: '30°C\'de hassas yıkama',
    isFeatured: false, isNew: true,
    tags: ['velvet', 'noir', 'takim'],
    variants: [
      { id: 'v12', sku: 'VNT-S', size: 'S', color: 'Siyah', colorHex: '#1A1A1A', price: 2490, stock: 5, images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80'] },
      { id: 'v13', sku: 'VNT-M', size: 'M', color: 'Siyah', colorHex: '#1A1A1A', price: 2490, stock: 7, images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80'] },
    ],
    createdAt: '2026-01-15', updatedAt: '2026-01-15',
  },
]
