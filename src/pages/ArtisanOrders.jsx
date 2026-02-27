import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Table, Tag, Button, Space, Modal, Descriptions, message, Select, Spin, Pagination } from 'antd'
import { EyeIcon, TruckIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'
import orderApi from '../api/OrderApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AiFloatingButton from '../components/AiFloatingButton'

const { Option } = Select

const formatPajak = (price) => {
  return price-((price*10)/100)
}

const STATUS_MAP = {
  pending: { label: 'Menunggu Konfirmasi', color: 'orange' },
  processing: { label: 'Diproses', color: 'blue' },
  shipped: { label: 'Dikirim', color: 'cyan' },
  completed: { label: 'Selesai (Penjual)', color: 'green' },
  finish: { label: 'Selesai (Pembeli)', color: 'gold' },
  cancelled: { label: 'Dibatalkan', color: 'red' },
}

const PAYMENT_METHOD_MAP = {
  cod: {label: 'COD'},
  midtrans: {label: 'TRANSFER'},
}

const PAYMENT_STATUS_MAP = {
  unpaid: { label: 'Belum Dibayar' },
  settled: { label: 'Sudah Dibayar' }
}

const ArtisanOrders = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  // Mengambil data dengan menyertakan page ke queryKey agar otomatis refetch saat page ganti
  const { data: orderResponse, isLoading: loadingList } = useQuery({
    queryKey: ["ordersIn", statusFilter, page],
    queryFn: () => orderApi.orderIn(page, statusFilter),
    keepPreviousData: true,
  })

  const { data: detailResponse, isLoading: loadingDetail } = useQuery({
    queryKey: ["orderDetail", id],
    queryFn: () => orderApi.orderDetail(id),
    enabled: !!id,
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderItemId, status }) => orderApi.updateStatus(orderItemId, status),
    onSuccess: () => {
      message.success(`Status item diperbarui`)
      queryClient.invalidateQueries(["ordersIn"])
      queryClient.invalidateQueries(["orderDetail", id])
    },
    onError: (err) => message.error(err.response?.data?.message || 'Gagal update status')
  })

  // Mapping data dari struktur API Laravel Pagination
  const orders = orderResponse?.data?.data?.data || []
  const paginationMeta = orderResponse?.data?.data || {}

  const orderDetail = detailResponse?.data?.data

  const columns = [
    { title: 'Invoice', dataIndex: ['order', 'order_code'], key: 'inv', render: (t) => <span className="font-mono font-bold text-blue-600">{t}</span> },
    { title: 'Pembeli', dataIndex: ['order', 'buyer', 'name'], key: 'cust' },
    { title: 'Tanggal', dataIndex: 'created_at', render: (d) => new Date(d).toLocaleDateString('id-ID') },
    { 
      title: 'Status', 
      dataIndex: 'item_status', 
      render: (s) => <Tag color={STATUS_MAP[s]?.color || 'default'}>{STATUS_MAP[s]?.label?.toUpperCase() || s}</Tag> 
    },
    { 
      title: 'Aksi', 
      key: 'action', 
      render: (_, r) => (
        <Button 
          type="primary"
          ghost
          icon={<EyeIcon className="w-4 h-4 mr-1" />} 
          onClick={() => navigate(`/pengrajin/pesanan/${r.id}`)}
          className="flex items-center"
        >
          Detail
        </Button>
      ) 
    }
  ]

  return (
    <div className="bg-gray-50 min-h-screen w-full pb-10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Daftar Pesanan Masuk</h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-500">Filter Status:</span>
            <Select value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1); }} style={{ width: 220 }}>
              <Option value="all">Semua Pesanan</Option>
              {Object.entries(STATUS_MAP).map(([k, v]) => <Option key={k} value={k}>{v.label}</Option>)}
            </Select>
          </div>
        </div>

        <Card borderless className="shadow-md rounded-xl">
          <div className='overflow-x-auto'>
            <Table 
              columns={columns} 
              dataSource={orders} 
              rowKey="id" 
              loading={loadingList} 
              pagination={false} // Matikan pagination internal Table
            />
          </div>
          <div className="flex justify-end p-6 border-t">
            <Pagination
              current={page}
              total={paginationMeta.total}
              pageSize={paginationMeta.per_page || 5}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
              showTotal={(total) => `${page} dari ${paginationMeta.last_page}`}
            />
          </div>
        </Card>

        <Modal
          title={orderDetail ? `Detail Invoice: ${orderDetail[0].order.order_code}` : "Memuat Detail..."}
          open={!!id}
          onCancel={() => navigate('/pengrajin/pesanan')}
          footer={null}
          width={850}
          centered
        >
          {loadingDetail ? <div className="text-center p-10"><Spin size="large" /></div> : orderDetail && (
            <div className="space-y-6 pt-4">
              <Descriptions bordered column={1} size="small" className="bg-white">
                <Descriptions.Item label="Nama Pembeli">{orderDetail[0].order.buyer.name}</Descriptions.Item>
                <Descriptions.Item label="No. Telepon">{orderDetail[0].order.buyer.phone}</Descriptions.Item>
                <Descriptions.Item label="Alamat Pengiriman" span={2}>{orderDetail[0].order.shipping_address}</Descriptions.Item>
                <Descriptions.Item label="Metode Pembayaran">
                  <Tag color={orderDetail[0].order.payment_method === 'midtrans' ? 'green' : 'red'}>
                    {PAYMENT_METHOD_MAP[orderDetail[0].order.payment_method].label}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Status Pembayaran">
                  <Tag color={orderDetail[0].order.payment_status == 'settled' ? 'green' : 'red'}>
                    {PAYMENT_STATUS_MAP[orderDetail[0].order.payment_status].label}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>

              <h3 className="font-bold text-lg border-b pb-2 text-gray-700">Item Produk</h3>
              <div className='overflow-x-auto'>
                <Table
                  dataSource={orderDetail}
                  rowKey="id"
                  pagination={false}
                  columns={[
                    { title: 'Produk', dataIndex: 'name_at_purchase' },
                    { title: 'Qty', dataIndex: 'quantity', align: 'center' },
                    { title: 'Harga', dataIndex: 'price_at_purchase', render: (v) => formatPrice(v) },
                    { title: 'Subtotal', dataIndex: 'subtotal', render: (v) => formatPrice(v) },
                    { 
                      title: 'Status', 
                      dataIndex: 'item_status', 
                      render: (s) => <Tag color={STATUS_MAP[s]?.color}>{STATUS_MAP[s]?.label}</Tag> 
                    },
                    { 
                      title: 'Aksi', 
                      key: 'ops', 
                      render: (_, record) => ( // Diubah dari 'items' ke 'record' agar tidak bingung
                        <Space>
                          {record.item_status === 'pending' && (
                            <Button 
                              size="small"
                              type="primary"
                              loading={updateStatusMutation.isPending}
                              onClick={() => updateStatusMutation.mutate({ orderItemId: record.id, status: 'processing' })}
                            >
                              Proses
                            </Button>
                          )}
                          {record.item_status === 'processing' && (
                            <Button 
                              size="small"
                              className="bg-orange-500 hover:bg-orange-600 text-white border-none flex items-center"
                              icon={<TruckIcon className="w-4 h-4 mr-1"/>}
                              loading={updateStatusMutation.isPending}
                              onClick={() => updateStatusMutation.mutate({ orderItemId: record.id, status: 'shipped' })}
                            >
                              Kirim
                            </Button>
                          )}
                          {record.item_status === 'shipped' && (
                            <Button
                              size="small"
                              className="bg-green-600 hover:bg-green-700 text-white border-none flex items-center"
                              icon={<CheckBadgeIcon className="w-4 h-4 mr-1"/>}
                              loading={updateStatusMutation.isPending}
                              onClick={() => updateStatusMutation.mutate({ orderItemId: record.id, status: 'completed' })}>
                              Selesaikan
                            </Button>
                          )}
                        </Space>
                      )
                    }
                  ]}
                />
              </div>

              <div className="flex justify-end p-4 bg-gray-100 rounded-lg">
                <div className="text-right">
                  <span className="text-gray-500 block text-xs mb-1">Total Pendapatan Anda dari Invoice ini {'(Pajak 10%)'}:</span>
                  <span className="text-2xl font-bold text-red-600">
                    {formatPrice((formatPajak(orderDetail[0].subtotal)))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>

      <AiFloatingButton />
    </div>
  )
}

export default ArtisanOrders