import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Table, Tag, Button, Space, Modal, Descriptions, message, Select, Spin } from 'antd'
import { EyeIcon, TruckIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'
import orderApi from '../api/OrderApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const { Option } = Select

const STATUS_MAP = {
  unpaid: { label: 'Belum Bayar', color: 'orange' },
  paid: { label: 'Menunggu', color: 'processing' }, // Tampil sebagai Menunggu
  processing: { label: 'Diproses', color: 'blue' },
  shipped: { label: 'Dikirim', color: 'cyan' },
  delivered: { label: 'Selesai', color: 'green' },
  cancelled: { label: 'Dibatalkan', color: 'red' },
}

const ArtisanOrders = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: orderResponse, isLoading: loadingList } = useQuery({
    queryKey: ["ordersIn"],
    queryFn: () => orderApi.orderIn(),
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

  const orders = Array.isArray(orderResponse?.data?.data) ? orderResponse.data.data : []
  const filteredData = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter)

  const orderDetail = detailResponse?.data?.data // Merujuk pada objek Order dari backend

  const columns = [
    { title: 'Invoice', dataIndex: 'invoice_number', key: 'inv', render: (t) => <span className="font-mono">{t}</span> },
    { title: 'Pembeli', dataIndex: ['user', 'name'], key: 'cust' },
    { title: 'Tanggal', dataIndex: 'created_at', render: (d) => new Date(d).toLocaleDateString('id-ID') },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      render: (s) => <Tag color={STATUS_MAP[s]?.color}>{STATUS_MAP[s]?.label.toUpperCase()}</Tag> 
    },
    { 
      title: 'Aksi', 
      key: 'action', 
      render: (_, r) => (
        <Button icon={<EyeIcon className="w-4 h-4" />} onClick={() => navigate(`/pengrajin/pesanan/${r.id}`)}>
          Detail
        </Button>
      ) 
    }
  ]

  return (
    <div className="bg-wastra-brown-50 min-h-screen w-full pb-10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-wastra-brown-800">Daftar Pesanan Masuk</h1>
          <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 200 }}>
            <Option value="all">Semua Pesanan</Option>
            {Object.entries(STATUS_MAP).map(([k, v]) => <Option key={k} value={k}>{v.label}</Option>)}
          </Select>
        </div>

        <Card borderless className="shadow-sm rounded-xl">
          <Table columns={columns} dataSource={filteredData} rowKey="id" loading={loadingList} />
        </Card>

        <Modal
          title={orderDetail ? `Invoice: ${orderDetail.invoice_number}` : "Memuat..."}
          open={!!id}
          onCancel={() => navigate('/pengrajin/pesanan')}
          footer={null}
          width={800}
        >
          {loadingDetail ? <div className="text-center p-10"><Spin /></div> : orderDetail && (
            <div className="space-y-6">
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Nama Pembeli">{orderDetail.user?.name}</Descriptions.Item>
                <Descriptions.Item label="Alamat Pengiriman">{orderDetail.shipping_address}</Descriptions.Item>
              </Descriptions>

              <h3 className="font-bold text-lg border-b pb-2">Produk Milik Anda</h3>
              <Table
                dataSource={orderDetail.item} // Mengambil dari array 'item'
                rowKey="id"
                pagination={false}
                columns={[
                  { title: 'Produk', dataIndex: 'name_at_purchase' },
                  { title: 'Qty', dataIndex: 'quantity', align: 'center' },
                  { title: 'Subtotal', dataIndex: 'subtotal', render: (v) => formatPrice(v) },
                  { 
                    title: 'Status Item', 
                    dataIndex: 'status', 
                    render: (s) => <Tag color={STATUS_MAP[s].color}>{STATUS_MAP[s].label}</Tag> 
                  },
                  { 
                    title: 'Aksi', 
                    key: 'ops', 
                    render: (_, item) => (
                      <Space>
                        {item.status === 'paid' && (
                          <Button size="small" type="primary" onClick={() => updateStatusMutation.mutate({ orderItemId: item.id, status: 'processing' })}>Proses</Button>
                        )}
                        {item.status === 'processing' && (
                          <Button size="small" className="bg-orange-500 text-white border-none" icon={<TruckIcon className="w-4 h-4 inline-block mr-1"/>} onClick={() => updateStatusMutation.mutate({ orderItemId: item.id, status: 'shipped' })}>Kirim</Button>
                        )}
                      </Space>
                    )
                  }
                ]}
              />

              <div className="flex justify-end p-4 bg-gray-50 rounded-lg">
                <div className="text-right">
                  <span className="text-gray-500 block text-xs">Total Pendapatan Anda dari Invoice ini:</span>
                  <span className="text-xl font-bold text-red-600">
                    {formatPrice(orderDetail.item?.reduce((sum, i) => sum + i.subtotal, 0))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default ArtisanOrders