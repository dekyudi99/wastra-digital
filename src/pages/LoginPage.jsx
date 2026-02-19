import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Card, Form, Input, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import authApi from '../api/AuthApi'
import { useEffect } from 'react'

const LoginPage = () => {
  useEffect(()=>{
    document.title = "Masuk | Wastra Digital"  
  }, [])

  const navigate = useNavigate()

  // 🔑 MUTATION LOGIN
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { success, data, message: apiMessage } = response.data

      if (!success) {
        message.error(apiMessage || 'Login gagal')
        return
      }

      const { token, user } = data

      // Simpan ke context / storage
      localStorage.setItem("AUTH_TOKEN", token)
      localStorage.setItem("ROLE", user.role)
      localStorage.setItem("USER_ID", user.id)
      localStorage.setItem("STATUS", user.status)

      message.success('Login berhasil')

      // Email belum terverifikasi → OTP
      if (!user.email_verified) {
        navigate('/otp', { replace: true })
        return
      }

      // Redirect berdasarkan role
      if (user.role == 'admin') {
        navigate('/admin')
      } else if (user.role == 'artisan') {
        if (user.status != 'approved') {
          navigate('/')
        }
        navigate('/pengrajin')
      } else {
        window.location.href = '/';
      }
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || 'Gagal masuk'
      )
    },
  })

  const onFinish = (values) => {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
      role: values.role,
    })
  }

  return (
    <div className="bg-wastra-brown-50 min-h-[calc(100vh-80px)] w-full">
      <div className="w-full px-4 max-w-md mx-auto py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-wastra-brown-800">Masuk</h1>
          <p className="text-wastra-brown-600 mt-2">
            Masukkan Email dan Password anda!
          </p>
        </div>

        <Card className="border border-wastra-brown-100 rounded-2xl">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="email"
              label={'Email'}
              rules={[
                { required: true, message: 'Masukkan email' },
                { type: 'email', message: 'Email tidak valid' },
              ]}
            >
              <Input placeholder="nama@email.com" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Kata Sandi"
              rules={[{ required: true, message: 'Masukkan kata sandi' }]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={loginMutation.isPending}
              className="w-full bg-wastra-brown-600"
            >
              Masuk
            </Button>

            <div className="mt-4 text-sm text-wastra-brown-600 flex flex-row justify-between">
              <p>
                Belum punya akun?{' '}
                <Link to={`/onboarding`} className="font-medium hover:underline">
                  Daftar
                </Link>
              </p>
              <Link to={'/lupa-password'}>Lupa kata sandi?</Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage