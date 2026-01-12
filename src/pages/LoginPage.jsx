import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Card, Form, Input, Select, message } from 'antd'
import { AUTH_STORAGE_KEYS, ROLE_LABELS_ID, USER_ROLES } from '../utils/authRoles'
import { useUser } from '../contexts/UserContext'

const roleOptions = [
  { value: USER_ROLES.CUSTOMER, label: ROLE_LABELS_ID[USER_ROLES.CUSTOMER] },
  { value: USER_ROLES.ARTISAN, label: ROLE_LABELS_ID[USER_ROLES.ARTISAN] },
  { value: USER_ROLES.ADMIN, label: ROLE_LABELS_ID[USER_ROLES.ADMIN] },
]

const LoginPage = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { login, isAuthenticated } = useUser()
  const [loading, setLoading] = useState(false)

  // Get redirect URL from query params (default to profile page)
  const redirectUrl = params.get('redirect') || '/profil'

  // If already authenticated, redirect to intended page or home
  if (isAuthenticated) {
    navigate(redirectUrl, { replace: true })
    return null
  }

  const role = useMemo(() => {
    const fromQuery = params.get('role')
    if (fromQuery) return fromQuery
    return localStorage.getItem(AUTH_STORAGE_KEYS.ROLE) || USER_ROLES.CUSTOMER
  }, [params])

  const onFinish = async (values) => {
    setLoading(true)
    try {
      // Simulasi login - dalam real app, ini akan call API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Login dengan UserContext
      login({
        email: values.email,
        role: values.role,
        name: values.email.split('@')[0], // Mock name from email
      })
      
      message.success('Berhasil masuk')
      
      // Redirect to intended page or default based on role
      if (values.role === USER_ROLES.ADMIN) {
        navigate('/admin')
      } else if (values.role === USER_ROLES.ARTISAN) {
        navigate('/pengrajin')
      } else {
        navigate(redirectUrl)
      }
    } catch (error) {
      message.error('Gagal masuk. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = role === USER_ROLES.ADMIN

  return (
    <div className="bg-wastra-brown-50 min-h-[calc(100vh-80px)] overflow-x-hidden w-full">
      <div className="w-full px-4 sm:px-6 max-w-md mx-auto py-8 sm:py-12">
        <div className="w-full">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-wastra-brown-800">Masuk</h1>
            <p className="text-wastra-brown-600 mt-2">
              {isAdmin ? (
                'Masuk sebagai Admin BUMDes'
              ) : (
                <>
                  Masuk untuk melanjutkan sebagai <span className="font-medium">{ROLE_LABELS_ID[role] || 'Pengguna'}</span>.
                </>
              )}
            </p>
          </div>

          <Card className="border border-wastra-brown-100 rounded-2xl">
            <Form layout="vertical" onFinish={onFinish} initialValues={{ role }}>
              {!isAdmin && (
                <Form.Item
                  name="role"
                  label="Peran"
                  rules={[{ required: true, message: 'Pilih peran' }]}
                >
                  <Select options={roleOptions} />
                </Form.Item>
              )}

              {isAdmin && (
                <Form.Item
                  name="role"
                  hidden
                  initialValue={USER_ROLES.ADMIN}
                >
                  <Input type="hidden" />
                </Form.Item>
              )}

              <Form.Item
                name="email"
                label={isAdmin ? "Username" : "Email"}
                rules={[
                  { required: true, message: isAdmin ? 'Masukkan username' : 'Masukkan email' },
                  ...(isAdmin ? [] : [{ type: 'email', message: 'Format email tidak valid' }]),
                ]}
              >
                <Input placeholder={isAdmin ? "username" : "nama@email.com"} />
              </Form.Item>

              <Form.Item
                name="password"
                label="Kata Sandi"
                rules={[{ required: true, message: 'Masukkan kata sandi' }]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>

              <div className="flex items-center justify-between mb-4">
                {!isAdmin && (
                  <Link to="/onboarding" className="text-sm text-wastra-brown-600 hover:text-wastra-brown-800">
                    Ganti peran
                  </Link>
                )}
                <Link to="/lupa-password" className="text-sm text-wastra-brown-600 hover:text-wastra-brown-800">
                  Lupa kata sandi?
                </Link>
              </div>

              <Button
                htmlType="submit"
                type="primary"
                size="large"
                loading={loading}
                className="w-full bg-wastra-brown-600 hover:bg-wastra-brown-700"
              >
                Masuk
              </Button>

              {!isAdmin && (
                <div className="mt-4 text-sm text-wastra-brown-600">
                  Belum punya akun?{' '}
                  <Link to={`/daftar?role=${role}`} className="font-medium text-wastra-brown-800 hover:underline">
                    Daftar
                  </Link>
                </div>
              )}
            </Form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LoginPage





