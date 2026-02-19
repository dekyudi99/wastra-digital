import orderApi from "../api/OrderApi"
import { useQuery } from "@tanstack/react-query"
import { Spin, Pagination } from "antd"
import { useEffect, useState } from "react"
import { formatNumber } from "../utils/format"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { ShoppingBagIcon } from "@heroicons/react/24/outline"

const ListOrder = () => {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [searchParams, setSearchParams] = useSearchParams()
    const initialParams = searchParams.get('status') || 'semua'
    const [status, setStatus] = useState(initialParams)

    useEffect(()=>{
        document.title = "List Pesanan | Wastra Digital"
    }, [])

    const { data: orderResponse, isLoading: loadingOrder, isError: isErrorOrder, error: errorOrder } = useQuery({
        // Sertakan [page] di queryKey agar query otomatis lari saat page berubah
        queryKey: ["myOrder", page, status], 
        queryFn: () => orderApi.myOrder(page, status),
        keepPreviousData: true, // Menjaga data lama terlihat saat loading data baru
    });

    const categories = [
        {cat: 'semua', label: 'Semua'},
        {cat: 'unpaid', label: 'Menunggu Pembayaran'},
        {cat: 'pending', label: 'Menunggu Konfirmasi'},
        {cat: 'processing', label: 'Sedang Diproses'},
        {cat: 'shipped', label: 'Dikemas'},
        {cat: 'completed', label: 'Selesai'},
        {cat: 'cancelled', label: 'Dibatalkan'}
    ];

    if (isErrorOrder) {
        return (
        <div className="min-h-screen bg-wastra-brown-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-semibold text-wastra-brown-800 mb-4">
                {errorOrder?.name}
            </h1>
            <p className="text-wastra-brown-600 mb-6">
                {errorOrder?.message}
            </p>
            <button
                type="primary"
                onClick={() => navigate('/')}
                className="bg-wastra-brown-600 hover:bg-wastra-brown-700 p-2 rounded-lg text-white font-bold"
                >
                Kembali ke Beranda
            </button>
            </div>
        </div>
        )
    }

    const paginationData = orderResponse?.data || {};
    const listOrder = paginationData?.data || [];

  return (
        <div className="flex flex-col p-8 bg-gray-100 min-h-screen">
            <h1 className="font-bold text-2xl">Daftar Pesanan Anda!</h1>
            {/* Tab Filter Status */}
            <div className="flex flex-row space-x-4 p-4 border mb-4 bg-white overflow-x-auto">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => { setStatus(cat.cat); setPage(1); setSearchParams(`status=${cat.cat}`); }} // Reset ke hal 1 saat ganti status
                        className={`capitalize pb-2 px-2 transition-all ${
                            status === cat.cat 
                            ? "text-wastra-brown-600 border-b-2 border-wastra-brown-600 font-bold" 
                            : "text-gray-500 hover:text-wastra-brown-400"
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col bg-white p-4 shadow-sm rounded-lg">
                {
                    loadingOrder?
                    <div className="flex justify-center items-center">
                        <Spin size="large" ></Spin>
                    </div>
                    :
                    listOrder.length > 0 ? (
                        listOrder.map((order) => (
                            status == 'unpaid'?
                            <CardOrder
                                key={order.id}
                                name={order.order_code}
                                price={order.total_amount}
                                qty={order.total_item}
                                id={order.id}
                                status={status}
                            />
                            :
                            order.items.map((item) => (
                                <CardOrder
                                    key={item.id}
                                    name={item.name_at_purchase}
                                    price={item.price_at_purchase}
                                    qty={item.quantity}
                                    id={item.id}
                                    status={status}
                                />
                            ))
                        ))
                    ) : (
                        <p className="text-center py-10 text-gray-500">Belum ada pesanan.</p>
                    )
                }

                {/* Komponen Pagination Ant Design */}
                <div className="mt-8 flex justify-center">
                    {
                        loadingOrder?
                        <div></div>
                        :
                        <Pagination
                            current={paginationData.current_page}
                            pageSize={paginationData.per_page}
                            total={paginationData.total}
                            onChange={(p) => setPage(p)}
                            showSizeChanger={false}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

const CardOrder = (props) => {
    return (
        <Link to={props.status == 'unpaid'? `/pesanan/detail/unpaid/${props.id}?status=${props.status}` : `/pesanan/detail/${props.id}?status=${props.status}`} className="border-b last:border-0 p-4 hover:bg-gray-50 flex flex-row justify-between items-center transition-all">
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
        </Link>
    );
}

export default ListOrder