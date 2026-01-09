import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card, Row, Col, Input, Select, Button, Tag } from 'antd'
import { 
  MagnifyingGlassIcon,
  FunnelIcon 
} from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'
import { mockProducts } from '../utils/mockProducts'

const { Search } = Input
const { Option } = Select

const ProductCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams()
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
      product.artisan.toLowerCase().includes(filters.search.toLowerCase())

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
    <div className="w-full bg-white">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 max-w-7xl py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Katalog Produk</h1>
          <p className="text-gray-600">
            Temukan koleksi kain tradisional endek dan songket dari pengrajin 
            terbaik Desa Sidemen
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Filter Produk</h2>
          </div>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
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
        <Row gutter={[16, 24]} justify="start">
        {filteredProducts.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Link to={`/produk/${product.id}`} className="block w-full h-full">
              <Card
                hoverable
                cover={
                  <div className="h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">
                      {product.name}
                    </span>
                  </div>
                }
                className="h-full w-full"
              >
                <div className="mb-2">
                  <Tag color={product.category === 'endek' ? 'blue' : 'gold'}>
                    {product.category === 'endek' ? 'Endek' : 'Songket'}
                  </Tag>
                </div>
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  Toko: {product.artisan.name}
                </p>
                <p className="text-xl font-bold text-wastra-red">
                  {formatPrice(product.price)}
                </p>
              </Card>
            </Link>
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

