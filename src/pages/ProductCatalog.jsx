import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Row, Col, Input, Select, Button, Tag } from 'antd'
import { 
  MagnifyingGlassIcon,
  FunnelIcon 
} from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'

const { Search } = Input
const { Option } = Select

const ProductCatalog = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priceRange: 'all',
  })

  // Mock data - akan diganti dengan data dari API nanti
  const products = [
    {
      id: 1,
      name: 'Kain Endek Sidemen Motif Geometris',
      price: 350000,
      image: '/placeholder-endek.jpg',
      category: 'endek',
      artisan: 'Ibu Made Sari',
    },
    {
      id: 2,
      name: 'Kain Songket Emas Klasik',
      price: 850000,
      image: '/placeholder-songket.jpg',
      category: 'songket',
      artisan: 'Ibu Ketut Sari',
    },
    {
      id: 3,
      name: 'Kain Endek Modern Pattern',
      price: 420000,
      image: '/placeholder-endek-2.jpg',
      category: 'endek',
      artisan: 'Ibu Wayan Sari',
    },
    {
      id: 4,
      name: 'Kain Songket Tradisional Bali',
      price: 950000,
      image: '/placeholder-songket-2.jpg',
      category: 'songket',
      artisan: 'Ibu Made Sari',
    },
  ]


  return (
    <div className="container mx-auto px-4 py-8">
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
              prefix={<MagnifyingGlassIcon className="w-5 h-5" />}
              onSearch={(value) => 
                setFilters({ ...filters, search: value })
              }
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
      <Row gutter={[24, 24]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Link to={`/produk/${product.id}`}>
              <Card
                hoverable
                cover={
                  <div className="h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">
                      {product.name}
                    </span>
                  </div>
                }
                className="h-full"
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
                  Toko: {product.artisan}
                </p>
                <p className="text-xl font-bold text-wastra-red">
                  {formatPrice(product.price)}
                </p>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-wastra-light-medium text-lg">
            Tidak ada produk yang ditemukan
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductCatalog

