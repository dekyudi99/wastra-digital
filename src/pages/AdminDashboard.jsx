import { useMemo } from 'react'
import { Card, Row, Col, Table, Button, Statistic, Tag, Space } from 'antd'
import {
  ShoppingBagIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  DocumentCheckIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline'
import { useUser } from '../contexts/UserContext'
import { formatPrice } from '../utils/format'

const COMMISSION_RATE = 0.1 // 10% komisi BUMDes

const AdminDashboard = () => {
  const { orders } = useUser()

  // Dummy statistics untuk komisi pendapatan bulan ini
  const commissionStats = useMemo(() => {
    // Dummy data - bisa diganti dengan perhitungan real dari orders nanti
    const dummyStats = {
      totalRevenue: 125000000, // Rp 125.000.000
      totalCommission: 12500000, // Rp 12.500.000 (10%)
      orderCount: 47,
      lastMonthCommission: 10800000, // Rp 10.800.000
      commissionChange: 15.7, // +15.7%
    }

    // Jika ada data orders real, gunakan data real
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const deliveredThisMonth = orders.filter(order => {
      if (order.status !== 'delivered') return false
      const orderDate = new Date(order.createdAt || order.updatedAt)
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
    })

    // Jika ada data real, gunakan data real
    if (deliveredThisMonth.length > 0) {
      const totalRevenue = deliveredThisMonth.reduce((sum, order) => sum + (order.total || 0), 0)
      const totalCommission = totalRevenue * COMMISSION_RATE

      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
      
      const deliveredLastMonth = orders.filter(order => {
        if (order.status !== 'delivered') return false
        const orderDate = new Date(order.createdAt || order.updatedAt)
        return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear
      })

      const lastMonthRevenue = deliveredLastMonth.reduce((sum, order) => sum + (order.total || 0), 0)
      const lastMonthCommission = lastMonthRevenue * COMMISSION_RATE

      const commissionChange = lastMonthCommission > 0 
        ? ((totalCommission - lastMonthCommission) / lastMonthCommission) * 100 
        : 0

      return {
        totalRevenue,
        totalCommission,
        orderCount: deliveredThisMonth.length,
        lastMonthCommission,
        commissionChange,
      }
    }

    // Return dummy data jika belum ada data real
    return dummyStats
  }, [orders])

  // Mock data - bisa diganti data API
  const stats = [
    { title: 'Pengrajin Aktif', value: 18, icon: <UserGroupIcon className="w-6 h-6" />, color: '#78350F' },
    { title: 'Produk Aktif', value: 124, icon: <ShoppingBagIcon className="w-6 h-6" />, color: '#A16207' },
    { title: 'Pesanan Berjalan', value: 42, icon: <TruckIcon className="w-6 h-6" />, color: '#0EA5E9' },
  ]

  const verificationQueue = [
    { key: 'v1', name: 'Ibu Putu Ayu', business: 'Tenun Sidemen', doc: 'NIB-2025-001', submittedAt: '10 Jan 2026', status: 'pending' },
    { key: 'v2', name: 'Pak Ketut Yasa', business: 'Songket Agung', doc: 'NIB-2025-002', submittedAt: '9 Jan 2026', status: 'pending' },
  ]

  const productReviewQueue = [
    { key: 'p1', name: 'Songket Motif Pucuk', artisan: 'Ibu Luh Sari', category: 'songket', price: 1150000, status: 'review' },
    { key: 'p2', name: 'Endek Ombak Laut', artisan: 'Pak Wayan Dana', category: 'endek', price: 420000, status: 'review' },
  ]

  const issueOrders = [
    { key: 'o1', id: 'ORD-2301', buyer: 'Rina', issue: 'Alamat tidak lengkap', status: 'butuh aksi' },
    { key: 'o2', id: 'ORD-2302', buyer: 'Adi', issue: 'Pembayaran dicek manual', status: 'cek pembayaran' },
  ]

  const payoutQueue = [
    { key: 'pay1', artisan: 'Ibu Made Sari', amount: 3200000, status: 'siap cair', eta: 'Hari ini' },
    { key: 'pay2', artisan: 'Pak Nyoman Putra', amount: 2100000, status: 'menunggu verifikasi', eta: 'Besok' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-wastra-brown-700 uppercase tracking-wide">Peran Anda</p>
            <h1 className="text-4xl font-bold mb-1 text-wastra-brown-900">Admin BUMDes</h1>
            <p className="text-gray-600">
              Kelola pengrajin, produk, dan aktivitas platform (tampilan admin).
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className="mb-8">
        {stats.map((item) => (
          <Col xs={24} sm={12} md={6} key={item.title}>
            <Card className="border border-wastra-brown-100 rounded-xl">
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.icon}
                valueStyle={{ color: item.color, fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
        
        {/* Komisi Pendapatan Bulan Ini - Statistics Detail */}
        <Col xs={24} sm={12} md={6}>
          <Card className="border border-wastra-brown-100 rounded-xl bg-gradient-to-br from-green-50 to-white">
            <Statistic
              title="Komisi Bulan Ini"
              value={commissionStats.totalCommission}
              prefix={<CurrencyDollarIcon className="w-6 h-6" />}
              formatter={(value) => formatPrice(value)}
              valueStyle={{ color: '#059669', fontWeight: 700 }}
              suffix={
                commissionStats.commissionChange !== 0 && (
                  <div className="flex items-center gap-1 text-xs mt-1">
                    {commissionStats.commissionChange > 0 ? (
                      <>
                        <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-medium">
                          {Math.abs(commissionStats.commissionChange).toFixed(1)}%
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
                        <span className="text-red-600 font-medium">
                          {Math.abs(commissionStats.commissionChange).toFixed(1)}%
                        </span>
                      </>
                    )}
                  </div>
                )
              }
            />
            <div className="mt-3 pt-3 border-t border-green-100">
              <div className="flex justify-between text-xs text-wastra-brown-600">
                <span>Dari {commissionStats.orderCount} pesanan</span>
                <span>{COMMISSION_RATE * 100}% komisi</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} className="mb-8">
        {/* Order Summary - Donut Chart */}
        <Col xs={24} md={8}>
          <Card className="border border-wastra-brown-100 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-wastra-brown-800">Ringkasan Pesanan</h3>
              <Tag>Bulan Ini</Tag>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {/* Dikirim - 25% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#0EA5E9"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.25} ${2 * Math.PI * 40}`}
                    strokeDashoffset="0"
                  />
                  {/* Selesai - 65% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.65} ${2 * Math.PI * 40}`}
                    strokeDashoffset={`-${2 * Math.PI * 40 * 0.25}`}
                  />
                  {/* Dibatalkan - 10% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.10} ${2 * Math.PI * 40}`}
                    strokeDashoffset={`-${2 * Math.PI * 40 * 0.90}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-wastra-brown-800">{commissionStats.orderCount}</div>
                    <div className="text-xs text-wastra-brown-600">Pesanan</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  <span className="text-sm text-wastra-brown-600">Dikirim</span>
                </div>
                <span className="text-sm font-semibold text-wastra-brown-800">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  <span className="text-sm text-wastra-brown-600">Selesai</span>
                </div>
                <span className="text-sm font-semibold text-wastra-brown-800">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-wastra-brown-600">Dibatalkan</span>
                </div>
                <span className="text-sm font-semibold text-wastra-brown-800">10%</span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Total Revenue - Bar Chart */}
        <Col xs={24} md={16}>
          <Card className="border border-wastra-brown-100 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-wastra-brown-800">Total Pendapatan</h3>
                <p className="text-sm text-wastra-brown-600 mt-1">Tren 6 bulan terakhir</p>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {[
                { month: 'Jul', value: 8500000 },
                { month: 'Agu', value: 9200000 },
                { month: 'Sep', value: 10800000 },
                { month: 'Okt', value: 11500000 },
                { month: 'Nov', value: 12000000 },
                { month: 'Des', value: 12500000 },
              ].map((item, idx) => {
                const maxValue = 12500000
                const height = (item.value / maxValue) * 100
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center mb-2">
                      <div className="text-xs font-semibold text-wastra-brown-800 mb-1">
                        {formatPrice(item.value).replace('Rp', '').trim()}
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-wastra-brown-600 to-wastra-brown-400 rounded-t-lg transition-all hover:opacity-80"
                        style={{ height: `${height}%`, minHeight: '20px' }}
                      ></div>
                    </div>
                    <div className="text-xs text-wastra-brown-600 mt-2">{item.month}</div>
                  </div>
                )
              })}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Top Pengrajin & Breakdown Komisi */}
      <Row gutter={[16, 16]} className="mb-8">
        {/* Top Pengrajin */}
        <Col xs={24} md={12}>
          <Card className="border border-wastra-brown-100 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-wastra-brown-800">Top Pengrajin</h3>
                <p className="text-sm text-wastra-brown-600 mt-1">Berdasarkan penjualan bulan ini</p>
              </div>
              <Button type="link" size="small">Lihat Semua</Button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Ibu Made Sari', sales: 32, revenue: 11200000 },
                { name: 'Pak Nyoman Putra', sales: 28, revenue: 9800000 },
                { name: 'Ibu Ketut Sari', sales: 25, revenue: 8750000 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-wastra-brown-50 rounded-lg">
                  <div className="w-12 h-12 bg-wastra-brown-200 rounded-full flex items-center justify-center text-wastra-brown-700 font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-wastra-brown-800">{item.name}</div>
                    <div className="text-sm text-wastra-brown-600">{item.sales} pesanan</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-wastra-brown-800">{formatPrice(item.revenue)}</div>
                    <div className="text-xs text-wastra-brown-500">Pendapatan</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Breakdown Komisi */}
        <Col xs={24} md={12}>
          <Card className="border border-wastra-brown-100 rounded-xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-wastra-brown-800">Breakdown Komisi</h3>
              <p className="text-sm text-wastra-brown-600 mt-1">Detail komisi bulan ini</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-wastra-brown-50 to-white rounded-lg border border-wastra-brown-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-wastra-brown-600">Total Pendapatan</span>
                  <span className="text-lg font-bold text-wastra-brown-800">
                    {formatPrice(commissionStats.totalRevenue)}
                  </span>
                </div>
                <div className="w-full bg-wastra-brown-200 rounded-full h-2 mb-2">
                  <div className="bg-wastra-brown-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-700">Komisi BUMDes ({COMMISSION_RATE * 100}%)</span>
                  <span className="text-lg font-bold text-green-700">
                    {formatPrice(commissionStats.totalCommission)}
                  </span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${COMMISSION_RATE * 100}%` }}></div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-700">Untuk Pengrajin (90%)</span>
                  <span className="text-lg font-bold text-blue-700">
                    {formatPrice(commissionStats.totalRevenue - commissionStats.totalCommission)}
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
            {commissionStats.lastMonthCommission > 0 && (
              <div className="mt-4 pt-4 border-t border-wastra-brown-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-wastra-brown-600">vs Bulan Lalu</span>
                  <span className={`font-semibold ${
                    commissionStats.commissionChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {commissionStats.commissionChange >= 0 ? '+' : ''}
                    {commissionStats.commissionChange.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} md={12}>
          <Card className="border border-wastra-brown-100 rounded-xl" title="Antrian Verifikasi Pengrajin">
            <Table
              size="small"
              pagination={false}
              dataSource={verificationQueue}
              columns={[
                { title: 'Nama', dataIndex: 'name' },
                { title: 'Usaha', dataIndex: 'business' },
                { title: 'Dokumen', dataIndex: 'doc' },
                { title: 'Diajukan', dataIndex: 'submittedAt', width: 120 },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  width: 110,
                  render: (status) => <Tag color="orange">Menunggu</Tag>,
                },
                {
                  title: 'Aksi',
                  key: 'action',
                  width: 150,
                  render: () => (
                    <Space>
                      <Button type="link" size="small" icon={<DocumentCheckIcon className="w-4 h-4" />}>Terima</Button>
                      <Button type="link" size="small" danger icon={<ExclamationTriangleIcon className="w-4 h-4" />}>Tolak</Button>
                    </Space>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="border border-wastra-brown-100 rounded-xl" title="Produk Menunggu Review">
            <Table
              size="small"
              pagination={false}
              dataSource={productReviewQueue}
              columns={[
                { title: 'Produk', dataIndex: 'name' },
                { title: 'Pengrajin', dataIndex: 'artisan' },
                { title: 'Kategori', dataIndex: 'category', width: 110, render: (c) => <Tag color={c === 'endek' ? 'blue' : 'gold'}>{c}</Tag> },
                { title: 'Harga', dataIndex: 'price', width: 130, render: (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p) },
                { title: 'Status', dataIndex: 'status', width: 110, render: () => <Tag color="processing">Review</Tag> },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card className="border border-wastra-brown-100 rounded-xl" title="Pesanan Bermasalah">
            <Table
              size="small"
              pagination={false}
              dataSource={issueOrders}
              columns={[
                { title: 'ID', dataIndex: 'id', width: 120 },
                { title: 'Pembeli', dataIndex: 'buyer', width: 120 },
                { title: 'Issue', dataIndex: 'issue' },
                { title: 'Status', dataIndex: 'status', width: 150, render: (s) => <Tag color="red">{s}</Tag> },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="border border-wastra-brown-100 rounded-xl" title="Antrian Pencairan Komisi">
            <Table
              size="small"
              pagination={false}
              dataSource={payoutQueue}
              columns={[
                { title: 'Pengrajin', dataIndex: 'artisan' },
                { title: 'Jumlah', dataIndex: 'amount', width: 140, render: (a) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a) },
                { title: 'Status', dataIndex: 'status', width: 150, render: (s) => <Tag color={s === 'siap cair' ? 'green' : 'orange'}>{s}</Tag> },
                { title: 'ETA', dataIndex: 'eta', width: 100 },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AdminDashboard




