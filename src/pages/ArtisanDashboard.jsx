import { useNavigate, Link } from 'react-router-dom'
import { Card, Row, Col, Statistic, Pagination, Button, Spin } from 'antd'
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
import AiFloatingButton from '../components/AiFloatingButton'
import { formatNumber } from '../utils/format'
import { useEffect } from 'react'

// const STATUS_CONFIG = {
//   unpaid: { color: 'warning', label: 'Belum Bayar', hex: '#F59E0B' },
//   paid: { color: 'processing', label: 'Menunggu', hex: '#3B82F6' },
//   processing: { color: 'blue', label: 'Diproses', hex: '#8B5CF6' },
//   shipped: { color: 'cyan', label: 'Dikirim', hex: '#22C55E' },
//   delivered: { color: 'success', label: 'Selesai', hex: '#0EA5E9' },
//   cancelled: { color: 'error', label: 'Batal', hex: '#EF4444' },
// }

const ArtisanDashboard = () => {
  useEffect(()=>{
    document.title = "Dashboard Pengrajin | Wastra Digital"
  }, [])

  const navigate = useNavigate()

  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await userApi.profile()
      return res.data.data
    },
  })

  const {data: totalOrder, isLoading: loadingTotal} = useQuery({
    queryKey: ["totalOrder"],
    queryFn: async () => {
      const res = await orderApi.totalTransaction()
      return res.data.data
    }
  })

  const { data: orderResponse, isLoading: loadingOrder } = useQuery({
    queryKey: ["ordersIn"],
    queryFn: () => orderApi.orderInNewer(),
  })

  const paginationData = orderResponse?.data || {};
  const listOrder = paginationData?.data || [];

  if (loadingUser || loadingOrder || loadingTotal) return <div className="h-screen flex justify-center items-center"><Spin size="large" /></div>

  return (
    <div className="bg-wastra-brown-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-wastra-brown-900">Dashboard Pengrajin</h1>
          <p className="text-wastra-brown-600">Selamat datang kembali, {userData?.name}.</p>
        </div>

        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} md={8}>
            <Link to={`/pengrajin/withdrawal`}>
              <Card borderless className="shadow-sm rounded-xl">
                <Statistic title="Estimasi Pendapatan" value={totalOrder?.balance || 0} formatter={formatPrice} valueStyle={{ color: '#059669' }} prefix={<CurrencyDollarIcon className="w-5 h-5" />} />
              </Card>
            </Link>
          </Col>
          <Col xs={24} md={8}>
            <Link to={'/pengrajin/pesanan'}>
              <Card borderless className="shadow-sm rounded-xl">
                <Statistic title="Pesanan Aktif" value={totalOrder?.active || 0} valueStyle={{ color: '#3B82F6' }} prefix={<ClockIcon className="w-5 h-5" />} />
              </Card>
            </Link>
          </Col>
          <Col xs={24} md={8}>
            <Link to={'/pengrajin/pesanan'}>    
              <Card borderless className="shadow-sm rounded-xl">
                <Statistic title="Total Pesanan" value={totalOrder?.all || 0} prefix={<ShoppingBagIcon className="w-5 h-5 text-amber-600" />} />
              </Card>
            </Link>
          </Col>
        </Row>

        <Card title="Pesanan Terbaru" className="shadow-sm rounded-xl" extra={<Button type="link" onClick={() => navigate('/pengrajin/pesanan')}>Lihat Semua</Button>}>
          <div className='flex flex-col bg-white p-4 shadow-sm rounded-lg overflow-x-auto'>
            {
              loadingOrder?
              <div className="flex justify-center items-center">
                  <Spin size="large" ></Spin>
              </div>
              :
              listOrder.length > 0 ? (
                  listOrder.map((item) => (                     
                    <CardOrder
                        key={item.id}
                        name={item.name_at_purchase}
                        price={item.price_at_purchase}
                        qty={item.quantity}
                        id={item.id}
                    />
                  ))
              ) : (
                  <p className="text-center py-10 text-gray-500">Belum ada pesanan.</p>
              )
              }
          </div>
        </Card>
      </div>

      {/* FLOATING AI BUTTON */}
      <AiFloatingButton />
    </div>
  )
}

const CardOrder = (props) => {
    return (
        <Link to={`/pengrajin/pesanan/${props.id}`} className="border-b last:border-0 p-4 hover:bg-gray-50 flex flex-row justify-between items-center transition-all">
            <div className="flex flex-row gap-x-4">
                <div className="p-3 flex justify-center items-center bg-gray-100 rounded-lg text-gray-500">
                    <ShoppingBagIcon className="h-8 w-8" />
                </div>
                <div className="flex flex-col">
                    <h2 className="font-semibold line-clamp-2 text-ellipsis text-lg text-gray-800">{props.name}</h2>
                    <p className="text-sm text-gray-500">{`Jumlah: ${props.qty}`}</p>
                </div>
            </div>
            <div className="text-right flex items-center ml-2">
                <p className="text-red-600 text-nowrap font-bold text-lg">Rp {formatNumber(props.price)}</p>
            </div>
        </Link>
    );
}

export default ArtisanDashboard