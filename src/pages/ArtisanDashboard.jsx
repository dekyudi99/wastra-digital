import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Statistic, Table, Tag, Button, Space } from 'antd'
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
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

  // Distribusi status untuk pie
  const statusConfig = {
    pending: { color: '#F59E0B', label: 'Menunggu' },
    processing: { color: '#3B82F6', label: 'Diproses' },
    shipped: { color: '#22C55E', label: 'Dikirim' },
    delivered: { color: '#0EA5E9', label: 'Selesai' },
    cancelled: { color: '#EF4444', label: 'Batal' },
  }
  const statusData = Object.entries(statusConfig).map(([key, meta]) => ({
    status: key,
    ...meta,
    value: artisanOrders.filter(o => o.status === key).length,
  })).filter(item => item.value > 0)
  const statusTotal = statusData.reduce((sum, item) => sum + item.value, 0)

  // Utility untuk membuat path pie sederhana (donut)
  const buildArc = (startAngle, endAngle, radiusOuter = 70, radiusInner = 40, cx = 80, cy = 80) => {
    const polarToCartesian = (r, angleDeg) => {
      const rad = (angleDeg - 90) * (Math.PI / 180)
      return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
      }
    }
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1
    const startOuter = polarToCartesian(radiusOuter, endAngle)
    const endOuter = polarToCartesian(radiusOuter, startAngle)
    const startInner = polarToCartesian(radiusInner, startAngle)
    const endInner = polarToCartesian(radiusInner, endAngle)

    return [
      'M', startOuter.x, startOuter.y,
      'A', radiusOuter, radiusOuter, 0, largeArc, 0, endOuter.x, endOuter.y,
      'L', startInner.x, startInner.y,
      'A', radiusInner, radiusInner, 0, largeArc, 1, endInner.x, endInner.y,
      'Z',
    ].join(' ')
  }

  const pieSlices = (() => {
    if (!statusTotal) return []
    let currentAngle = 0
    return statusData.map(item => {
      const angle = (item.value / statusTotal) * 360
      const slice = {
        ...item,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
      }
      currentAngle += angle
      return slice
    })
  })()

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

        {/* Pie Chart Status Pesanan */}
        <Card className="mb-6 border border-wastra-brown-100 rounded-xl" title="Distribusi Status Pesanan">
          {statusTotal === 0 ? (
            <div className="text-center py-6 text-wastra-brown-500">
              Belum ada pesanan untuk ditampilkan
            </div>
          ) : (
            <div className="flex flex-wrap gap-6 items-center">
              <div className="relative" style={{ width: 160, height: 160 }}>
                <svg width="160" height="160" viewBox="0 0 160 160">
                  {pieSlices.map((slice, idx) => (
                    <path
                      key={slice.status}
                      d={buildArc(slice.startAngle, slice.endAngle)}
                      fill={slice.color}
                      stroke="#fff"
                      strokeWidth="2"
                      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))' }}
                    />
                  ))}
                  <circle cx="80" cy="80" r="28" fill="#fff" />
                  <text x="80" y="76" textAnchor="middle" className="text-sm font-semibold fill-wastra-brown-800">
                    {totalOrders}
                  </text>
                  <text x="80" y="94" textAnchor="middle" className="text-[10px] fill-wastra-brown-500">
                    total
                  </text>
                </svg>
              </div>
              <div className="flex-1 min-w-[200px] grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pieSlices.map(slice => (
                  <div key={slice.status} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-wastra-brown-100">
                    <span className="w-3 h-3 rounded-full" style={{ background: slice.color }} />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-wastra-brown-800">{slice.label}</div>
                      <div className="text-xs text-wastra-brown-500">
                        {slice.value} pesanan ({Math.round((slice.value / statusTotal) * 100)}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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


