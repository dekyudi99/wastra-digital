import IconUpcoming from "../assets/upcoming.png"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const Upcoming = () => {
    useEffect(()=>{
        document.title = "Upcoming | BUMDes Karya Lestari"
    }, [])

    const navigate = useNavigate()

    const handleBack = () => {
        navigate(-1)
    }
  return (
    <div className='font-bold text-3xl text-center h-screen w-full flex flex-col items-center justify-center gap-2'>
        <img src={IconUpcoming} alt="" className="h-72"/>
        <p>Status pengrajin anda belum dikonfirmasi!</p>
        <button onClick={handleBack} className="text-white font-bold text-lg p-2 rounded-lg bg-greenBG mt-4">Kembali</button>
    </div>
  )
}

export default Upcoming