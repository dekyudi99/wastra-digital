import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Card, Form, Input, Select, Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import authApi from '../api/AuthApi'
import { AUTH_STORAGE_KEYS, ROLE_LABELS_ID, USER_ROLES } from '../utils/authRoles'
import { villages as importedVillages } from '../utils/indonesiaRegions'

const { Dragger } = Upload

const villages = importedVillages || {
  selat: [
    { id: 'tengah', name: 'Dusun Tengah' },
    { id: 'sidakarya', name: 'Dusun Sidakarya' },
  ],
}

const roleOptions = [
  { value: USER_ROLES.CUSTOMER, label: ROLE_LABELS_ID[USER_ROLES.CUSTOMER] },
  { value: USER_ROLES.ARTISAN, label: ROLE_LABELS_ID[USER_ROLES.ARTISAN] },
  { value: USER_ROLES.ADMIN, label: ROLE_LABELS_ID[USER_ROLES.ADMIN] },
]

const RegisterPage = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [ktpFile, setKtpFile] = useState(null)

  const role = useMemo(() => {
    return (
      params.get('role') ||
      localStorage.getItem(AUTH_STORAGE_KEYS.ROLE) ||
      USER_ROLES.CUSTOMER
    )
  }, [params])

  const villageOptions = useMemo(() => {
    return villages?.selat?.map(v => ({
      value: v.id,
      label: v.name,
    })) || []
  }, [])

  // 🔑 REGISTER MUTATION
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      const { success, data, message: apiMessage } = response.data

      if (!success) {
        message.error(apiMessage || 'Gagal mendaftar')
        return
      }

      const { token, user } = data

      // ✅ LOGIN OTOMATIS (INI KUNCI PERUBAHAN)
      localStorage.setItem("AUTH_TOKEN", token)
      localStorage.setItem("ROLE", user.role)

      message.success('Akun berhasil dibuat. Silakan verifikasi OTP.')
      navigate('/otp', { replace: true })
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || 'Gagal membuat akun'
      )
    },
  })

  const onFinish = (values) => {
  const isArtisan = values.role === USER_ROLES.ARTISAN

  if (isArtisan && !ktpFile) {
    message.error('Harap upload foto KTP Anda')
    return
  }

  if (isArtisan && !values.village) {
    message.error('Harap pilih dusun Anda')
    return
  }

  const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value)
    })

    if (isArtisan) {
      formData.append('ktp', ktpFile)
    }

    registerMutation.mutate(formData)
  }

  return (
    <div className="bg-wastra-brown-50 min-h-[calc(100vh-80px)] w-full">
      <div className="w-full px-4 max-w-md mx-auto py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-wastra-brown-800">Daftar</h1>
          <p className="text-wastra-brown-600 mt-2">
            Buat akun sebagai{' '}
            <span className="font-medium">
              {ROLE_LABELS_ID[role] || 'Pengguna'}
            </span>
          </p>
        </div>

        <Card className="border rounded-2xl">
          <Form layout="vertical" onFinish={onFinish} initialValues={{ role }}>
            <Form.Item
              name="role"
              label="Peran"
              rules={[{ required: true, message: 'Pilih peran' }]}
            >
              <Select options={roleOptions} />
            </Form.Item>

            <Form.Item
              name="name"
              label="Nama"
              rules={[{ required: true, message: 'Masukkan nama' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Masukkan email' },
                { type: 'email', message: 'Email tidak valid' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Kata Sandi"
              rules={[{ required: true, message: 'Masukkan kata sandi' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Konfirmasi Kata Sandi"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Konfirmasi kata sandi' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Kata sandi tidak sama'))
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            {role === USER_ROLES.ARTISAN && (
              <>
                <Form.Item
                  name="village"
                  label="Dusun"
                  rules={[{ required: true, message: 'Pilih dusun' }]}
                >
                  <Select options={villageOptions} />
                </Form.Item>

                <Form.Item label="Upload KTP" required>
                  <Dragger
                    accept="image/*"
                    maxCount={1}
                    beforeUpload={(file) => {
                      setKtpFile(file)
                      return false
                    }}
                    onRemove={() => setKtpFile(null)}
                  >
                    <InboxOutlined />
                    <p>Klik atau seret file KTP</p>
                  </Dragger>
                </Form.Item>
              </>
            )}

            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={registerMutation.isPending}
              className="w-full"
            >
              Buat Akun
            </Button>

            <div className="mt-4 text-sm">
              Sudah punya akun?{' '}
              <Link to={`/masuk?role=${role}`}>Masuk</Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage