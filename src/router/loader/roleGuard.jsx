import { redirect } from "react-router-dom"
import { message } from "antd"
import axiosClient from "../../api/AxiosClient" 

const roleGuard = (requiredRole) => async () => {
  const token = localStorage.getItem("AUTH_TOKEN")

  // 1. Cek Token dasar (Client-side check)
  if (!token) {
    message.warning('Login terlebih dahulu!')
    throw redirect('/masuk')
  }

  // 2. Panggil data terbaru dari server (Source of Truth)
  // Endpoint ini harus mengembalikan data user: { role, status, dll }
  const response = await axiosClient.get('user/profile')
  const user = response.data.data
  const { role, status } = user
  // 3. Validasi Role
  if (role !== requiredRole) {
    message.error('Anda tidak memiliki izin untuk halaman ini!')
    throw redirect('/')
  }
  // 4. Validasi Status Spesifik (Artisan)
  if (role === "artisan" && status !== "approved") {
    message.warning('Akun Anda masih dalam proses peninjauan.')
    throw redirect('/upcoming')
  }
  // Jika semua lolos, kembalikan data user (bisa digunakan di komponen lewat useLoaderData)
  return null
}

export default roleGuard