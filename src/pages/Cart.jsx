import { useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Card, Button, Checkbox, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { 
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'
import { useCart } from '../contexts/CartContext'
import { useUser } from '../contexts/UserContext'
import { USER_ROLES } from '../utils/authRoles'

const Cart = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartItems, toggleSelect, updateQuantity, removeItem } = useCart()
  const { hasRole } = useUser()
  const modalShownRef = useRef(false)
  
  const isArtisan = hasRole(USER_ROLES.ARTISAN)
  
  // Show warning when artisan accesses cart page
  useEffect(() => {
    if (isArtisan && !modalShownRef.current) {
      modalShownRef.current = true
      Modal.warning({
        title: 'Akses Dibatasi',
        icon: <ExclamationCircleOutlined />,
        content: 'Pengrajin tidak dapat menggunakan keranjang belanja. Silakan gunakan akun pembeli untuk melakukan pembelian.',
        onOk: () => {
          // Kembali ke halaman sebelumnya jika ada di location state, jika tidak kembali ke beranda
          const previousPath = location.state?.from
          if (previousPath && previousPath !== '/keranjang') {
            navigate(previousPath)
          } else {
            navigate('/')
          }
        },
      })
    }
  }, [isArtisan, navigate, location])

  // Hanya hitung total dari item yang dipilih
  const selectedItems = cartItems.filter(item => item.selected)
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const total = subtotal

  // Show restricted access message for artisan
  if (isArtisan) {
    return (
      <div className="w-full bg-white min-h-screen pb-32">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 max-w-6xl py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-wastra-brown-800 mb-1 sm:mb-2">
              Keranjang Belanja
            </h1>
          </div>

          {/* Restricted Access Message */}
          <div className="text-center py-12 sm:py-20 px-4">
            <ExclamationCircleOutlined className="text-4xl sm:text-6xl text-wastra-brown-300 mx-auto mb-4 sm:mb-6" style={{ fontSize: '48px' }} />
            <h2 className="text-xl sm:text-2xl font-semibold text-wastra-brown-800 mb-2 sm:mb-3">
              Akses Dibatasi
            </h2>
            <p className="text-sm sm:text-base text-wastra-brown-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
              Pengrajin tidak dapat menggunakan keranjang belanja. Silakan gunakan akun pembeli untuk melakukan pembelian.
            </p>
            <Button
              size="large"
              className="bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white border-none h-11 sm:h-12 px-6 sm:px-8 rounded-lg font-medium text-sm sm:text-base"
              onClick={() => navigate('/produk')}
            >
              Kembali ke Katalog
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white min-h-screen pb-24 sm:pb-32 overflow-x-hidden">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl mx-auto py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-wastra-brown-800 mb-1 sm:mb-2">
            Keranjang Belanja
          </h1>
          <p className="text-sm sm:text-base text-wastra-brown-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} di keranjang Anda
          </p>
        </div>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <div className="text-center py-12 sm:py-20 px-4">
            <ShoppingBagIcon className="w-16 h-16 sm:w-24 sm:h-24 text-wastra-brown-300 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-2xl font-light text-wastra-brown-800 mb-2">
              Keranjang Anda Kosong
            </h2>
            <p className="text-sm sm:text-base text-wastra-brown-600 mb-6 sm:mb-8">
              Mulai berbelanja dan tambahkan produk ke keranjang
            </p>
            <Link to="/produk">
              <Button 
                size="large"
                className="bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white border-none h-11 sm:h-12 px-6 sm:px-8 rounded-lg font-medium text-sm sm:text-base"
              >
                Jelajahi Produk
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {cartItems.map((item) => (
              <Card
                key={item.id}
                className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
                  item.selected 
                    ? 'border-wastra-brown-400 bg-wastra-brown-50/30' 
                    : 'border-wastra-brown-100'
                }`}
                bodyStyle={{ padding: '12px' }}
              >
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                  {/* Checkbox */}
                  <div className="flex-shrink-0">
                    <Checkbox
                      checked={item.selected}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </div>

                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-wastra-brown-50 rounded-lg overflow-hidden border border-wastra-brown-100">
                      <img 
                        src={item.thumbnail} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <h3 className="text-base sm:text-lg font-semibold text-wastra-brown-800 mb-1 sm:mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-lg sm:text-xl font-bold text-wastra-brown-600 mb-2 sm:mb-3">
                      {formatPrice(item.price)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-wastra-brown-50 border border-wastra-brown-200 text-wastra-brown-700 hover:bg-wastra-brown-100 flex items-center justify-center transition-colors"
                        aria-label="Kurangi jumlah"
                      >
                        <MinusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <span className="text-base sm:text-lg font-semibold text-wastra-brown-800 min-w-[1.5rem] sm:min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-wastra-brown-50 border border-wastra-brown-200 text-wastra-brown-700 hover:bg-wastra-brown-100 flex items-center justify-center transition-colors"
                        aria-label="Tambah jumlah"
                      >
                        <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors ml-1 sm:ml-2"
                        aria-label="Hapus item"
                      >
                        <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Bottom Summary */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-wastra-brown-200 shadow-lg z-50">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl py-3 sm:py-4 md:py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4">
              <div className="flex-1 w-full min-w-0">
                <div className="flex items-center justify-between mb-1 sm:mb-2 gap-2">
                  <span className="text-sm sm:text-base md:text-lg text-wastra-brown-600 truncate">
                    Total {selectedItems.length > 0 && `(${selectedItems.length})`}
                  </span>
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-wastra-brown-800 whitespace-nowrap">
                    {formatPrice(total)}
                  </span>
                </div>
                {selectedItems.length === 0 && (
                  <p className="text-xs sm:text-sm text-wastra-brown-500">
                    Pilih produk untuk melihat total harga
                  </p>
                )}
              </div>
              <div className="w-full sm:w-auto flex-shrink-0">
                <Button
                  size="large"
                  className="w-full sm:w-auto bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white border-none h-10 sm:h-11 md:h-12 px-6 sm:px-8 md:px-12 rounded-lg font-medium text-xs sm:text-sm md:text-base"
                  disabled={selectedItems.length === 0 || isArtisan}
                  onClick={() => {
                    if (isArtisan) {
                      Modal.warning({
                        title: 'Akses Dibatasi',
                        icon: <ExclamationCircleOutlined />,
                        content: 'Pengrajin tidak dapat melakukan checkout produk. Silakan gunakan akun pembeli untuk melakukan pembelian.',
                      })
                      return
                    }
                    navigate('/checkout')
                  }}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart

