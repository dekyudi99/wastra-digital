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
import formatTanggal from '../utils/formatTanggal'
import formatToCamelCase from '../utils/formatToCamelCase'

const ROLE_MAP = {
  customer: {label: "Pembeli"},
  artisan: {label: "Pengrajin"},
  admin: {label: "Admin"}
}

const AdminDashboard = () => {
  const navigate = useNavigate()

  // =========================================
  // 🔹 API (optional - fallback ke dummy)
  // =========================================

  const { data: totalP, loadingTotalP } = useQuery({
    queryKey: ['totalP'],
    queryFn: adminApi.totalPendaftaran,
  })

  const { data: totalA, loading: loadingTotalA } = useQuery({
    queryKey: ['totalA'],
    queryFn: adminApi.totalActiveArtisan,
  })

  const { data: commisionD, isLoading: loadingCommision } = useQuery({
    queryKey: ['commision'],
    queryFn: adminApi.commision,
  })

  const { data: onProgressResponse, isLoading: loadingOnProgress} = useQuery({
    queryKey: ["onProgress"],
    queryFn: adminApi.onProgress,
  })

  const { data: orderItem, isLoading: loadingOrderItem} = useQuery({
    queryKey: ["orderItem"],
    queryFn: adminApi.orderItem,
  })

  const { data: loggingResponse, isLoading: loadingLogging} = useQuery({
    queryKey: ["logging"],
    queryFn: adminApi.logging,
  })

  // =========================================
  // 🔹 SAFE DATA HANDLING
  // =========================================

  const totalPendaftaran =
    totalP?.data?.data?.total || 0

  const totalActiveArtisan =
    totalA?.data?.data?.total || 0

  const commisionData = 
    commisionD?.data?.data?.saldo || 0

  const orderI = 
    orderItem?.data?.data

  const loggingData = 
    loggingResponse?.data?.data

  if (loadingCommision || loadingTotalA || loadingTotalP || loadingOnProgress || loadingOrderItem || loadingLogging) {
    return (
      <div className='flex justify-center items-start mt-8'>
        <Spin size='large'/>
      </div>
    )
  }

  const columns = [
    {
      title: "No",
      render: (_, __, index) => index +1
    },
    {
      title: "Tanggal",
      dataIndex: "created_at",
      render: (_, record) => formatTanggal(record.created_at)
    },
    {
      title: "Pembeli",
      dataIndex: ["order", "buyer", "name"],
    },
    {
      title: "Pengrajin",
      dataIndex: ["seller", "name"],
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      render: (_, record) => formatPrice(record.subtotal)
    },
    {
      title: "Status",
      dataIndex: "item_status",
    },
    {
      title: "Estimasi Pendapatan",
      dataIndex: "subtotal",
      render: (_, record) => 
        <Tag color={'green'}>
          +{formatPrice((record.subtotal*10)/100)}
        </Tag>
    },
  ]

  const columnsLogging = [
    {
      title: "No",
      render: (_, __, index) => index+1,
    },
    {
      title: "Tanggal",
      dataIndex: "created_at",
      render: (_, record) => formatTanggal(record.created_at),
    },
    {
      title: "Pengguna",
      dataIndex: ["user", "name"],
    },
    {
      title: "Peran",
      dataIndex: "actor_role",
      render: (_, record) => ROLE_MAP[record.actor_role].label
    },
    {
      title: "Aksi",
      dataIndex: "action",
      render: (_, record) => formatToCamelCase(record.action)
    }
  ]

  const statsCards = [
    {
      title: 'Pengrajin Aktif',
      value: totalActiveArtisan,
      icon: <UserGroupIcon className="w-6 h-6" />,
      color: '#78350F',
      url: 'pengrajin/aktif',
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
      value: onProgressResponse?.data?.data?.total,
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
              value={commisionData}
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
      <div className='p-4 space-y-2'>
        <div className='flex flex-row justify-between'>
          <h2 className='font-bold text-xl'>Pesanan Terbaru</h2>
          <Link className='text-blue-500 underline hover:text-blue-600'>Lihat Semua</Link>
        </div>
        <div className='overflow-x-auto'>
          {
            orderI?.length === 0?
            <div className='w-full justify-center'>
              <p>Belum ada pesanan!</p>
            </div>
            :
            <Table
              columns={columns}
              dataSource={orderI}
              rowKey={'id'}
              pagination={false}
            />
          }
        </div>
      </div>

      {/* Top Artisans */}
      <div className='p-4 space-y-2'>
        <div className='flex flex-row justify-between'>
          <h2 className='font-bold text-xl'>Aktivitas Terbaru</h2>
          <Link className='text-blue-500 underline hover:text-blue-600'>Lihat Semua</Link>
        </div>
        <div className='overflow-x-auto'>
          {
            loggingData?.length === 0?
            <div className='w-full justify-center'>
              <p>Belum ada aksi apapun!</p>
            </div>
            :
            <Table
              columns={columnsLogging}
              dataSource={loggingData}
              rowKey={'id'}
              pagination={false}
            />
          }
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
