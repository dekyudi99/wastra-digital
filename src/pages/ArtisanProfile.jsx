import { useParams, Link } from 'react-router-dom'
import { Card, Row, Col, Tag, Statistic, Divider } from 'antd'
import { 
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'

const ArtisanProfile = () => {
  const { id } = useParams()

  // Mock data - akan diganti dengan data dari API nanti
  const artisan = {
    id: parseInt(id),
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
  }

  const products = [
    {
      id: 1,
      name: 'Kain Endek Sidemen Motif Geometris',
      price: 350000,
      image: '/placeholder-endek.jpg',
    },
    {
      id: 2,
      name: 'Kain Songket Emas Klasik',
      price: 850000,
      image: '/placeholder-songket.jpg',
    },
  ]


  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/produk">
        <Button 
          type="text" 
          icon={<ArrowLeftIcon className="w-5 h-5" />}
          className="mb-4"
        >
          Kembali
        </Button>
      </Link>

      <Row gutter={[32, 32]}>
        {/* Profile Section */}
        <Col xs={24} md={8}>
          <Card>
            <div className="text-center mb-6">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserIcon className="w-16 h-16 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2">{artisan.name}</h1>
              <p className="text-gray-600 mb-4">{artisan.experience} Pengalaman</p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {artisan.specialties.map((specialty, idx) => (
                  <Tag key={idx} color="blue">{specialty}</Tag>
                ))}
              </div>
            </div>

            <Divider />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPinIcon className="w-5 h-5 text-wastra-light-medium" />
                <span className="text-gray-700">{artisan.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{artisan.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{artisan.email}</span>
              </div>
            </div>

            <Divider />

            <Row gutter={16}>
              <Col span={12}>
                <Statistic 
                  title="Produk" 
                  value={artisan.productsCount} 
                  valueStyle={{ fontSize: '24px' }}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Rating" 
                  value={artisan.rating} 
                  precision={1}
                  valueStyle={{ fontSize: '24px' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Bio & Products */}
        <Col xs={24} md={16}>
          <Card title="Tentang Pengrajin" className="mb-6">
            <p className="text-gray-700 whitespace-pre-line">
              {artisan.bio}
            </p>
          </Card>

          <Card title="Produk dari Pengrajin Ini">
            <Row gutter={[16, 16]}>
              {products.map((product) => (
                <Col xs={24} sm={12} key={product.id}>
                  <Link to={`/produk/${product.id}`}>
                    <Card
                      hoverable
                      cover={
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">
                            {product.name}
                          </span>
                        </div>
                      }
                    >
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-wastra-red">
                        {formatPrice(product.price)}
                      </p>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ArtisanProfile

