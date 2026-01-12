import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Table, Tag, Button, Space, Modal, Descriptions, message, Select } from 'antd'
import {
  ArrowLeftIcon,
  EyeIcon,
  TruckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useUser } from '../contexts/UserContext'
import { formatPrice } from '../utils/format'
import { provinces, regencies, districts } from '../utils/indonesiaRegions'

const { Option } = Select

const ORDER_STATUS = {
  pending: { label: 'Menunggu Pembayaran', color: 'orange' },
  processing: { label: 'Diproses', color: 'blue' },
  shipped: { label: 'Dikirim', color: 'cyan' },
  delivered: { label: 'Selesai', color: 'green' },
  cancelled: { label: 'Dibatalkan', color: 'red' },
}

const ArtisanOrders = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user, orders, getOrderById, updateOrderStatus } = useUser()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  // Filter orders untuk pengrajin ini
  let artisanOrders = orders.filter(order => 
    order.items?.some(item => item.seller === user?.name) || 
    order.seller === user?.name
  )

  // Filter by status
  if (statusFilter !== 'all') {
    artisanOrders = artisanOrders.filter(o => o.status === statusFilter)
  }

  // Load order detail if viewing single order
  useEffect(() => {
    if (id) {
      const order = getOrderById(id)
      if (order) {
        setSelectedOrder(order)
        setIsModalVisible(true)
      }
    }
  }, [id, getOrderById])

  const columns = [
    {
      title: 'ID Pesanan',
      dataIndex: 'id',
      key: 'id',
      render: (id) => `#${id.slice(0, 8)}`,
    },
    {
      title: 'Pembeli',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Produk',
      key: 'items',
      render: (_, record) => {
        const items = record.items || []
        return (
          <div>
            {items.slice(0, 2).map((item, idx) => (
              <div key={idx} className="text-sm">
                {item.name} x{item.quantity}
              </div>
            ))}
            {items.length > 2 && <div className="text-xs text-gray-500">+{items.length - 2} lainnya</div>}
          </div>
        )
      },
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => formatPrice(total),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = ORDER_STATUS[status] || { color: 'default', label: status }
        return <Tag color={config.color}>{config.label}</Tag>
      },
    },
    {
      title: 'Tanggal',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeIcon className="w-4 h-4" />}
            onClick={() => handleViewDetail(record.id)}
          >
            Detail
          </Button>
          {record.status === 'processing' && (
            <Button
              type="link"
              size="small"
              icon={<TruckIcon className="w-4 h-4" />}
              onClick={() => handleUpdateStatus(record.id, 'shipped')}
            >
              Kirim
            </Button>
          )}
          {record.status === 'shipped' && (
            <Button
              type="link"
              size="small"
              icon={<CheckCircleIcon className="w-4 h-4" />}
              onClick={() => handleUpdateStatus(record.id, 'delivered')}
            >
              Selesai
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const handleViewDetail = (orderId) => {
    const order = getOrderById(orderId)
    setSelectedOrder(order)
    setIsModalVisible(true)
    navigate(`/pengrajin/pesanan/${orderId}`)
  }

  const handleUpdateStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
    message.success(`Status pesanan berhasil diubah menjadi ${ORDER_STATUS[newStatus]?.label}`)
    
    // Refresh selected order if open
    if (selectedOrder && selectedOrder.id === orderId) {
      const updatedOrder = getOrderById(orderId)
      setSelectedOrder(updatedOrder)
    }
  }

  const getProvinceName = (provinceId) => {
    const province = provinces.find(p => p.id === provinceId)
    return province?.name || provinceId
  }

  const getRegencyName = (regencyId) => {
    const regency = regencies.find(r => r.id === regencyId)
    return regency?.name || regencyId
  }

  const getDistrictName = (districtId) => {
    const district = districts.find(d => d.id === districtId)
    return district?.name || districtId
  }

  return (
    <div className="bg-wastra-brown-50 min-h-[calc(100vh-80px)] overflow-x-hidden w-full">
      <div className="w-full px-3 sm:px-4 md:px-6 max-w-7xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            {id && (
              <Button
                icon={<ArrowLeftIcon className="w-4 h-4" />}
                onClick={() => navigate('/pengrajin/pesanan')}
                className="mb-2"
              >
                Kembali
              </Button>
            )}
            <h1 className="text-3xl font-semibold text-wastra-brown-800">
              Kelola Pesanan
            </h1>
            <p className="text-wastra-brown-600 mt-2">
              Kelola pesanan yang masuk dari pembeli
            </p>
          </div>
        </div>

        {/* Filter */}
        <Card className="mb-6 border border-wastra-brown-100 rounded-xl">
          <div className="flex items-center gap-4">
            <span className="text-wastra-brown-700 font-medium">Filter Status:</span>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 200 }}
            >
              <Option value="all">Semua Status</Option>
              <Option value="pending">Menunggu Pembayaran</Option>
              <Option value="processing">Diproses</Option>
              <Option value="shipped">Dikirim</Option>
              <Option value="delivered">Selesai</Option>
              <Option value="cancelled">Dibatalkan</Option>
            </Select>
          </div>
        </Card>

        {/* Orders Table */}
        {!id && (
          <Card className="border border-wastra-brown-100 rounded-xl">
            <Table
              columns={columns}
              dataSource={artisanOrders}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              locale={{
                emptyText: 'Belum ada pesanan',
              }}
            />
          </Card>
        )}

        {/* Order Detail Modal */}
        <Modal
          title={`Detail Pesanan #${selectedOrder?.id?.slice(0, 8)}`}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false)
            navigate('/pengrajin/pesanan')
          }}
          footer={null}
          width={800}
        >
          {selectedOrder && (
            <div>
              <Descriptions bordered column={1} className="mb-4">
                <Descriptions.Item label="ID Pesanan">
                  #{selectedOrder.id.slice(0, 8)}
                </Descriptions.Item>
                <Descriptions.Item label="Pembeli">
                  {selectedOrder.customerName || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={ORDER_STATUS[selectedOrder.status]?.color}>
                    {ORDER_STATUS[selectedOrder.status]?.label}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Tanggal Pesanan">
                  {new Date(selectedOrder.createdAt).toLocaleString('id-ID')}
                </Descriptions.Item>
              </Descriptions>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Produk yang Dipesan:</h4>
                <div className="space-y-2">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Descriptions bordered column={1} className="mb-4">
                <Descriptions.Item label="Subtotal">
                  {formatPrice(selectedOrder.subtotal || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Ongkos Kirim">
                  {formatPrice(selectedOrder.shippingCost || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Total">
                  <span className="font-semibold text-lg">
                    {formatPrice(selectedOrder.total || 0)}
                  </span>
                </Descriptions.Item>
              </Descriptions>

              {selectedOrder.shippingAddress && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Alamat Pengiriman:</h4>
                  <div className="p-3 bg-gray-50 rounded">
                    <div>{selectedOrder.shippingAddress.street}</div>
                    <div>
                      {selectedOrder.shippingAddress.district && 
                        getDistrictName(selectedOrder.shippingAddress.district) + ', '}
                      {selectedOrder.shippingAddress.regency && 
                        getRegencyName(selectedOrder.shippingAddress.regency) + ', '}
                      {selectedOrder.shippingAddress.province && 
                        getProvinceName(selectedOrder.shippingAddress.province)}
                      {selectedOrder.shippingAddress.postalCode && 
                        ' ' + selectedOrder.shippingAddress.postalCode}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                {selectedOrder.status === 'processing' && (
                  <Button
                    type="primary"
                    icon={<TruckIcon className="w-4 h-4" />}
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'shipped')
                      setIsModalVisible(false)
                      navigate('/pengrajin/pesanan')
                    }}
                    className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
                  >
                    Tandai Sebagai Dikirim
                  </Button>
                )}
                {selectedOrder.status === 'shipped' && (
                  <Button
                    type="primary"
                    icon={<CheckCircleIcon className="w-4 h-4" />}
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'delivered')
                      setIsModalVisible(false)
                      navigate('/pengrajin/pesanan')
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Tandai Sebagai Selesai
                  </Button>
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

