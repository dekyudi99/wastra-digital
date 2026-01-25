import { redirect } from "react-router-dom"

const roleGuard = (requiredRole) => () => {
  const user = JSON.parse(
    localStorage.getItem('wastra.user')
  )

  const role = localStorage.getItem('wastra.role')

  // ❌ belum login
  if (!user?.token) {
    throw redirect('/login')
  }

  // ❌ role tidak sesuai
  if (role !== requiredRole) {
    throw redirect('/')
  }

  return null
}

export default roleGuard