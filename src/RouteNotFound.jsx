import { useRouteError, Link } from "react-router-dom"
import { useEffect } from "react"

const RouteNotFound = () => {
    useEffect(()=>{
        document.title = "Not Found | Wastra Digital"
    }, [])

    const error = useRouteError()
  return (
    <div className="bg-white text-black w-screen h-screen flex flex-col justify-center items-center">
        <h1 className="font-bold text-4xl">Anda Telah Tersesat</h1>
        <p className="my-1">{error.statusText || error.message}</p>
        <p>Silakan Kembali Ke jalan Kebenaran, <Link href="/" className="text-blue-600 underline">Jalan Kebenaran</Link></p>
    </div>
  )
}

export default RouteNotFound