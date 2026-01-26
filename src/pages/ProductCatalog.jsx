import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Card, Row, Col, Input, Select, Button, Tag, Modal, message, Spin } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  ShoppingCartIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'

import productApi from '../api/ProductApi'
import { formatPrice } from '../utils/format'
import orderApi from '../api/OrderApi'

const { Search } = Input
const { Option } = Select

const PRICE_MAP = {
  low: '0-500000',
  medium: '500000-1000000',
  high: '1000000+',
}

const ProductCatalog = () => {
  const token = localStorage.getItem("AUTH_TOKEN")
  const isAuthenticated = !!token

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const isArtisan = localStorage.getItem("ROLE") === 'artisan'

  // 🔑 SOURCE OF TRUTH DARI URL
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || 'all'
  const price = searchParams.get('price') || 'all'
  const queryClient = useQueryClient()

  // 🔑 QUERY KE BACKEND
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', search, category, price],
    queryFn: async () => {
      const res = await productApi.get({
        search: search || undefined,
        category: category !== 'all' ? category : undefined,
        price: price !== 'all' ? PRICE_MAP[price] : undefined,
      })
      return res.data.data || []
    },
  })

  const addCart = useMutation({
    mutationFn: ({ id, quantity }) =>
      orderApi.addCart(id, quantity),
    onSuccess: () => {
      message.success('Produk ditambahkan ke keranjang')
      queryClient.invalidateQueries({ queryKey: ["cartCount"] })
    },
    onError: (error) => {
      message.error(
        error?.response?.data?.message || 'Gagal menambahkan ke keranjang'
      )
    },
  })

  const updateParams = (key, value) => {
    const params = Object.fromEntries(searchParams.entries())

    if (!value || value === 'all') {
      delete params[key]
    } else {
      params[key] = value
    }

    setSearchParams(params)
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Katalog Produk</h1>
          <p className="text-gray-600">
            Temukan produk kain tradisional terbaik
          </p>
        </div>

        {/* FILTER */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FunnelIcon className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold">Filter Produk</h2>
          </div>

          <Row gutter={[12, 12]}>
            <Col xs={24} md={8}>
              <Search
                placeholder="Cari produk..."
                allowClear
                value={search}
                onChange={(e) => updateParams('search', e.target.value)}
                onSearch={(value) => updateParams('search', value)}
              />
            </Col>

            <Col xs={24} md={8}>
              <Select
                className="w-full"
                value={category}
                onChange={(value) => updateParams('category', value)}
              >
                <Option value="all">Semua Kategori</Option>
                <Option value="Endek">Endek</Option>
                <Option value="Songket">Songket</Option>
              </Select>
            </Col>

            <Col xs={24} md={8}>
              <Select
                className="w-full"
                value={price}
                onChange={(value) => updateParams('price', value)}
              >
                <Option value="all">Semua Harga</Option>
                <Option value="low">Rp 0 - 500.000</Option>
                <Option value="medium">Rp 500.000 - 1.000.000</Option>
                <Option value="high">Rp 1.000.000+</Option>
              </Select>
            </Col>
          </Row>
        </div>

        {/* PRODUCT GRID */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id} >
                <Card
                  hoverable
                  cover={
                    <Link to={`/produk/${product.id}`}>
                      <img
                        src={product.image_url?.[0]}
                        alt={product.name}
                        className="h-48 w-full object-cover"
                      />
                    </Link>
                  }
                  className='h-[420px]'
                >
                  <div className='h-full flex flex-col justify-between space-y-4'>
                    <div className='flex flex-row'>
                      <Tag color={product.category === 'Endek'? `blue`: 'orange'}>{product.category}</Tag>
                      <Tag color='red' className={product.discount !== 0 && product.discount !== null? '' : 'hidden'}>Hemat {product.discount}%</Tag>
                    </div>

                    <h3 className="font-semibold line-clamp-2 text-ellipsis h-[48px]">
                      {product.name}
                    </h3>

                    <p className="text-lg font-bold text-red-600">
                      {formatPrice(product.last_price)}
                    </p>

                    <Button
                      block
                      icon={<ShoppingCartIcon className="w-4 h-4" />}
                      disabled={isArtisan || addCart.isLoading}
                      onClick={() => {
                        if (isArtisan) {
                          Modal.warning({
                            title: 'Akses Dibatasi',
                            icon: <ExclamationCircleOutlined />,
                            content: 'Pengrajin tidak dapat membeli produk.',
                          })
                          return
                        }

                        if (!isAuthenticated) {
                          Modal.confirm({
                            title: 'Login Diperlukan',
                            onOk: () =>
                              navigate(
                                `/onboarding?redirect=${encodeURIComponent(
                                  `/produk/${product.id}`
                                )}`
                              ),
                          })
                          return
                        }

                        addCart.mutate({
                          id: product.id,
                          quantity: 1,
                        })
                      }}
                    >
                      Tambah ke Keranjang
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {!isLoading && products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Tidak ada produk ditemukan
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCatalog
