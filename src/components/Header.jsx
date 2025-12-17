import { Link, useLocation } from 'react-router-dom'
import { Input } from 'antd'
import { BellIcon, Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline'

const Header = () => {
  const location = useLocation()

  const navLinkClass = (path) => {
    const isActive = location.pathname === path
    return [
      'text-sm font-medium transition-colors',
      isActive ? 'text-wastra-brown-800' : 'text-wastra-brown-600 hover:text-wastra-brown-800',
    ].join(' ')
  }

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-wastra-brown-100">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Brand (temporary, will be replaced by logo) */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex flex-col leading-tight">
              <div className="text-base font-semibold text-wastra-brown-800 tracking-tight">
                Wastra Digital
              </div>
              <div className="text-xs text-wastra-brown-500 mt-0.5">
                Kain Tradisional Bali
              </div>
            </div>
          </Link>

          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-2xl">
            <div className="flex w-full items-stretch">
              <Input
                placeholder="Cari produk, kategori, atau pengrajin..."
                allowClear
                size="large"
                className="flex-1 rounded-l-lg rounded-r-none border-r-0 h-12"
              />
              <button
                type="button"
                className="bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white rounded-r-lg w-12 h-12 flex items-center justify-center transition-colors border border-wastra-brown-600 border-l-0 flex-shrink-0"
                aria-label="Cari"
              >
                <MagnifyingGlassIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Nav + Actions */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className={navLinkClass('/')}>Beranda</Link>
              <Link to="/produk" className={navLinkClass('/produk')}>Katalog Produk</Link>
              <Link to="/admin" className={navLinkClass('/admin')}>Admin</Link>
              <Link
                to="/onboarding"
                className="text-sm font-medium text-wastra-brown-600 hover:text-wastra-brown-800 transition-colors"
              >
                Masuk
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="w-10 h-10 bg-wastra-brown-50 border border-wastra-brown-100 rounded-lg flex items-center justify-center text-wastra-brown-700 hover:bg-wastra-brown-100 transition-colors"
                aria-label="Notifikasi"
              >
                <BellIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                className="w-10 h-10 bg-wastra-brown-50 border border-wastra-brown-100 rounded-lg flex items-center justify-center text-wastra-brown-700 hover:bg-wastra-brown-100 transition-colors relative"
                aria-label="Keranjang"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-wastra-brown-600 text-white text-xs rounded-full flex items-center justify-center font-medium border-2 border-white">
                  0
                </span>
              </button>

              <button
                type="button"
                className="w-10 h-10 bg-wastra-brown-50 border border-wastra-brown-100 rounded-lg flex items-center justify-center text-wastra-brown-700 hover:bg-wastra-brown-100 transition-colors"
                aria-label="Akun"
              >
                <UserIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                className="md:hidden w-10 h-10 bg-wastra-brown-50 border border-wastra-brown-100 rounded-lg flex items-center justify-center text-wastra-brown-700 hover:bg-wastra-brown-100 transition-colors"
                aria-label="Menu"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

