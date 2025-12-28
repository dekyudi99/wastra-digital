import { Link, useNavigate } from 'react-router-dom'
import { Card, Button, Checkbox } from 'antd'
import { 
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'
import { useCart } from '../contexts/CartContext'

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, toggleSelect, updateQuantity, removeItem } = useCart()

  // Hanya hitung total dari item yang dipilih
  const selectedItems = cartItems.filter(item => item.selected)
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const total = subtotal

  return (
    <div className="w-full bg-white min-h-screen pb-32">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-6xl py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-wastra-brown-800 mb-2">
            Keranjang Belanja
          </h1>
          <p className="text-wastra-brown-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} di keranjang Anda
          </p>
        </div>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBagIcon className="w-24 h-24 text-wastra-brown-300 mx-auto mb-6" />
            <h2 className="text-2xl font-light text-wastra-brown-800 mb-2">
              Keranjang Anda Kosong
            </h2>
            <p className="text-wastra-brown-600 mb-8">
              Mulai berbelanja dan tambahkan produk ke keranjang
            </p>
            <Link to="/produk">
              <Button 
                size="large"
                className="bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white border-none h-12 px-8 rounded-lg font-medium"
              >
                Jelajahi Produk
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card
                key={item.id}
                className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
                  item.selected 
                    ? 'border-wastra-brown-400 bg-wastra-brown-50/30' 
                    : 'border-wastra-brown-100'
                }`}
                bodyStyle={{ padding: '20px' }}
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  {/* Checkbox */}
                  <div className="flex-shrink-0">
                    <Checkbox
                      checked={item.selected}
                      onChange={() => toggleSelect(item.id)}
                      className="w-5 h-5"
                    />
                  </div>

                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-wastra-brown-50 rounded-lg overflow-hidden border border-wastra-brown-100">
                      <img 
                        src={item.thumbnail} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <h3 className="text-lg font-semibold text-wastra-brown-800 mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-xl font-bold text-wastra-brown-600 mb-3">
                      {formatPrice(item.price)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-wastra-brown-50 border border-wastra-brown-200 text-wastra-brown-700 hover:bg-wastra-brown-100 flex items-center justify-center transition-colors"
                        aria-label="Kurangi jumlah"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold text-wastra-brown-800 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-wastra-brown-50 border border-wastra-brown-200 text-wastra-brown-700 hover:bg-wastra-brown-100 flex items-center justify-center transition-colors"
                        aria-label="Tambah jumlah"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-full bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors ml-2"
                        aria-label="Hapus item"
                      >
                        <TrashIcon className="w-4 h-4" />
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
          <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-6xl py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg text-wastra-brown-600">
                    Total Harga {selectedItems.length > 0 && `(${selectedItems.length} ${selectedItems.length === 1 ? 'item' : 'items'})`}
                  </span>
                  <span className="text-2xl font-bold text-wastra-brown-800">
                    {formatPrice(total)}
                  </span>
                </div>
                {selectedItems.length === 0 && (
                  <p className="text-sm text-wastra-brown-500">
                    Pilih produk untuk melihat total harga
                  </p>
                )}
              </div>
              <div className="w-full sm:w-auto">
                <Button
                  size="large"
                  className="w-full sm:w-auto bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white border-none h-12 px-12 rounded-lg font-medium text-base"
                  disabled={selectedItems.length === 0}
                  onClick={() => navigate('/checkout')}
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

