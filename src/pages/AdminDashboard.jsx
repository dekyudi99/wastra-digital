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
} from '@heroicons/react/24/outline'

const AdminDashboard = () => {
  // Mock data - bisa diganti data API
  const stats = [
    { title: 'Pengrajin Aktif', value: 18, icon: <UserGroupIcon className="w-6 h-6" />, color: '#78350F' },
    { title: 'Produk Aktif', value: 124, icon: <ShoppingBagIcon className="w-6 h-6" />, color: '#A16207' },
    { title: 'Pesanan Berjalan', value: 42, icon: <TruckIcon className="w-6 h-6" />, color: '#0EA5E9' },
    { title: 'Komisi Bulan Ini', value: 'Rp 12.500.000', icon: <CurrencyDollarIcon className="w-6 h-6" />, color: '#059669' },
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




