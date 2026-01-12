import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Radio, Input, Modal, Form, Select, Upload, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { 
  ArrowLeftIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  PlusIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'
import { useCart } from '../contexts/CartContext'
import { useUser } from '../contexts/UserContext'
import { provinces, regencies, districts } from '../utils/indonesiaRegions'
import { getSellerBanks, getSellerInfo } from '../utils/sellerBankAccounts'
import { USER_ROLES } from '../utils/authRoles'

const Checkout = () => {
  const navigate = useNavigate()
  const { getSelectedItems, removeSelectedItems } = useCart()
  const { addOrder, addresses, getDefaultAddress, addAddress, updateAddress, hasRole } = useUser()
  const [paymentMethod, setPaymentMethod] = useState('cod')
  
  const isArtisan = hasRole(USER_ROLES.ARTISAN)
  
  // Prevent artisan from accessing checkout
  useEffect(() => {
    if (isArtisan) {
      Modal.warning({
        title: 'Akses Dibatasi',
        icon: <ExclamationCircleOutlined />,
        content: 'Pengrajin tidak dapat melakukan checkout produk. Silakan gunakan akun pembeli untuk melakukan pembelian.',
        onOk: () => {
          navigate('/produk')
        },
      })
    }
  }, [isArtisan, navigate])
  
  // Early return if artisan tries to access checkout
  if (isArtisan) {
    return (
      <div className="w-full bg-wastra-brown-50 min-h-screen pb-32 overflow-x-hidden">
        <div className="bg-white border-b border-wastra-brown-100">
          <div className="w-full px-4 sm:px-6 md:px-8 max-w-6xl mx-auto py-3 sm:py-4">
            <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Halaman Checkout</p>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => navigate('/produk')}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-wastra-brown-50 rounded-lg transition-colors"
                aria-label="Kembali"
              >
                <ArrowLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-wastra-brown-800" />
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-wastra-brown-800">
                Checkout
              </h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl py-12 sm:py-20">
          <div className="text-center px-4">
            <div className="mb-4 sm:mb-6">
              <ExclamationCircleOutlined className="text-4xl sm:text-6xl text-wastra-brown-300 mx-auto" style={{ fontSize: '48px' }} />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-wastra-brown-800 mb-2 sm:mb-3">
              Akses Dibatasi
            </h2>
            <p className="text-sm sm:text-base text-wastra-brown-600 mb-6 sm:mb-8 max-w-md mx-auto">
              Pengrajin tidak dapat melakukan checkout produk. Silakan gunakan akun pembeli untuk melakukan pembelian.
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
  const [proofFile, setProofFile] = useState(null)
  const [form] = Form.useForm()
  const [paymentForm] = Form.useForm()
  const [selectedProvince, setSelectedProvince] = useState(null)
  const [selectedRegency, setSelectedRegency] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [mapLocation, setMapLocation] = useState({ lat: -8.4095, lng: 115.1889 }) // Default: Bali

  // Load default address on mount only
  useEffect(() => {
    // Hanya set default address saat pertama kali mount jika belum ada address yang dipilih
    if (!address && addresses.length > 0) {
      const defaultAddr = getDefaultAddress()
      if (defaultAddr) {
        setAddress(defaultAddr)
      } else {
        // Jika tidak ada default, gunakan alamat pertama
        setAddress(addresses[0])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // Update address jika address yang dipilih dihapus dari addresses
  // Hanya update jika address yang dipilih benar-benar tidak ada lagi (dihapus)
  useEffect(() => {
    if (address && address.id && addresses.length > 0) {
      const addressStillExists = addresses.find(addr => addr.id === address.id)
      if (!addressStillExists) {
        // Hanya update jika address yang dipilih benar-benar tidak ada lagi (dihapus)
        // Jangan update jika address baru saja ditambahkan (akan di-handle di handleAddressSubmit)
        const defaultAddr = getDefaultAddress()
        if (defaultAddr) {
          setAddress(defaultAddr)
        } else if (addresses.length > 0) {
          setAddress(addresses[0])
        }
      }
      // Jangan update address jika masih ada, biarkan user memilih sendiri
    }
  }, [addresses, address, getDefaultAddress])

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
    if (!address) {
      message.warning('Pilih alamat terlebih dahulu')
      return
    }
    form.setFieldsValue({
      name: address?.name || '',
      streetAddress: address?.streetAddress || '',
      phone: address?.phone || '',
      province: address?.province || null,
      regency: address?.regency || null,
      district: address?.district || null,
      postalCode: address?.postalCode || '',
      notes: address?.notes || ''
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
    
    const addressData = {
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
      notes: values.notes || null,
      fullAddress: `${values.streetAddress}, ${districtName}, ${regencyName}, ${provinceName} ${values.postalCode}`
    }
    
    // Check if editing existing address
    if (address && address.id) {
      // Update existing address
      updateAddress(address.id, addressData)
      // Update current address state
      const updatedAddress = { ...address, ...addressData }
      setAddress(updatedAddress)
      message.success('Alamat berhasil diperbarui')
    } else {
      // Add new address
      const savedAddress = addAddress(addressData)
      // Set address yang baru ditambahkan sebagai address yang dipilih
      // savedAddress sudah berisi semua data yang diperlukan, langsung set
      setAddress(savedAddress)
      message.success('Alamat berhasil ditambahkan')
    }
    
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
      message.error('Pilih alamat pengiriman terlebih dahulu')
      return
    }

    if (selectedItems.length === 0) {
      message.error('Pilih produk terlebih dahulu')
      return
    }

    // Validasi alamat lengkap
    if (!address.streetAddress || !address.province || !address.regency || !address.district) {
      message.error('Lengkapi alamat pengiriman terlebih dahulu')
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
      // COD langsung processing karena pembayaran saat terima barang
      const orderData = {
        id: newOrderId,
        orderId: newOrderId,
        paymentMethod: 'cod',
        total: total,
        subtotal: subtotal,
        shippingCost: shippingCost,
        shippingAddress: address,
        items: selectedItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.thumbnail || item.image,
          thumbnail: item.thumbnail || item.image,
        })),
        // Keep products for backward compatibility
        products: selectedItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          thumbnail: item.thumbnail || item.image,
        })),
        status: 'processing' // COD langsung processing karena pembayaran saat terima barang
      }
      
      // Add order to UserContext
      addOrder(orderData)
      
      // Remove selected items from cart after successful checkout
      removeSelectedItems()
      
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
    // Status: jika ada bukti transfer, langsung processing. Jika tidak, tetap pending
    const orderStatus = proofFile ? 'processing' : 'pending'
    
    const orderData = {
      id: orderId,
      orderId: orderId,
      paymentMethod: 'bank',
      total: total,
      subtotal: subtotal,
      shippingCost: shippingCost,
      shippingAddress: address,
      items: selectedItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.thumbnail || item.image,
        thumbnail: item.thumbnail || item.image,
      })),
      // Keep products for backward compatibility
      products: selectedItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        thumbnail: item.thumbnail || item.image,
      })),
      bankInfo: {
        bankName: bank?.name,
        accountName: bank?.accountName,
        accountNumber: bank?.accountNumber,
        seller: selectedSeller
      },
      virtualAccount: virtualAccount,
      transferDate: values.transferDate,
      transferAmount: values.transferAmount,
      proofOfPayment: proofFile ? {
        name: proofFile.name,
        size: proofFile.size,
        type: proofFile.type,
        // Simulasi: convert file to base64 untuk storage (dalam real app, upload ke server)
        url: proofFile instanceof File ? URL.createObjectURL(proofFile) : null
      } : null,
      notes: values.notes || null,
      status: orderStatus // Set status berdasarkan ada/tidaknya bukti transfer
    }
    
    // Add order to UserContext
    addOrder(orderData)
    
    // Remove selected items from cart after successful checkout
    removeSelectedItems()
    
    // Save to localStorage as backup
    localStorage.setItem('lastOrder', JSON.stringify(orderData))
    
    // Close modal
    setIsPaymentModalVisible(false)
    setIsPaymentInstructionVisible(false)
    setProofFile(null)
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
    <div className="w-full bg-wastra-brown-50 min-h-screen pb-40">
      {/* Header */}
      <div className="bg-white border-b border-wastra-brown-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-wastra-brown-50 rounded-lg transition-colors"
              aria-label="Kembali"
            >
              <ArrowLeftIcon className="w-6 h-6 text-wastra-brown-800" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-wastra-brown-800">
                Checkout
              </h1>
              <p className="text-sm text-wastra-brown-500 mt-1">
                Lengkapi informasi untuk menyelesaikan pesanan
              </p>
            </div>
          </div>
        </div>
      </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-6 overflow-x-hidden">
        {/* Delivery Address Section */}
        <Card className="mb-6 border border-wastra-brown-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4 pb-4 border-b border-wastra-brown-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-wastra-brown-100 rounded-lg flex items-center justify-center">
                <MapPinIcon className="w-5 h-5 text-wastra-brown-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-wastra-brown-800">
                  Alamat Pengiriman
                </h2>
                <p className="text-xs text-wastra-brown-500 mt-0.5">
                  Pilih atau tambah alamat pengiriman
                </p>
              </div>
            </div>
            <Button
              type="text"
              icon={<PlusIcon className="w-4 h-4" />}
              size="small"
              className="text-wastra-brown-600 hover:text-wastra-brown-800 hover:bg-wastra-brown-50"
              onClick={handleAddAddress}
            >
              Tambah Baru
            </Button>
          </div>

          {/* Select Address Dropdown */}
          {addresses.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-wastra-brown-700 mb-2">
                Pilih Alamat
              </label>
              <Select
                size="large"
                placeholder="Pilih alamat pengiriman"
                value={address?.id}
                onChange={(addressId) => {
                  const selectedAddr = addresses.find(addr => addr.id === addressId)
                  if (selectedAddr) {
                    setAddress(selectedAddr)
                  }
                }}
                className="w-full"
                showSearch
                filterOption={(input, option) => {
                  const text = option?.children?.[0]?.props?.children || ''
                  const addressText = option?.children?.[1]?.props?.children || ''
                  return (text + ' ' + addressText).toLowerCase().includes(input.toLowerCase())
                }}
                optionLabelProp="label"
              >
                {addresses.map((addr) => {
                  // Get names dengan validasi
                  const districtName = addr.district && districts[addr.regency] 
                    ? districts[addr.regency].find(d => d.id === addr.district)?.name 
                    : null
                  const regencyName = addr.regency && regencies[addr.province]
                    ? regencies[addr.province].find(r => r.id === addr.regency)?.name
                    : null
                  const provinceName = addr.province
                    ? provinces.find(p => p.id === addr.province)?.name
                    : null
                  
                  // Build address parts tanpa duplikasi
                  const addressParts = []
                  if (districtName && districtName !== regencyName) {
                    addressParts.push(districtName)
                  }
                  if (regencyName) {
                    addressParts.push(regencyName)
                  }
                  if (provinceName) {
                    addressParts.push(provinceName)
                  }
                  if (addr.postalCode) {
                    addressParts.push(addr.postalCode)
                  }
                  
                  const locationText = addressParts.length > 0 ? addressParts.join(', ') : ''
                  
                  return (
                    <Select.Option 
                      key={addr.id} 
                      value={addr.id}
                      label={addr.name}
                    >
                      <div className="py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-semibold text-wastra-brown-800 text-sm">{addr.name}</div>
                          {addr.isDefault && (
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-wastra-brown-600 mt-1 leading-relaxed">
                          {addr.streetAddress}
                        </div>
                        {locationText && (
                          <div className="text-xs text-wastra-brown-400 mt-0.5">
                            {locationText}
                          </div>
                        )}
                      </div>
                    </Select.Option>
                  )
                })}
              </Select>
            </div>
          )}

          {/* Display Selected Address */}
          {address ? (
            <div className="p-5 bg-gradient-to-br from-wastra-brown-50 to-white rounded-xl border-2 border-wastra-brown-200 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Nama & Default Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-lg font-bold text-wastra-brown-800">
                      {address.name}
                    </p>
                    {address.isDefault && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  {/* Alamat Detail */}
                  <div className="space-y-2 text-sm">
                    {/* Telepon */}
                    <div className="flex items-center gap-2 text-wastra-brown-700">
                      <span className="text-wastra-brown-500 font-medium min-w-[80px]">Telepon:</span>
                      <span className="font-medium">{address.phone}</span>
                    </div>

                    {/* Alamat Lengkap */}
                    <div className="flex items-start gap-2 text-wastra-brown-700">
                      <span className="text-wastra-brown-500 font-medium min-w-[80px] mt-0.5">Alamat:</span>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{address.streetAddress}</p>
                        <p className="text-wastra-brown-600">
                          {(() => {
                            const parts = []
                            if (address.district) {
                              const districtName = districts[address.regency]?.find(d => d.id === address.district)?.name
                              if (districtName) parts.push(districtName)
                            }
                            if (address.regency) {
                              const regencyName = regencies[address.province]?.find(r => r.id === address.regency)?.name
                              if (regencyName) parts.push(regencyName)
                            }
                            if (address.province) {
                              const provinceName = provinces.find(p => p.id === address.province)?.name
                              if (provinceName) parts.push(provinceName)
                            }
                            if (address.postalCode) {
                              parts.push(address.postalCode)
                            }
                            return parts.join(', ')
                          })()}
                        </p>
                      </div>
                    </div>

                    {/* Catatan */}
                    {address.notes && (
                      <div className="mt-3 pt-3 border-t border-wastra-brown-200">
                        <div className="flex items-start gap-2">
                          <span className="text-wastra-brown-500 font-medium text-xs min-w-[80px]">Catatan:</span>
                          <p className="text-xs text-wastra-brown-600 italic flex-1">
                            {address.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  type="text"
                  size="small"
                  className="text-wastra-brown-600 hover:text-wastra-brown-800 hover:bg-wastra-brown-100 flex-shrink-0 rounded-lg px-3"
                  onClick={handleEditAddress}
                >
                  Ubah
                </Button>
              </div>
            </div>
          ) : addresses.length === 0 ? (
            <div className="py-8 text-center bg-wastra-brown-50 rounded-lg border-2 border-dashed border-wastra-brown-200">
              <MapPinIcon className="w-12 h-12 text-wastra-brown-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-wastra-brown-600 mb-2">
                Belum ada alamat pengiriman
              </p>
              <p className="text-xs text-wastra-brown-500 mb-4">
                Silakan tambahkan alamat terlebih dahulu
              </p>
              <Button
                type="primary"
                icon={<PlusIcon className="w-4 h-4" />}
                size="small"
                className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
                onClick={handleAddAddress}
              >
                Tambah Alamat
              </Button>
            </div>
          ) : null}
        </Card>

        {/* Seller and Products Section */}
        {Object.entries(productsBySeller).map(([seller, items]) => (
          <Card key={seller} className="mb-6 border border-wastra-brown-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-wastra-brown-100">
              <div className="w-10 h-10 bg-wastra-brown-100 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="w-5 h-5 text-wastra-brown-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-wastra-brown-800">
                  {seller}
                </h2>
                <p className="text-xs text-wastra-brown-500 mt-0.5">
                  {items.length} {items.length === 1 ? 'produk' : 'produk'}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-wastra-brown-50 rounded-lg hover:bg-wastra-brown-100 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg overflow-hidden border-2 border-wastra-brown-200 shadow-sm">
                      <img 
                        src={item.thumbnail || item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=Product'
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-wastra-brown-800 mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-red-600 mb-1">
                          {formatPrice(item.price)}
                        </p>
                        <p className="text-sm text-wastra-brown-600">
                          Qty: <span className="font-medium">{item.quantity}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-wastra-brown-500 mb-1">Subtotal</p>
                        <p className="text-base font-bold text-wastra-brown-800">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* Voucher Section */}
        <Card className="mb-6 border border-wastra-brown-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-semibold text-wastra-brown-800 block">Voucher Diskon</span>
              {voucherCode ? (
                <p className="text-sm text-green-600 mt-1 font-medium">
                  ✓ Kode: {voucherCode}
                </p>
              ) : (
                <p className="text-xs text-wastra-brown-500 mt-1">
                  Punya kode voucher?
                </p>
              )}
            </div>
            <Button
              type={voucherCode ? "default" : "primary"}
              size="small"
              className={voucherCode ? "" : "bg-wastra-brown-600 hover:bg-wastra-brown-700"}
              onClick={() => {
                const code = prompt('Masukkan kode voucher:')
                if (code) {
                  setVoucherCode(code)
                  message.success('Kode voucher berhasil diterapkan')
                }
              }}
            >
              {voucherCode ? 'Ubah Kode' : 'Masukkan Kode'}
            </Button>
          </div>
        </Card>

        {/* Shipping Options */}
        <Card className="mb-6 border border-wastra-brown-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-wastra-brown-100">
            <div className="w-10 h-10 bg-wastra-brown-100 rounded-lg flex items-center justify-center">
              <ShoppingBagIcon className="w-5 h-5 text-wastra-brown-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-wastra-brown-800">
                Opsi Pengiriman
              </h2>
              <p className="text-xs text-wastra-brown-500 mt-0.5">
                Pilih metode pengiriman yang diinginkan
              </p>
            </div>
          </div>
          <Radio.Group 
            value={shippingOption} 
            onChange={(e) => setShippingOption(e.target.value)}
            className="w-full"
          >
            <div className="space-y-3">
              <Radio value="reguler" className="w-full">
                <div className="flex items-center justify-between w-full ml-3 p-3 rounded-lg hover:bg-wastra-brown-50 transition-colors">
                  <div>
                    <span className="text-base font-semibold text-wastra-brown-800 block">Reguler</span>
                    <p className="text-sm text-wastra-brown-500 mt-0.5">Estimasi tiba 14-20 hari</p>
                  </div>
                  <span className="text-base font-bold text-wastra-brown-800">
                    {formatPrice(0)}
                  </span>
                </div>
              </Radio>
              <Radio value="express" className="w-full">
                <div className="flex items-center justify-between w-full ml-3 p-3 rounded-lg hover:bg-wastra-brown-50 transition-colors">
                  <div>
                    <span className="text-base font-semibold text-wastra-brown-800 block">Express</span>
                    <p className="text-sm text-wastra-brown-500 mt-0.5">Estimasi tiba 7-10 hari</p>
                  </div>
                  <span className="text-base font-bold text-wastra-brown-800">
                    {formatPrice(50000)}
                  </span>
                </div>
              </Radio>
            </div>
          </Radio.Group>
        </Card>


        {/* Payment Method */}
        <Card className="mb-6 border border-wastra-brown-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-wastra-brown-100">
            <div className="w-10 h-10 bg-wastra-brown-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-5 h-5 text-wastra-brown-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-wastra-brown-800">
                Metode Pembayaran
              </h2>
              <p className="text-xs text-wastra-brown-500 mt-0.5">
                Pilih metode pembayaran yang diinginkan
              </p>
            </div>
          </div>
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
                <div className="flex items-center justify-between w-full ml-3 p-3 rounded-lg hover:bg-wastra-brown-50 transition-colors">
                  <div>
                    <span className="text-base font-semibold text-wastra-brown-800 block">Cash on Delivery (COD)</span>
                    <p className="text-sm text-wastra-brown-500 mt-0.5">Bayar saat barang diterima</p>
                  </div>
                </div>
              </Radio>
              <Radio value="bank" className="w-full">
                <div className="flex items-center justify-between w-full ml-3 p-3 rounded-lg hover:bg-wastra-brown-50 transition-colors">
                  <div>
                    <span className="text-base font-semibold text-wastra-brown-800 block">Transfer Bank</span>
                    <p className="text-sm text-wastra-brown-500 mt-0.5">Transfer via Virtual Account</p>
                  </div>
                  {selectedBank && virtualAccount && (
                    <Button
                      type="link"
                      size="small"
                      className="text-wastra-brown-600 hover:text-wastra-brown-800 p-0 h-auto font-medium"
                      onClick={() => setIsPaymentModalVisible(true)}
                    >
                      Lihat Detail →
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
              <div className="mt-4 p-5 bg-gradient-to-br from-blue-50 to-wastra-brown-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                      {bank.logo}
                    </div>
                    <div>
                      <div className="text-base font-bold text-wastra-brown-800">
                        {bank.name}
                      </div>
                      <div className="text-xs text-wastra-brown-500">Penjual: {selectedSeller}</div>
                    </div>
                  </div>
                  <Button
                    type="text"
                    size="small"
                    className="text-wastra-brown-600 hover:text-wastra-brown-800 hover:bg-white"
                    onClick={() => setIsPaymentModalVisible(true)}
                  >
                    Ubah
                  </Button>
                </div>
                <div className="bg-white p-3 rounded-lg border border-blue-200">
                  <p className="text-xs text-wastra-brown-500 mb-1">Virtual Account:</p>
                  <p className="text-xl font-bold text-wastra-brown-800 font-mono tracking-wider">
                    {virtualAccount}
                  </p>
                  <p className="text-xs text-wastra-brown-500 mt-2">Atas Nama: <span className="font-medium">{bank.accountName}</span></p>
                </div>
              </div>
            )
          })()}
        </Card>

        {/* Payment Details */}
        <Card className="mb-6 border-2 border-wastra-brown-300 rounded-xl shadow-lg bg-gradient-to-br from-white to-wastra-brown-50">
          <h2 className="text-lg font-bold text-wastra-brown-800 mb-5 pb-4 border-b-2 border-wastra-brown-200">
            Rincian Pembayaran
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-wastra-brown-600">Subtotal ({selectedItems.length} produk)</span>
              <span className="text-base font-semibold text-wastra-brown-800">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-wastra-brown-600">Ongkos Kirim</span>
              <span className="text-base font-semibold text-wastra-brown-800">
                {formatPrice(shippingCost)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-green-600">Diskon</span>
                <span className="text-base font-semibold text-green-600">
                  -{formatPrice(discount)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-4 border-t-2 border-wastra-brown-200">
              <span className="text-lg font-bold text-wastra-brown-800">Total Pembayaran</span>
              <span className="text-2xl font-bold text-red-600">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-wastra-brown-200 shadow-2xl z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <p className="text-xs text-wastra-brown-500 mb-1">Total Pembayaran</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">
                {formatPrice(total)}
              </p>
            </div>
            <div className="w-full sm:w-auto flex gap-3">
              <Button
                size="large"
                className="flex-1 sm:flex-none bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white border-none h-12 px-8 sm:px-12 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all"
                disabled={!address}
                onClick={handleCheckout}
              >
                {!address ? 'Pilih Alamat Dulu' : 'Lanjutkan Pembayaran'}
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
                  rules={[
                    { 
                      required: true, 
                      message: 'Upload bukti transfer' 
                    },
                    {
                      validator: () => {
                        if (!proofFile) {
                          return Promise.reject(new Error('Upload bukti transfer'))
                        }
                        return Promise.resolve()
                      }
                    }
                  ]}
                  extra="Format: JPG, PNG, atau PDF (Maks. 5MB)"
                >
                  <Upload
                    beforeUpload={(file) => {
                      // Validasi file
                      const isImage = file.type.startsWith('image/')
                      const isPdf = file.type === 'application/pdf'
                      
                      if (!isImage && !isPdf) {
                        message.error('Hanya file gambar (JPG, PNG) atau PDF yang diizinkan!')
                        return Upload.LIST_ONLY
                      }
                      
                      const isLt5M = file.size / 1024 / 1024 < 5
                      if (!isLt5M) {
                        message.error('Ukuran file harus kurang dari 5MB!')
                        return Upload.LIST_ONLY
                      }
                      
                      // Simpan file ke state
                      setProofFile(file)
                      paymentForm.setFieldsValue({ proof: file })
                      
                      // Prevent auto upload
                      return false
                    }}
                    onRemove={() => {
                      setProofFile(null)
                      paymentForm.setFieldsValue({ proof: null })
                    }}
                    maxCount={1}
                    accept="image/*,.pdf"
                  >
                    <Button 
                      icon={<PaperClipIcon className="w-4 h-4" />}
                      className="rounded-lg"
                    >
                      Pilih File
                    </Button>
                  </Upload>
                  {proofFile && (
                    <div className="mt-2 p-3 bg-wastra-brown-50 rounded-lg border border-wastra-brown-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <PaperClipIcon className="w-5 h-5 text-wastra-brown-600 flex-shrink-0" />
                        <span className="text-sm text-wastra-brown-800 truncate">
                          {proofFile.name}
                        </span>
                        <span className="text-xs text-wastra-brown-500 flex-shrink-0">
                          ({(proofFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setProofFile(null)
                          paymentForm.setFieldsValue({ proof: null })
                        }}
                        className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}
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
                  setProofFile(null)
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

