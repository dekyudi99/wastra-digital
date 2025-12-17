import { useState } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Button, 
  Statistic, 
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Upload
} from 'antd'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const { Option } = Select

const AdminDashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  // Mock data - akan diganti dengan data dari API nanti
  const products = [
    {
      key: '1',
      id: 1,
      name: 'Kain Endek Sidemen Motif Geometris',
      category: 'endek',
      price: 350000,
      stock: 10,
      artisan: 'Ibu Made Sari',
      status: 'active',
    },
    {
      key: '2',
      id: 2,
      name: 'Kain Songket Emas Klasik',
      category: 'songket',
      price: 850000,
      stock: 5,
      artisan: 'Ibu Ketut Sari',
      status: 'active',
    },
  ]

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
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
      render: (price) => 
        new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(price),
    },
    {
      title: 'Stok',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Pengrajin',
      dataIndex: 'artisan',
      key: 'artisan',
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
        <Space size="middle">
          <Button 
            type="link" 
            icon={<PencilIcon className="w-4 h-4" />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button 
            type="link" 
            danger
            icon={<TrashIcon className="w-4 h-4" />}
            onClick={() => handleDelete(record)}
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ]

  const handleEdit = (record) => {
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Hapus Produk',
      content: `Apakah Anda yakin ingin menghapus produk "${record.name}"?`,
      okText: 'Ya, Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      onOk() {
        // Handle delete
        console.log('Delete:', record)
      },
    })
  }

  const handleSubmit = (values) => {
    console.log('Submit:', values)
    setIsModalVisible(false)
    form.resetFields()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard Admin</h1>
        <p className="text-gray-600">
          Kelola produk, pengrajin, dan aktivitas platform
        </p>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Produk"
              value={45}
              prefix={<ShoppingBagIcon className="w-6 h-6" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Pengrajin"
              value={12}
              prefix={<UserGroupIcon className="w-6 h-6" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Pendapatan"
              value={12500000}
              prefix={<CurrencyDollarIcon className="w-6 h-6" />}
              suffix="IDR"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Pesanan"
              value={89}
              prefix={<ChartBarIcon className="w-6 h-6" />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Products Table */}
      <Card
        title="Manajemen Produk"
        extra={
          <Button
            type="primary"
            icon={<PlusIcon className="w-5 h-5" />}
            onClick={() => {
              form.resetFields()
              setIsModalVisible(true)
            }}
          >
            Tambah Produk
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={products}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title="Tambah/Edit Produk"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        okText="Simpan"
        cancelText="Batal"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Nama Produk"
            rules={[{ required: true, message: 'Masukkan nama produk' }]}
          >
            <Input placeholder="Nama produk" />
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
            name="price"
            label="Harga"
            rules={[{ required: true, message: 'Masukkan harga' }]}
          >
            <Input type="number" placeholder="Harga" />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stok"
            rules={[{ required: true, message: 'Masukkan stok' }]}
          >
            <Input type="number" placeholder="Stok" />
          </Form.Item>

          <Form.Item
            name="artisan"
            label="Pengrajin"
            rules={[{ required: true, message: 'Masukkan nama pengrajin' }]}
          >
            <Input placeholder="Nama pengrajin" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Pilih status' }]}
          >
            <Select placeholder="Pilih status">
              <Option value="active">Aktif</Option>
              <Option value="inactive">Nonaktif</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminDashboard




