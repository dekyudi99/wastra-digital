import { CheckBadgeIcon } from "@heroicons/react/24/outline"
import { Link } from "react-router-dom"

const PaymentSuccess = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-2 font-bold text-xl">
        <CheckBadgeIcon className="h-36 w-36 text-green-500 animate-bounce"/>
        <p>Pembayan Berhasil! Lihat <Link to={`/pesanan/list?status=pending`} className="text-blue-600 underline">Pesanan</Link></p>
    </div>
  )
}

export default PaymentSuccess