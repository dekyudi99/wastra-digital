import orderApi from "../api/OrderApi"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, Link, useSearchParams } from "react-router-dom"
import { Spin, Button, Modal, message, Form, Input } from "antd"
import { ChevronLeftIcon, ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { formatNumber } from "../utils/format"
import { useEffect, useState } from "react"
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import paymentApi from "../api/PaymentApi"

const { TextArea } = Input

const OrderDetail = () => {
    useEffect(()=>{
        document.title = "Detail Order | Wastra Digital"
    }, [])

    const {id} = useParams()
    const [searchParams] = useSearchParams()
    const backParams = searchParams.get("status")
    const queryClient = useQueryClient()
    const [isOpenOverlay, setIsOpenOverlay] = useState(false)
    
    const {data: orderResponse, isLoading, isError, error} = useQuery({
        queryKey: ["orderDetail", id],
        queryFn: () => orderApi.orderDetail(id),
    })
    
    const cancelMutation = useMutation({
        mutationKey: ["orderDetail", id],
        mutationFn: (variables) => orderApi.cancelOrderUnpaid(variables.id, variables.reason),
        onSuccess: () => {
            setIsOpenOverlay(prev=>!prev)
            message.success("Pesanan Telah Dibatalkan")
            queryClient.invalidateQueries({ queryKey: ["orderDetail", id]})
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || "Gagal membatalkan pesanan!")
        }
    })

    const paymentMutation = useMutation({
        mutationKey: ["paymentKey", id],
        mutationFn: () => paymentApi.pay(id),
        onSuccess: (response) => {
            window.location.href = response.data.payment_url
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || "Pembayaran Gagal")
        }
    })

    const onFinish = (values) => {
        cancelMutation.mutate({
            id: id,
            reason: values.reason,
        })
    }
    
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spin size="large"/>
            </div>
        )
    }
    
    if (isError) {
        return (
            <div className="flex flex-col space-y-2 items-center">
                <h2 className="font-bold text-2xl text-red-700">{error?.name}</h2>
                <p>{error?.response?.data?.message}</p>
            </div>
        )
    }
    
    const orderDetail = orderResponse?.data?.data || {}
    return (
        <div className="p-8 bg-gray-300">
        <div className="bg-white">
            <div className="flex flex-row justify-between p-4">
                <Link to={`/pesanan/list?status=${backParams}`} className="flex flex-row items-center hover:text-wastra-brown-400">
                    <ChevronLeftIcon className="h-5"/>{"Kembali"}
                </Link>
                <div className="flex flex-col items-end md:items-center md:flex-row space-x-2 text-sm md:text-base">
                    <p>NO. PESANAN. {orderDetail.order_code}</p>
                    <p className="hidden md:flex">|</p>
                    <p className="text-amber-900 font-semibold">{orderDetail.order_status == 'cancelled'? 'Pesanan Dibatalkan' : orderDetail.payment_status == 'unpaid'? 'Menunggu Pembayaran' : "Sudah Dibayar"}</p>
                </div>
            </div>
            <hr />
            <div className="flex flex-col space-y-2">
                {
                    orderDetail?.items?.map((item) => ( 
                        <CardOrder
                            key={item.id}
                            name={item.name_at_purchase}
                            price={item.price_at_purchase}
                            qty={item.quantity}
                            id={item.id}
                        />
                    ))
                }
            </div>
            <hr />
            <div className="flex flex-row justify-between p-4">
                <p className="font-bold text-xl">Total</p>
                <p className="text-red-600 font-bold text-xl">Rp {formatNumber(orderDetail.total_amount)}</p>
            </div>
        </div>
        <div className="flex flex-col items-end mt-4 space-y-2">
            <Button
                loading={paymentMutation.isPending}
                onClick={() => {
                    Modal.confirm({
                        title: 'Bayar Sekarang!',
                        icon: <ExclamationTriangleIcon className="h-7" />,
                        content: 'Apakah anda yakin ingin membayar sekarang?',
                        okText: 'Ya',
                        cancelText: 'Batal',
                        okType: 'primary',
                        onOk: () => {
                            paymentMutation.mutate()
                        },
                    })
                }}
                disabled={orderDetail.order_status == 'cancelled'}
                className="w-32 rounded-none bg-wastra-brown-700 text-white font-semibold disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-white"
            >
                Bayar Sekarang
            </Button>
            <Button
                type="button"
                loading={cancelMutation.isPending}
                disabled={orderDetail.order_status == 'cancelled'}
                onClick={() => {
                    Modal.confirm({
                        title: 'Batalkan Pesanan!',
                        icon: <ExclamationTriangleIcon className="h-7" />,
                        content: 'Apakah anda yakin ingin membatalkan pesanan?',
                        okText: 'Ya',
                        cancelText: 'Batal',
                        okType: 'danger',
                        onOk: () => {
                            setIsOpenOverlay(true)
                        },
                    })
                }}
                className="w-32 rounded-none bg-red-700 text-white font-semibold disabled:cursor-not-allowed disabled:bg-gray-500"
            >
                Batalkan
            </Button>
        </div>
        <CancelOverlay 
            isOpen={isOpenOverlay}
            setIsOpen={setIsOpenOverlay}
            onFinish={onFinish}
            loading={cancelMutation.isPending}
        />
    </div>
  )
}

const CancelOverlay = (props) => {
    return (
        <div className={`${props.isOpen? '' : 'hidden'} fixed inset-0 bg-black/50 z-40 backdrop-blur-sm space-y-2`}>
             <div className="relative z-50 flex justify-center items-center h-full">
                <div className="bg-white p-6 rounded-lg shadow-xl md:w-[50%]">
                    <div className="flex justify-end">
                        <button onClick={() => props.setIsOpen(prev=>!prev)}>
                            <XMarkIcon className="h-6 w-6"/>
                        </button>
                    </div>
                    <h2 className="font-bold text-center">Kenapa Anda Membatalkan Pesanan Ini?</h2>
                    <Form layout="vertical" onFinish={(values) => props.onFinish(values)}>
                        <Form.Item
                            name={"reason"}
                            label={"Alasan"}
                            rules={[
                                {required: true, message: "Alasan wajib diisi"},
                            ]}
                        >
                            <TextArea
                                placeholder="masukan alasan pembatalan..."
                                autoSize={{minRows: 3}}
                                maxLength={255}
                                showCount
                            />
                        </Form.Item>
                        <Button
                            loading={props.loading}
                            htmlType="submit"
                            type="primary"
                            className="w-full bg-blue-600 font-bold text-white"
                        >
                            Kirim
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}

const CardOrder = (props) => {
    return (
        <div className="border-b last:border-0 p-4 hover:bg-gray-50 flex flex-row justify-between items-center transition-all">
            <div className="flex flex-row gap-x-4">
                <div className="p-3 flex justify-center items-center bg-gray-100 rounded-lg text-gray-500">
                    <ShoppingBagIcon className="h-8 w-8" />
                </div>
                <div className="flex flex-col">
                    <h2 className="font-semibold text-lg text-gray-800">{props.name}</h2>
                    <p className="text-sm text-gray-500">{`${props.status == 'unpaid'? 'Total Item:' : 'Jumlah:'} ${props.qty}`}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-red-600 font-bold text-lg">Rp {formatNumber(props.price)}</p>
            </div>
        </div>
    );
}

export default OrderDetail