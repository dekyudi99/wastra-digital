import Header from './Header'
import Footer from './Footer'
import { useLocation } from 'react-router-dom'

const Layout = ({ children }) => {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div key={location.pathname} className="page-transition">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout




