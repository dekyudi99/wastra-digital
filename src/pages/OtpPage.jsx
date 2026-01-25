import { useNavigate } from 'react-router-dom'
import { Button, Card, Form, Input, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import authApi from '../api/AuthApi'

const OtpPage = () => {
  const navigate = useNavigate()

  const sendOtpMutation = useMutation({
    mutationFn: authApi.sendToken,
    onError: (error) => {
      message.error(
        error.response?.data?.message || 'Gagal mendapatkan otp'
      )
    },
  })

  const otpMutation = useMutation({
    mutationFn: authApi.otp,
    onSuccess: (response) => {
        const { success, message: apiMessage } = response.data

        if (!success) {
            message.error(apiMessage || 'Verifikasi email gagal')
            return
        }

        message.success('Verifikasi email berhasil')

        const user = JSON.parse(
            localStorage.getItem('wastra.user')
        )

        // Redirect berdasarkan role
        if (user.role == 'admin') {
            navigate('/admin', { replace: true })
        } else if (user.role == 'artisan') {
            navigate('/pengrajin', { replace: true })
        } else {
            navigate('/', {replace: true})
        }
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || 'Gagal verifikasi email'
      )
    },
  })

  const onFinish = (values) => {
    otpMutation.mutate({
        otp: values.otp
    })
  }

  return (
    <div className="bg-wastra-brown-50 min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md border border-wastra-brown-100 rounded-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-wastra-brown-800">
            Verifikasi OTP
          </h1>
          <p className="text-wastra-brown-600 mt-2">
            Masukkan kode OTP yang dikirim ke email atau nomor Anda
          </p>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="otp"
            label="Kode OTP"
            rules={[
              { required: true, message: 'Masukkan kode OTP' },
              { len: 6, message: 'Kode OTP harus 6 digit' },
            ]}
          >
            <Input
              placeholder="123456"
              maxLength={6}
              inputMode="numeric"
              autoFocus
            />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            size="large"
            loading={sendOtpMutation.isPending}
            className="w-full bg-wastra-brown-600 hover:bg-wastra-brown-700"
          >
            Verifikasi
          </Button>
        </Form>
        <div className='flex w-full justify-end border-none py-2'>
            <button onClick={sendOtpMutation.mutate} className='text-blue-600 underline hover:italic hover:text-blue-700'>Kirim Ulang?</button>
        </div>
      </Card>
    </div>
  )
}

export default OtpPage