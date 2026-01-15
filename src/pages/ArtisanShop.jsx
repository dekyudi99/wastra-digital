import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Card, Row, Col, Tag, Avatar, Rate, Button, Descriptions, Divider, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { 
  ShoppingCartIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  StarIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'
import { mockProducts } from '../utils/mockProducts'
import { useUser } from '../contexts/UserContext'
import { useCart } from '../contexts/CartContext'
import { USER_ROLES } from '../utils/authRoles'

const ArtisanShop = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, hasRole } = useUser()
  const { cartItems, setCartItems } = useCart()
  
  const isArtisan = hasRole(USER_ROLES.ARTISAN)
  const artisanId = parseInt(id, 10)

  // Get artisan info from products
  const artisanProducts = mockProducts.filter(p => p.artisan.id === artisanId)
  const artisan = artisanProducts.length > 0 ? artisanProducts[0].artisan : null

  if (!artisan || artisanProducts.length === 0) {
    return (
      <div className="min-h-screen bg-wastra-brown-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-semibold text-wastra-brown-800 mb-4">
            Toko tidak ditemukan
          </h1>
          <p className="text-wastra-brown-600 mb-6">
            Toko yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <Button
            type="primary"
            onClick={() => navigate('/produk')}
            className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
          >
            Kembali ke Katalog
          </Button>
        </div>
      </div>
    )
  }

  // Calculate shop statistics
  const totalProducts = artisanProducts.length
  const averageRating = artisanProducts.reduce((sum, p) => sum + p.rating, 0) / totalProducts
  const totalReviews = artisanProducts.reduce((sum, p) => sum + p.totalReviews, 0)
  const priceRange = {
    min: Math.min(...artisanProducts.map(p => p.price)),
    max: Math.max(...artisanProducts.map(p => p.price)),
  }

  // Mock shop description
  const shopDescription = `Selamat datang di toko ${artisan.name}! Kami adalah pengrajin tradisional yang telah berpengalaman puluhan tahun dalam membuat kain Endek dan Songket berkualitas tinggi dari Desa Sidemen, Karangasem, Bali. Setiap produk kami dibuat dengan teliti menggunakan teknik tenun tradisional yang diwariskan turun-temurun, memastikan kualitas dan keaslian motif yang autentik.`

  const handleAddToCart = (product) => {
    if (isArtisan) {
      Modal.warning({
        title: 'Akses Dibatasi',
        icon: <ExclamationCircleOutlined />,
        content: 'Pengrajin tidak dapat menambahkan produk ke keranjang. Silakan gunakan akun pembeli untuk melakukan pembelian.',
      })
      return
    }
    
    if (!isAuthenticated) {
      Modal.confirm({
        title: 'Login Diperlukan',
        icon: <ExclamationCircleOutlined />,
        content: 'Silakan login terlebih dahulu untuk menambahkan produk ke keranjang.',
        okText: 'Login',
        cancelText: 'Batal',
        okType: 'primary',
        onOk: () => {
          navigate(`/onboarding?redirect=${encodeURIComponent(`/artisan/${id}`)}`)
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
          image: product.images?.[0] || product.image,
          thumbnail: product.images?.[0] || product.image,
          selected: false,
          seller: product.artisan.name,
        },
      ])
    }
    message.success('Produk ditambahkan ke keranjang')
  }

  return (
    <div className="min-h-screen bg-wastra-brown-50 py-4 sm:py-6 md:py-8 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/produk">
          <Button 
            type="text" 
            icon={<UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="mb-4 sm:mb-6 text-wastra-brown-600 hover:text-wastra-brown-800 text-sm sm:text-base"
          >
            Kembali ke Katalog
          </Button>
        </Link>

        {/* Shop Header */}
        <Card className="border border-wastra-brown-200 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Shop Avatar */}
            <div className="flex-shrink-0">
              <Avatar 
                size={120} 
                icon={<UserIcon className="w-16 h-16" />}
                className="bg-wastra-brown-200 text-wastra-brown-600 border-4 border-white shadow-lg"
              />
            </div>

            {/* Shop Info */}
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-wastra-brown-800 mb-2">
                  {artisan.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Rate disabled defaultValue={averageRating} allowHalf className="text-sm sm:text-base" />
                    <span className="text-wastra-brown-600 text-sm sm:text-base font-medium">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-wastra-brown-500 text-xs sm:text-sm">
                      ({totalReviews} ulasan)
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-wastra-brown-600">
                  <div className="flex items-center gap-2">
                    <ShoppingBagIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{totalProducts} Produk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Desa Sidemen, Karangasem, Bali</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  type="primary"
                  icon={<ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
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
                          navigate(`/onboarding?redirect=${encodeURIComponent(`/artisan/${id}`)}`)
                        },
                      })
                      return
                    }
                    navigate(`/chat/${id}`)
                  }}
                  className="bg-wastra-brown-600 hover:bg-wastra-brown-700 border-none h-10 sm:h-11"
                >
                  Chat Penjual
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Shop Description */}
        <Card className="border border-wastra-brown-200 rounded-xl shadow-sm mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-wastra-brown-800 mb-4">
            Tentang Toko
          </h2>
          <p className="text-wastra-brown-700 leading-relaxed text-sm sm:text-base">
            {shopDescription}
          </p>
        </Card>

        {/* Shop Statistics */}
        <Card className="border border-wastra-brown-200 rounded-xl shadow-sm mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-wastra-brown-800 mb-4">
            Statistik Toko
          </h2>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <div className="text-center p-4 bg-wastra-brown-50 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-wastra-brown-800 mb-1">
                  {totalProducts}
                </div>
                <div className="text-sm sm:text-base text-wastra-brown-600">
                  Total Produk
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="text-center p-4 bg-wastra-brown-50 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-wastra-brown-800 mb-1">
                  {averageRating.toFixed(1)}
                </div>
                <div className="text-sm sm:text-base text-wastra-brown-600">
                  Rating Rata-rata
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="text-center p-4 bg-wastra-brown-50 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-wastra-brown-800 mb-1">
                  {totalReviews}
                </div>
                <div className="text-sm sm:text-base text-wastra-brown-600">
                  Total Ulasan
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="text-center p-4 bg-wastra-brown-50 rounded-lg">
                <div className="text-sm sm:text-base font-bold text-wastra-brown-800 mb-1">
                  {formatPrice(priceRange.min)}
                </div>
                <div className="text-xs sm:text-sm text-wastra-brown-600">
                  Harga Terendah
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Products Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-wastra-brown-800">
              Produk ({totalProducts})
            </h2>
          </div>

          <Row gutter={[16, 16]}>
            {artisanProducts.map((product) => (
              <Col xs={12} sm={8} md={6} lg={4} key={product.id}>
                <Card
                  hoverable
                  className="h-full flex flex-col border border-wastra-brown-200 rounded-xl overflow-hidden"
                  cover={
                    <Link to={`/produk/${product.id}`} className="block">
                      <div className="h-40 sm:h-48 bg-wastra-brown-50 flex items-center justify-center cursor-pointer hover:opacity-90 transition">
                        <span className="text-wastra-brown-400 text-xs sm:text-sm text-center px-2">
                          {product.name}
                        </span>
                      </div>
                    </Link>
                  }
                  bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '12px' }}
                >
                  <Link to={`/produk/${product.id}`} className="flex-1">
                    <div className="mb-2">
                      <Tag color={product.category === 'endek' ? 'blue' : 'gold'} className="text-xs">
                        {product.category === 'endek' ? 'Endek' : 'Songket'}
                      </Tag>
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold mb-2 line-clamp-2 hover:text-wastra-brown-600 transition text-wastra-brown-800">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Rate disabled defaultValue={product.rating} allowHalf className="text-xs" />
                      <span className="text-xs text-wastra-brown-500">
                        ({product.totalReviews})
                      </span>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-red-600 mb-2">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                  <Button
                    type="default"
                    block
                    icon={<ShoppingCartIcon className="w-4 h-4" />}
                    className="border-wastra-brown-600 text-wastra-brown-600 hover:bg-wastra-brown-50 mt-auto"
                    disabled={isArtisan}
                    onClick={() => handleAddToCart(product)}
                  >
                    Tambah ke Keranjang
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  )
}

export default ArtisanShop
