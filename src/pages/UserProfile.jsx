import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, Upload, Avatar, message, Tabs, Divider } from 'antd'
import { 
  UserIcon, 
  CameraIcon,
  ArrowLeftIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import { useUser } from '../contexts/UserContext'
import { ROLE_LABELS_ID } from '../utils/authRoles'

const { TabPane } = Tabs

const UserProfile = () => {
  const navigate = useNavigate()
  const { user, updateUser, updateAvatar, logout } = useUser()
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  if (!user) {
    navigate('/masuk')
    return null
  }

  // Handle avatar upload
  const handleAvatarChange = (info) => {
    const { file } = info
    
    // Handle file selection
    if (file) {
      // Convert file to base64 untuk persist di localStorage
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64String = e.target.result
        updateAvatar(base64String)
        message.success('Foto profil berhasil diubah')
      }
      reader.onerror = () => {
        message.error('Gagal membaca file')
      }
      reader.readAsDataURL(file.originFileObj || file)
    }
  }

  // Handle profile update
  const handleProfileUpdate = async (values) => {
    setLoading(true)
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 500))
      updateUser(values)
      message.success('Profil berhasil diperbarui')
    } catch (error) {
      message.error('Gagal memperbarui profil')
    } finally {
      setLoading(false)
    }
  }

  // Handle password change
  const handlePasswordChange = async (values) => {
    setLoading(true)
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 500))
      message.success('Kata sandi berhasil diubah')
      passwordForm.resetFields()
    } catch (error) {
      message.error('Gagal mengubah kata sandi')
    } finally {
      setLoading(false)
    }
  }

  const uploadProps = {
    name: 'avatar',
    listType: 'picture-circle',
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        message.error('Hanya file JPG/PNG yang diizinkan!')
        return Upload.LIST_IGNORE
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('Ukuran gambar harus kurang dari 2MB!')
        return Upload.LIST_IGNORE
      }
      // Prevent auto upload, kita handle manual di onChange
      return false
    },
    onChange: handleAvatarChange,
    customRequest: () => {
      // Custom request untuk prevent auto upload
      // File sudah di-handle di onChange
    },
  }

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
          <h1 className="text-3xl font-semibold text-wastra-brown-800">Profil Saya</h1>
          <p className="text-wastra-brown-600 mt-2">
            Kelola informasi profil dan akun Anda
          </p>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} className="bg-white rounded-lg p-6">
          {/* Profile Tab */}
          <TabPane tab="Profil" key="profile">
            <Card className="border-0 shadow-none">
              <div className="text-center mb-8">
                <Upload {...uploadProps}>
                  <div className="relative inline-block">
                    <Avatar
                      size={120}
                      src={user.avatar}
                      icon={!user.avatar && <UserIcon className="w-12 h-12" />}
                      className="border-4 border-wastra-brown-200"
                    />
                    <div className="absolute bottom-0 right-0 bg-wastra-brown-600 rounded-full p-2 cursor-pointer hover:bg-wastra-brown-700 transition-colors">
                      <CameraIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </Upload>
                <p className="text-sm text-wastra-brown-600 mt-4">
                  Klik untuk mengubah foto profil
                </p>
              </div>

              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  name: user.name || '',
                  email: user.email || '',
                  phone: user.phone || '',
                  role: ROLE_LABELS_ID[user.role] || '',
                }}
                onFinish={handleProfileUpdate}
              >
                <Form.Item
                  name="name"
                  label="Nama Lengkap"
                  rules={[{ required: true, message: 'Masukkan nama lengkap' }]}
                >
                  <Input size="large" placeholder="Nama lengkap Anda" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Masukkan email' },
                    { type: 'email', message: 'Format email tidak valid' },
                  ]}
                >
                  <Input size="large" placeholder="nama@email.com" disabled />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Nomor Telepon"
                  rules={[
                    { required: true, message: 'Masukkan nomor telepon' },
                    { pattern: /^[0-9+\-\s()]+$/, message: 'Format nomor telepon tidak valid' },
                  ]}
                >
                  <Input size="large" placeholder="+62 812-3456-7890" />
                </Form.Item>

                <Form.Item name="role" label="Peran">
                  <Input size="large" disabled />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    className="w-full bg-wastra-brown-600 hover:bg-wastra-brown-700"
                  >
                    Simpan Perubahan
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>

          {/* Change Password Tab */}
          <TabPane tab="Ubah Kata Sandi" key="password">
            <Card className="border-0 shadow-none">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <LockClosedIcon className="w-6 h-6 text-wastra-brown-600" />
                  <h3 className="text-xl font-semibold text-wastra-brown-800">
                    Ubah Kata Sandi
                  </h3>
                </div>
                <p className="text-wastra-brown-600">
                  Pastikan kata sandi baru Anda kuat dan mudah diingat
                </p>
              </div>

              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={handlePasswordChange}
              >
                <Form.Item
                  name="currentPassword"
                  label="Kata Sandi Saat Ini"
                  rules={[{ required: true, message: 'Masukkan kata sandi saat ini' }]}
                >
                  <Input.Password size="large" placeholder="••••••••" />
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  label="Kata Sandi Baru"
                  rules={[
                    { required: true, message: 'Masukkan kata sandi baru' },
                    { min: 8, message: 'Kata sandi minimal 8 karakter' },
                  ]}
                >
                  <Input.Password size="large" placeholder="Minimal 8 karakter" />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Konfirmasi Kata Sandi Baru"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: 'Konfirmasi kata sandi baru' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('Kata sandi tidak sama'))
                      },
                    }),
                  ]}
                >
                  <Input.Password size="large" placeholder="Ulangi kata sandi baru" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    className="w-full bg-wastra-brown-600 hover:bg-wastra-brown-700"
                  >
                    Ubah Kata Sandi
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>
        </Tabs>

        {/* Logout Button */}
        <div className="mt-6 text-center">
          <Button
            danger
            size="large"
            onClick={() => {
              logout()
              navigate('/')
              message.success('Anda telah keluar')
            }}
          >
            Keluar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserProfile

