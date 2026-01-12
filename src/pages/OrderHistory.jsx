import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Tag, Button, Empty, Descriptions, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { 
  ArrowLeftIcon,
  EyeIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { useUser } from '../contexts/UserContext'
import { message } from 'antd'
import { formatPrice } from '../utils/format'
import { provinces, regencies, districts } from '../utils/indonesiaRegions'

const ORDER_STATUS = {
  pending: { label: 'Menunggu Pembayaran', color: 'orange', icon: ClockIcon },
  processing: { label: 'Diproses', color: 'blue', icon: ClockIcon },
  shipped: { label: 'Dikirim', color: 'cyan', icon: TruckIcon },
  delivered: { label: 'Selesai', color: 'green', icon: CheckCircleIcon },
  cancelled: { label: 'Dibatalkan', color: 'red', icon: XCircleIcon },
}

const OrderHistory = () => {
  const navigate = useNavigate()
  const { orders, getOrderById, updateOrderStatus } = useUser()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleViewDetail = (orderId) => {
    const order = getOrderById(orderId)
    setSelectedOrder(order)
    setIsModalVisible(true)
  }

  const handleConfirmPayment = (orderId) => {
    // Update status dari pending ke processing setelah konfirmasi pembayaran
    updateOrderStatus(orderId, 'processing')
    message.success('Pembayaran berhasil dikonfirmasi. Pesanan sedang diproses.')
    // Refresh selected order jika sedang dibuka
    if (selectedOrder && selectedOrder.id === orderId) {
      const updatedOrder = getOrderById(orderId)
      setSelectedOrder(updatedOrder)
    }
  }

  const handleCancelOrder = (orderId) => {
    const order = getOrderById(orderId)
    if (!order) return

    // Tentukan pesan berdasarkan status dan metode pembayaran
    let cancelMessage = 'Apakah Anda yakin ingin membatalkan pesanan ini?'
    let refundInfo = ''

    if (order.status === 'processing' && order.paymentMethod === 'bank') {
      cancelMessage = 'Pesanan ini sudah dibayar dan sedang diproses. Apakah Anda yakin ingin membatalkan?'
      refundInfo = '\n\nPengembalian dana akan diproses dalam 1-3 hari kerja setelah pembatalan dikonfirmasi.'
    } else if (order.status === 'pending' && order.paymentMethod === 'bank') {
      cancelMessage = 'Pesanan ini menunggu pembayaran. Apakah Anda yakin ingin membatalkan?'
      refundInfo = '\n\nJika sudah melakukan transfer, pengembalian dana akan diproses dalam 1-3 hari kerja.'
    } else if (order.paymentMethod === 'cod') {
      cancelMessage = 'Pesanan COD ini akan dibatalkan. Apakah Anda yakin?'
      refundInfo = '\n\nKarena pembayaran dilakukan saat barang diterima, tidak ada pengembalian dana yang diperlukan.'
    }

    Modal.confirm({
      title: 'Batalkan Pesanan?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>{cancelMessage}</p>
          <p className="text-red-600 font-semibold mt-2">Tindakan ini tidak dapat dibatalkan.</p>
          {refundInfo && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">{refundInfo}</p>
            </div>
          )}
        </div>
      ),
      okText: 'Ya, Batalkan',
      okType: 'danger',
      cancelText: 'Tidak',
      width: 500,
      onOk: () => {
        updateOrderStatus(orderId, 'cancelled')
        
        // Pesan sukses dengan info refund jika perlu
        let successMessage = 'Pesanan berhasil dibatalkan.'
        if (order.paymentMethod === 'bank' && (order.status === 'processing' || order.proofOfPayment)) {
          successMessage = 'Pesanan berhasil dibatalkan. Pengembalian dana akan diproses dalam 1-3 hari kerja.'
        }
        
        message.success(successMessage, 5)
        
        // Refresh selected order jika sedang dibuka
        if (selectedOrder && selectedOrder.id === orderId) {
          const updatedOrder = getOrderById(orderId)
          setSelectedOrder(updatedOrder)
        }
      },
    })
  }

  // Check if order can be cancelled (only pending or processing)
  const canCancelOrder = (order) => {
    return order.status === 'pending' || order.status === 'processing'
  }

  const getStatusConfig = (status) => {
    return ORDER_STATUS[status] || ORDER_STATUS.pending
  }

  // Filter orders by status
  const [filterStatus, setFilterStatus] = useState('all')
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus)

  if (orders.length === 0) {
    return (
      <div className="bg-wastra-brown-50 min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-wastra-brown-600 hover:text-wastra-brown-800 mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Kembali</span>
            </button>
            <h1 className="text-3xl font-semibold text-wastra-brown-800">Riwayat Pesanan</h1>
          </div>

          <Card className="text-center py-12">
            <Empty
              description={
                <div>
                  <p className="text-lg text-wastra-brown-600 mb-2">
                    Belum ada pesanan
                  </p>
                  <p className="text-wastra-brown-500">
                    Mulai berbelanja dan buat pesanan pertama Anda
                  </p>
                </div>
              }
            >
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/produk')}
                className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
              >
                Jelajahi Produk
              </Button>
            </Empty>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-wastra-brown-50 min-h-screen py-6 sm:py-8 overflow-x-hidden w-full">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-wastra-brown-600 hover:text-wastra-brown-800 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Kembali</span>
          </button>
          <h1 className="text-3xl font-semibold text-wastra-brown-800">Riwayat Pesanan</h1>
          <p className="text-wastra-brown-600 mt-2">
            {orders.length} {orders.length === 1 ? 'pesanan' : 'pesanan'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button
            type={filterStatus === 'all' ? 'primary' : 'default'}
            onClick={() => setFilterStatus('all')}
            className={filterStatus === 'all' ? 'bg-wastra-brown-600 hover:bg-wastra-brown-700' : ''}
          >
            Semua
          </Button>
          {Object.entries(ORDER_STATUS).map(([key, config]) => (
            <Button
              key={key}
              type={filterStatus === key ? 'primary' : 'default'}
              onClick={() => setFilterStatus(key)}
              className={filterStatus === key ? 'bg-wastra-brown-600 hover:bg-wastra-brown-700' : ''}
            >
              {config.label}
            </Button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status)
            const StatusIcon = statusConfig.icon

            return (
              <Card
                key={order.id}
                className="hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-wastra-brown-800">
                        Pesanan #{order.id}
                      </h3>
                      <Tag color={statusConfig.color} className="flex items-center gap-1">
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </Tag>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-wastra-brown-600">
                      <div>
                        <span className="font-medium">Tanggal:</span>{' '}
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span>{' '}
                        <span className="text-wastra-brown-800 font-semibold">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Items:</span>{' '}
                        {order.items?.length || 0} produk
                      </div>
                    </div>

                    {order.trackingNumber && (
                      <div className="mt-2 text-sm">
                        <span className="text-wastra-brown-600">No. Resi:</span>{' '}
                        <span className="font-mono font-semibold text-wastra-brown-800">
                          {order.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      icon={<EyeIcon className="w-4 h-4" />}
                      onClick={() => handleViewDetail(order.id)}
                    >
                      Detail
                    </Button>
                    {order.status === 'pending' && (
                      <>
                        {order.paymentMethod === 'bank' && order.proofOfPayment ? (
                          <Button
                            type="primary"
                            onClick={() => handleConfirmPayment(order.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Konfirmasi Pembayaran
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            onClick={() => navigate(`/checkout?orderId=${order.id}`)}
                            className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
                          >
                            Bayar
                          </Button>
                        )}
                      </>
                    )}
                    {canCancelOrder(order) && (
                      <Button
                        danger
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Batalkan
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Order Detail Modal */}
        <Modal
          title={`Detail Pesanan #${selectedOrder?.id}`}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={700}
        >
          {selectedOrder && (
            <div>
              <Descriptions column={1} bordered className="mb-4">
                <Descriptions.Item label="Status">
                  <Tag color={getStatusConfig(selectedOrder.status).color}>
                    {getStatusConfig(selectedOrder.status).label}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Tanggal Pesanan">
                  {new Date(selectedOrder.createdAt).toLocaleString('id-ID')}
                </Descriptions.Item>
                {selectedOrder.trackingNumber && (
                  <Descriptions.Item label="No. Resi">
                    <span className="font-mono">{selectedOrder.trackingNumber}</span>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Alamat Pengiriman">
                  {selectedOrder.shippingAddress?.name ? (
                    <div className="space-y-1">
                      <p className="font-semibold text-wastra-brown-800">{selectedOrder.shippingAddress.name}</p>
                      <p className="text-sm text-wastra-brown-600">{selectedOrder.shippingAddress.phone}</p>
                      <p className="text-sm text-wastra-brown-600">{selectedOrder.shippingAddress.streetAddress}</p>
                      <p className="text-sm text-wastra-brown-600">
                        {(() => {
                          const parts = []
                          if (selectedOrder.shippingAddress.district) {
                            const districtName = districts[selectedOrder.shippingAddress.regency]?.find(
                              d => d.id === selectedOrder.shippingAddress.district
                            )?.name
                            if (districtName) parts.push(districtName)
                          }
                          if (selectedOrder.shippingAddress.regency) {
                            const regencyName = regencies[selectedOrder.shippingAddress.province]?.find(
                              r => r.id === selectedOrder.shippingAddress.regency
                            )?.name
                            if (regencyName) parts.push(regencyName)
                          }
                          if (selectedOrder.shippingAddress.province) {
                            const provinceName = provinces.find(
                              p => p.id === selectedOrder.shippingAddress.province
                            )?.name
                            if (provinceName) parts.push(provinceName)
                          }
                          if (selectedOrder.shippingAddress.postalCode) {
                            parts.push(selectedOrder.shippingAddress.postalCode)
                          }
                          return parts.join(', ')
                        })()}
                      </p>
                      {selectedOrder.shippingAddress.notes && (
                        <p className="text-xs text-wastra-brown-500 italic mt-2">
                          Catatan: {selectedOrder.shippingAddress.notes}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-wastra-brown-400">Alamat tidak tersedia</span>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Metode Pembayaran">
                  {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Transfer Bank'}
                </Descriptions.Item>
                {selectedOrder.paymentMethod === 'bank' && selectedOrder.proofOfPayment && (
                  <Descriptions.Item label="Bukti Transfer">
                    <div>
                      <p className="text-sm text-wastra-brown-600 mb-1">
                        File: {selectedOrder.proofOfPayment.name}
                      </p>
                      {selectedOrder.proofOfPayment.url && (
                        <a 
                          href={selectedOrder.proofOfPayment.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Lihat Bukti Transfer
                        </a>
                      )}
                    </div>
                  </Descriptions.Item>
                )}
              </Descriptions>

              {/* Informasi untuk Pesanan yang Dibatalkan */}
              {selectedOrder.status === 'cancelled' && (
                <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <XCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-800 mb-2">Pesanan Dibatalkan</h4>
                      <p className="text-sm text-red-700 mb-2">
                        Pesanan ini telah dibatalkan pada{' '}
                        {selectedOrder.updatedAt || selectedOrder.cancelledAt
                          ? new Date(selectedOrder.updatedAt || selectedOrder.cancelledAt).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'tanggal tidak diketahui'}
                      </p>
                      {selectedOrder.paymentMethod === 'bank' && (
                        <div className="mt-3 p-3 bg-white border border-red-200 rounded">
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            Informasi Pengembalian Dana:
                          </p>
                          <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                            <li>Pengembalian dana akan diproses dalam 1-3 hari kerja</li>
                            <li>Dana akan dikembalikan ke rekening yang sama dengan rekening pengirim</li>
                            <li>Anda akan menerima notifikasi via email/SMS saat pengembalian dana selesai</li>
                            <li>Jika ada pertanyaan, hubungi customer service kami</li>
                          </ul>
                        </div>
                      )}
                      {selectedOrder.paymentMethod === 'cod' && (
                        <p className="text-xs text-red-600 mt-2 italic">
                          Karena pembayaran dilakukan saat barang diterima, tidak ada pengembalian dana yang diperlukan.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tombol Aksi untuk Order */}
              <div className="mt-4 space-y-3">
                {/* Tombol Konfirmasi Pembayaran untuk order pending dengan bukti transfer */}
                {selectedOrder.status === 'pending' && 
                 selectedOrder.paymentMethod === 'bank' && 
                 selectedOrder.proofOfPayment && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-wastra-brown-700 mb-3">
                      Bukti transfer sudah diupload. Klik tombol di bawah untuk mengonfirmasi pembayaran dan memproses pesanan.
                    </p>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => {
                        handleConfirmPayment(selectedOrder.id)
                        setIsModalVisible(false)
                      }}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Konfirmasi Pembayaran
                    </Button>
                  </div>
                )}

                {/* Tombol Batalkan Pesanan */}
                {canCancelOrder(selectedOrder) && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-wastra-brown-700 mb-3">
                      {selectedOrder.status === 'pending' 
                        ? 'Pesanan masih menunggu pembayaran. Anda dapat membatalkan pesanan ini.'
                        : 'Pesanan sedang diproses. Anda masih dapat membatalkan pesanan ini sebelum dikirim.'}
                    </p>
                    {selectedOrder.paymentMethod === 'bank' && selectedOrder.status === 'processing' && (
                      <p className="text-xs text-red-600 mb-3 font-medium">
                        ⚠️ Pesanan ini sudah dibayar. Pembatalan akan memicu proses pengembalian dana.
                      </p>
                    )}
                    <Button
                      danger
                      size="large"
                      onClick={() => {
                        handleCancelOrder(selectedOrder.id)
                        setIsModalVisible(false)
                      }}
                      className="w-full"
                    >
                      Batalkan Pesanan
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-3">Items:</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-wastra-brown-50 rounded">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-wastra-brown-600">
                          {item.quantity} x {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span>Subtotal:</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Ongkir:</span>
                  <span>{formatPrice(selectedOrder.shippingCost || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-wastra-brown-600">
                    {formatPrice(selectedOrder.total)}
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

export default OrderHistory

