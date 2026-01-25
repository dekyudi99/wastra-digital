import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Button, Checkbox, Spin, message } from 'antd'
import { 
  MinusIcon, 
  PlusIcon, 
  TrashIcon, 
  ShoppingBagIcon 
} from '@heroicons/react/24/outline'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { formatPrice } from '../utils/format'
import orderApi from '../api/OrderApi'

const Cart = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // State lokal untuk melacak item mana yang dicentang (selection)
  const [selectedIds, setSelectedIds] = useState([])

  // 1. FETCH DATA DARI API
  const { data: cartResponse = [], isLoading, isError } = useQuery({
    queryKey: ["myCart"],
    queryFn: async () => {
      const res = await orderApi.getCart()
      return res.data // Mengambil data sesuai struktur response API Anda
    }
  })

  const cartItems = cartResponse?.data || []

  const plusMutation = useMutation({
    mutationFn: (id) => orderApi.plusCart(id),
    onSuccess: () => queryClient.invalidateQueries(['myCart']),
  })

  const minusMutation = useMutation({
    mutationFn: (id) => orderApi.minusCart(id),
    onSuccess: () => queryClient.invalidateQueries(['myCart']),
    onError: (err) => {
      message.error(err.response?.data?.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => orderApi.deleteCart(id),
    onSuccess: () => {
      message.success('Item dihapus')
      queryClient.invalidateQueries(['myCart'])
    },
  })

  // 3. LOGIKA SELECTION & PERHITUNGAN
  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const selectedItems = cartItems.filter(item => selectedIds.includes(item.id))
  // Gunakan item.product.last_price sesuai JSON API
  const total = selectedItems.reduce((sum, item) => sum + (item.product.last_price * item.quantity), 0)


  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spin size="large" tip="Memuat Keranjang..." />
    </div>
  )

  return (
    <div className="w-full bg-white min-h-screen pb-24 sm:pb-32 overflow-x-hidden">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl mx-auto py-4 sm:py-6 md:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-wastra-brown-800 mb-1">
            Keranjang Belanja
          </h1>
          <p className="text-sm text-wastra-brown-600">
            {cartItems.length} item di keranjang Anda
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBagIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-light mb-6">Keranjang Anda Kosong</h2>
            <Link to="/produk">
              <Button size="large" className="bg-amber-800 text-white border-none">Jelajahi Produk</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card
                key={item.id}
                className={`border rounded-xl transition-all ${
                  selectedIds.includes(item.id) ? 'border-amber-500 bg-amber-50/20' : 'border-gray-100'
                }`}
                bodyStyle={{ padding: '12px' }}
              >
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                  />

                  {/* Image dari API: item.product.image_url[0] */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={item.product.image_url?.[0]} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 w-full">
                    <h3 className="text-lg font-semibold truncate">{item.product.name}</h3>
                    <p className="text-amber-700 font-bold">
                      {formatPrice(item.product.last_price)}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => minusMutation.mutate(item.id)}
                        disabled={item.quantity <= 1 || minusMutation.isLoading}
                        className="p-1 rounded-full border hover:bg-gray-100 disabled:opacity-30"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="font-bold">{item.quantity}</span>
                      <button
                        onClick={() => plusMutation.mutate(item.id)}
                        disabled={plusMutation.isLoading}
                        className="p-1 rounded-full border hover:bg-gray-100"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteMutation.mutate(item.id)}
                        className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <TrashIcon className="w-5 h-5" />
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
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-2xl z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total {selectedIds.length > 0 && `(${selectedIds.length})`}</p>
              <h2 className="text-2xl font-bold text-amber-900">{formatPrice(total)}</h2>
            </div>
            <Button
              size="large"
              className="bg-amber-800 text-white px-12 h-12 rounded-lg"
              disabled={selectedIds.length === 0}
              onClick={() => navigate('/checkout', { state: { items: selectedItems, total } })}
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart