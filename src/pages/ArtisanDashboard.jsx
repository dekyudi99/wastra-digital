import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Statistic, Table, Tag, Button, Space } from 'antd'
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { useUser } from '../contexts/UserContext'
import { formatPrice } from '../utils/format'

const ArtisanDashboard = () => {
  const navigate = useNavigate()
  const { user, orders } = useUser()

  // Filter orders untuk pengrajin ini (berdasarkan seller/artisan)
  const artisanOrders = orders.filter(order => 
    order.items?.some(item => item.seller === user?.name) || 
    order.seller === user?.name
  )

  // Statistik
  const totalProducts = 12 // Mock - akan dari context nanti
  const totalOrders = artisanOrders.length
  const pendingOrders = artisanOrders.filter(o => o.status === 'pending' || o.status === 'processing').length
  const totalRevenue = artisanOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => sum + (order.total || 0), 0)

  // Recent orders untuk tabel
  const recentOrders = artisanOrders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const columns = [
    {
      title: 'ID Pesanan',
      dataIndex: 'id',
      key: 'id',
      render: (id) => `#${id.slice(0, 8)}`,
    },
    {
      title: 'Pembeli',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => formatPrice(total),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          pending: { color: 'orange', label: 'Menunggu Pembayaran' },
          processing: { color: 'blue', label: 'Diproses' },
          shipped: { color: 'cyan', label: 'Dikirim' },
          delivered: { color: 'green', label: 'Selesai' },
          cancelled: { color: 'red', label: 'Dibatalkan' },
        }
        const config = statusConfig[status] || { color: 'default', label: status }
        return <Tag color={config.color}>{config.label}</Tag>
      },
    },
    {
      title: 'Tanggal',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('id-ID'),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeIcon className="w-4 h-4" />}
            onClick={() => navigate(`/pengrajin/pesanan/${record.id}`)}
          >
            Detail
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="bg-wastra-brown-50 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-wastra-brown-800">Dashboard Pengrajin</h1>
          <p className="text-wastra-brown-600 mt-2">
            Kelola produk dan pesanan Anda dengan mudah
          </p>
        </div>

        {/* Statistik Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card className="border border-wastra-brown-100 rounded-xl">
              <Statistic
                title="Total Produk"
                value={totalProducts}
                prefix={<ShoppingBagIcon className="w-5 h-5 text-wastra-brown-600" />}
                valueStyle={{ color: '#78350F' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="border border-wastra-brown-100 rounded-xl">
              <Statistic
                title="Total Pesanan"
                value={totalOrders}
                prefix={<ChartBarIcon className="w-5 h-5 text-wastra-brown-600" />}
                valueStyle={{ color: '#78350F' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="border border-wastra-brown-100 rounded-xl">
              <Statistic
                title="Pesanan Pending"
                value={pendingOrders}
                prefix={<ClockIcon className="w-5 h-5 text-wastra-brown-600" />}
                valueStyle={{ color: '#F59E0B' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="border border-wastra-brown-100 rounded-xl">
              <Statistic
                title="Total Pendapatan"
                value={totalRevenue}
                prefix={<CurrencyDollarIcon className="w-5 h-5 text-wastra-brown-600" />}
                formatter={(value) => formatPrice(value)}
                valueStyle={{ color: '#059669' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Card className="mb-6 border border-wastra-brown-100 rounded-xl">
          <div className="flex flex-wrap gap-3">
            <Button
              type="primary"
              icon={<PlusIcon className="w-5 h-5" />}
              onClick={() => navigate('/pengrajin/produk/tambah')}
              className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
            >
              Tambah Produk Baru
            </Button>
            <Button
              icon={<ShoppingBagIcon className="w-5 h-5" />}
              onClick={() => navigate('/pengrajin/produk')}
            >
              Kelola Produk
            </Button>
            <Button
              icon={<ChartBarIcon className="w-5 h-5" />}
              onClick={() => navigate('/pengrajin/pesanan')}
            >
              Lihat Semua Pesanan
            </Button>
          </div>
        </Card>

        {/* Recent Orders */}
        <Card
          title="Pesanan Terbaru"
          className="border border-wastra-brown-100 rounded-xl"
          extra={
            <Button type="link" onClick={() => navigate('/pengrajin/pesanan')}>
              Lihat Semua
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={recentOrders}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: 'Belum ada pesanan',
            }}
          />
        </Card>
      </div>
    </div>
  )
}

export default ArtisanDashboard


