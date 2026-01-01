import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, Upload, message, Row, Col } from 'antd'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { useUser } from '../contexts/UserContext'
import { formatPrice } from '../utils/format'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { Option } = Select
const { TextArea } = Input

const ArtisanProducts = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams() // untuk edit mode
  const { user } = useUser()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  
  // Check if we're in add mode (tambah) or edit mode (id exists)
  const isAddMode = location.pathname.includes('/tambah')
  const isEditMode = !!id
  const showForm = isAddMode || isEditMode

  // Mock data produk pengrajin - akan dari context/API nanti
  const [products, setProducts] = useState([
    {
      key: '1',
      id: '1',
      name: 'Kain Endek Sidemen Motif Geometris',
      category: 'endek',
      price: 350000,
      stock: 10,
      description: 'Kain endek tradisional dengan motif geometris',
      images: ['/placeholder-endek.jpg'],
      status: 'active',
    },
    {
      key: '2',
      id: '2',
      name: 'Kain Songket Emas Klasik',
      category: 'songket',
      price: 850000,
      stock: 5,
      description: 'Kain songket dengan benang emas',
      images: ['/placeholder-songket.jpg'],
      status: 'active',
    },
  ])

  const columns = [
    {
      title: 'Gambar',
      dataIndex: 'images',
      key: 'images',
      width: 100,
      render: (images) => (
        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
          {images && images[0] ? (
            <img src={images[0]} alt="Produk" className="w-full h-full object-cover" />
          ) : (
            <PhotoIcon className="w-6 h-6 text-gray-400" />
          )}
        </div>
      ),
    },
    {
      title: 'Nama Produk',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
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
      render: (price) => formatPrice(price),
    },
    {
      title: 'Stok',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Aktif' : 'Nonaktif'}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<PencilIcon className="w-4 h-4" />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            size="small"
            icon={<TrashIcon className="w-4 h-4" />}
            onClick={() => handleDelete(record.id)}
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ]

  const handleEdit = (product) => {
    navigate(`/pengrajin/produk/${product.id}`)
  }

  const handleDelete = (productId) => {
    Modal.confirm({
      title: 'Hapus Produk',
      icon: <ExclamationCircleOutlined />,
      content: 'Apakah Anda yakin ingin menghapus produk ini?',
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      onOk: () => {
        setProducts(products.filter(p => p.id !== productId))
        message.success('Produk berhasil dihapus')
      },
    })
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      // Simulasi save - akan call API nanti
      await new Promise(resolve => setTimeout(resolve, 500))

      if (isEditMode && id) {
        // Update existing
        setProducts(prevProducts => prevProducts.map(p => p.id === id ? { ...p, ...values } : p))
        message.success('Produk berhasil diperbarui')
      } else {
        // Add new
        const newProduct = {
          key: String(Date.now()),
          id: String(Date.now()),
          ...values,
          images: values.images || [],
          status: 'active',
        }
        setProducts(prevProducts => [...prevProducts, newProduct])
        message.success('Produk berhasil ditambahkan')
      }

      form.resetFields()
      navigate('/pengrajin/produk')
    } catch (error) {
      message.error('Gagal menyimpan produk')
    } finally {
      setLoading(false)
    }
  }

  // Load product data if editing
  useEffect(() => {
    if (isEditMode && id) {
      const product = products.find(p => p.id === id)
      if (product) {
        // Use setTimeout to ensure form is ready
        setTimeout(() => {
          form.setFieldsValue({
            name: product.name,
            category: product.category,
            description: product.description,
            price: product.price,
            stock: product.stock,
            images: product.images || [],
            status: product.status,
          })
        }, 100)
      }
    } else if (isAddMode) {
      form.resetFields()
      form.setFieldsValue({
        category: 'endek',
        status: 'active',
      })
    }
  }, [id, isEditMode, isAddMode, products, form])

  return (
    <div className="bg-wastra-brown-50 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            {(isAddMode || isEditMode) && (
              <Button
                icon={<ArrowLeftIcon className="w-4 h-4" />}
                onClick={() => navigate('/pengrajin/produk')}
                className="mb-2"
              >
                Kembali
              </Button>
            )}
            <h1 className="text-3xl font-semibold text-wastra-brown-800">
              {isEditMode ? 'Edit Produk' : isAddMode ? 'Tambah Produk' : 'Kelola Produk'}
            </h1>
            <p className="text-wastra-brown-600 mt-2">
              {isEditMode ? 'Edit informasi produk Anda' : isAddMode ? 'Tambah produk baru' : 'Kelola produk yang Anda jual'}
            </p>
          </div>
          {!isAddMode && !isEditMode && (
            <Button
              type="primary"
              icon={<PlusIcon className="w-5 h-5" />}
              onClick={() => navigate('/pengrajin/produk/tambah')}
              className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
            >
              Tambah Produk
            </Button>
          )}
        </div>

        {/* Products Table */}
        {!isAddMode && !isEditMode && (
          <Card className="border border-wastra-brown-100 rounded-xl">
            <Table
              columns={columns}
              dataSource={products}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              locale={{
                emptyText: 'Belum ada produk. Tambah produk pertama Anda!',
              }}
            />
          </Card>
        )}

        {/* Add/Edit Form */}
        {(isAddMode || isEditMode) && (
          <Card className="border border-wastra-brown-100 rounded-xl">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                category: 'endek',
                status: 'active',
              }}
            >
              <Form.Item
                name="name"
                label="Nama Produk"
                rules={[{ required: true, message: 'Masukkan nama produk' }]}
              >
                <Input placeholder="Contoh: Kain Endek Sidemen Motif Geometris" />
              </Form.Item>

              <Form.Item
                name="category"
                label="Kategori"
                rules={[{ required: true, message: 'Pilih kategori' }]}
              >
                <Select placeholder="Pilih kategori">
                  <Option value="endek">Endek</Option>
                  <Option value="songket">Songket</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="description"
                label="Deskripsi"
                rules={[{ required: true, message: 'Masukkan deskripsi produk' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Jelaskan produk Anda secara detail..."
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="price"
                    label="Harga (Rp)"
                    rules={[{ required: true, message: 'Masukkan harga' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="350000"
                      min={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="stock"
                    label="Stok"
                    rules={[{ required: true, message: 'Masukkan stok' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="10"
                      min={0}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="images"
                label="Gambar Produk"
                extra="Upload gambar produk (maks 5MB per gambar)"
              >
                <Upload
                  listType="picture-card"
                  maxCount={5}
                  beforeUpload={() => false} // Prevent auto upload
                >
                  <div>
                    <PhotoIcon className="w-6 h-6" />
                    <div className="mt-2">Upload</div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
                  >
                    {isEditMode ? 'Perbarui Produk' : 'Tambah Produk'}
                  </Button>
                  <Button onClick={() => {
                    form.resetFields()
                    navigate('/pengrajin/produk')
                  }}>
                    Batal
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ArtisanProducts

