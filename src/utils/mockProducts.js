// Mock data produk - digunakan di katalog, detail produk, dan chat
export const mockProducts = [
  {
    id: 1,
    name: 'Kain Endek Sidemen Motif Geometris',
    price: 350000,
    image: '/placeholder-endek.jpg',
    category: 'endek',
    artisan: {
      id: 1,
      name: 'Ibu Made Sari',
    },
    rating: 4.5,
    totalReviews: 24,
    specifications: {
      material: 'Katun 100%',
      width: '110 cm',
      length: '250 cm',
      technique: 'Tenun Tradisional',
      origin: 'Desa Sidemen, Karangasem, Bali',
    },
    images: [
      '/placeholder-endek.jpg',
      '/placeholder-endek-2.jpg',
    ],
  },
  {
    id: 2,
    name: 'Kain Songket Emas Klasik',
    price: 850000,
    image: '/placeholder-songket.jpg',
    category: 'songket',
    artisan: {
      id: 2,
      name: 'Ibu Ketut Sari',
    },
    rating: 4.7,
    totalReviews: 18,
    specifications: {
      material: 'Benang Sutra & Lurex Emas',
      width: '100 cm',
      length: '230 cm',
      technique: 'Tenun Songket Tradisional',
      origin: 'Desa Sidemen, Karangasem, Bali',
    },
    images: [
      '/placeholder-songket.jpg',
      '/placeholder-songket-2.jpg',
    ],
  },
  {
    id: 3,
    name: 'Kain Endek Modern Pattern',
    price: 420000,
    image: '/placeholder-endek-2.jpg',
    category: 'endek',
    artisan: {
      id: 3,
      name: 'Ibu Wayan Sari',
    },
    rating: 4.3,
    totalReviews: 12,
    specifications: {
      material: 'Katun Premium',
      width: '115 cm',
      length: '240 cm',
      technique: 'Tenun Tradisional Modern',
      origin: 'Desa Sidemen, Karangasem, Bali',
    },
    images: [
      '/placeholder-endek-2.jpg',
      '/placeholder-endek.jpg',
    ],
  },
  {
    id: 4,
    name: 'Kain Songket Tradisional Bali',
    price: 950000,
    image: '/placeholder-songket-2.jpg',
    category: 'songket',
    artisan: {
      id: 1,
      name: 'Ibu Made Sari',
    },
    rating: 4.8,
    totalReviews: 30,
    specifications: {
      material: 'Sutra & Benang Emas',
      width: '105 cm',
      length: '240 cm',
      technique: 'Songket Klasik',
      origin: 'Desa Sidemen, Karangasem, Bali',
    },
    images: [
      '/placeholder-songket-2.jpg',
      '/placeholder-songket.jpg',
    ],
  },
]

export const getProductById = (id) => {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id
  if (Number.isNaN(numericId)) return null
  return mockProducts.find((p) => p.id === numericId) || null
}


