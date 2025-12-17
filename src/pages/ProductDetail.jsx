import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { Button, Card, Row, Col, Tag, Descriptions, Divider } from 'antd'
import { 
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'

const ProductDetail = () => {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)

  // Mock data - akan diganti dengan data dari API nanti
  const product = {
    id: parseInt(id),
    name: 'Kain Endek Sidemen Motif Geometris',
    price: 350000,
    category: 'endek',
    artisan: {
      id: 1,
      name: 'Ibu Made Sari',
    },
    description: `
      Kain endek tradisional dengan motif geometris yang khas dari 
      Desa Sidemen. Ditenun dengan teknik tradisional menggunakan 
      benang katun berkualitas tinggi. Setiap helai kain dibuat 
      dengan teliti oleh pengrajin berpengalaman.
      
      Kain ini cocok untuk berbagai keperluan seperti pakaian adat, 
      dekorasi rumah, atau sebagai koleksi kain tradisional. 
      Motif geometris yang unik membuat kain ini terlihat modern 
      namun tetap mempertahankan nilai tradisionalnya.
    `,
    specifications: {
      material: 'Katun 100%',
      width: '110 cm',
      length: '250 cm',
      weight: '450 gram',
      technique: 'Tenun Tradisional',
      origin: 'Desa Sidemen, Karangasem, Bali',
    },
    images: [
      '/placeholder-endek.jpg',
      '/placeholder-endek-2.jpg',
    ],
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/produk">
        <Button 
          type="text" 
          icon={<ArrowLeftIcon className="w-5 h-5" />}
          className="mb-4"
        >
          Kembali ke Katalog
        </Button>
      </Link>

      <Row gutter={[32, 32]}>
        {/* Product Images */}
        <Col xs={24} md={12}>
          <Card>
            <div className="aspect-square bg-gray-200 flex items-center justify-center rounded-lg mb-4">
              <span className="text-gray-400 text-lg">
                {product.name}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <div 
                  key={idx}
                  className="aspect-square bg-gray-200 rounded cursor-pointer hover:opacity-75 transition"
                />
              ))}
            </div>
          </Card>
        </Col>

        {/* Product Info */}
        <Col xs={24} md={12}>
          <div className="mb-4">
            <Tag color={product.category === 'endek' ? 'blue' : 'gold'} className="mb-2">
              {product.category === 'endek' ? 'Endek' : 'Songket'}
            </Tag>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-wastra-red mb-4">
              {formatPrice(product.price)}
            </p>
          </div>

          <Divider />

          <div className="mb-6">
            <Link to={`/artisan/${product.artisan.id}`}>
              <Button 
                type="link" 
                icon={<UserIcon className="w-5 h-5" />}
                className="p-0 mb-4"
              >
                <span className="text-lg">Toko: {product.artisan.name}</span>
              </Button>
            </Link>
            <p className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <Divider />

          <Descriptions title="Spesifikasi Produk" bordered column={1}>
            <Descriptions.Item label="Bahan">
              {product.specifications.material}
            </Descriptions.Item>
            <Descriptions.Item label="Lebar">
              {product.specifications.width}
            </Descriptions.Item>
            <Descriptions.Item label="Panjang">
              {product.specifications.length}
            </Descriptions.Item>
          </Descriptions>

          <div className="mt-6 flex gap-4">
            <Button 
              type="primary" 
              size="large"
              icon={<ShoppingCartIcon className="w-5 h-5" />}
              className="flex-1"
            >
              Tambah ke Keranjang
            </Button>
            <Button 
              size="large"
              icon={<HeartIcon className="w-5 h-5" />}
            >
              Favorit
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ProductDetail

