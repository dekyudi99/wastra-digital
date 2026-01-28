import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Table, Button, Statistic, Tag, Space, Spin } from 'antd'
import {
  ShoppingBagIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { formatPrice } from '../utils/format'
import orderApi from '../api/OrderApi' // Sesuaikan dengan file API Anda

const COMMISSION_RATE = 0.1

const AdminDashboard = () => {
  const navigate = useNavigate()

  // --- FETCH DATA DARI API ---
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => orderApi.adminDashboardStats(), // Panggil fungsi backend tadi
  })

  const dashboardData = apiResponse?.data?.data

  const statsCards = [
    { title: 'Pengrajin Aktif', value: dashboardData?.stats?.artisans || 0, icon: <UserGroupIcon className="w-6 h-6" />, color: '#78350F' },
    { title: 'Produk Aktif', value: dashboardData?.stats?.products || 0, icon: <ShoppingBagIcon className="w-6 h-6" />, color: '#A16207' },
    { title: 'Pesanan Berjalan', value: dashboardData?.stats?.ongoing_orders || 0, icon: <TruckIcon className="w-6 h-6" />, color: '#0EA5E9' },
  ]

  if (isLoading) return <div className="h-screen flex justify-center items-center"><Spin size="large" tip="Memuat Statistik..." /></div>

  return (
    <div className="w-full px-3 sm:px-4 max-w-7xl mx-auto py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-wastra-brown-900">Admin BUMDes</h1>
        <p className="text-gray-600">Statistik real-time aktivitas platform Wastra Digital.</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        {statsCards.map((item) => (
          <Col xs={24} sm={12} md={6} key={item.title}>
            <Card borderless className="shadow-sm rounded-xl">
              <Statistic title={item.title} value={item.value} prefix={item.icon} valueStyle={{ color: item.color, fontWeight: 700 }} />
            </Card>
          </Col>
        ))}
        <Col xs={24} sm={12} md={6}>
          <Card borderless className="shadow-sm rounded-xl bg-green-50">
            <Statistic 
              title="Komisi BUMDes (10%)" 
              value={dashboardData?.stats?.commission || 0} 
              formatter={formatPrice} 
              valueStyle={{ color: '#059669', fontWeight: 700 }} 
            />
          </Card>
        </Col>
      </Row>

      {/* Grafik Pendapatan */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24}>
          <Card title="Tren Pendapatan Platform" className="rounded-xl shadow-sm">
            <div className="h-64 flex items-end justify-between gap-4">
              {dashboardData?.revenue_chart?.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center group">
                  <div className="text-[10px] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatPrice(item.total)}
                  </div>
                  <div 
                    className="w-full bg-wastra-brown-400 rounded-t-lg transition-all hover:bg-wastra-brown-600"
                    style={{ height: `${(item.total / dashboardData.stats.total_revenue) * 100}%`, minHeight: '10%' }}
                  />
                  <div className="text-xs mt-2 text-gray-500 font-medium">{item.month}</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Top Pengrajin Table */}
      <Card title="Performa Pengrajin Terbaik" className="rounded-xl shadow-sm">
        <Table 
          dataSource={dashboardData?.top_artisans} 
          rowKey="id"
          pagination={false}
          columns={[
            { title: 'Nama Pengrajin', dataIndex: 'name', key: 'name', render: (t) => <strong>{t}</strong> },
            { title: 'Email', dataIndex: 'email', key: 'email' },
            { title: 'Total Item Terjual', dataIndex: 'items_sold', key: 'sold', align: 'center', render: (v) => <Tag color="blue">{v || 0} Produk</Tag> }
          ]}
        />
      </Card>
    </div>
  )
}

export default AdminDashboard