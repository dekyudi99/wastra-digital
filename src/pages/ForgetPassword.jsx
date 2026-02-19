import { Card, Form, Button, message, Input } from "antd"
import { useMutation } from "@tanstack/react-query";
import authApi from "../api/AuthApi";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ForgetPassword = () => {
    useEffect(()=>{
        document.title = "Lupa Password | Wastra Digital"  
    }, [])

    const navigate = useNavigate()

    const forgetPassword = useMutation({
        mutationFn: authApi.forgetPassword,
        onSuccess: () => {
            message.success("Link ganti password telah dikirim ke email anda!")
            navigate('/cek-email')
        },
        onError: (error) => {
            message.error(
                error.response?.data?.message || 'Gagal mengirim link ganti password!'
            )
            console.log(error)
        },
    })

    const onFinish = (values) => {
        forgetPassword.mutate({
            email: values.email,
        })
    }

  return (
    <div className="bg-wastra-brown-50 min-h-[calc(100vh-80px)] w-full">
        <div className="w-full px-4 max-w-md mx-auto py-12">
            <div className="mb-6">
                <h1 className="text-3xl font-semibold text-wastra-brown-800">Lupa Kata Sandi!</h1>
                <p className="text-wastra-brown-600 mt-2">
                    Masukkan email anda!
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

                    <Button
                        htmlType="submit"
                        type="primary"
                        size="large"
                        loading={forgetPassword.isPending}
                        className="w-full bg-wastra-brown-600"
                    >
                        Kirim
                    </Button>

                    <div className="mt-4 text-sm text-wastra-brown-600">
                        <p>
                            Sudah ingat?
                            <Link to={'/masuk'} className="font-medium hover:underline">Kembali</Link>
                        </p>
                    </div>
                </Form>
            </Card>
        </div>
    </div>
  )
}

export default ForgetPassword