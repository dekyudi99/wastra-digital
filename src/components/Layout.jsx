import Header from './Header'
import Footer from './Footer'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Layout = ({ children }) => {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)

  // ❗ halaman yang TIDAK pakai footer
  const hideFooterRoutes = [
    '/notifications',
    '/chat'
  ]

  const shouldHideFooter = hideFooterRoutes.some(path =>
    location.pathname.startsWith(path)
  )

  // Handle page transition dengan animasi fade
  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 200)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* MAIN dengan transisi */}
      <main 
        className={`flex-1 overflow-hidden transition-opacity duration-200 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="page-transition">
          {children}
        </div>
      </main>

      {/* FOOTER */}
      {!shouldHideFooter && <Footer />}
    </div>
  )
}

export default Layout
