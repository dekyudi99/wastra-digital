import { useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, Row, Col, Table, Statistic, Tag, Spin } from 'antd'
import {
  ShoppingBagIcon,
  UserGroupIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { formatPrice } from '../utils/format'
import orderApi from '../api/OrderApi'
import adminApi from '../api/AdminApi'

const COMMISSION_RATE = 0.1

// =============================
// 🔹 DUMMY DATA
// =============================
const dummyDashboard = {
  stats: {
    ongoing_orders: 12,
    commission: 1250000,
    total_revenue: 12500000,
  },
  revenue_chart: [
    { month: 'Jan', total: 2000000 },
    { month: 'Feb', total: 1800000 },
    { month: 'Mar', total: 2500000 },
    { month: 'Apr', total: 1500000 },
    { month: 'Mei', total: 3000000 },
    { month: 'Jun', total: 2200000 },
  ],
  top_artisans: [
    { id: 1, name: 'I Wayan Tenun', email: 'wayan@email.com', items_sold: 45 },
    { id: 2, name: 'Ni Luh Wastra', email: 'luh@email.com', items_sold: 38 },
    { id: 3, name: 'Made Kain', email: 'made@email.com', items_sold: 29 },
  ],
}

const AdminDashboard = () => {
  const navigate = useNavigate()

  // =========================================
  // 🔹 API (optional - fallback ke dummy)
  // =========================================
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => orderApi.adminDashboardStats(),
    retry: false,
  })

  const { data: totalP } = useQuery({
    queryKey: ['totalP'],
    queryFn: adminApi.totalPendaftaran,
    retry: false,
  })

  const { data: totalA } = useQuery({
    queryKey: ['totalA'],
    queryFn: adminApi.totalActiveArtisan,
    retry: false,
  })

  // =========================================
  // 🔹 SAFE DATA HANDLING
  // =========================================
  const dashboardData =
    apiResponse?.data?.data ?? dummyDashboard

  const totalPendaftaran =
    totalP?.data?.data?.total ?? 8

  const totalActiveArtisan =
    totalA?.data?.data?.total ?? 15

  // =========================================
  // 🔹 STAT CARDS
  // =========================================
  const statsCards = [
    {
      title: 'Pengrajin Aktif',
      value: totalActiveArtisan,
      icon: <UserGroupIcon className="w-6 h-6" />,
      color: '#78350F',
      url: '',
    },
    {
      title: 'Pendaftaran Pengrajin',
      value: totalPendaftaran,
      icon: <ShoppingBagIcon className="w-6 h-6" />,
      color: '#A16207',
      url: 'pengrajin/daftar',
    },
    {
      title: 'Pesanan Berjalan',
      value: dashboardData.stats.ongoing_orders,
      icon: <TruckIcon className="w-6 h-6" />,
      color: '#0EA5E9',
      url: '',
    },
  ]

  return (
    <div className="w-full px-3 sm:px-4 max-w-7xl mx-auto py-6 sm:py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-wastra-brown-900">
          Admin BUMDes
        </h1>
        <p className="text-gray-600">
          Statistik real-time aktivitas platform Wastra Digital.
        </p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        {statsCards.map((item) => (
          <Col xs={24} sm={12} md={6} key={item.title}>
            <Link to={item.url}>
              <Card borderless className="shadow-sm rounded-xl">
                <Statistic
                  title={item.title}
                  value={item.value}
                  prefix={item.icon}
                  valueStyle={{
                    color: item.color,
                    fontWeight: 700,
                  }}
                />
              </Card>
            </Link>
          </Col>
        ))}

        <Col xs={24} sm={12} md={6}>
          <Card
            borderless
            className="shadow-sm rounded-xl bg-green-50"
          >
            <Statistic
              title="Komisi BUMDes (10%)"
              value={dashboardData.stats.commission}
              formatter={formatPrice}
              valueStyle={{
                color: '#059669',
                fontWeight: 700,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue Chart */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24}>
          <Card
            title="Tren Pendapatan Platform"
            className="rounded-xl shadow-sm"
          >
            <div className="h-64 flex items-end justify-between gap-4">
              {dashboardData.revenue_chart.map((item, idx) => {
                const percentage =
                  dashboardData.stats.total_revenue > 0
                    ? (item.total /
                        dashboardData.stats.total_revenue) *
                      100
                    : 10

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center group"
                  >
                    <div className="text-[10px] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatPrice(item.total)}
                    </div>

                    <div
                      className="w-full bg-wastra-brown-400 rounded-t-lg transition-all hover:bg-wastra-brown-600"
                      style={{
                        height: `${percentage}%`,
                        minHeight: '10%',
                      }}
                    />

                    <div className="text-xs mt-2 text-gray-500 font-medium">
                      {item.month}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Top Artisans */}
      <Card
        title="Performa Pengrajin Terbaik"
        className="rounded-xl shadow-sm"
      >
        <Table
          dataSource={dashboardData.top_artisans}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: 'Nama Pengrajin',
              dataIndex: 'name',
              key: 'name',
              render: (t) => <strong>{t}</strong>,
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
            },
            {
              title: 'Total Item Terjual',
              dataIndex: 'items_sold',
              key: 'sold',
              align: 'center',
              render: (v) => (
                <Tag color="blue">
                  {v || 0} Produk
                </Tag>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}

export default AdminDashboard
