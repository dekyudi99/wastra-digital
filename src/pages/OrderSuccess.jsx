import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Card, Button, Divider, Tag } from 'antd'
import { 
  CheckCircleIcon,
  ShoppingBagIcon,
  HomeIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'
import { getSellerBanks } from '../utils/sellerBankAccounts'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    // Ambil data order dari location state atau localStorage
    const data = location.state || JSON.parse(localStorage.getItem('lastOrder') || 'null')
    if (!data) {
      // Jika tidak ada data, redirect ke home
      navigate('/')
      return
    }
    setOrderData(data)
    // Clear localStorage setelah diambil
    localStorage.removeItem('lastOrder')
  }, [location, navigate])

  if (!orderData) {
    return null
  }

  const { 
    orderId, 
    paymentMethod, 
    total, 
    subtotal,
    shippingCost,
    shippingAddress,
    address, 
    products,
    items,
    bankInfo,
    virtualAccount
  } = orderData

  // Use items if available, otherwise fallback to products
  const orderItems = items || products || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-wastra-brown-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            type="text"
            icon={<ArrowLeftIcon className="w-5 h-5" />}
            onClick={() => navigate('/keranjang')}
            className="text-wastra-brown-600 hover:text-wastra-brown-800 hover:bg-wastra-brown-50 flex items-center gap-2"
          >
            Kembali ke Keranjang
          </Button>
        </div>

        {/* Success Icon & Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircleIcon className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-wastra-brown-800 mb-2">
            Pesanan Berhasil Diterima!
          </h1>
          <p className="text-lg text-wastra-brown-600">
            Terima kasih telah berbelanja di Wastra Digital
          </p>
        </div>

        {/* Order ID Card */}
        <Card className="mb-6 border-2 border-wastra-brown-200 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="w-6 h-6 text-wastra-brown-600" />
              <div>
                <p className="text-sm text-wastra-brown-600 mb-1">Order ID</p>
                <p className="text-xl font-bold text-wastra-brown-800 font-mono">
                  {orderId}
                </p>
              </div>
            </div>
            <Tag color="green" className="text-base px-4 py-1">
              Berhasil
            </Tag>
          </div>
        </Card>

        {/* Payment Information */}
        {paymentMethod === 'bank' && bankInfo && (
          <Card className="mb-6 border border-wastra-brown-200 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-wastra-brown-800 mb-4">
              Informasi Pembayaran
            </h2>
            <div className="space-y-4">
              <div className="bg-wastra-brown-50 rounded-lg p-4 border border-wastra-brown-200">
                <div className="flex items-center gap-2 mb-3">
                  <BuildingOfficeIcon className="w-5 h-5 text-wastra-brown-600" />
                  <span className="text-base font-semibold text-wastra-brown-800">
                    {bankInfo.bankName}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-wastra-brown-600">Virtual Account:</span>
                    <span className="text-lg font-bold text-wastra-brown-800 font-mono">
                      {virtualAccount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-wastra-brown-600">Atas Nama:</span>
                    <span className="text-base font-semibold text-wastra-brown-800">
                      {bankInfo.accountName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-wastra-brown-600">Total Pembayaran:</span>
                    <span className="text-xl font-bold text-red-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  ⚠️ Penting:
                </p>
                <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                  <li>Lakukan transfer sesuai dengan total pembayaran</li>
                  <li>Pesanan akan diproses setelah pembayaran terverifikasi</li>
                  <li>Kami akan mengirimkan notifikasi via email/SMS setelah pembayaran dikonfirmasi</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Order Summary */}
        <Card className="mb-6 border border-wastra-brown-200 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-wastra-brown-800 mb-4">
            Ringkasan Pesanan
          </h2>
          <div className="space-y-3">
            {orderItems.map((item, index) => (
              <div key={index} className="flex gap-4 pb-3 border-b border-wastra-brown-100 last:border-0">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-wastra-brown-50 rounded-lg overflow-hidden border border-wastra-brown-100">
                    {(item.thumbnail || item.image) && (
                      <img 
                        src={item.thumbnail || item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-wastra-brown-800 mb-1 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-wastra-brown-600 mb-2">
                    {item.quantity}x × {formatPrice(item.price)}
                  </p>
                  <p className="text-lg font-bold text-wastra-brown-800">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
            <Divider className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-wastra-brown-600">Subtotal</span>
                <span className="text-wastra-brown-800">
                  {formatPrice(subtotal || orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-wastra-brown-600">Ongkos Kirim</span>
                <span className="text-wastra-brown-800">
                  {formatPrice(shippingCost || 0)}
                </span>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-wastra-brown-800">Total</span>
                <span className="text-2xl font-bold text-red-600">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Shipping Address */}
        {(shippingAddress || address) && (
          <Card className="mb-6 border border-wastra-brown-200 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-wastra-brown-800 mb-4">
              Alamat Pengiriman
            </h2>
            <div className="space-y-2 text-wastra-brown-700">
              <p className="font-semibold">{(shippingAddress || address).name}</p>
              <p className="text-sm">{(shippingAddress || address).phone}</p>
              <p className="text-sm">
                {(shippingAddress || address).streetAddress}
                {(shippingAddress || address).district && `, ${(shippingAddress || address).district}`}
                {(shippingAddress || address).regency && `, ${(shippingAddress || address).regency}`}
                {(shippingAddress || address).province && `, ${(shippingAddress || address).province}`}
                {(shippingAddress || address).postalCode && ` ${(shippingAddress || address).postalCode}`}
              </p>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="primary"
            size="large"
            icon={<DocumentTextIcon className="w-5 h-5" />}
            className="bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white border-none rounded-lg flex-1 h-12"
            onClick={() => window.print()}
          >
            Cetak Invoice
          </Button>
          <Button
            size="large"
            icon={<ShoppingBagIcon className="w-5 h-5" />}
            className="border-wastra-brown-300 text-wastra-brown-700 hover:bg-wastra-brown-50 rounded-lg flex-1 h-12"
            onClick={() => navigate('/produk')}
          >
            Lanjut Belanja
          </Button>
          <Link to="/" className="flex-1">
            <Button
              size="large"
              icon={<HomeIcon className="w-5 h-5" />}
              className="w-full border-wastra-brown-300 text-wastra-brown-700 hover:bg-wastra-brown-50 rounded-lg h-12"
            >
              Kembali ke Beranda
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <Card className="mt-6 border border-wastra-brown-200 rounded-xl shadow-sm bg-wastra-brown-50">
          <h3 className="text-base font-semibold text-wastra-brown-800 mb-2">
            Butuh Bantuan?
          </h3>
          <p className="text-sm text-wastra-brown-600 mb-3">
            Jika Anda memiliki pertanyaan tentang pesanan Anda, silakan hubungi customer service kami.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="link"
              className="text-wastra-brown-600 hover:text-wastra-brown-800 p-0 h-auto"
            >
              Hubungi Customer Service
            </Button>
            <span className="text-wastra-brown-400">•</span>
            <Button
              type="link"
              className="text-wastra-brown-600 hover:text-wastra-brown-800 p-0 h-auto"
            >
              Lihat Status Pesanan
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default OrderSuccess

