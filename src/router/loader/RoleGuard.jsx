import { redirect } from "react-router-dom"
import { message } from "antd"

const roleGuard = (requiredRole) => () => {
  const token = localStorage.getItem("AUTH_TOKEN")

  const role = localStorage.getItem("ROLE")

  if (!token) {
    message.warning('Login terlebih dahulu untuk mengakses halaman itu!')
    throw redirect('/masuk')
  }

  if (role !== requiredRole) {
    message.warning('Anda tidak bisa mengakses halaman ini!')
    throw redirect('/')
  }

  if (localStorage.getItem("IS_ARTISAN") == "0" && role == "artisan") {
    message.warning('Anda tidak bisa mengakses halaman ini!')
    throw redirect('/upcoming')
  }

  return null
}

export default roleGuard