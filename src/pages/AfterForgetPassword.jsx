import { EnvelopeIcon } from "@heroicons/react/24/outline" 

const AfterForgetPassword = () => {
  return (
    <div className="flex flex-col items-center py-8 gap-2">
        <EnvelopeIcon width={"20%"} color="brown"/>
        <h1 className="text-wrap text-center font-bold text-2xl">Link Ganti Password Telah Dikirim ke Email Anda!</h1>
        <p className="text-wrap text-lg">Silakan cek email anda!</p>
    </div>
  )
}

export default AfterForgetPassword