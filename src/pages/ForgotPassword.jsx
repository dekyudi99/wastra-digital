import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, message, Steps } from 'antd'
import { 
  ArrowLeftIcon,
  EnvelopeIcon,
  LockClosedIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const { Step } = Steps

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [email, setEmail] = useState('')

  // Step 1: Enter email
  const handleStep1 = async (values) => {
    setLoading(true)
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setEmail(values.email)
      setCurrentStep(1)
      message.success('Email verifikasi telah dikirim')
    } catch (error) {
      message.error('Gagal mengirim email verifikasi')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Enter verification code
  const handleStep2 = async (values) => {
    setLoading(true)
    try {
      // Simulasi verifikasi kode
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCurrentStep(2)
      message.success('Kode verifikasi benar')
    } catch (error) {
      message.error('Kode verifikasi tidak valid')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset password
  const handleStep3 = async (values) => {
    setLoading(true)
    try {
      // Simulasi reset password
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('Kata sandi berhasil diubah')
      setTimeout(() => {
        navigate('/masuk')
      }, 1500)
    } catch (error) {
      message.error('Gagal mengubah kata sandi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-wastra-brown-50 min-h-[calc(100vh-80px)] py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <Link
            to="/masuk"
            className="flex items-center gap-2 text-wastra-brown-600 hover:text-wastra-brown-800 mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Kembali ke halaman masuk</span>
          </Link>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-wastra-brown-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LockClosedIcon className="w-8 h-8 text-wastra-brown-600" />
            </div>
            <h1 className="text-3xl font-semibold text-wastra-brown-800 mb-2">
              Lupa Kata Sandi?
            </h1>
            <p className="text-wastra-brown-600">
              Ikuti langkah-langkah untuk mereset kata sandi Anda
            </p>
          </div>

          {/* Steps */}
          <Card className="border border-wastra-brown-100 rounded-2xl mb-6">
            <Steps current={currentStep} direction="horizontal" size="small" className="mb-8">
              <Step title="Email" />
              <Step title="Verifikasi" />
              <Step title="Reset" />
            </Steps>

            {/* Step 1: Enter Email */}
            {currentStep === 0 && (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleStep1}
              >
                <div className="text-center mb-6">
                  <EnvelopeIcon className="w-12 h-12 text-wastra-brown-400 mx-auto mb-4" />
                  <p className="text-wastra-brown-600">
                    Masukkan email yang terdaftar untuk menerima kode verifikasi
                  </p>
                </div>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Masukkan email' },
                    { type: 'email', message: 'Format email tidak valid' },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="nama@email.com"
                    prefix={<EnvelopeIcon className="w-5 h-5 text-wastra-brown-400" />}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    className="w-full bg-wastra-brown-600 hover:bg-wastra-brown-700"
                  >
                    Kirim Kode Verifikasi
                  </Button>
                </Form.Item>
              </Form>
            )}

            {/* Step 2: Verification Code */}
            {currentStep === 1 && (
              <Form
                layout="vertical"
                onFinish={handleStep2}
              >
                <div className="text-center mb-6">
                  <EnvelopeIcon className="w-12 h-12 text-wastra-brown-400 mx-auto mb-4" />
                  <p className="text-wastra-brown-600 mb-2">
                    Kode verifikasi telah dikirim ke
                  </p>
                  <p className="font-semibold text-wastra-brown-800">{email}</p>
                  <p className="text-sm text-wastra-brown-500 mt-2">
                    Periksa inbox atau folder spam Anda
                  </p>
                </div>

                <Form.Item
                  name="code"
                  label="Kode Verifikasi"
                  rules={[
                    { required: true, message: 'Masukkan kode verifikasi' },
                    { len: 6, message: 'Kode harus 6 digit' },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    className="w-full bg-wastra-brown-600 hover:bg-wastra-brown-700"
                  >
                    Verifikasi
                  </Button>
                </Form.Item>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    className="text-sm text-wastra-brown-600 hover:text-wastra-brown-800"
                    onClick={() => setCurrentStep(0)}
                  >
                    Kirim ulang kode
                  </button>
                </div>
              </Form>
            )}

            {/* Step 3: New Password */}
            {currentStep === 2 && (
              <Form
                layout="vertical"
                onFinish={handleStep3}
              >
                <div className="text-center mb-6">
                  <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-wastra-brown-600">
                    Masukkan kata sandi baru Anda
                  </p>
                </div>

                <Form.Item
                  name="newPassword"
                  label="Kata Sandi Baru"
                  rules={[
                    { required: true, message: 'Masukkan kata sandi baru' },
                    { min: 8, message: 'Kata sandi minimal 8 karakter' },
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder="Minimal 8 karakter"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Konfirmasi Kata Sandi"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: 'Konfirmasi kata sandi' },
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
                  <Input.Password
                    size="large"
                    placeholder="Ulangi kata sandi baru"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    className="w-full bg-wastra-brown-600 hover:bg-wastra-brown-700"
                  >
                    Reset Kata Sandi
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-wastra-brown-600">
            Ingat kata sandi Anda?{' '}
            <Link to="/masuk" className="font-medium text-wastra-brown-800 hover:underline">
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

