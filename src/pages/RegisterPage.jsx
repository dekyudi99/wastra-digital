import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Card, Form, Input, Select, Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { AUTH_STORAGE_KEYS, ROLE_LABELS_ID, USER_ROLES } from '../utils/authRoles'
import { villages as importedVillages } from '../utils/indonesiaRegions'

// Fallback villages jika import gagal
const defaultVillages = {
  'selat': [
    { id: 'tengah', name: 'Dusun Tengah' },
    { id: 'sidakarya', name: 'Dusun Sidakarya' },
    { id: 'budamanis', name: 'Dusun Budamanis' },
    { id: 'tabola', name: 'Dusun Tabola' },
    { id: 'guminten', name: 'Dusun Guminten' },
  ]
}

const villages = importedVillages || defaultVillages

const { Dragger } = Upload

const roleOptions = [
  { value: USER_ROLES.CUSTOMER, label: ROLE_LABELS_ID[USER_ROLES.CUSTOMER] },
  { value: USER_ROLES.ARTISAN, label: ROLE_LABELS_ID[USER_ROLES.ARTISAN] },
  { value: USER_ROLES.ADMIN, label: ROLE_LABELS_ID[USER_ROLES.ADMIN] },
]

const RegisterPage = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [ktpFile, setKtpFile] = useState(null)

  const role = useMemo(() => {
    const fromQuery = params.get('role')
    if (fromQuery) return fromQuery
    return localStorage.getItem(AUTH_STORAGE_KEYS.ROLE) || USER_ROLES.CUSTOMER
  }, [params])

  const isArtisan = role === USER_ROLES.ARTISAN

  // Options untuk dropdown dusun - dengan fallback yang aman
  const villageOptions = useMemo(() => {
    if (!villages || !villages['selat']) {
      return []
    }
    return villages['selat'].map(village => ({
      value: village.id,
      label: village.name,
    }))
  }, [])

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const isCurrentArtisan = values.role === USER_ROLES.ARTISAN
      
      // Validasi KTP untuk pengrajin
      if (isCurrentArtisan && !ktpFile) {
        message.error('Harap upload foto KTP Anda')
        setLoading(false)
        return
      }

      // Validasi dusun untuk pengrajin
      if (isCurrentArtisan && !values.village) {
        message.error('Harap pilih dusun Anda')
        setLoading(false)
        return
      }

      // Simulasi register - dalam real app, ini akan call API
      // Data yang akan dikirim: values + ktpFile (untuk pengrajin)
      const registerData = {
        ...values,
        ...(isCurrentArtisan && {
          ktp: ktpFile,
          village: values.village,
        }),
      }

      await new Promise(resolve => setTimeout(resolve, 500))

      // Setelah daftar, arahkan ke halaman login agar pengguna masuk terlebih dulu
      message.success('Akun berhasil dibuat. Silakan masuk untuk melanjutkan.')
      navigate(`/masuk?role=${values.role}`)
    } catch (error) {
      message.error('Gagal membuat akun. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-wastra-brown-50 min-h-[calc(100vh-80px)] overflow-x-hidden w-full">
      <div className="w-full px-4 sm:px-6 max-w-md mx-auto py-8 sm:py-12">
        <div className="w-full">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-wastra-brown-800">Daftar</h1>
            <p className="text-wastra-brown-600 mt-2">
              Buat akun baru sebagai <span className="font-medium">{ROLE_LABELS_ID[role] || 'Pengguna'}</span>.
            </p>
          </div>

          <Card className="border border-wastra-brown-100 rounded-2xl">
            <Form layout="vertical" onFinish={onFinish} initialValues={{ role }}>
              <Form.Item
                name="role"
                label="Peran"
                rules={[{ required: true, message: 'Pilih peran' }]}
              >
                <Select options={roleOptions} />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
              >
                {({ getFieldValue }) => {
                  const currentRole = getFieldValue('role') || role
                  const isCurrentArtisan = currentRole === USER_ROLES.ARTISAN
                  
                  return (
                    <>
                      <Form.Item
                        name="name"
                        label={isCurrentArtisan ? 'Nama Pengrajin' : currentRole === USER_ROLES.ADMIN ? 'Nama Admin' : 'Nama Lengkap'}
                        rules={[{ required: true, message: 'Masukkan nama' }]}
                      >
                        <Input placeholder="Nama Anda" />
                      </Form.Item>

                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: 'Masukkan email' },
                          { type: 'email', message: 'Format email tidak valid' },
                        ]}
                      >
                        <Input placeholder="nama@email.com" />
                      </Form.Item>

                      <Form.Item
                        name="password"
                        label="Kata Sandi"
                        rules={[{ required: true, message: 'Masukkan kata sandi' }]}
                      >
                        <Input.Password placeholder="Minimal 8 karakter" />
                      </Form.Item>

                      <Form.Item
                        name="confirmPassword"
                        label="Konfirmasi Kata Sandi"
                        dependencies={['password']}
                        rules={[
                          { required: true, message: 'Konfirmasi kata sandi' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) return Promise.resolve()
                              return Promise.reject(new Error('Kata sandi tidak sama'))
                            },
                          }),
                        ]}
                      >
                        <Input.Password placeholder="Ulangi kata sandi" />
                      </Form.Item>

                      {isCurrentArtisan && (
                        <>
                          <Form.Item
                            name="village"
                            label="Dusun"
                            rules={[{ required: true, message: 'Pilih dusun' }]}
                          >
                            <Select 
                              placeholder="Pilih dusun Anda"
                              options={villageOptions}
                            />
                          </Form.Item>

                          <Form.Item
                            name="ktp"
                            label="Upload KTP"
                            rules={[{ required: true, message: 'Upload foto KTP Anda' }]}
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                              if (Array.isArray(e)) {
                                return e
                              }
                              return e?.fileList
                            }}
                          >
                            <Dragger
                              name="ktp"
                              accept="image/*"
                              maxCount={1}
                              beforeUpload={(file) => {
                                // Validasi ukuran file (max 5MB)
                                const isLt5M = file.size / 1024 / 1024 < 5
                                if (!isLt5M) {
                                  message.error('Ukuran file harus kurang dari 5MB!')
                                  return Upload.LIST_IGNORE
                                }
                                // Validasi tipe file
                                const isImage = file.type.startsWith('image/')
                                if (!isImage) {
                                  message.error('File harus berupa gambar!')
                                  return Upload.LIST_IGNORE
                                }
                                setKtpFile(file)
                                return false // Prevent auto upload
                              }}
                              onRemove={() => {
                                setKtpFile(null)
                              }}
                            >
                              <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                              </p>
                              <p className="ant-upload-text">Klik atau seret file ke sini untuk upload</p>
                              <p className="ant-upload-hint">
                                Upload foto KTP Anda (Format: JPG, PNG. Maksimal 5MB)
                              </p>
                            </Dragger>
                          </Form.Item>
                        </>
                      )}
                    </>
                  )
                }}
              </Form.Item>

              <Button
                htmlType="submit"
                type="primary"
                size="large"
                loading={loading}
                className="w-full bg-wastra-brown-600 hover:bg-wastra-brown-700"
              >
                Buat Akun
              </Button>

              <div className="mt-4 text-sm text-wastra-brown-600">
                Sudah punya akun?{' '}
                <Link to={`/masuk?role=${role}`} className="font-medium text-wastra-brown-800 hover:underline">
                  Masuk
                </Link>
              </div>

              <div className="mt-3">
                <Link to="/onboarding" className="text-sm text-wastra-brown-600 hover:text-wastra-brown-800">
                  Kembali ke onboarding
                </Link>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage


