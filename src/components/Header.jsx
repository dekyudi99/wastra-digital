import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Input, Avatar, Modal, Dropdown, Menu } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { 
  BellIcon, 
  Bars3Icon, 
  MagnifyingGlassIcon, 
  ShoppingBagIcon, 
  UserIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useUser } from '../contexts/UserContext'
import { useCart } from '../contexts/CartContext'
import { USER_ROLES } from '../utils/authRoles'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const { user, isAuthenticated, hasRole, logout } = useUser()
  const { cartItems } = useCart()
  
  // Hanya tampilkan cart count jika user sudah login
  const cartCount = isAuthenticated ? cartItems.length : 0
  const isArtisan = hasRole(USER_ROLES.ARTISAN)
  const isAdmin = hasRole(USER_ROLES.ADMIN)
  const isCustomer = hasRole(USER_ROLES.CUSTOMER)

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/produk?search=${encodeURIComponent(searchValue.trim())}`)
    } else {
      navigate('/produk')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const navLinkClass = (path) => {
    const isActive = location.pathname === path
    return [
      'text-sm font-medium transition-colors no-underline decoration-2 underline-offset-4 hover:underline',
      isActive
        ? 'text-wastra-brown-800 underline'
        : 'text-wastra-brown-600 hover:text-wastra-brown-800',
    ].join(' ')
  }

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-wastra-brown-100">
      <div className="container mx-auto px-4 pr-14">
        <div className="flex items-center justify-between h-20 gap-6">
          <Link to="/" className="flex-shrink-0 no-underline">
            <div className="flex flex-col leading-tight">
              <div className="text-base font-semibold text-wastra-brown-800 tracking-tight">
                Wastra Digital
              </div>
              <div className="text-xs text-wastra-brown-500 mt-0.5">
                Kain Tradisional Bali
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex flex-1 max-w-md">
            <div className="flex w-full items-stretch">
              <Input
                placeholder="Cari produk, kategori, atau pengrajin..."
                allowClear
                size="large"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 rounded-l-lg rounded-r-none border-r-0 h-12"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white rounded-r-lg w-12 h-12 flex items-center justify-center transition-colors border border-wastra-brown-600 border-l-0 flex-shrink-0"
              >
                <MagnifyingGlassIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-4 mr-10">
              <Link to="/" className={navLinkClass('/')}>Beranda</Link>
              <Link to="/produk" className={navLinkClass('/produk')}>Katalog Produk</Link>
              {isArtisan && (
                <>
                  <Link to="/pengrajin" className={navLinkClass('/pengrajin')}>Dashboard</Link>
                  <Link to="/pengrajin/produk" className={navLinkClass('/pengrajin/produk')}>Kelola Produk</Link>
                  <Link to="/pengrajin/pesanan" className={navLinkClass('/pengrajin/pesanan')}>Pesanan Masuk</Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" className={navLinkClass('/admin')}>Dashboard Admin</Link>
              )}
              {!isAuthenticated && (
                <Link to="/onboarding" className={navLinkClass('/onboarding')}>Masuk</Link>
              )}
            </nav>

            <div className="flex items-center gap-3 flex-shrink pr-8">

              {/* ✅ NOTIFIKASI */}
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    Modal.confirm({
                      title: 'Login Diperlukan',
                      icon: <ExclamationCircleOutlined />,
                      content: 'Silakan login terlebih dahulu untuk melihat notifikasi.',
                      okText: 'Login',
                      cancelText: 'Batal',
                      okType: 'primary',
                      onOk: () => {
                        navigate(`/onboarding?redirect=${encodeURIComponent('/notifications')}`)
                      },
                    })
                    return
                  }
                  navigate('/notifications')
                }}
                className="w-10 h-10 bg-wastra-brown-50 border border-wastra-brown-100 rounded-lg flex items-center justify-center text-wastra-brown-700 hover:bg-wastra-brown-100 transition-colors"
                aria-label="Notifikasi"
              >
                <BellIcon className="w-5 h-5" />
              </button>
              

              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    Modal.confirm({
                      title: 'Login Diperlukan',
                      icon: <ExclamationCircleOutlined />,
                      content: 'Silakan login terlebih dahulu untuk melihat keranjang.',
                      okText: 'Login',
                      cancelText: 'Batal',
                      okType: 'primary',
                      onOk: () => {
                        navigate(`/onboarding?redirect=${encodeURIComponent('/keranjang')}`)
                      },
                    })
                    return
                  }
                  navigate('/keranjang')
                }}
                className="w-10 h-10 bg-wastra-brown-50 border border-wastra-brown-100 rounded-lg flex items-center justify-center text-wastra-brown-700 hover:bg-wastra-brown-100 transition-colors relative"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-wastra-brown-600 text-white text-xs rounded-full flex items-center justify-center font-medium border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item 
                        key="logout" 
                        danger
                        onClick={() => {
                          logout()
                          navigate('/')
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <ArrowRightOnRectangleIcon className="w-4 h-4" />
                          <span>Keluar</span>
                        </div>
                      </Menu.Item>
                    </Menu>
                  }
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (isArtisan) {
                        navigate('/pengrajin/profil')
                      } else {
                        navigate('/profil')
                      }
                    }}
                    className="w-10 h-10 bg-wastra-brown-50 border border-wastra-brown-100 rounded-lg flex items-center justify-center text-wastra-brown-700 hover:bg-wastra-brown-100 transition-colors"
                  >
                    {user?.avatar ? (
                      <Avatar src={user.avatar} size={32} />
                    ) : (
                      <UserIcon className="w-5 h-5" />
                    )}
                  </button>
                </Dropdown>
              ) : (
                <Link
                  to="/onboarding"
                  className="w-10 h-10 bg-wastra-brown-50 border border-wastra-brown-100 rounded-lg flex items-center justify-center text-wastra-brown-700 hover:bg-wastra-brown-100 transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}

              <button
                type="button"
                className="md:hidden w-10 h-10 bg-wastra-brown-50 border border-wastra-brown-100 rounded-lg flex items-center justify-center text-wastra-brown-700 hover:bg-wastra-brown-100 transition-colors"
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
