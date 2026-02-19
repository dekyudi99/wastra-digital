import { CheckCircleIcon } from "@heroicons/react/24/outline"
import { Link } from "react-router-dom"

const SuccessChangePassword = () => {
  return (
    <div className="flex flex-col items-center py-8 gap-2">
        <CheckCircleIcon width={"20%"} color="green"/>
        <h1 className="text-wrap text-center font-bold text-2xl">Password Anda Berhasil Diganti!</h1>
        <p className="text-wrap text-lg">Silakan masuk lagi! <Link to={'/masuk'} className="underline text-blue-500 hover:text-blue-800">Masuk</Link></p>
    </div>
  )
}

export default SuccessChangePassword