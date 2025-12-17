import { useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Card, Form, Input, Select } from 'antd'
import { AUTH_STORAGE_KEYS, ROLE_LABELS_ID, USER_ROLES } from '../utils/authRoles'

const roleOptions = [
  { value: USER_ROLES.CUSTOMER, label: ROLE_LABELS_ID[USER_ROLES.CUSTOMER] },
  { value: USER_ROLES.ARTISAN, label: ROLE_LABELS_ID[USER_ROLES.ARTISAN] },
  { value: USER_ROLES.ADMIN, label: ROLE_LABELS_ID[USER_ROLES.ADMIN] },
]

const RegisterPage = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const role = useMemo(() => {
    const fromQuery = params.get('role')
    if (fromQuery) return fromQuery
    return localStorage.getItem(AUTH_STORAGE_KEYS.ROLE) || USER_ROLES.CUSTOMER
  }, [params])

  const onFinish = (values) => {
    // UI only: simulate register success
    localStorage.setItem(AUTH_STORAGE_KEYS.ROLE, values.role)
    navigate(`/masuk?role=${values.role}`)
  }

  return (
    <div className="bg-wastra-brown-50 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
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
                name="name"
                label={role === USER_ROLES.ARTISAN ? 'Nama Pengrajin' : role === USER_ROLES.ADMIN ? 'Nama Admin' : 'Nama Lengkap'}
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

              <Button
                htmlType="submit"
                type="primary"
                size="large"
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


