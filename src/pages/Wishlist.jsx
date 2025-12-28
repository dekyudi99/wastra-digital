import { Link, useNavigate } from 'react-router-dom'
import { Card, Button, Empty, Row, Col } from 'antd'
import { 
  ArrowLeftIcon,
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { useUser } from '../contexts/UserContext'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../utils/format'

const Wishlist = () => {
  const navigate = useNavigate()
  const { wishlist, removeFromWishlist } = useUser()
  const { cartItems, setCartItems } = useCart()

  const handleAddToCart = (product) => {
    // Check if product already in cart
    const existingItem = cartItems.find(item => item.id === product.id)
    
    if (existingItem) {
      // Update quantity
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      // Add new item
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          thumbnail: product.image,
          selected: false,
          seller: product.artisan || product.seller || 'Unknown',
        },
      ])
    }
  }

  const handleRemove = (productId) => {
    removeFromWishlist(productId)
  }

  if (wishlist.length === 0) {
    return (
      <div className="bg-wastra-brown-50 min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-wastra-brown-600 hover:text-wastra-brown-800 mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Kembali</span>
            </button>
            <h1 className="text-3xl font-semibold text-wastra-brown-800">Wishlist</h1>
          </div>

          <Card className="text-center py-12">
            <Empty
              description={
                <div>
                  <HeartIcon className="w-16 h-16 text-wastra-brown-300 mx-auto mb-4" />
                  <p className="text-lg text-wastra-brown-600 mb-2">
                    Wishlist Anda Kosong
                  </p>
                  <p className="text-wastra-brown-500">
                    Simpan produk favorit Anda di sini
                  </p>
                </div>
              }
            >
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/produk')}
                className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
              >
                Jelajahi Produk
              </Button>
            </Empty>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-wastra-brown-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-wastra-brown-600 hover:text-wastra-brown-800 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Kembali</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-wastra-brown-800">Wishlist</h1>
              <p className="text-wastra-brown-600 mt-2">
                {wishlist.length} {wishlist.length === 1 ? 'produk' : 'produk'} favorit
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <Row gutter={[16, 16]}>
          {wishlist.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                className="h-full"
                cover={
                  <div className="relative h-48 bg-wastra-brown-100 overflow-hidden">
                    <img
                      alt={product.name}
                      src={product.image || '/placeholder-product.jpg'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Product'
                      }}
                    />
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                }
                actions={[
                  <Button
                    key="cart"
                    type="primary"
                    icon={<ShoppingCartIcon className="w-4 h-4" />}
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-wastra-brown-600 hover:bg-wastra-brown-700 border-none"
                  >
                    Tambah ke Keranjang
                  </Button>,
                ]}
              >
                <Link to={`/produk/${product.id}`}>
                  <Card.Meta
                    title={
                      <div className="line-clamp-2 text-wastra-brown-800 font-medium">
                        {product.name}
                      </div>
                    }
                    description={
                      <div className="mt-2">
                        <p className="text-lg font-bold text-wastra-brown-600">
                          {formatPrice(product.price)}
                        </p>
                        {product.artisan && (
                          <p className="text-sm text-wastra-brown-500 mt-1">
                            oleh {product.artisan}
                          </p>
                        )}
                      </div>
                    }
                  />
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default Wishlist

