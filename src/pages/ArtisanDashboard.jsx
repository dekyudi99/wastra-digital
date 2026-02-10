import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Statistic, Table, Tag, Button, Spin } from 'antd'
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { formatPrice } from '../utils/format'
import userApi from '../api/UserApi'
import orderApi from '../api/OrderApi'

const STATUS_CONFIG = {
  unpaid: { color: 'warning', label: 'Belum Bayar', hex: '#F59E0B' },
  paid: { color: 'processing', label: 'Menunggu', hex: '#3B82F6' },
  processing: { color: 'blue', label: 'Diproses', hex: '#8B5CF6' },
  shipped: { color: 'cyan', label: 'Dikirim', hex: '#22C55E' },
  delivered: { color: 'success', label: 'Selesai', hex: '#0EA5E9' },
  cancelled: { color: 'error', label: 'Batal', hex: '#EF4444' },
}

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

  const orders = Array.isArray(orderResponse?.data?.data) ? orderResponse.data.data : []

  // Statistik: Menghitung total pendapatan dari item milik pengrajin di semua order
  const totalRevenue = orders.reduce((sum, order) => {
    const itemSum = order.item?.reduce((s, i) => s + (i.status !== 'cancelled' ? i.subtotal : 0), 0) || 0
    return sum + itemSum
  }, 0)

  const activeOrdersCount = orders.filter(o => ['paid', 'processing'].includes(o.status)).length

  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'invoice_number',
      render: (text) => <span className="font-mono text-xs text-gray-500">{text}</span>,
    },
    {
      title: 'Pembeli',
      dataIndex: ['user', 'name'],
      render: (name) => <span className="text-sm font-medium">{name}</span>
    },
    {
      title: 'Jumlah Produk',
      dataIndex: 'item',
      render: (items) => <Tag color="default">{items?.length || 0} Produk</Tag>,
    },
    {
      title: 'Status Pesanan',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={STATUS_CONFIG[status]?.color}>
          {STATUS_CONFIG[status]?.label.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeIcon className="w-4 h-4" />}
          onClick={() => navigate(`/pengrajin/pesanan/${record.id}`)}
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
          <p className="text-wastra-brown-600">Selamat datang kembali, {userData?.name}.</p>
        </div>

        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} md={8}>
            <Card borderless className="shadow-sm rounded-xl">
              <Statistic title="Total Pendapatan" value={totalRevenue} formatter={formatPrice} valueStyle={{ color: '#059669' }} prefix={<CurrencyDollarIcon className="w-5 h-5" />} />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card borderless className="shadow-sm rounded-xl">
              <Statistic title="Pesanan Aktif" value={activeOrdersCount} valueStyle={{ color: '#3B82F6' }} prefix={<ClockIcon className="w-5 h-5" />} />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card borderless className="shadow-sm rounded-xl">
              <Statistic title="Total Transaksi" value={orders.length} prefix={<ShoppingBagIcon className="w-5 h-5 text-amber-600" />} />
            </Card>
          </Col>
        </Row>

        <Card title="Pesanan Terbaru" className="shadow-sm rounded-xl" extra={<Button type="link" onClick={() => navigate('/pengrajin/pesanan')}>Lihat Semua</Button>}>
          <Table columns={columns} dataSource={orders.slice(0, 5)} rowKey="id" pagination={false} />
        </Card>
      </div>
    </div>
  )
}

export default ArtisanDashboard