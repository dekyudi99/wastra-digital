import { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Input, message, Tooltip } from 'antd'
import { 
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { formatPrice } from '../utils/format'
import { mockProducts } from '../utils/mockProducts'

const { TextArea } = Input

const AdminProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [warningModalVisible, setWarningModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [warningMessage, setWarningMessage] = useState('')

  // Initialize products function
  const initializeProducts = () => {
    try {
      // Pastikan mockProducts ada dan merupakan array
      if (!mockProducts || !Array.isArray(mockProducts)) {
        console.error('mockProducts is not available or not an array')
        setProducts([])
        return
      }
      
      // Initialize products dengan struktur warning
      const initializedProducts = mockProducts.map(product => ({
        ...product,
        warningMessage: null,
        warningStatus: null, // 'pending', 'acknowledged', 'updated'
        flaggedAt: null,
        artisanName: product.artisan?.name || 'Unknown'
      }))
      setProducts(initializedProducts)
      localStorage.setItem('wastra.adminProducts', JSON.stringify(initializedProducts))
    } catch (error) {
      console.error('Error initializing products:', error)
      setProducts([])
    }
  }

  // Load products from localStorage atau mockProducts
  useEffect(() => {
    try {
      setLoading(true)
      const storedProducts = localStorage.getItem('wastra.adminProducts')
      if (storedProducts) {
        try {
          const parsed = JSON.parse(storedProducts)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed)
          } else {
            initializeProducts()
          }
        } catch (error) {
          console.error('Error parsing stored products:', error)
          initializeProducts()
        }
      } else {
        initializeProducts()
      }
    } catch (error) {
      console.error('Error loading products:', error)
      initializeProducts()
    } finally {
      setLoading(false)
    }
  }, [])

  // Save products to localStorage
  const saveProducts = (updatedProducts) => {
    setProducts(updatedProducts)
    localStorage.setItem('wastra.adminProducts', JSON.stringify(updatedProducts))
  }

  // Check if product can be deleted (lebih dari 24 jam tanpa konfirmasi)
  const canDeleteProduct = (product) => {
    if (!product.flaggedAt || !product.warningMessage) return false
    if (product.warningStatus === 'updated' || product.warningStatus === 'acknowledged') return false
    
    const flaggedTime = new Date(product.flaggedAt).getTime()
    const now = new Date().getTime()
    const hoursDiff = (now - flaggedTime) / (1000 * 60 * 60)
    
    return hoursDiff >= 24
  }

  // Get time remaining until deletion
  const getTimeUntilDeletion = (product) => {
    if (!product.flaggedAt || !product.warningMessage) return null
    if (product.warningStatus === 'updated' || product.warningStatus === 'acknowledged') return null
    
    const flaggedTime = new Date(product.flaggedAt).getTime()
    const now = new Date().getTime()
    const hoursDiff = (now - flaggedTime) / (1000 * 60 * 60)
    const remainingHours = 24 - hoursDiff
    
    if (remainingHours <= 0) return 'Dapat dihapus'
    return `${Math.ceil(remainingHours)} jam lagi`
  }

  const handleSendWarning = () => {
    if (!warningMessage.trim()) {
      message.error('Masukkan pesan peringatan')
      return
    }

    const updatedProducts = products.map(p => 
      p.id === selectedProduct.id 
        ? {
            ...p,
            warningMessage: warningMessage.trim(),
            warningStatus: 'pending',
            flaggedAt: new Date().toISOString()
          }
        : p
    )

    saveProducts(updatedProducts)
    message.success('Peringatan berhasil dikirim ke pengrajin')
    setWarningModalVisible(false)
    setWarningMessage('')
    setSelectedProduct(null)
  }

  const handleDeleteProduct = (product) => {
    Modal.confirm({
      title: 'Hapus Produk',
      icon: <ExclamationCircleOutlined />,
      content: `Apakah Anda yakin ingin menghapus produk "${product.name}"? Produk ini akan dihapus secara permanen.`,
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      onOk: () => {
        const updatedProducts = products.filter(p => p.id !== product.id)
        saveProducts(updatedProducts)
        message.success('Produk berhasil dihapus')
      },
    })
  }

  const openWarningModal = (product) => {
    setSelectedProduct(product)
    setWarningMessage(product.warningMessage || '')
    setWarningModalVisible(true)
  }

  const columns = [
    {
      title: 'Gambar',
      dataIndex: 'images',
      key: 'images',
      width: 80,
      render: (images) => (
        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
          {images && images[0] ? (
            <span className="text-xs text-gray-400">Foto</span>
          ) : (
            <span className="text-xs text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      title: 'Nama Produk',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          {record.warningMessage && (
            <div className="text-xs text-red-600 mt-1">
              ⚠️ Ada peringatan
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Pengrajin',
      dataIndex: 'artisanName',
      key: 'artisanName',
      width: 150,
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category) => (
        <Tag color={category === 'endek' ? 'blue' : 'gold'}>
          {category === 'endek' ? 'Endek' : 'Songket'}
        </Tag>
      ),
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price) => formatPrice(price),
    },
    {
      title: 'Status Peringatan',
      key: 'warningStatus',
      width: 180,
      render: (_, record) => {
        if (!record.warningMessage) {
          return <Tag color="green">Tidak Ada</Tag>
        }
        
        if (record.warningStatus === 'updated') {
          return <Tag color="green">Sudah Diperbarui</Tag>
        }
        
        if (record.warningStatus === 'acknowledged') {
          return <Tag color="blue">Dikonfirmasi</Tag>
        }
        
        if (canDeleteProduct(record)) {
          return <Tag color="red">Dapat Dihapus</Tag>
        }
        
        return (
          <div>
            <Tag color="orange">Menunggu</Tag>
            <div className="text-xs text-gray-500 mt-1">
              {getTimeUntilDeletion(record)}
            </div>
          </div>
        )
      },
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Kirim Peringatan">
            <Button
              type="default"
              size="small"
              icon={<ExclamationTriangleIcon className="w-4 h-4" />}
              onClick={() => openWarningModal(record)}
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              Peringatan
            </Button>
          </Tooltip>
          {canDeleteProduct(record) && (
            <Tooltip title="Hapus Produk">
              <Button
                type="primary"
                danger
                size="small"
                icon={<TrashIcon className="w-4 h-4" />}
                onClick={() => handleDeleteProduct(record)}
              >
                Hapus
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  // Fallback jika ada error
  if (!products && !loading) {
    return (
      <div className="bg-wastra-brown-50 min-h-[calc(100vh-80px)] overflow-x-hidden w-full">
        <div className="w-full px-3 sm:px-4 md:px-6 max-w-7xl mx-auto py-6 sm:py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-wastra-brown-800 mb-2">
              Terjadi Kesalahan
            </h1>
            <p className="text-wastra-brown-600">
              Gagal memuat data produk. Silakan refresh halaman.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-wastra-brown-50 min-h-[calc(100vh-80px)] overflow-x-hidden w-full">
      <div className="w-full px-3 sm:px-4 md:px-6 max-w-7xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-wastra-brown-800 mb-2">
            Manajemen Produk
          </h1>
          <p className="text-sm sm:text-base text-wastra-brown-600">
            Kelola dan pantau semua produk pengrajin. Kirim peringatan jika produk tidak sesuai.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border border-wastra-brown-200">
            <div className="text-sm text-wastra-brown-600 mb-1">Total Produk</div>
            <div className="text-2xl font-bold text-wastra-brown-800">{products.length}</div>
          </Card>
          <Card className="border border-orange-200 bg-orange-50">
            <div className="text-sm text-orange-700 mb-1">Produk dengan Peringatan</div>
            <div className="text-2xl font-bold text-orange-700">
              {products.filter(p => p.warningMessage && p.warningStatus === 'pending').length}
            </div>
          </Card>
          <Card className="border border-red-200 bg-red-50">
            <div className="text-sm text-red-700 mb-1">Dapat Dihapus</div>
            <div className="text-2xl font-bold text-red-700">
              {products.filter(p => canDeleteProduct(p)).length}
            </div>
          </Card>
          <Card className="border border-green-200 bg-green-50">
            <div className="text-sm text-green-700 mb-1">Sudah Diperbarui</div>
            <div className="text-2xl font-bold text-green-700">
              {products.filter(p => p.warningStatus === 'updated').length}
            </div>
          </Card>
        </div>

        {/* Products Table */}
        <Card className="border border-wastra-brown-200 rounded-xl">
          <Table
            columns={columns}
            dataSource={products}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} produk`,
            }}
            scroll={{ x: 1000 }}
            locale={{
              emptyText: loading ? 'Memuat data...' : 'Tidak ada produk',
            }}
          />
        </Card>

        {/* Warning Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
              <span>Kirim Peringatan ke Pengrajin</span>
            </div>
          }
          open={warningModalVisible}
          onCancel={() => {
            setWarningModalVisible(false)
            setWarningMessage('')
            setSelectedProduct(null)
          }}
          onOk={handleSendWarning}
          okText="Kirim Peringatan"
          okButtonProps={{ className: 'bg-orange-600 hover:bg-orange-700' }}
          width={600}
        >
          {selectedProduct && (
            <div className="mt-4">
              <div className="mb-4 p-3 bg-wastra-brown-50 rounded-lg">
                <div className="text-sm text-wastra-brown-600 mb-1">Produk:</div>
                <div className="font-semibold text-wastra-brown-800">{selectedProduct.name}</div>
                <div className="text-sm text-wastra-brown-600 mt-1">
                  Pengrajin: {selectedProduct.artisanName}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-wastra-brown-700 mb-2">
                  Pesan Peringatan *
                </label>
                <TextArea
                  rows={4}
                  placeholder="Contoh: Foto produk tidak sesuai dengan produk yang dijual. Silakan perbarui foto produk dengan foto yang sesuai."
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  className="rounded-lg"
                />
                <div className="text-xs text-wastra-brown-500 mt-2">
                  Peringatan ini akan dikirim ke pengrajin. Pengrajin memiliki waktu 24 jam untuk memperbarui produk sebelum produk dapat dihapus.
                </div>
              </div>

              {selectedProduct.warningMessage && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm font-medium text-yellow-800 mb-1">
                    Peringatan Sebelumnya:
                  </div>
                  <div className="text-sm text-yellow-700">
                    {selectedProduct.warningMessage}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default AdminProductManagement

