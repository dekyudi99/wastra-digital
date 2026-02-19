import orderApi from "../api/OrderApi"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { Spin, message, Modal, Button } from "antd"
import { useSearchParams, Link } from "react-router-dom"
import { 
    ChevronLeftIcon,
    DocumentTextIcon,
    ChevronDoubleRightIcon,
    BanknotesIcon,
    ArrowPathIcon,
    TruckIcon,
    ClipboardDocumentCheckIcon,
    StarIcon,
    NoSymbolIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline"
import { useEffect } from "react"

const OrderDetailStatus = () => {
    useEffect(()=>{
        document.title = "Detail Pesanan | Wastra Digital"
    }, [])

    const { id } = useParams()
    const [paramsBack] = useSearchParams()
    const backParams = paramsBack.get("status")
    const queryClient = useQueryClient()
    
    const {data: responseDetail, isLoading: loadingDetail, isError: isErrorDetail, error: errorDetail } = useQuery({
        queryKey: ["order", id],
        queryFn: () => orderApi.orderDetailStatus(id),
    })

    const cancelOrder = useMutation({
        mutationKey: ["order", id],
        mutationFn: (variables) => orderApi.cancelOrder(variables.id, variables.reason),
        onSuccess: () => {
            message.success("Pesanan telah dibatalkan!")
            queryClient.invalidateQueries({ queryKey: ["order", id] });
        },
        onError: (error) => {
            const errorMsg = error.response?.data?.message || "Gagal membatalkan pesanan!";
            message.error(errorMsg);
            console.error("Mutation Error:", error);
        }
    })

    if (loadingDetail) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large"/>
            </div>
        )
    }

    if (isErrorDetail) {
        return (
            <div className="flex flex-col gap-2 justify-center items-center h-screen">
                <h1 className="font-bold text-2xl text-red-700">{errorDetail.name}</h1>
                <p>{errorDetail?.response?.data?.messsage}</p>
            </div>
        )
    }

    const orderDetail = responseDetail?.data?.data || null

    const statusLabels = {
        pending: "Menunggu Konfirmasi",
        processing: "Sedang Diproses",
        shipped: "Sedang Dikirim",
        completed: "Pesanan Telah Sampai",
        finish: "Pesanan Selesai",
        cancelled: "Dibatalkan"
    }

    const statusRate = {
        pending: 0,
        processing: 1,
        shipped: 2,
        completed: 3,
        finish: 4,
        cancelled: 5,
    }

  return (
    <div className="bg-gray-300 p-8">
        <div className="bg-white">
            <div className="flex flex-row justify-between p-4 gap-2">
                <Link to={`/pesanan/list?status=${backParams}`} className="flex flex-row items-center hover:text-wastra-brown-400">
                    <ChevronLeftIcon className="h-5"/>{"Kembali"}
                </Link>
                <div className="flex flex-col items-end md:items-center md:flex-row space-x-2 text-sm md:text-base">
                    <p>NO. PESANAN. {orderDetail.order.order_code}</p>
                    <p className="hidden md:flex">|</p>
                    <p className="text-amber-900 font-semibold">{statusRate[orderDetail.item_status] == 5? statusLabels[orderDetail.item_status] : orderDetail.order.payment_status == 'unpaid'? 'Menunggu Pembayaran' : statusLabels[orderDetail.item_status]}</p>
                </div>
            </div>
            <hr />
            <div className="flex flex-col items-center md:items-start md:flex-row p-10">
                <IconStatus 
                    name={"Pesanan Dibuat"}
                    color={statusRate[orderDetail.item_status] == 5? `border-red-500` : statusRate[orderDetail.item_status] >= 0 ? 'border-green-500' : 'border-gray-500'}
                >
                    <DocumentTextIcon className="h-10" color={statusRate[orderDetail.item_status] == 5? `red` : `green`}/>
                </IconStatus>
                <IconArrow
                    status={statusRate[orderDetail.item_status]}
                />
                <IconStatus 
                    name={"Pesanan Dibayar"}
                    color={statusRate[orderDetail.item_status] == 5 ? `border-red-500` : orderDetail.order.payment_status == 'settled'? `border-green-500` : 'border-gray-500'}
                >
                    <BanknotesIcon className="h-10" color={statusRate[orderDetail.item_status] == 5? `red` : orderDetail.order.payment_status == 'settled'? `green` : 'gray'}/>
                </IconStatus>
                <IconArrow
                    status={statusRate[orderDetail.item_status]}
                />
                <IconStatus 
                    name={"Pesanan Diproses"}
                    color={statusRate[orderDetail.item_status] == 5? `border-red-500` : statusRate[orderDetail.item_status] >= 1 ? 'border-green-500' : 'border-gray-500'}
                >
                    <ArrowPathIcon className="h-10" color={statusRate[orderDetail.item_status] == 5? `red` : statusRate[orderDetail.item_status] >= 1 ? 'green' : 'gray'}/>
                </IconStatus>
                <IconArrow
                    status={statusRate[orderDetail.item_status]}
                />
                <IconStatus 
                    name={"Pesanan Diantarkan"}
                    color={statusRate[orderDetail.item_status] == 5? `border-red-500` : statusRate[orderDetail.item_status] >= 2 ? 'border-green-500' : 'border-gray-500'}
                >
                    <TruckIcon className="h-10" color={statusRate[orderDetail.item_status] == 5? `red` : statusRate[orderDetail.item_status] >= 2 ? 'green' : 'gray'}/>
                </IconStatus>
                <IconArrow
                    status={statusRate[orderDetail.item_status]}
                />
                <IconStatus 
                    name={"Pesanan Sampai"}
                    color={statusRate[orderDetail.item_status] == 5? `border-red-500` : statusRate[orderDetail.item_status] >= 3 ? 'border-green-500' : 'border-gray-500'}
                >
                    <ClipboardDocumentCheckIcon className="h-10" color={statusRate[orderDetail.item_status] == 5? `red` : statusRate[orderDetail.item_status] >= 3 ? 'green' : 'gray'}/>
                </IconStatus>
                <div className="h-20 w-1 rounded-sm mx-4 bg-gray-500 rotate-90 md:rotate-0"></div>
                <IconStatus 
                    name={statusRate[orderDetail.item_status] == 5 ? 'Pesanan Dibatalkan' : "Pesanan Selesai"}
                    color={statusRate[orderDetail.item_status] == 5? `border-red-500` : statusRate[orderDetail.item_status] >= 4 ? 'border-green-500' : 'border-gray-500'}
                >
                    {
                        statusRate[orderDetail.item_status] == 5?
                        <NoSymbolIcon className="h-10" color={'red'}/>
                        :
                        <StarIcon className="h-10" color={statusRate[orderDetail.item_status] >= 4 ? 'green' : 'gray'}/>
                    }
                </IconStatus>
            </div>
        </div>

        <div className="flex flex-col items-end mt-4 space-y-2">
            {
                (orderDetail.order.payment_status == 'unpaid' && orderDetail.item_status != 'cancelled')  && (
                    <Link
                        to={`/pesanan/detail/unpaid/${orderDetail.order.id}?status=${backParams}`}
                        className="p-2 w-48 text-center bg-orange-600 rounded-none text-sm hover:bg-white hover:text-orange-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Bayar
                    </Link>
                )
            }
            <Button
                disabled={statusRate[orderDetail.item_status]==5 || orderDetail.order.payment_status == 'unpaid'}
                className="p-2 w-48 bg-wastra-brown-700 rounded-none hover:bg-wastra-brown-500 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Tandai Selesai
            </Button>
            <Button
                loading={cancelOrder.isPending}
                onClick={ () =>
                    Modal.confirm({
                        title: 'Batalkan Pesanan!',
                        icon: <ExclamationTriangleIcon className="h-7" />,
                        content: 'Apakah anda yakin ingin membatalkan pesanan?',
                        okText: 'Ya',
                        cancelText: 'Batal',
                        okType: 'danger',
                        onOk: () => {
                            cancelOrder.mutate({ 
                                id: id, 
                                reason: "Pesanan Batal" 
                            });
                        },
                    })
                }
                disabled={statusRate[orderDetail.item_status]>2}
                className="p-2 bg-white rounded-none text-gray-800 w-48 hover:bg-gray-100 disabled:bg-gray-400 disabled:text-white disabled:cursor-not-allowed"
            >
                Batalkan
            </Button>
        </div>
    </div>
  )
}

const IconArrow = (props) => {
    return (
        <ChevronDoubleRightIcon 
            className="h-10 md:mt-2 rotate-90 md:rotate-0"
            color={props.status == 5? `red` : props.status >= 1 ? 'green' : 'gray'}
        />
    )
}

const IconStatus = (props) => {
    return (
        <div className="flex flex-col gap-1 justify-center items-center">
            <div className={`rounded-full border-4 ${props.color} p-2`}>
                {props.children}
            </div>
            <p>{props.name}</p>
        </div>
    )
}

export default OrderDetailStatus