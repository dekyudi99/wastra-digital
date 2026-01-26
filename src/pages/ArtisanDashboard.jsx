import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Statistic, Table, Tag, Button, Spin } from 'antd'
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'

import { formatPrice } from '../utils/format'
import userApi from '../api/UserApi'
import orderApi from '../api/OrderApi'

const ArtisanDashboard = () => {
  const navigate = useNavigate()

  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await userApi.profile()
      return res.data.data
    },
  })

  const { data: orderResponse, isLoading: loadingOrder } = useQuery({
    queryKey: ["ordersIn"],
    queryFn: () => orderApi.orderIn(),
  })

  const artisanOrderItems = orderResponse?.data?.data || []
  // 🛡️ Pastikan data adalah array untuk mencegah error ".filter is not a function"
  const safeItems = Array.isArray(artisanOrderItems) ? artisanOrderItems : []

  const statusConfig = {
    unpaid: { color: 'warning', label: 'Belum Bayar', hex: '#F59E0B' },
    paid: { color: 'processing', label: 'Sudah Bayar', hex: '#3B82F6' },
    processing: { color: 'blue', label: 'Diproses', hex: '#8B5CF6' },
    shipped: { color: 'cyan', label: 'Dikirim', hex: '#22C55E' },
    delivered: { color: 'success', label: 'Selesai', hex: '#0EA5E9' },
    cancelled: { color: 'error', label: 'Batal', hex: '#EF4444' },
  }

  // LOGIKA STATISTIK DENGAN DATA AMAN
  const totalRevenue = safeItems
    .filter(item => item.order?.status !== 'cancelled')
    .reduce((sum, item) => sum + (item.subtotal || 0), 0)

  const pendingOrdersCount = safeItems.filter(item => 
    ['paid', 'unpaid', 'processing'].includes(item.order?.status)
  ).length

  const uniqueProductsSold = [...new Set(safeItems.map(item => item.product_id))].length

  // CHART LOGIC
  const statusCounts = safeItems.reduce((acc, item) => {
    const status = item.order?.status || 'unpaid'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const statusData = Object.entries(statusConfig).map(([key, meta]) => ({
    status: key,
    ...meta,
    value: statusCounts[key] || 0,
  })).filter(item => item.value > 0)

  const statusTotal = statusData.reduce((sum, item) => sum + item.value, 0)

  const buildArc = (startAngle, endAngle) => {
    const cx = 80, cy = 80, rOut = 70, rIn = 45
    const polarToCartesian = (r, deg) => {
      const rad = (deg - 90) * (Math.PI / 180)
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
    }
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1
    const p1 = polarToCartesian(rOut, endAngle), p2 = polarToCartesian(rOut, startAngle)
    const p3 = polarToCartesian(rIn, startAngle), p4 = polarToCartesian(rIn, endAngle)
    return `M ${p1.x} ${p1.y} A ${rOut} ${rOut} 0 ${largeArc} 0 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rIn} ${rIn} 0 ${largeArc} 1 ${p4.x} ${p4.y} Z`
  }

  const pieSlices = (() => {
    let currentAngle = 0
    return statusData.map(item => {
      const angle = (item.value / statusTotal) * 360
      const slice = { ...item, startAngle: currentAngle, endAngle: currentAngle + angle }
      currentAngle += angle
      return slice
    })
  })()

  const columns = [
    {
      title: 'Invoice',
      dataIndex: ['order', 'invoice_number'],
      key: 'invoice',
      render: (text) => <span className="font-mono text-xs text-gray-500">{text}</span>,
    },
    {
      title: 'Produk',
      key: 'product',
      render: (_, record) => (
        <div>
          <div className="font-medium text-wastra-brown-800">{record.name_at_purchase}</div>
          <div className="text-xs text-gray-400">Qty: {record.quantity}</div>
        </div>
      )
    },
    {
      title: 'Pembeli',
      dataIndex: ['order', 'user', 'name'],
      key: 'customer',
      render: (name) => <span className="text-sm">{name || 'Customer'}</span>
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (val) => <span className="font-bold">{formatPrice(val)}</span>,
    },
    {
      title: 'Status',
      dataIndex: ['order', 'status'],
      key: 'status',
      render: (status) => {
        const config = statusConfig[status] || { color: 'default', label: status }
        return <Tag color={config.color}>{config.label.toUpperCase()}</Tag>
      },
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeIcon className="w-4 h-4" />}
          onClick={() => navigate(`/pengrajin/pesanan/${record.order_id}`)}
        >
          Detail
        </Button>
      ),
    },
  ]

  if (loadingUser || loadingOrder) return <div className="h-screen flex justify-center items-center"><Spin size="large" /></div>

  return (
    <div className="bg-wastra-brown-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-wastra-brown-900">Dashboard Pengrajin</h1>
          <p className="text-wastra-brown-600">Selamat datang, {userData?.name}.</p>
        </div>

        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}><Card borderless className="shadow-sm rounded-xl"><Statistic title="Produk Terjual" value={safeItems.length} prefix={<ShoppingBagIcon className="w-5 h-5 text-amber-600" />} /></Card></Col>
          <Col xs={24} sm={12} lg={6}><Card borderless className="shadow-sm rounded-xl"><Statistic title="Pesanan Aktif" value={pendingOrdersCount} valueStyle={{ color: '#F59E0B' }} prefix={<ClockIcon className="w-5 h-5" />} /></Card></Col>
          <Col xs={24} sm={12} lg={6}><Card borderless className="shadow-sm rounded-xl"><Statistic title="Total Pendapatan" value={totalRevenue} formatter={(v) => formatPrice(v)} valueStyle={{ color: '#059669' }} prefix={<CurrencyDollarIcon className="w-5 h-5" />} /></Card></Col>
          <Col xs={24} sm={12} lg={6}><Card borderless className="shadow-sm rounded-xl"><Statistic title="Jenis Produk" value={uniqueProductsSold} prefix={<ChartBarIcon className="w-5 h-5 text-blue-600" />} /></Card></Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card title="Distribusi Pesanan" className="shadow-sm rounded-xl h-full">
              {statusTotal === 0 ? <div className="text-center py-20 text-gray-400">Belum ada data</div> : (
                <div className="flex flex-col items-center">
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    {pieSlices.map(slice => <path key={slice.status} d={buildArc(slice.startAngle, slice.endAngle)} fill={slice.hex} stroke="#fff" strokeWidth="2" />)}
                    <circle cx="80" cy="80" r="32" fill="#fff" />
                    <text x="80" y="85" textAnchor="middle" className="text-xl font-bold fill-gray-700">{statusTotal}</text>
                  </svg>
                  <div className="w-full mt-6 space-y-2">
                    {statusData.map(s => (
                      <div key={s.status} className="flex justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.hex }} /><span>{s.label}</span></div>
                        <span className="font-bold">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </Col>
          <Col xs={24} lg={16}>
            <Card title="Pesanan Terbaru" className="shadow-sm rounded-xl h-full" extra={<Button type="link" onClick={() => navigate('/pengrajin/pesanan')}>Lihat Semua</Button>}>
              <Table columns={columns} dataSource={safeItems.slice(0, 5)} rowKey="id" pagination={false} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ArtisanDashboard