import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Radio, Input, Modal, Form, Select } from 'antd'
import { 
  ArrowLeftIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  PlusIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'
import { useCart } from '../contexts/CartContext'
import { provinces, regencies, districts } from '../utils/indonesiaRegions'
import { getSellerBanks, getSellerInfo } from '../utils/sellerBankAccounts'

const Checkout = () => {
  const navigate = useNavigate()
  const { getSelectedItems } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [voucherCode, setVoucherCode] = useState('')
  const [shippingOption, setShippingOption] = useState('reguler')
  const [address, setAddress] = useState(null) // null untuk pengguna baru
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false)
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false)
  const [isPaymentInstructionVisible, setIsPaymentInstructionVisible] = useState(false)
  const [selectedBank, setSelectedBank] = useState(null)
  const [selectedSeller, setSelectedSeller] = useState(null) // Seller yang dipilih untuk pembayaran
  const [virtualAccount, setVirtualAccount] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const [form] = Form.useForm()
  const [paymentForm] = Form.useForm()
  const [selectedProvince, setSelectedProvince] = useState(null)
  const [selectedRegency, setSelectedRegency] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [mapLocation, setMapLocation] = useState({ lat: -8.4095, lng: 115.1889 }) // Default: Bali

  // Generate Virtual Account Number
  const generateVirtualAccount = (bankId, sellerName) => {
    const sellerBanks = getSellerBanks(sellerName)
    const bank = sellerBanks.find(b => b.id === bankId)
    if (!bank) return null
    
    // Generate random 10 digit number
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000).toString().substring(0, 10)
    const vaNumber = `${bank.vaPrefix}${randomDigits}`
    
    return vaNumber
  }

  // Generate Order ID
  const generateOrderId = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `WD${timestamp}${random}`
  }

  // Ambil produk yang dipilih dari cart
  const selectedItems = getSelectedItems()

  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shippingCost = shippingOption === 'reguler' ? 0 : 50000
  const discount = 0
  const total = subtotal + shippingCost - discount

  const handleAddAddress = () => {
    form.resetFields()
    setSelectedProvince(null)
    setSelectedRegency(null)
    setSelectedDistrict(null)
    setMapLocation({ lat: -8.4095, lng: 115.1889 }) // Default: Bali
    setIsAddressModalVisible(true)
  }

  const handleEditAddress = () => {
    form.setFieldsValue({
      name: address?.name || '',
      streetAddress: address?.streetAddress || '',
      phone: address?.phone || '',
      province: address?.province || null,
      regency: address?.regency || null,
      district: address?.district || null,
      postalCode: address?.postalCode || ''
    })
    setSelectedProvince(address?.province || null)
    setSelectedRegency(address?.regency || null)
    setSelectedDistrict(address?.district || null)
    setIsAddressModalVisible(true)
  }

  // Update map location when province/regency changes
  useEffect(() => {
    if (selectedProvince === 'bali') {
      setMapLocation({ lat: -8.4095, lng: 115.1889 }) // Bali center
    } else if (selectedProvince === 'jawa-timur') {
      setMapLocation({ lat: -7.2459, lng: 112.7378 }) // Surabaya
    } else if (selectedProvince === 'jawa-tengah') {
      setMapLocation({ lat: -6.9667, lng: 110.4167 }) // Semarang
    } else if (selectedProvince === 'jawa-barat') {
      setMapLocation({ lat: -6.9175, lng: 107.6191 }) // Bandung
    } else if (selectedProvince === 'dki-jakarta') {
      setMapLocation({ lat: -6.2088, lng: 106.8456 }) // Jakarta
    } else if (selectedProvince === 'yogyakarta') {
      setMapLocation({ lat: -7.7956, lng: 110.3695 }) // Yogyakarta
    }
  }, [selectedProvince])

  const handleProvinceChange = (value) => {
    setSelectedProvince(value)
    setSelectedRegency(null)
    setSelectedDistrict(null)
    form.setFieldsValue({ regency: null, district: null })
  }

  const handleRegencyChange = (value) => {
    setSelectedRegency(value)
    setSelectedDistrict(null)
    form.setFieldsValue({ district: null })
  }

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value)
  }

  const handleAddressSubmit = (values) => {
    const provinceName = provinces.find(p => p.id === values.province)?.name || ''
    const regencyName = regencies[values.province]?.find(r => r.id === values.regency)?.name || ''
    const districtName = districts[values.regency]?.find(d => d.id === values.district)?.name || ''
    
    setAddress({
      name: values.name,
      phone: values.phone,
      streetAddress: values.streetAddress,
      province: values.province,
      provinceName: provinceName,
      regency: values.regency,
      regencyName: regencyName,
      district: values.district,
      districtName: districtName,
      postalCode: values.postalCode,
      fullAddress: `${values.streetAddress}, ${districtName}, ${regencyName}, ${provinceName} ${values.postalCode}`
    })
    setIsAddressModalVisible(false)
    form.resetFields()
    setSelectedProvince(null)
    setSelectedRegency(null)
    setSelectedDistrict(null)
  }

  // Group products by seller
  const productsBySeller = selectedItems.reduce((acc, item) => {
    const seller = item.seller || 'Unknown Seller'
    if (!acc[seller]) {
      acc[seller] = []
    }
    acc[seller].push(item)
    return acc
  }, {})

  // Get all unique sellers from selected items
  const sellers = Object.keys(productsBySeller)

  // Get available banks for selected seller
  const getAvailableBanks = () => {
    if (!selectedSeller) {
      // Jika belum pilih seller, gabungkan semua bank dari semua seller
      const allBanks = new Map()
      sellers.forEach(sellerName => {
        const sellerBanks = getSellerBanks(sellerName)
        sellerBanks.forEach(bank => {
          // Use seller name + bank id as unique key
          const key = `${sellerName}_${bank.id}`
          if (!allBanks.has(key)) {
            allBanks.set(key, {
              ...bank,
              sellerName: sellerName
            })
          }
        })
      })
      return Array.from(allBanks.values())
    }
    return getSellerBanks(selectedSeller).map(bank => ({
      ...bank,
      sellerName: selectedSeller
    }))
  }

  const availableBanks = getAvailableBanks()

  // Auto-select seller if only one seller
  useEffect(() => {
    if (sellers.length === 1 && !selectedSeller) {
      setSelectedSeller(sellers[0])
    }
  }, [sellers, selectedSeller])

  const handleCheckout = () => {
    if (!address) {
      alert('Silakan tambahkan alamat pengiriman terlebih dahulu')
      return
    }

    if (paymentMethod === 'bank') {
      // Generate order ID dan virtual account
      const newOrderId = generateOrderId()
      setOrderId(newOrderId)
      setIsPaymentModalVisible(true)
    } else {
      // Handle COD checkout
      const newOrderId = generateOrderId()
      setOrderId(newOrderId)
      
      // Prepare order data
      const orderData = {
        orderId: newOrderId,
        paymentMethod: 'cod',
        total: total,
        address: address,
        products: selectedItems,
        shippingCost: shippingCost
      }
      
      // Save to localStorage as backup
      localStorage.setItem('lastOrder', JSON.stringify(orderData))
      
      // Navigate to success page with order data
      navigate('/order-success', { state: orderData })
    }
  }

  const handleBankSelection = (value) => {
    // Value format: "sellerName_bankId" atau "bankId" jika sudah ada selectedSeller
    let sellerName = selectedSeller
    let bankId = value

    if (value.includes('_')) {
      const [seller, bank] = value.split('_')
      sellerName = seller
      bankId = bank
    }

    if (!sellerName && sellers.length > 0) {
      // Jika belum pilih seller dan ada multiple sellers, ambil seller dari value
      sellerName = sellers.find(s => value.startsWith(s + '_')) || sellers[0]
    }

    setSelectedSeller(sellerName)
    setSelectedBank(bankId)
    const vaNumber = generateVirtualAccount(bankId, sellerName)
    setVirtualAccount(vaNumber)
    setIsPaymentInstructionVisible(true)
  }

  const handleBankPaymentSubmit = (values) => {
    // Handle bank payment submission
    const sellerBanks = getSellerBanks(selectedSeller)
    const bank = sellerBanks.find(b => b.id === selectedBank)
    
    // Prepare order data
    const orderData = {
      orderId: orderId,
      paymentMethod: 'bank',
      total: total,
      address: address,
      products: selectedItems,
      shippingCost: shippingCost,
      bankInfo: {
        bankName: bank?.name,
        accountName: bank?.accountName,
        accountNumber: bank?.accountNumber,
        seller: selectedSeller
      },
      virtualAccount: virtualAccount,
      transferDate: values.transferDate,
      transferAmount: values.transferAmount
    }
    
    // Save to localStorage as backup
    localStorage.setItem('lastOrder', JSON.stringify(orderData))
    
    // Close modal
    setIsPaymentModalVisible(false)
    setIsPaymentInstructionVisible(false)
    paymentForm.resetFields()
    
    // Navigate to success page with order data
    navigate('/order-success', { state: orderData })
  }

  // Jika tidak ada produk yang dipilih, tampilkan pesan
  if (selectedItems.length === 0) {
    return (
      <div className="w-full bg-wastra-brown-50 min-h-screen pb-32">
        <div className="bg-white border-b border-wastra-brown-100">
          <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-6xl py-4">
            <p className="text-sm text-gray-400 mb-2">Halaman Checkout</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-wastra-brown-50 rounded-lg transition-colors"
                aria-label="Kembali"
              >
                <ArrowLeftIcon className="w-6 h-6 text-wastra-brown-800" />
              </button>
              <h1 className="text-3xl font-bold text-wastra-brown-800">
                Checkout
              </h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-6xl py-20">
          <div className="text-center">
            <div className="mb-6">
              <ShoppingBagIcon className="w-24 h-24 text-wastra-brown-300 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-wastra-brown-800 mb-3">
              Belum Ada Produk yang Dipilih
            </h2>
            <p className="text-wastra-brown-600 mb-8 max-w-md mx-auto">
              Silakan kembali ke keranjang dan pilih produk yang ingin Anda checkout dengan mencentang checkbox pada produk.
            </p>
            <Button
              size="large"
              className="bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white border-none h-12 px-8 rounded-lg font-medium"
              onClick={() => navigate('/keranjang')}
            >
              Kembali ke Keranjang
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-wastra-brown-50 min-h-screen pb-32">
      <div className="bg-white border-b border-wastra-brown-100">
        <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-6xl py-4">
          <p className="text-sm text-gray-400 mb-2">Halaman Checkout</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-wastra-brown-50 rounded-lg transition-colors"
              aria-label="Kembali"
            >
              <ArrowLeftIcon className="w-6 h-6 text-wastra-brown-800" />
            </button>
            <h1 className="text-3xl font-bold text-wastra-brown-800">
              Checkout
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-6xl py-8">
        {/* Delivery Address Section */}
        <Card className="mb-6 border border-wastra-brown-100 rounded-xl shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <MapPinIcon className="w-5 h-5 text-wastra-brown-600" />
                <h2 className="text-lg font-semibold text-wastra-brown-800">
                  Alamat Pengiriman
                </h2>
              </div>
              {address ? (
                <div>
                  <p className="text-base font-semibold text-wastra-brown-800 mb-1">
                    {address.name}
                  </p>
                  <p className="text-sm text-wastra-brown-600 mb-1">
                    {address.fullAddress || address.streetAddress}
                  </p>
                  <p className="text-sm text-wastra-brown-600">
                    {address.phone}
                  </p>
                </div>
              ) : (
                <div className="py-4">
                  <p className="text-sm text-wastra-brown-600 mb-4">
                    Belum ada alamat pengiriman. Silakan tambahkan alamat terlebih dahulu.
                  </p>
                  <Button
                    type="primary"
                    icon={<PlusIcon className="w-4 h-4" />}
                    className="bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white border-none h-10 px-6 rounded-lg"
                    onClick={handleAddAddress}
                  >
                    Tambah Alamat
                  </Button>
                </div>
              )}
            </div>
            {address && (
              <Button
                type="text"
                className="text-wastra-brown-600 hover:text-wastra-brown-800"
                onClick={handleEditAddress}
              >
                Ubah
              </Button>
            )}
          </div>
        </Card>

        {/* Seller and Products Section */}
        {Object.entries(productsBySeller).map(([seller, items]) => (
          <Card key={seller} className="mb-6 border border-wastra-brown-100 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BuildingOfficeIcon className="w-5 h-5 text-wastra-brown-600" />
              <h2 className="text-lg font-semibold text-wastra-brown-800">
                {seller}
              </h2>
            </div>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-wastra-brown-50 rounded-lg overflow-hidden border border-wastra-brown-100">
                      <img 
                        src={item.thumbnail} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-wastra-brown-800 mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-xl font-bold text-red-600 mb-1">
                      {formatPrice(item.price)}
                    </p>
                    <p className="text-sm text-wastra-brown-600">
                      {item.quantity}x
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* Voucher Section */}
        <Card className="mb-6 border border-wastra-brown-100 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-wastra-brown-800">Voucher</span>
            <Button
              type="text"
              className="text-wastra-brown-600 hover:text-wastra-brown-800"
              onClick={() => {
                const code = prompt('Masukkan kode voucher:')
                if (code) setVoucherCode(code)
              }}
            >
              Masukan Kode &gt;
            </Button>
          </div>
          {voucherCode && (
            <p className="text-sm text-wastra-brown-600 mt-2">
              Kode: {voucherCode}
            </p>
          )}
        </Card>

        {/* Shipping Options */}
        <Card className="mb-6 border border-wastra-brown-100 rounded-xl shadow-sm">
          <h2 className="text-base font-semibold text-wastra-brown-800 mb-4">
            Opsi Pengiriman
          </h2>
          <Radio.Group 
            value={shippingOption} 
            onChange={(e) => setShippingOption(e.target.value)}
            className="w-full"
          >
            <div className="space-y-3">
              <Radio value="reguler" className="w-full">
                <div className="flex items-center justify-between w-full ml-2">
                  <div>
                    <span className="text-base font-medium text-wastra-brown-800">Reguler</span>
                    <p className="text-sm text-wastra-brown-600">Tiba 14 - 20 Desember</p>
                  </div>
                  <span className="text-base font-semibold text-wastra-brown-800">
                    {formatPrice(0)}
                  </span>
                </div>
              </Radio>
              <Radio value="express" className="w-full">
                <div className="flex items-center justify-between w-full ml-2">
                  <div>
                    <span className="text-base font-medium text-wastra-brown-800">Express</span>
                    <p className="text-sm text-wastra-brown-600">Tiba 7 - 10 Desember</p>
                  </div>
                  <span className="text-base font-semibold text-wastra-brown-800">
                    {formatPrice(50000)}
                  </span>
                </div>
              </Radio>
            </div>
          </Radio.Group>
        </Card>

        {/* Total Products */}
        <Card className="mb-6 border border-wastra-brown-100 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-wastra-brown-800">
              Total {selectedItems.length} Produk
            </span>
            <span className="text-lg font-semibold text-wastra-brown-800">
              {formatPrice(subtotal)}
            </span>
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="mb-6 border border-wastra-brown-100 rounded-xl shadow-sm">
          <h2 className="text-base font-semibold text-wastra-brown-800 mb-4">
            Metode Pembayaran
          </h2>
          <Radio.Group 
            value={paymentMethod} 
            onChange={(e) => {
              setPaymentMethod(e.target.value)
              if (e.target.value === 'bank') {
                // Generate order ID dan buka modal pembayaran bank
                if (!orderId) {
                  const newOrderId = generateOrderId()
                  setOrderId(newOrderId)
                }
                // Auto-select seller jika hanya ada 1 seller
                const currentSellers = Object.keys(productsBySeller)
                if (currentSellers.length === 1 && !selectedSeller) {
                  setSelectedSeller(currentSellers[0])
                }
                setIsPaymentModalVisible(true)
              }
            }}
            className="w-full"
          >
            <div className="space-y-3">
              <Radio value="cod" className="w-full">
                <span className="text-base font-medium text-wastra-brown-800 ml-2">COD</span>
              </Radio>
              <Radio value="bank" className="w-full">
                <div className="flex items-center justify-between w-full ml-2">
                  <span className="text-base font-medium text-wastra-brown-800">Bank</span>
                  {selectedBank && virtualAccount && (
                    <Button
                      type="link"
                      size="small"
                      className="text-wastra-brown-600 hover:text-wastra-brown-800 p-0 h-auto"
                      onClick={() => setIsPaymentModalVisible(true)}
                    >
                      Lihat Detail &gt;
                    </Button>
                  )}
                </div>
              </Radio>
            </div>
          </Radio.Group>
          
          {/* Tampilkan info bank yang sudah dipilih */}
          {paymentMethod === 'bank' && selectedBank && virtualAccount && selectedSeller && (() => {
            const sellerBanks = getSellerBanks(selectedSeller)
            const bank = sellerBanks.find(b => b.id === selectedBank)
            if (!bank) return null
            
            return (
              <div className="mt-4 p-4 bg-wastra-brown-50 border border-wastra-brown-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{bank.logo}</span>
                    <div>
                      <div className="text-base font-semibold text-wastra-brown-800">
                        {bank.name}
                      </div>
                      <div className="text-xs text-wastra-brown-500">Penjual: {selectedSeller}</div>
                    </div>
                  </div>
                  <Button
                    type="link"
                    size="small"
                    className="text-wastra-brown-600 hover:text-wastra-brown-800"
                    onClick={() => setIsPaymentModalVisible(true)}
                  >
                    Ubah
                  </Button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-wastra-brown-600">Virtual Account:</p>
                  <p className="text-lg font-bold text-wastra-brown-800 font-mono">
                    {virtualAccount}
                  </p>
                  <p className="text-xs text-wastra-brown-500 mt-1">Atas Nama: {bank.accountName}</p>
                </div>
              </div>
            )
          })()}
        </Card>

        {/* Payment Details */}
        <Card className="mb-6 border border-wastra-brown-100 rounded-xl shadow-sm">
          <h2 className="text-base font-semibold text-wastra-brown-800 mb-4">
            Rincian Pembayaran
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-wastra-brown-600">Subtotal Pembayaran</span>
              <span className="text-base font-medium text-wastra-brown-800">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-wastra-brown-600">Subtotal Pengiriman</span>
              <span className="text-base font-medium text-wastra-brown-800">
                {formatPrice(shippingCost)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-wastra-brown-600">Total Diskon</span>
              <span className="text-base font-medium text-wastra-brown-800">
                {formatPrice(discount)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-wastra-brown-100">
              <span className="text-lg font-semibold text-wastra-brown-800">Total Pembayaran</span>
              <span className="text-xl font-bold text-wastra-brown-800">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-wastra-brown-200 shadow-lg z-50">
        <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-6xl py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <p className="text-sm font-semibold text-wastra-brown-800 mb-1">Total Harga</p>
              <p className="text-2xl font-bold text-red-600">
                {formatPrice(total)}
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <Button
                size="large"
                className="w-full sm:w-auto bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white border-none h-12 px-12 rounded-lg font-bold text-base uppercase"
                disabled={!address}
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <Modal
        title="Tambah Alamat Pengiriman"
        open={isAddressModalVisible}
        onCancel={() => {
          setIsAddressModalVisible(false)
          form.resetFields()
          setSelectedProvince(null)
          setSelectedRegency(null)
          setSelectedDistrict(null)
        }}
        footer={null}
        width={800}
        className="address-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddressSubmit}
          className="mt-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Nama Penerima"
              name="name"
              rules={[{ required: true, message: 'Masukkan nama penerima' }]}
              className="md:col-span-2"
            >
              <Input 
                size="large" 
                placeholder="Contoh: Bintang Kertika"
                className="rounded-lg"
              />
            </Form.Item>
            
            <Form.Item
              label="Nomor Telepon"
              name="phone"
              rules={[
                { required: true, message: 'Masukkan nomor telepon' },
                { pattern: /^[0-9+\-\s()]+$/, message: 'Format nomor telepon tidak valid' }
              ]}
              className="md:col-span-2"
            >
              <Input 
                size="large" 
                placeholder="Contoh: (+62) 812-3456-7891"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label="Provinsi"
              name="province"
              rules={[{ required: true, message: 'Pilih provinsi' }]}
            >
              <Select
                size="large"
                placeholder="Pilih Provinsi"
                className="rounded-lg"
                onChange={handleProvinceChange}
                value={selectedProvince}
              >
                {provinces.map(province => (
                  <Select.Option key={province.id} value={province.id}>
                    {province.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Kabupaten/Kota"
              name="regency"
              rules={[{ required: true, message: 'Pilih kabupaten/kota' }]}
            >
              <Select
                size="large"
                placeholder="Pilih Kabupaten/Kota"
                className="rounded-lg"
                onChange={handleRegencyChange}
                value={selectedRegency}
                disabled={!selectedProvince}
              >
                {selectedProvince && regencies[selectedProvince]?.map(regency => (
                  <Select.Option key={regency.id} value={regency.id}>
                    {regency.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Kecamatan"
              name="district"
              rules={[{ required: true, message: 'Pilih kecamatan' }]}
            >
              <Select
                size="large"
                placeholder="Pilih Kecamatan"
                className="rounded-lg"
                onChange={handleDistrictChange}
                value={selectedDistrict}
                disabled={!selectedRegency}
              >
                {selectedRegency && districts[selectedRegency]?.map(district => (
                  <Select.Option key={district.id} value={district.id}>
                    {district.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Kode Pos"
              name="postalCode"
              rules={[
                { required: true, message: 'Masukkan kode pos' },
                { pattern: /^[0-9]{5}$/, message: 'Kode pos harus 5 digit' }
              ]}
            >
              <Input 
                size="large" 
                placeholder="Contoh: 80862"
                className="rounded-lg"
                maxLength={5}
              />
            </Form.Item>
          </div>
          
          <Form.Item
            label="Alamat Detail (Jalan, Nomor Rumah, RT/RW, dll)"
            name="streetAddress"
            rules={[{ required: true, message: 'Masukkan alamat detail' }]}
          >
            <Input.TextArea 
              rows={3}
              placeholder="Contoh: Jalan Raya Udayana No. 123, RT 01/RW 02, Desa Banyuasri"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label="Pilih Lokasi di Peta"
            className="mb-4"
          >
            <div className="w-full h-64 rounded-lg overflow-hidden border border-wastra-brown-200">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${mapLocation.lat},${mapLocation.lng}&hl=id&z=15&output=embed`}
              />
            </div>
            <p className="text-xs text-wastra-brown-500 mt-2">
              Geser peta untuk melihat lokasi. Klik "Lihat di Google Maps" untuk memilih lokasi yang lebih akurat.
            </p>
          </Form.Item>
          
          <Form.Item className="mb-0">
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => {
                  setIsAddressModalVisible(false)
                  form.resetFields()
                  setSelectedProvince(null)
                  setSelectedRegency(null)
                  setSelectedDistrict(null)
                }}
                className="rounded-lg"
              >
                Batal
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white border-none rounded-lg"
              >
                Simpan Alamat
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bank Payment Modal */}
      <Modal
        title="Pembayaran Bank"
        open={isPaymentModalVisible}
        onCancel={() => {
          setIsPaymentModalVisible(false)
          setIsPaymentInstructionVisible(false)
          // Jangan reset selectedBank dan virtualAccount jika sudah dipilih
          // Hanya reset form jika belum submit
          if (!selectedBank) {
            paymentForm.resetFields()
          }
        }}
        footer={null}
        width={800}
        className="payment-modal"
      >
        <div className="mt-4">
          <Form
            form={paymentForm}
            layout="vertical"
            onFinish={handleBankPaymentSubmit}
          >
            {/* Order ID */}
            {orderId && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Order ID:</span> {orderId}
                </p>
              </div>
            )}

            {/* Pilih Seller jika ada multiple sellers */}
            {sellers.length > 1 && (
              <Form.Item
                label="Pilih Penjual"
                name="seller"
                rules={[{ required: true, message: 'Pilih penjual terlebih dahulu' }]}
              >
                <Select
                  size="large"
                  placeholder="Pilih Penjual"
                  className="rounded-lg mb-4"
                  onChange={(value) => {
                    setSelectedSeller(value)
                    setSelectedBank(null)
                    setVirtualAccount(null)
                    setIsPaymentInstructionVisible(false)
                    paymentForm.setFieldsValue({ bank: null })
                  }}
                  value={selectedSeller}
                >
                  {sellers.map(sellerName => (
                    <Select.Option key={sellerName} value={sellerName}>
                      {sellerName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item
              label="Pilih Bank"
              name="bank"
              rules={[{ required: true, message: 'Pilih bank untuk transfer' }]}
            >
              <Select
                size="large"
                placeholder={sellers.length > 1 && !selectedSeller ? "Pilih penjual terlebih dahulu" : "Pilih Bank"}
                className="rounded-lg"
                disabled={sellers.length > 1 && !selectedSeller}
                onChange={(value) => {
                  handleBankSelection(value)
                  paymentForm.setFieldsValue({ bank: value })
                }}
                value={selectedBank ? (selectedSeller ? `${selectedSeller}_${selectedBank}` : selectedBank) : null}
              >
                {availableBanks.map(bank => {
                  const optionValue = sellers.length > 1 ? `${bank.sellerName}_${bank.id}` : bank.id
                  return (
                    <Select.Option key={optionValue} value={optionValue}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{bank.logo}</span>
                        <div className="flex-1">
                          <div className="font-medium">{bank.name}</div>
                          {sellers.length > 1 && (
                            <div className="text-xs text-wastra-brown-500">{bank.sellerName}</div>
                          )}
                        </div>
                      </div>
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>

            {selectedBank && virtualAccount && selectedSeller && (
              <>
                {(() => {
                  const sellerBanks = getSellerBanks(selectedSeller)
                  const bank = sellerBanks.find(b => b.id === selectedBank)
                  if (!bank) return null
                  
                  return (
                    <Card className="mb-4 bg-gradient-to-br from-wastra-brown-50 to-wastra-brown-100 border-2 border-wastra-brown-300 shadow-lg">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-3xl">{bank.logo}</span>
                          <div>
                            <h3 className="text-xl font-bold text-wastra-brown-800">
                              {bank.name}
                            </h3>
                            <p className="text-sm text-wastra-brown-600">Penjual: {selectedSeller}</p>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-wastra-brown-200">
                          <div className="space-y-2 mb-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-wastra-brown-600">Virtual Account:</span>
                              <span className="text-2xl font-bold text-wastra-brown-800 font-mono tracking-wider">
                                {virtualAccount}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-wastra-brown-600">Atas Nama:</span>
                              <span className="text-base font-semibold text-wastra-brown-800">
                                {bank.accountName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-wastra-brown-600">Nomor Rekening:</span>
                              <span className="text-base font-semibold text-wastra-brown-800">
                                {bank.accountNumber}
                              </span>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-wastra-brown-200">
                            <div className="flex justify-between items-center">
                              <span className="text-base font-semibold text-wastra-brown-800">Total Pembayaran:</span>
                              <span className="text-2xl font-bold text-red-600">
                                {formatPrice(total)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })()}

                {isPaymentInstructionVisible && selectedSeller && (() => {
                  const sellerBanks = getSellerBanks(selectedSeller)
                  const bank = sellerBanks.find(b => b.id === selectedBank)
                  if (!bank) return null
                  
                  return (
                    <Card className="mb-4 bg-blue-50 border border-blue-200">
                      <h4 className="text-base font-semibold text-blue-900 mb-3">
                        Instruksi Pembayaran:
                      </h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                        {bank.instructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ol>
                    <div className="mt-4 p-3 bg-white rounded-lg border border-blue-300">
                      <p className="text-xs text-blue-700 font-medium mb-1">
                        Cara Transfer:
                      </p>
                      <ol className="list-decimal list-inside space-y-1 text-xs text-blue-800">
                        <li>Masukkan Virtual Account: <span className="font-mono font-bold">{virtualAccount}</span></li>
                        <li>Masukkan jumlah: <span className="font-bold">{formatPrice(total)}</span></li>
                        <li>Konfirmasi dan selesaikan transfer</li>
                        <li>Upload bukti transfer di bawah ini</li>
                      </ol>
                    </div>
                  </Card>
                  )
                })()}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800 font-medium mb-2">
                    ⚠️ Penting: 
                  </p>
                  <ul className="text-xs text-yellow-700 list-disc list-inside space-y-1">
                    <li>Pastikan jumlah transfer sesuai dengan total pembayaran: <span className="font-bold">{formatPrice(total)}</span></li>
                    <li>Virtual Account akan otomatis terdeteksi setelah transfer</li>
                    <li>Upload bukti transfer untuk mempercepat proses verifikasi</li>
                  </ul>
                </div>

                <Form.Item
                  label="Tanggal Transfer"
                  name="transferDate"
                  rules={[{ required: true, message: 'Masukkan tanggal transfer' }]}
                >
                  <Input
                    type="date"
                    size="large"
                    className="rounded-lg"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </Form.Item>

                <Form.Item
                  label="Jumlah Transfer"
                  name="transferAmount"
                  rules={[
                    { required: true, message: 'Masukkan jumlah transfer' },
                    { 
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.reject(new Error('Masukkan jumlah transfer'))
                        }
                        const amount = parseFloat(value)
                        if (amount === total) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error(`Jumlah transfer harus ${formatPrice(total)}`))
                      }
                    }
                  ]}
                >
                  <Input
                    type="number"
                    size="large"
                    placeholder={`Masukkan ${formatPrice(total)}`}
                    className="rounded-lg"
                    prefix="Rp "
                  />
                </Form.Item>

                <Form.Item
                  label="Upload Bukti Transfer"
                  name="proof"
                  rules={[{ required: true, message: 'Upload bukti transfer' }]}
                  extra="Format: JPG, PNG, atau PDF (Maks. 5MB)"
                >
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    size="large"
                    className="rounded-lg"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert('Ukuran file maksimal 5MB')
                          e.target.value = ''
                          return
                        }
                        paymentForm.setFieldsValue({ proof: file })
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Catatan (Opsional)"
                  name="notes"
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Tambahkan catatan jika diperlukan..."
                    className="rounded-lg"
                  />
                </Form.Item>
              </>
            )}

            <Form.Item className="mb-0 mt-6">
              <div className="flex gap-3 justify-end">
              <Button
                onClick={() => {
                  setIsPaymentModalVisible(false)
                  setIsPaymentInstructionVisible(false)
                  // Hanya reset form, jangan hapus bank yang sudah dipilih
                  paymentForm.resetFields()
                }}
                className="rounded-lg"
              >
                {selectedBank ? 'Tutup' : 'Batal'}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white border-none rounded-lg"
                disabled={!selectedBank || !virtualAccount}
              >
                Konfirmasi Pembayaran
              </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export default Checkout

