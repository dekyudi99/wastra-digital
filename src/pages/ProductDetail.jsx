import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button, Card, Row, Col, Tag, Descriptions, Divider, Avatar, Rate, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { 
  ShoppingCartIcon,
  UserIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'
import { useUser } from '../contexts/UserContext'
import { useCart } from '../contexts/CartContext'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isImageModalVisible, setIsImageModalVisible] = useState(false)
  const { toggleWishlist, isInWishlist, isAuthenticated } = useUser()
  const { cartItems, setCartItems } = useCart()

  // Mock data - akan diganti dengan data dari API nanti
  const product = {
    id: parseInt(id),
    name: 'Kain Endek Sidemen Motif Geometris',
    price: 350000,
    category: 'endek',
    rating: 4.5,
    totalReviews: 24,
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

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      userName: 'Putu Sari',
      avatar: null,
      rating: 5,
      date: '15 Desember 2024',
      comment: 'Kainnya sangat bagus dan berkualitas tinggi! Motifnya sangat detail dan warnanya tidak luntur setelah dicuci. Pengiriman juga cepat. Sangat puas dengan pembelian ini.'
    },
    {
      id: 2,
      userName: 'Made Wijaya',
      avatar: null,
      rating: 4,
      date: '10 Desember 2024',
      comment: 'Kualitas kain sangat baik, cocok untuk dibuat baju adat. Hanya saja harganya sedikit mahal, tapi sebanding dengan kualitasnya.'
    },
    {
      id: 3,
      userName: 'Ketut Dewi',
      avatar: null,
      rating: 5,
      date: '5 Desember 2024',
      comment: 'Sangat suka dengan produk ini! Motifnya unik dan autentik. Pengrajinnya juga sangat ramah dan responsif. Akan beli lagi untuk koleksi.'
    },
    {
      id: 4,
      userName: 'Wayan Kadek',
      avatar: null,
      rating: 4,
      date: '28 November 2024',
      comment: 'Kain endek yang bagus, teksturnya halus dan nyaman dipakai. Cocok untuk berbagai acara adat. Recommended!'
    }
  ]


  return (
    <div className="min-h-screen bg-wastra-brown-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/produk">
          <Button 
            type="text" 
            icon={<ArrowLeftIcon className="w-5 h-5" />}
            className="mb-6 text-wastra-brown-600 hover:text-wastra-brown-800"
          >
            Kembali ke Katalog
          </Button>
        </Link>

        <Row gutter={[32, 32]}>
        {/* Product Images */}
        <Col xs={24} md={12}>
          <Card className="border border-wastra-brown-200 rounded-xl shadow-sm">
            {/* Main Image */}
            <div 
              className="h-80 bg-wastra-brown-50 flex items-center justify-center rounded-lg mb-4 border border-wastra-brown-100 cursor-pointer hover:opacity-90 transition"
              onClick={() => setIsImageModalVisible(true)}
            >
              <span className="text-wastra-brown-400 text-base text-center px-4">
                {product.name} - Foto {selectedImageIndex + 1}
              </span>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-square bg-wastra-brown-50 rounded cursor-pointer transition border-2 ${
                    selectedImageIndex === idx 
                      ? 'border-wastra-brown-600 ring-2 ring-wastra-brown-200' 
                      : 'border-wastra-brown-100 hover:border-wastra-brown-300'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-wastra-brown-400 text-xs">
                      Foto {idx + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Product Info */}
        <Col xs={24} md={12}>
          <Card className="border border-wastra-brown-200 rounded-xl shadow-sm">
            <div className="mb-4">
              <Tag color={product.category === 'endek' ? 'blue' : 'gold'} className="mb-2">
                {product.category === 'endek' ? 'Endek' : 'Songket'}
              </Tag>
              <h1 className="text-3xl font-bold mb-4 text-wastra-brown-800">{product.name}</h1>
              <div className="flex items-center gap-3 mb-3">
                <Rate disabled defaultValue={product.rating} allowHalf className="text-sm" />
                <span className="text-wastra-brown-600 text-sm">
                  {product.rating} ({product.totalReviews} ulasan)
                </span>
              </div>
              <p className="text-3xl font-bold text-red-600 mb-4">
                {formatPrice(product.price)}
              </p>
            </div>

            <Divider className="my-4" />

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Link to={`/artisan/${product.artisan.id}`}>
                  <Button 
                    type="link" 
                    icon={<UserIcon className="w-5 h-5" />}
                    className="p-0 text-wastra-brown-600 hover:text-wastra-brown-800"
                  >
                    <span className="text-lg">Toko: {product.artisan.name}</span>
                  </Button>
                </Link>
                <Button
                  type="default"
                  icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />}
                  onClick={() => {
                    if (!isAuthenticated) {
                      Modal.confirm({
                        title: 'Login Diperlukan',
                        icon: <ExclamationCircleOutlined />,
                        content: 'Silakan login terlebih dahulu untuk chat dengan penjual.',
                        okText: 'Login',
                        cancelText: 'Batal',
                        okType: 'primary',
                        onOk: () => {
                          navigate(`/onboarding?redirect=${encodeURIComponent(`/produk/${product.id}`)}`)
                        },
                      })
                      return
                    }
                    navigate(`/chat/${product.artisan.id}?productId=${product.id}`)
                  }}
                  className="border-wastra-brown-300 text-wastra-brown-700 hover:bg-wastra-brown-50 hover:border-wastra-brown-400"
                >
                  Chat Penjual
                </Button>
              </div>
              <p className="text-wastra-brown-700 whitespace-pre-line leading-relaxed">
                {product.description}
              </p>
            </div>

            <Divider className="my-4" />

            <Descriptions title="Spesifikasi Produk" bordered column={1} className="mb-6">
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

            <div className="flex gap-3">
              <Button 
                type="primary" 
                size="large"
                icon={<ShoppingCartIcon className="w-5 h-5" />}
                className="flex-1 bg-wastra-brown-600 hover:bg-wastra-brown-700 border-none h-12"
                onClick={() => {
                  if (!isAuthenticated) {
                    Modal.confirm({
                      title: 'Login Diperlukan',
                      icon: <ExclamationCircleOutlined />,
                      content: 'Silakan login terlebih dahulu untuk menambahkan produk ke keranjang.',
                      okText: 'Login',
                      cancelText: 'Batal',
                      okType: 'primary',
                      onOk: () => {
                        navigate(`/onboarding?redirect=${encodeURIComponent(`/produk/${product.id}`)}`)
                      },
                    })
                    return
                  }
                  
                  const existingItem = cartItems.find(item => item.id === product.id)
                  if (existingItem) {
                    setCartItems(cartItems.map(item =>
                      item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                    ))
                  } else {
                    setCartItems([
                      ...cartItems,
                      {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        image: product.images[0],
                        thumbnail: product.images[0],
                        selected: false,
                        seller: product.artisan.name,
                      },
                    ])
                  }
                  message.success('Produk ditambahkan ke keranjang')
                }}
              >
                Tambah ke Keranjang
              </Button>
              <Button
                size="large"
                icon={<HeartIcon className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />}
                className={`h-12 ${isInWishlist(product.id) ? 'border-red-500 text-red-500' : ''}`}
                onClick={() => {
                  if (!isAuthenticated) {
                    Modal.confirm({
                      title: 'Login Diperlukan',
                      icon: <ExclamationCircleOutlined />,
                      content: 'Silakan login terlebih dahulu untuk menambahkan produk ke wishlist.',
                      okText: 'Login',
                      cancelText: 'Batal',
                      okType: 'primary',
                      onOk: () => {
                        navigate(`/onboarding?redirect=${encodeURIComponent(`/produk/${product.id}`)}`)
                      },
                    })
                    return
                  }
                  
                  const added = toggleWishlist({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                    artisan: product.artisan.name,
                  })
                  message.success(added ? 'Ditambahkan ke wishlist' : 'Dihapus dari wishlist')
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Reviews Section */}
      <div className="mt-12">
        <Card className="border border-wastra-brown-200 rounded-xl shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-wastra-brown-800 mb-2">
              Ulasan Pembeli
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Rate disabled defaultValue={product.rating} allowHalf className="text-lg" />
                <span className="text-xl font-semibold text-wastra-brown-800">
                  {product.rating}
                </span>
              </div>
              <span className="text-wastra-brown-600">
                dari {product.totalReviews} ulasan
              </span>
            </div>
          </div>

          <Divider className="my-6" />

          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="pb-6 border-b border-wastra-brown-100 last:border-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <Avatar 
                    size={48} 
                    icon={<UserIcon className="w-6 h-6" />}
                    className="bg-wastra-brown-200 text-wastra-brown-600 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-wastra-brown-800 mb-1">
                          {review.userName}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Rate disabled defaultValue={review.rating} className="text-sm" />
                          <span className="text-sm text-wastra-brown-500">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-wastra-brown-700 mt-3 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {reviews.length > 4 && (
            <div className="mt-6 text-center">
              <Button 
                type="link" 
                className="text-wastra-brown-600 hover:text-wastra-brown-800"
              >
                Lihat Semua Ulasan
              </Button>
            </div>
          )}
        </Card>
      </div>
      </div>

      {/* Image Modal */}
      <Modal
        open={isImageModalVisible}
        onCancel={() => setIsImageModalVisible(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: '800px' }}
        centered
        className="image-modal"
      >
        <div className="relative">
          <div className="aspect-square bg-wastra-brown-50 flex items-center justify-center rounded-lg border border-wastra-brown-100 mb-4">
            <span className="text-wastra-brown-400 text-lg text-center px-4">
              {product.name} - Foto {selectedImageIndex + 1}
            </span>
          </div>
          
          {/* Navigation Arrows */}
          {product.images.length > 1 && (
            <>
              <Button
                type="text"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg border-none z-10"
                icon={<ChevronLeftIcon className="w-6 h-6" />}
                onClick={() => setSelectedImageIndex((prev) => 
                  prev === 0 ? product.images.length - 1 : prev - 1
                )}
              />
              <Button
                type="text"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg border-none z-10"
                icon={<ChevronRightIcon className="w-6 h-6" />}
                onClick={() => setSelectedImageIndex((prev) => 
                  prev === product.images.length - 1 ? 0 : prev + 1
                )}
              />
            </>
          )}
          
          {/* Thumbnail Navigation */}
          {product.images.length > 1 && (
            <div className="flex gap-2 justify-center mt-4">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded cursor-pointer transition border-2 ${
                    selectedImageIndex === idx
                      ? 'border-wastra-brown-600 ring-2 ring-wastra-brown-200'
                      : 'border-wastra-brown-100 hover:border-wastra-brown-300'
                  } bg-wastra-brown-50 flex items-center justify-center`}
                >
                  <span className="text-wastra-brown-400 text-xs">
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default ProductDetail

