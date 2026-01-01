import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Form, Input, Select, Modal, message, Tag, Empty } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { 
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useUser } from '../contexts/UserContext'
import { provinces, regencies, districts } from '../utils/indonesiaRegions'

const { Option } = Select

const AddressManagement = () => {
  const navigate = useNavigate()
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useUser()
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [selectedProvince, setSelectedProvince] = useState(null)
  const [selectedRegency, setSelectedRegency] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)

  const handleAdd = () => {
    setEditingAddress(null)
    form.resetFields()
    setSelectedProvince(null)
    setSelectedRegency(null)
    setSelectedDistrict(null)
    setIsModalVisible(true)
  }

  const handleEdit = (address) => {
    setEditingAddress(address)
    form.setFieldsValue({
      name: address.name,
      phone: address.phone,
      streetAddress: address.streetAddress,
      province: address.province,
      regency: address.regency,
      district: address.district,
      postalCode: address.postalCode,
      notes: address.notes,
    })
    setSelectedProvince(address.province)
    setSelectedRegency(address.regency)
    setSelectedDistrict(address.district)
    setIsModalVisible(true)
  }

  const handleDelete = (addressId) => {
    Modal.confirm({
      title: 'Hapus Alamat?',
      content: 'Apakah Anda yakin ingin menghapus alamat ini?',
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      onOk: () => {
        deleteAddress(addressId)
        message.success('Alamat berhasil dihapus')
      },
    })
  }

  const handleSubmit = (values) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, values)
      message.success('Alamat berhasil diperbarui')
    } else {
      addAddress(values)
      message.success('Alamat berhasil ditambahkan')
    }
    setIsModalVisible(false)
    form.resetFields()
  }

  const handleSetDefault = (addressId) => {
    setDefaultAddress(addressId)
    message.success('Alamat default berhasil diubah')
  }

  const availableRegencies = selectedProvince ? regencies[selectedProvince] || [] : []
  const availableDistricts = selectedRegency ? districts[selectedRegency] || [] : []

  return (
    <div className="bg-wastra-brown-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-wastra-brown-600 hover:text-wastra-brown-800 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Kembali</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-wastra-brown-800">Alamat Saya</h1>
              <p className="text-wastra-brown-600 mt-2">
                Kelola alamat pengiriman Anda
              </p>
            </div>
            <Button
              type="primary"
              icon={<PlusIcon className="w-5 h-5" />}
              size="large"
              onClick={handleAdd}
              className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
            >
              Tambah Alamat
            </Button>
          </div>
        </div>

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <Card>
            <Empty
              description={
                <div>
                  <p className="text-lg text-wastra-brown-600 mb-2">
                    Belum ada alamat
                  </p>
                  <p className="text-wastra-brown-500">
                    Tambahkan alamat untuk memudahkan proses checkout
                  </p>
                </div>
              }
            >
              <Button
                type="primary"
                icon={<PlusIcon className="w-5 h-5" />}
                onClick={handleAdd}
                className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
              >
                Tambah Alamat Pertama
              </Button>
            </Empty>
          </Card>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <Card
                key={address.id}
                className={`hover:shadow-md transition-shadow ${
                  address.isDefault ? 'border-wastra-brown-400 border-2' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-wastra-brown-800">
                        {address.name}
                      </h3>
                      {address.isDefault && (
                        <Tag color="green" icon={<CheckCircleIcon className="w-3 h-3" />}>
                          Default
                        </Tag>
                      )}
                    </div>
                    <div className="space-y-1 text-wastra-brown-600">
                      <p>{address.streetAddress}</p>
                    <p>
                      {address.district && districts[address.regency]?.find(d => d.id === address.district)?.name}, {' '}
                      {address.regency && regencies[address.province]?.find(r => r.id === address.regency)?.name}, {' '}
                      {address.province && provinces.find(p => p.id === address.province)?.name}
                    </p>
                      <p>{address.postalCode}</p>
                      <p className="mt-2">
                        <span className="font-medium">Telp:</span> {address.phone}
                      </p>
                      {address.notes && (
                        <p className="text-sm italic">
                          <span className="font-medium">Catatan:</span> {address.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!address.isDefault && (
                      <Button
                        size="small"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      icon={<PencilIcon className="w-4 h-4" />}
                      onClick={() => handleEdit(address)}
                    >
                      Edit
                    </Button>
                    <Button
                      danger
                      icon={<TrashIcon className="w-4 h-4" />}
                      onClick={() => handleDelete(address.id)}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          title={editingAddress ? 'Edit Alamat' : 'Tambah Alamat Baru'}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false)
            form.resetFields()
            setEditingAddress(null)
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Nama Penerima"
              rules={[{ required: true, message: 'Masukkan nama penerima' }]}
            >
              <Input size="large" placeholder="Nama lengkap" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Nomor Telepon"
              rules={[
                { required: true, message: 'Masukkan nomor telepon' },
                { pattern: /^[0-9+\-\s()]+$/, message: 'Format tidak valid' },
              ]}
            >
              <Input size="large" placeholder="+62 812-3456-7890" />
            </Form.Item>

            <Form.Item
              name="streetAddress"
              label="Alamat Lengkap"
              rules={[{ required: true, message: 'Masukkan alamat lengkap' }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Jalan, RT/RW, Nomor rumah"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="province"
              label="Provinsi"
              rules={[{ required: true, message: 'Pilih provinsi' }]}
            >
              <Select
                size="large"
                placeholder="Pilih Provinsi"
                value={selectedProvince}
                onChange={(value) => {
                  setSelectedProvince(value)
                  setSelectedRegency(null)
                  setSelectedDistrict(null)
                  form.setFieldsValue({ regency: null, district: null })
                }}
              >
                {provinces.map((province) => (
                  <Option key={province.id} value={province.id}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="regency"
              label="Kota/Kabupaten"
              rules={[{ required: true, message: 'Pilih kota/kabupaten' }]}
            >
              <Select
                size="large"
                placeholder="Pilih Kota/Kabupaten"
                value={selectedRegency}
                onChange={(value) => {
                  setSelectedRegency(value)
                  setSelectedDistrict(null)
                  form.setFieldsValue({ district: null })
                }}
                disabled={!selectedProvince}
              >
                {availableRegencies.map((regency) => (
                  <Option key={regency.id} value={regency.id}>
                    {regency.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="district"
              label="Kecamatan"
              rules={[{ required: true, message: 'Pilih kecamatan' }]}
            >
              <Select
                size="large"
                placeholder="Pilih Kecamatan"
                value={selectedDistrict}
                onChange={setSelectedDistrict}
                disabled={!selectedRegency}
              >
                {availableDistricts.map((district) => (
                  <Option key={district.id} value={district.id}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="postalCode"
              label="Kode Pos"
              rules={[
                { required: true, message: 'Masukkan kode pos' },
                { pattern: /^[0-9]{5}$/, message: 'Kode pos harus 5 digit' },
              ]}
            >
              <Input size="large" placeholder="12345" maxLength={5} />
            </Form.Item>

            <Form.Item
              name="notes"
              label="Catatan (Opsional)"
            >
              <Input.TextArea
                rows={2}
                placeholder="Contoh: Rumah warna biru, dekat masjid"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex gap-2 justify-end">
                <Button onClick={() => setIsModalVisible(false)}>
                  Batal
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
                >
                  {editingAddress ? 'Simpan Perubahan' : 'Simpan Alamat'}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default AddressManagement

