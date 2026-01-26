import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Table, Tag, Button, Space, Modal, Descriptions, message, Select, Spin } from 'antd'
import { ArrowLeftIcon, EyeIcon, TruckIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'
import orderApi from '../api/OrderApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const { Option } = Select

const ORDER_STATUS = {
  unpaid: { label: 'Belum Bayar', color: 'orange' },
  paid: { label: 'Sudah Bayar', color: 'processing' },
  processing: { label: 'Diproses', color: 'blue' },
  shipped: { label: 'Dikirim', color: 'cyan' },
  delivered: { label: 'Selesai', color: 'green' },
  cancelled: { label: 'Dibatalkan', color: 'red' },
}

const ArtisanOrders = () => {
  const navigate = useNavigate()
  const { id } = useParams() // 🔑 Mengambil ID dari URL untuk Modal
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('all')

  // 1. DATA LIST PESANAN
  const { data: orderResponse, isLoading: loadingList } = useQuery({
    queryKey: ["ordersIn"],
    queryFn: () => orderApi.orderIn(),
  })

  // 2. DATA DETAIL PESANAN (Aktif otomatis jika ada ID di URL)
  const { data: detailResponse, isLoading: loadingDetail } = useQuery({
    queryKey: ["orderDetail", id],
    queryFn: () => orderApi.orderDetail(id),
    enabled: !!id, // 🛡️ Hanya fetch jika ada ID di URL
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => orderApi.updateStatus(orderId, status),
    onSuccess: (res) => {
      message.success(`Status berhasil diubah: ${res.data.message}`)
      queryClient.invalidateQueries(["ordersIn"])
      queryClient.invalidateQueries(["orderDetail", id])
    },
    onError: (err) => message.error(err.response?.data?.message || 'Gagal update status')
  })

  const artisanOrderItems = orderResponse?.data?.data || []
  const selectedOrder = detailResponse?.data?.data
  
  // 🛡️ Pastikan data array sebelum filter
  const safeOrderItems = Array.isArray(artisanOrderItems) ? artisanOrderItems : []
  const filteredData = statusFilter === 'all' 
    ? safeOrderItems 
    : safeOrderItems.filter(item => item.order?.status === statusFilter)

  const columns = [
    { title: 'Invoice', dataIndex: ['order', 'invoice_number'], key: 'invoice', render: (t) => <span className="font-mono text-xs">{t}</span> },
    { title: 'Pembeli', dataIndex: ['order', 'user', 'name'], key: 'customer', render: (n) => n || 'Pelanggan' },
    { title: 'Produk', key: 'product', render: (_, r) => <div><div className="font-medium">{r.name_at_purchase}</div><div className="text-xs text-gray-400">Qty: {r.quantity}</div></div> },
    { title: 'Subtotal', dataIndex: 'subtotal', key: 'subtotal', render: (t) => formatPrice(t) },
    { title: 'Status', dataIndex: ['order', 'status'], key: 'status', render: (s) => <Tag color={ORDER_STATUS[s]?.color}>{ORDER_STATUS[s]?.label.toUpperCase()}</Tag> },
    { title: 'Aksi', key: 'action', render: (_, r) => <Button type="link" icon={<EyeIcon className="w-4 h-4" />} onClick={() => navigate(`/pengrajin/pesanan/${r.order_id}`)}>Detail</Button> }
  ]

  return (
    <div className="bg-wastra-brown-50 min-h-screen w-full pb-10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-wastra-brown-800 mb-6">Kelola Pesanan</h1>
        
        <Card className="mb-6 rounded-xl border-none shadow-sm">
          <Space>
            <span>Filter Status:</span>
            <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 180 }}>
              <Option value="all">Semua</Option>
              {Object.entries(ORDER_STATUS).map(([k, v]) => <Option key={k} value={k}>{v.label}</Option>)}
            </Select>
          </Space>
        </Card>

        <Card borderless className="rounded-xl shadow-sm">
          <Table columns={columns} dataSource={filteredData} rowKey="id" loading={loadingList} />
        </Card>

        {/* MODAL DETAIL - Terbuka jika parameter ID ada di URL */}
        <Modal
          title={`Pesanan: ${selectedOrder?.invoice_number || 'Memuat...'}`}
          open={!!id}
          onCancel={() => navigate('/pengrajin/pesanan')} // 🔑 Tutup modal = hapus ID di URL
          footer={null}
          width={750}
        >
          {loadingDetail ? <div className="py-10 text-center"><Spin /></div> : selectedOrder && (
            <div className="space-y-6">
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Status"><Tag color={ORDER_STATUS[selectedOrder.status]?.color}>{ORDER_STATUS[selectedOrder.status]?.label}</Tag></Descriptions.Item>
                <Descriptions.Item label="Pembeli">{selectedOrder.user?.name}</Descriptions.Item>
                <Descriptions.Item label="Alamat">{selectedOrder.shipping_address}</Descriptions.Item>
              </Descriptions>

              <Table
                dataSource={selectedOrder.order_item}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  { title: 'Produk', dataIndex: 'name_at_purchase' },
                  { title: 'Harga', dataIndex: 'price_at_purchase', render: (v) => formatPrice(v) },
                  { title: 'Qty', dataIndex: 'quantity' },
                  { title: 'Subtotal', dataIndex: 'subtotal', render: (v) => formatPrice(v) },
                ]}
              />

              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <span className="font-bold">Total Pendapatan:</span>
                <span className="text-xl font-bold text-red-600">{formatPrice(selectedOrder.total_amount)}</span>
              </div>

              <div className="flex justify-end gap-3">
                 {selectedOrder.status === 'paid' && (
                   <Button type="primary" className="bg-blue-600" onClick={() => updateStatusMutation.mutate({ orderId: selectedOrder.id, status: 'processing' })}>Proses Pesanan</Button>
                 )}
                 {selectedOrder.status === 'processing' && (
                   <Button type="primary" icon={<TruckIcon className="w-4 h-4"/>} className="bg-orange-600" onClick={() => updateStatusMutation.mutate({ orderId: selectedOrder.id, status: 'shipped' })}>Kirim Barang</Button>
                 )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default ArtisanOrders