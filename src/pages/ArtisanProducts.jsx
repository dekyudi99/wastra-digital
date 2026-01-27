import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, Upload, message, Row, Col, Spin } from 'antd'
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formatPrice } from '../utils/format'
import productApi from '../api/ProductApi' 

const { Option } = Select
const { TextArea } = Input

const ArtisanProducts = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const [fileList, setFileList] = useState([])

  const isAddMode = location.pathname.includes('/tambah')
  const isEditMode = !!id

  // 1. Fetch List Produk (Hanya di halaman utama)
  const { data: productsRes, isLoading: loadingList } = useQuery({
    queryKey: ['myProducts'],
    queryFn: () => productApi.myProduct(),
    enabled: !isAddMode && !isEditMode
  })

  // 2. Fetch Detail Produk (Hanya saat mode EDIT)
  const { data: detailRes, isLoading: loadingDetail } = useQuery({
    queryKey: ['productDetail', id],
    queryFn: async () => {
      const res = await productApi.getById(id)
      return res.data.data[0] // Mengambil index 0 sesuai struktur data Anda
    },
    enabled: isEditMode,
  })

  // 3. EFFECT: Mengisi Form saat data detail berhasil di-fetch
  useEffect(() => {
    if (isEditMode && detailRes) {
      form.setFieldsValue(detailRes)
      
      // Sinkronisasi Gambar untuk komponen Upload AntD
      if (detailRes.image_url && Array.isArray(detailRes.image_url)) {
        const formattedImages = detailRes.image_url.map((url, index) => ({
          uid: `-${index}`, // uid harus unik dan negatif untuk file lama
          name: `image-${index}.jpg`,
          status: 'done',
          url: url,
        }))
        setFileList(formattedImages)
      }
    } else if (isAddMode) {
      form.resetFields()
      setFileList([])
    }
  }, [detailRes, isEditMode, isAddMode, form])

  // 4. Mutation: Delete
  const deleteMutation = useMutation({
    mutationFn: (productId) => productApi.delete(productId),
    onSuccess: () => {
      message.success('Produk berhasil dihapus')
      queryClient.invalidateQueries(['myProducts'])
    },
    onError: (err) => message.error(err.response?.data?.message || 'Gagal menghapus produk')
  })

  // 5. Mutation: Submit (Store / Update)
  const submitMutation = useMutation({
    mutationFn: (formData) => isEditMode ? productApi.update(id, formData) : productApi.store(formData),
    onSuccess: () => {
      message.success(isEditMode ? 'Produk berhasil diperbarui' : 'Produk berhasil ditambahkan')
      queryClient.invalidateQueries(['myProducts'])
      navigate('/pengrajin/produk')
    },
    onError: (err) => message.error(err.response?.data?.message || 'Gagal menyimpan data')
  })

  const handleSubmit = (values) => {
    const formData = new FormData()
    
    // Append fields teks ke FormData
    Object.keys(values).forEach(key => {
      if (key !== 'image' && values[key] !== null && values[key] !== undefined) {
        formData.append(key, values[key])
      }
    })
    
    // Append file gambar baru (yang di-upload)
    fileList.forEach(file => {
      if (file.originFileObj) {
        formData.append('image[]', file.originFileObj)
      }
    })

    // Laravel Hack: Gunakan spoofing method untuk request multipart di mode Update
    if (isEditMode) {
      formData.append('_method', 'PUT')
    }

    submitMutation.mutate(formData)
  }

  const columns = [
    {
      title: 'Gambar',
      dataIndex: 'image_url',
      width: 100,
      render: (urls) => (
        <div className="w-16 h-16 border rounded overflow-hidden bg-gray-50 flex items-center justify-center">
          {urls?.[0] ? (
             <img src={urls[0]} className="w-full h-full object-cover" alt="prod" />
          ) : (
             <PhotoIcon className="w-6 h-6 text-gray-300" />
          )}
        </div>
      )
    },
    { title: 'Nama Produk', dataIndex: 'name', key: 'name', render: (t) => <span className="font-medium">{t}</span> },
    { title: 'Kategori', dataIndex: 'category', render: (c) => <Tag color="gold">{c}</Tag> },
    { title: 'Harga', dataIndex: 'price', render: (p) => formatPrice(p) },
    { title: 'Stok', dataIndex: 'stock', align: 'center' },
    {
      title: 'Aksi',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<PencilIcon className="w-4 h-4" />} onClick={() => navigate(`/pengrajin/produk/${record.id}`)}>Edit</Button>
          <Button type="link" danger icon={<TrashIcon className="w-4 h-4" />} onClick={() => handleDelete(record.id)}>Hapus</Button>
        </Space>
      )
    }
  ]

  const handleDelete = (productId) => {
    Modal.confirm({
      title: 'Hapus Produk?',
      content: 'Apakah Anda yakin? Data yang dihapus tidak dapat dikembalikan.',
      okText: 'Hapus',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(productId)
    })
  }

  if (loadingDetail) return (
    <div className="h-screen flex flex-col justify-center items-center bg-white">
      <Spin size="large" />
      <p className="mt-4 text-gray-500">Memuat data produk...</p>
    </div>
  )

  return (
    <div className="bg-wastra-brown-50 min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            {(isAddMode || isEditMode) && (
              <Button 
                type="text" 
                icon={<ArrowLeftIcon className="w-4 h-4" />} 
                onClick={() => navigate('/pengrajin/produk')}
                className="mb-2 p-0 flex items-center gap-1 text-gray-500 hover:text-wastra-brown-600"
              >
                Kembali
              </Button>
            )}
            <h1 className="text-3xl font-bold text-wastra-brown-800">
              {isEditMode ? 'Edit Produk' : isAddMode ? 'Tambah Produk' : 'Kelola Produk'}
            </h1>
          </div>
          {!isAddMode && !isEditMode && (
            <Button 
              type="primary" 
              icon={<PlusIcon className="w-5 h-5" />} 
              className="bg-wastra-brown-600 border-none h-10 flex items-center" 
              onClick={() => navigate('/pengrajin/produk/tambah')}
            >
              Tambah Produk
            </Button>
          )}
        </div>

        {(!isAddMode && !isEditMode) ? (
          <Card borderless className="shadow-sm rounded-xl overflow-hidden">
            <Table 
              columns={columns} 
              dataSource={productsRes?.data?.data || []} 
              rowKey="id" 
              loading={loadingList}
              pagination={{ pageSize: 8 }}
            />
          </Card>
        ) : (
          <Card borderless className="shadow-sm rounded-xl">
            <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
              <Row gutter={24}>
                <Col xs={24} lg={16}>
                  <Form.Item name="name" label="Nama Produk" rules={[{ required: true, message: 'Nama wajib diisi' }]}>
                    <Input placeholder="Masukkan nama produk..." />
                  </Form.Item>
                  <Form.Item name="description" label="Deskripsi" rules={[{ required: true, message: 'Deskripsi wajib diisi' }]}>
                    <TextArea rows={6} placeholder="Jelaskan detail produk, motif, dan sejarahnya..." />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item name="category" label="Kategori" rules={[{ required: true, message: 'Pilih kategori' }]}>
                    <Select placeholder="Pilih kategori">
                      <Option value="Endek">Endek</Option>
                      <Option value="Songket">Songket</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="material" label="Material" rules={[{ required: true, message: 'Material wajib diisi' }]}>
                    <Input placeholder="Contoh: Sutra, Katun..." />
                  </Form.Item>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item name="price" label="Harga (Rp)" rules={[{ required: true, message: 'Harga wajib diisi' }]}>
                        <InputNumber 
                          className="w-full" 
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="stock" label="Stok" rules={[{ required: true, message: 'Stok wajib diisi' }]}>
                        <InputNumber className="w-full" min={0} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item name="wide" label="Lebar (cm)" rules={[{ required: true, message: 'Isi lebar' }]}>
                        <InputNumber className="w-full" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="long" label="Panjang (cm)" rules={[{ required: true, message: 'Isi panjang' }]}>
                        <InputNumber className="w-full" min={0} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Form.Item label="Gambar Produk (Maksimal 5)">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={() => {}} // Anda bisa menambahkan Modal preview jika butuh
                  onChange={({ fileList }) => setFileList(fileList)}
                  beforeUpload={() => false} // Menunda upload otomatis ke server
                >
                  {fileList.length < 5 && (
                    <div className="flex flex-col items-center">
                      <PhotoIcon className="w-6 h-6 text-gray-400" />
                      <div className="mt-1 text-xs text-gray-500">Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <div className="border-t pt-6 flex justify-end gap-3">
                <Button onClick={() => navigate('/pengrajin/produk')} disabled={submitMutation.isLoading}>
                  Batal
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={submitMutation.isLoading} 
                  className="bg-wastra-brown-600 border-none px-8"
                >
                  {isEditMode ? 'Perbarui Produk' : 'Simpan Produk'}
                </Button>
              </div>
            </Form>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ArtisanProducts