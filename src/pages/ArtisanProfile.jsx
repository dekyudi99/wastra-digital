import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Tag, Statistic, Divider, Button, Empty } from 'antd'
import { 
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'

// Mock data artisan - akan diganti dengan data dari API nanti
const ARTISANS_DATA = {
  1: {
    id: 1,
    name: 'Ibu Made Sari',
    location: 'Desa Sidemen, Karangasem, Bali',
    phone: '+62 812-3456-7890',
    email: 'made.sari@example.com',
    bio: `
      Saya adalah pengrajin kain tradisional yang telah menekuni 
      kerajinan tenun endek selama lebih dari 20 tahun. Kain-kain 
      yang saya buat menggunakan teknik tradisional yang diwariskan 
      turun-temurun dari nenek moyang.
      
      Setiap helai kain dibuat dengan penuh dedikasi dan cinta, 
      mempertahankan kualitas dan keindahan motif tradisional Bali. 
      Saya berharap melalui platform ini, lebih banyak orang dapat 
      mengenal dan menghargai warisan budaya kami.
    `,
    specialties: ['Endek', 'Songket', 'Tenun Tradisional'],
    experience: '20+ tahun',
    productsCount: 12,
    rating: 4.8,
  },
  2: {
    id: 2,
    name: 'Pelangi Weaving',
    location: 'Desa Sidemen, Karangasem, Bali',
    phone: '+62 812-3456-7891',
    email: 'pelangi.weaving@example.com',
    bio: `
      Pelangi Weaving adalah workshop tenun tradisional yang didirikan 
      oleh sekelompok pengrajin berpengalaman. Kami mengkhususkan diri 
      dalam pembuatan kain songket dengan motif klasik dan modern.
      
      Dengan lebih dari 15 tahun pengalaman, kami telah menghasilkan 
      ribuan helai kain berkualitas tinggi yang digunakan untuk berbagai 
      keperluan adat dan modern.
    `,
    specialties: ['Songket', 'Tenun Modern', 'Kain Adat'],
    experience: '15+ tahun',
    productsCount: 18,
    rating: 4.9,
  },
  3: {
    id: 3,
    name: 'Ibu Wayan Sari',
    location: 'Desa Sidemen, Karangasem, Bali',
    phone: '+62 812-3456-7892',
    email: 'wayan.sari@example.com',
    bio: `
      Sebagai pengrajin generasi ketiga, saya mewarisi keahlian tenun 
      dari nenek dan ibu saya. Spesialisasi saya adalah kain endek dengan 
      motif tradisional yang autentik.
      
      Setiap produk yang saya buat adalah hasil dari dedikasi dan 
      ketelitian tinggi, memastikan kualitas yang terbaik untuk 
      pelanggan saya.
    `,
    specialties: ['Endek Tradisional', 'Kain Adat'],
    experience: '25+ tahun',
    productsCount: 10,
    rating: 4.7,
  },
  4: {
    id: 4,
    name: 'Ibu Ketut Sari',
    location: 'Desa Sidemen, Karangasem, Bali',
    phone: '+62 812-3456-7893',
    email: 'ketut.sari@example.com',
    bio: `
      Pengrajin yang fokus pada pembuatan kain endek dengan teknik 
      tradisional yang telah diwariskan turun-temurun. Saya sangat 
      memperhatikan detail dan kualitas dalam setiap helai kain yang 
      saya produksi.
    `,
    specialties: ['Endek', 'Tenun Tradisional'],
    experience: '18+ tahun',
    productsCount: 8,
    rating: 4.6,
  },
}

const ArtisanProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const artisanId = parseInt(id)

  // Get artisan data based on ID
  const artisan = ARTISANS_DATA[artisanId]

  // If artisan not found, show error
  if (!artisan) {
    return (
      <div className="min-h-screen bg-wastra-brown-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Button 
            type="text" 
            icon={<ArrowLeftIcon className="w-5 h-5" />}
            onClick={() => navigate('/produk')}
            className="mb-6"
          >
            Kembali ke Katalog
          </Button>
          <Card>
            <Empty
              description={
                <div>
                  <p className="text-lg text-wastra-brown-600 mb-2">
                    Pengrajin tidak ditemukan
                  </p>
                  <p className="text-wastra-brown-500">
                    ID pengrajin yang Anda cari tidak tersedia.
                  </p>
                </div>
              }
            >
              <Button 
                type="primary"
                onClick={() => navigate('/produk')}
                className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
              >
                Kembali ke Katalog Produk
              </Button>
            </Empty>
          </Card>
        </div>
      </div>
    )
  }

  // Mock products for this artisan - akan diganti dengan data dari API nanti
  // Filter products based on artisan ID
  const getArtisanProducts = () => {
    // This is mock data - in real app, fetch from API based on artisanId
    const allProducts = [
      { id: 1, name: 'Kain Endek Sidemen Motif Geometris', price: 350000, artisanId: 1 },
      { id: 2, name: 'Kain Songket Emas Klasik', price: 850000, artisanId: 2 },
      { id: 3, name: 'Kain Endek Modern Pattern', price: 420000, artisanId: 1 },
      { id: 4, name: 'Kain Songket Tradisional Bali', price: 950000, artisanId: 2 },
      { id: 5, name: 'Kain Endek Premium Warna Alam', price: 680000, artisanId: 3 },
      { id: 6, name: 'Kain Endek Motif Bunga', price: 450000, artisanId: 1 },
      { id: 7, name: 'Kain Songket Emas Premium', price: 1200000, artisanId: 2 },
      { id: 8, name: 'Kain Endek Klasik', price: 380000, artisanId: 4 },
    ]
    return allProducts.filter(p => p.artisanId === artisanId)
  }

  const products = getArtisanProducts()

  return (
    <div className="min-h-screen bg-wastra-brown-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <Button 
          type="text" 
          icon={<ArrowLeftIcon className="w-5 h-5" />}
          onClick={() => navigate(-1)}
          className="mb-6 text-wastra-brown-600 hover:text-wastra-brown-800"
        >
          Kembali
        </Button>

        <Row gutter={[24, 24]}>
          {/* Profile Section */}
          <Col xs={24} md={8}>
            <Card className="border border-wastra-brown-200 rounded-xl shadow-sm">
              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-wastra-brown-100 to-wastra-brown-200 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
                  <UserIcon className="w-16 h-16 text-wastra-brown-600" />
                </div>
                <h1 className="text-2xl font-bold mb-2 text-wastra-brown-800">{artisan.name}</h1>
                <p className="text-wastra-brown-600 mb-4">{artisan.experience} Pengalaman</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {artisan.specialties.map((specialty, idx) => (
                    <Tag key={idx} color="blue" className="rounded-full">{specialty}</Tag>
                  ))}
                </div>
              </div>

              <Divider className="my-4" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-wastra-brown-500 flex-shrink-0" />
                  <span className="text-wastra-brown-700 text-sm">{artisan.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-5 h-5 text-wastra-brown-500 flex-shrink-0" />
                  <span className="text-wastra-brown-700 text-sm">{artisan.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-wastra-brown-500 flex-shrink-0" />
                  <span className="text-wastra-brown-700 text-sm break-all">{artisan.email}</span>
                </div>
              </div>

              <Divider className="my-4" />

              <Button
                type="primary"
                icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />}
                onClick={() => navigate(`/chat/${artisan.id}`)}
                className="w-full bg-wastra-brown-600 hover:bg-wastra-brown-700 border-none h-11 mb-4"
                size="large"
              >
                Chat dengan Pengrajin
              </Button>

              <Row gutter={16}>
                <Col span={12}>
                  <Statistic 
                    title="Produk" 
                    value={products.length || artisan.productsCount} 
                    valueStyle={{ fontSize: '24px', color: '#8B4513' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="Rating" 
                    value={artisan.rating} 
                    precision={1}
                    valueStyle={{ fontSize: '24px', color: '#8B4513' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Bio & Products */}
          <Col xs={24} md={16}>
            <Card 
              title={<span className="text-wastra-brown-800 font-semibold">Tentang Pengrajin</span>} 
              className="mb-6 border border-wastra-brown-200 rounded-xl shadow-sm"
            >
              <p className="text-wastra-brown-700 whitespace-pre-line leading-relaxed">
                {artisan.bio}
              </p>
            </Card>

            <Card 
              title={<span className="text-wastra-brown-800 font-semibold">Produk dari Pengrajin Ini ({products.length})</span>}
              className="border border-wastra-brown-200 rounded-xl shadow-sm"
            >
              {products.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {products.map((product) => (
                    <Col xs={24} sm={12} key={product.id}>
                      <Link to={`/produk/${product.id}`} className="block h-full">
                        <Card
                          hoverable
                          className="h-full border border-wastra-brown-100 rounded-lg transition-all hover:shadow-md"
                          cover={
                            <div className="h-48 bg-gradient-to-br from-wastra-brown-50 to-wastra-brown-100 flex items-center justify-center">
                              <span className="text-wastra-brown-400 text-sm text-center px-4">
                                {product.name}
                              </span>
                            </div>
                          }
                        >
                          <h3 className="font-semibold mb-2 line-clamp-2 text-wastra-brown-800">
                            {product.name}
                          </h3>
                          <p className="text-lg font-bold text-red-600">
                            {formatPrice(product.price)}
                          </p>
                        </Card>
                      </Link>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty 
                  description="Belum ada produk dari pengrajin ini"
                  className="py-8"
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ArtisanProfile

