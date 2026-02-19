import paymentApi from "../api/PaymentApi"
import { useQuery } from "@tanstack/react-query"
import { Spin, Button, Form, InputNumber, Switch } from "antd" // Hapus import tak terpakai
import { useNavigate, Link } from "react-router-dom"
import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import tanggalHariIni from "../utils/tanggalHariIni"
import { formatNumber } from "../utils/format"

// 1. Pindahkan konstanta ke luar untuk menghindari re-allocation
const LABEL_OWNER_TYPE = {
    artisan: "Pengrajin",
    admin: "Admin"    
}

const Withdrawal = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const { data: walletInfo, isLoading: isLoadingWallet, isError: isErrorWallet, error: errorWallet } = useQuery({
        queryKey: ["walletInfo"],
        queryFn: async () => {
            const res = await paymentApi.walletInfo()
            return res.data.data
        }
    })

    const totalSaldo = walletInfo?.available_balance || 0

    // 2. Gunakan useWatch untuk sinkronisasi yang lebih "React-way"
    const isAllSelected = Form.useWatch('all', form)

    const onSwitchChange = (checked) => {
        if (checked) {
            form.setFieldsValue({ amount: totalSaldo })
        }
    }

    const handleFinish = (values) => {
        console.log("Submit data:", values)
        // Tambahkan logic mutasi API di sini
    }

    if (isLoadingWallet) return <div className="flex justify-center py-12"><Spin size="large" /></div>
    
    // Pastikan walletInfo ada sebelum render UI utama
    if (isErrorWallet || !walletInfo) {
        return (
            <div className="text-center py-12">
                <p>{errorWallet?.response?.data?.message || 'Gagal memuat data dompet'}</p>
                <Button onClick={() => navigate('/pengrajin')}>Kembali</Button>
            </div>
        )
    }

    return (
        <div className="bg-gray-300 p-8">
            <div className="bg-white max-w-3xl mx-auto shadow-sm">
                <div className="flex justify-between p-4 border-b">
                    <Link to="/pengrajin" className="flex items-center hover:text-wastra-brown-400">
                        <ChevronLeftIcon className="h-5 mr-1"/> Kembali
                    </Link>
                    <h1 className="font-bold uppercase">Withdrawal</h1>
                    <p className="text-gray-500">{LABEL_OWNER_TYPE[walletInfo.owner_type] || 'User'}</p>
                </div>

                <div className="flex flex-col items-center p-8">
                    <p className="font-bold">Saldo yang dapat ditarik</p>
                    <p className="text-gray-400 text-xs mb-2">{tanggalHariIni()}</p>
                    <p className="text-3xl font-bold text-orange-700">Rp {formatNumber(totalSaldo)}</p>
                    <p className="text-sm text-gray-500 mb-8">
                        Saldo Tertunda: <span className="font-semibold text-gray-700">Rp {formatNumber(walletInfo.balance)}</span>
                    </p>

                    <Form 
                        form={form} 
                        layout="vertical" 
                        className="w-full max-w-sm"
                        onFinish={handleFinish}
                        initialValues={{ amount: 0, all: false }}
                    >
                        <Form.Item
                            name="amount"
                            label={<span className="font-bold text-gray-700">Nominal Penarikan</span>}
                            rules={[
                                { required: true, message: 'Masukkan nominal' },
                                { type: 'number', max: totalSaldo, message: 'Saldo tidak mencukupi' },
                                { type: 'number', min: 10000, message: 'Minimal penarikan Rp 10.000' }
                            ]}
                        >
                            <InputNumber 
                                className="w-full"
                                size="large"
                                formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/Rp\s?|(,*)/g, '')}
                                onChange={(val) => {
                                    if (val !== totalSaldo) form.setFieldsValue({ all: false })
                                }}
                            />
                        </Form.Item>

                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-500 text-sm italic">Tarik semua saldo yang tersedia</span>
                            <Form.Item name="all" valuePropName="checked" noStyle>
                                <Switch onChange={onSwitchChange} size="small" />
                            </Form.Item>
                        </div>

                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            block 
                            size="large"
                            className="bg-orange-700 hover:bg-orange-800 h-12 text-lg font-bold"
                        >
                            Konfirmasi Penarikan
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Withdrawal