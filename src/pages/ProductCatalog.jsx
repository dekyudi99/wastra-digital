import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Input, Select, Button, Tag, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'
import { mockProducts } from '../utils/mockProducts'
import { useCart } from '../contexts/CartContext'
import { useUser } from '../contexts/UserContext'
import { USER_ROLES } from '../utils/authRoles'

const { Search } = Input
const { Option } = Select

const ProductCatalog = () => {
  const navigate = useNavigate()
  const { cartItems, setCartItems } = useCart()
  const { isAuthenticated, hasRole } = useUser()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const isArtisan = hasRole(USER_ROLES.ARTISAN)
  const searchQuery = searchParams.get('search') || ''
  
  const [filters, setFilters] = useState({
    search: searchQuery,
    category: 'all',
    priceRange: 'all',
  })

  // Update filter search ketika query parameter berubah
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: searchQuery
    }))
  }, [searchQuery])

  const products = mockProducts

  // Filter products berdasarkan search, category, dan priceRange
  const filteredProducts = products.filter((product) => {
    // Filter berdasarkan pencarian (nama produk atau artisan)
    const matchesSearch = filters.search === '' || 
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (product.artisan?.name || '').toLowerCase().includes(filters.search.toLowerCase())

    // Filter berdasarkan kategori
    const matchesCategory = filters.category === 'all' || 
      product.category === filters.category

    // Filter berdasarkan rentang harga
    let matchesPriceRange = true
    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'low':
          matchesPriceRange = product.price >= 0 && product.price <= 500000
          break
        case 'medium':
          matchesPriceRange = product.price > 500000 && product.price <= 1000000
          break
        case 'high':
          matchesPriceRange = product.price > 1000000
          break
        default:
          matchesPriceRange = true
      }
    }

    return matchesSearch && matchesCategory && matchesPriceRange
  })

  return (
    <div className="w-full bg-white overflow-x-hidden">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto py-3 sm:py-4 md:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Katalog Produk</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">
            Temukan koleksi kain tradisional endek dan songket dari pengrajin 
            terbaik Desa Sidemen
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            <h2 className="text-base sm:text-lg font-semibold">Filter Produk</h2>
          </div>
          <Row gutter={[8, 8]} className="!mx-0">
            <Col xs={24} sm={12} md={8} className="!px-2 sm:!px-2 md:!px-3">
              <Search
                placeholder="Cari produk..."
                allowClear
                enterButton
                size="large"
                value={filters.search}
                prefix={<MagnifyingGlassIcon className="w-5 h-5" />}
                onChange={(e) => {
                  const value = e.target.value
                  setFilters({ ...filters, search: value })
                  // Update URL query parameter
                  if (value) {
                    setSearchParams({ search: value })
                  } else {
                    setSearchParams({})
                  }
                }}
                onSearch={value => {
                  setFilters({ ...filters, search: value })
                  // Update URL query parameter
                  if (value) {
                    setSearchParams({ search: value })
                  } else {
                    setSearchParams({})
                  }
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Kategori"
                size="large"
                className="w-full"
                value={filters.category}
                onChange={(value) => 
                  setFilters({ ...filters, category: value })
                }
              >
                <Option value="all">Semua Kategori</Option>
                <Option value="endek">Endek</Option>
                <Option value="songket">Songket</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Rentang Harga"
                size="large"
                className="w-full"
                value={filters.priceRange}
                onChange={(value) => 
                  setFilters({ ...filters, priceRange: value })
                }
              >
                <Option value="all">Semua Harga</Option>
                <Option value="low">Rp 0 - Rp 500.000</Option>
                <Option value="medium">Rp 500.000 - Rp 1.000.000</Option>
                <Option value="high">Rp 1.000.000+</Option>
              </Select>
            </Col>
          </Row>
        </div>

        {/* Products Grid */}
        <Row gutter={[8, 12]} className="!mx-0" justify="start">
        {filteredProducts.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id} className="!px-2 sm:!px-2 md:!px-3">
            <Card
              hoverable
              cover={
                <Link to={`/produk/${product.id}`} className="block">
                  <div className="h-40 sm:h-48 md:h-56 lg:h-64 bg-gray-200 flex items-center justify-center cursor-pointer hover:opacity-90 transition">
                    <span className="text-gray-400 text-xs sm:text-sm text-center px-2">
                      {product.name}
                    </span>
                  </div>
                </Link>
              }
              className="h-full w-full flex flex-col"
              bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '12px' }}
            >
              <Link to={`/produk/${product.id}`} className="flex-1">
                <div className="mb-1 sm:mb-2">
                  <Tag color={product.category === 'endek' ? 'blue' : 'gold'} className="text-xs">
                    {product.category === 'endek' ? 'Endek' : 'Songket'}
                  </Tag>
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 line-clamp-2 hover:text-wastra-brown-600 transition">
                  {product.name}
                </h3>
                <Link to={`/artisan/${product.artisan.id}`} className="block mb-1 sm:mb-2">
                  <p className="text-gray-600 text-xs sm:text-sm hover:text-wastra-brown-600 transition">
                    Toko: {product.artisan.name}
                  </p>
                </Link>
                <p className="text-base sm:text-lg md:text-xl font-bold text-wastra-red mb-2 sm:mb-3">
                  {formatPrice(product.price)}
                </p>
              </Link>
              <div className="flex flex-col gap-2 mt-auto">
                <Button
                  type="default"
                  block
                  icon={<ShoppingCartIcon className="w-4 h-4" />}
                  className="border-wastra-brown-600 text-wastra-brown-600 hover:bg-wastra-brown-50 h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                  disabled={isArtisan}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    
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
                          navigate(`/onboarding?redirect=${encodeURIComponent(`/produk/${product.id}`)}`)
                        },
                      })
                      return
                    }
                    
                    // Tambahkan produk ke cart tanpa selected (tidak langsung checkout)
                    const existingItem = cartItems.find(item => item.id === product.id)
                    if (existingItem) {
                      // Jika sudah ada, update quantity saja
                      setCartItems(cartItems.map(item =>
                        item.id === product.id
                          ? { ...item, quantity: item.quantity + 1 }
                          : item
                      ))
                    } else {
                      // Jika belum ada, tambahkan dengan selected: false
                      setCartItems([
                        ...cartItems,
                        {
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          quantity: 1,
                          image: product.images?.[0] || '',
                          thumbnail: product.images?.[0] || '',
                          selected: false,
                          seller: product.artisan.name,
                        },
                      ])
                    }
                    
                    message.success('Produk berhasil ditambahkan ke keranjang!')
                  }}
                >
                  Tambah ke Keranjang
                </Button>
                <Button
                  type="primary"
                  block
                  className="bg-red-600 hover:bg-red-700 border-none h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                  disabled={isArtisan}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    
                    if (isArtisan) {
                      Modal.warning({
                        title: 'Akses Dibatasi',
                        icon: <ExclamationCircleOutlined />,
                        content: 'Pengrajin tidak dapat melakukan checkout produk. Silakan gunakan akun pembeli untuk melakukan pembelian.',
                      })
                      return
                    }
                    
                    if (!isAuthenticated) {
                      Modal.confirm({
                        title: 'Login Diperlukan',
                        icon: <ExclamationCircleOutlined />,
                        content: 'Silakan login terlebih dahulu untuk memesan produk.',
                        okText: 'Login',
                        cancelText: 'Batal',
                        okType: 'primary',
                        onOk: () => {
                          navigate(`/onboarding?redirect=${encodeURIComponent(`/produk/${product.id}`)}`)
                        },
                      })
                      return
                    }
                    
                    // Tambahkan produk ke cart dengan selected: true
                    const existingItem = cartItems.find(item => item.id === product.id)
                    if (existingItem) {
                      // Jika sudah ada, update quantity dan set selected
                      setCartItems(cartItems.map(item =>
                        item.id === product.id
                          ? { ...item, quantity: item.quantity + 1, selected: true }
                          : item
                      ))
                    } else {
                      // Jika belum ada, tambahkan dengan selected: true
                      setCartItems([
                        ...cartItems,
                        {
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          quantity: 1,
                          image: product.images?.[0] || '',
                          thumbnail: product.images?.[0] || '',
                          selected: true,
                          seller: product.artisan.name,
                        },
                      ])
                    }
                    
                    // Navigate ke checkout
                    navigate('/checkout')
                  }}
                >
                  Pesan Sekarang
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-wastra-light-medium text-lg">
              Tidak ada produk yang ditemukan
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCatalog

