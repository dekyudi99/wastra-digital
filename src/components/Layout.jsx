import Header from './Header'
import Footer from './Footer'
import { useLocation } from 'react-router-dom'

const Layout = ({ children }) => {
  const location = useLocation()

  // ❗ halaman yang TIDAK pakai footer
  const hideFooterRoutes = [
    '/notifications',
    '/chat'
  ]

  const shouldHideFooter = hideFooterRoutes.some(path =>
    location.pathname.startsWith(path)
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* MAIN */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* FOOTER */}
      {!shouldHideFooter && <Footer />}
    </div>
  )
}

export default Layout
