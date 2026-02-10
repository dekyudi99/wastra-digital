import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, NavLink, useSearchParams } from 'react-router-dom'
import { Input, Avatar, Modal, Dropdown, Menu, message, Spin, Drawer,Collapse } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { 
  BellIcon, 
  Bars3Icon, 
  MagnifyingGlassIcon, 
  ShoppingBagIcon, 
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useMutation } from '@tanstack/react-query'
import authApi from '../api/AuthApi'
import { useQuery } from '@tanstack/react-query'
import orderApi from '../api/OrderApi'
import IconWeb from '../assets/logoWastraDigital.png'
import userApi from '../api/UserApi'

const Header = () => {
  const [searchParams] = useSearchParams()
  const token = localStorage.getItem("AUTH_TOKEN");
  const role = localStorage.getItem("ROLE");
  const isAuthenticated = !!token;
  const location = useLocation()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const q = searchParams.get('search')
    if (q !== null) {
      setSearchValue(q)
    }
  }, [location.pathname])

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem("AUTH_TOKEN")
      localStorage.removeItem("ROLE")
      window.location.href = '/';
      message.success('Berhasil logout')
    },
    onError: () => {
      navigate('/', { replace: true })
    },
  })

  // 2. Gunakan properti 'enabled' untuk mengontrol eksekusi
  const { data: cartount, isLoading: isLoadingCart } = useQuery({
    queryKey: ["cartCount"],
    queryFn: orderApi.cartCount,
    // Query hanya jalan jika sudah login DAN rolenya 'customer'
    enabled: isAuthenticated && role === "customer",
    retry: false,
  });

  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: userApi.profile,
    enabled: isAuthenticated,
    staleTime: Infinity,
    retry: false,
  });
  
  // Hanya tampilkan cart count jika user sudah login
  const cartCount = cartount?.data?.data?.total || ''
  const user = userData?.data?.data || ''

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

  const MENU = [
    {
      label: 'Beranda',
      path: '/',
      roles: ['guest', 'customer', 'artisan', 'admin'],
    },
    {
      label: 'Katalog Produk',
      path: '/produk',
      roles: ['guest', 'customer', 'artisan', 'admin'],
    },
    {
      label: 'Pengrajin',
      roles: ['artisan'],
      children: [
        { label: 'Dashboard', path: '/pengrajin' },
        { label: 'Kelola Produk', path: '/pengrajin/produk' },
        { label: 'Pesanan Masuk', path: '/pengrajin/pesanan' },
      ],
    },
    {
      label: 'Admin',
      roles: ['admin'],
      children: [
        { label: 'Dashboard Admin', path: '/admin' },
      ],
    },
  ]

  return (
    <header className="bg-white fixed top-0 left-0 right-0 z-50 border-b border-wastra-brown-100 w-full flex flex-row justify-between">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-4">
          <Link to="/" className="flex-shrink-0 flex flex-row items-center gap-1 no-underline">
            <img src={IconWeb} alt="" className='h-12'/>
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
                placeholder="Cari produk..."
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
            <nav className="hidden md:flex items-center gap-4 mr-6">
              <NavLink 
                to="/" 
                end // Menggunakan 'end' agar rute '/' tidak aktif saat di sub-rute lain
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors decoration-2 underline-offset-4 ${
                    isActive 
                      ? 'text-wastra-brown-800 underline font-semibold' 
                      : 'text-wastra-brown-600 hover:text-wastra-brown-800 no-underline hover:underline'
                  }`
                }
              >
                Beranda
              </NavLink>

              <NavLink 
                to="/produk" 
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors decoration-2 underline-offset-4 ${
                    isActive 
                      ? 'text-wastra-brown-800 underline font-semibold' 
                      : 'text-wastra-brown-600 hover:text-wastra-brown-800 no-underline hover:underline'
                  }`
                }
              >
                Katalog Produk
              </NavLink>

              {user?.role === "artisan" && (
                <>
                  <NavLink 
                    to="/pengrajin" 
                    end
                    className={({ isActive }) => 
                      `text-sm font-medium transition-colors decoration-2 underline-offset-4 ${
                        isActive 
                          ? 'text-wastra-brown-800 underline font-semibold' 
                          : 'text-wastra-brown-600 hover:text-wastra-brown-800 no-underline hover:underline'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink 
                    to="/pengrajin/produk" 
                    className={({ isActive }) => 
                      `text-sm font-medium transition-colors decoration-2 underline-offset-4 ${
                        isActive 
                          ? 'text-wastra-brown-800 underline font-semibold' 
                          : 'text-wastra-brown-600 hover:text-wastra-brown-800 no-underline hover:underline'
                      }`
                    }
                  >
                    Kelola Produk
                  </NavLink>
                  <NavLink 
                    to="/pengrajin/pesanan" 
                    className={({ isActive }) => 
                      `text-sm font-medium transition-colors decoration-2 underline-offset-4 ${
                        isActive 
                          ? 'text-wastra-brown-800 underline font-semibold' 
                          : 'text-wastra-brown-600 hover:text-wastra-brown-800 no-underline hover:underline'
                      }`
                    }
                  >
                    Pesanan Masuk
                  </NavLink>
                </>
              )}

              {user?.role === "admin" && (
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => 
                    `text-sm font-medium transition-colors decoration-2 underline-offset-4 ${
                      isActive 
                        ? 'text-wastra-brown-800 underline font-semibold' 
                        : 'text-wastra-brown-600 hover:text-wastra-brown-800 no-underline hover:underline'
                    }`
                  }
                >
                  Dashboard Admin
                </NavLink>
              )}

              {!isAuthenticated && (
                <NavLink 
                  to="/masuk" 
                  className={({ isActive }) => 
                    `text-sm font-medium transition-colors decoration-2 underline-offset-4 ${
                      isActive 
                        ? 'text-wastra-brown-800 underline font-semibold' 
                        : 'text-wastra-brown-600 hover:text-wastra-brown-800 no-underline hover:underline'
                    }`
                  }
                >
                  Masuk
                </NavLink>
              )}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink pr-1 sm:pr-0">

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
                        navigate(`/masuk?redirect=${encodeURIComponent('/notifications')}`)
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
                      icon: <ExclamationCircleOutlined/>,
                      content: 'Silakan login terlebih dahulu untuk melihat keranjang.',
                      okText: 'Login',
                      cancelText: 'Batal',
                      okType: 'primary',
                      onOk: () => {
                        navigate(`/masuk?redirect=${encodeURIComponent('/keranjang')}`)
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
                    {isLoadingCart?
                      <Spin size='small'/>
                      :
                      cartCount
                    }
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item 
                        key="profile"
                        onClick={() => {navigate('/profil')}}
                      >
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4" />
                          <span>Profil</span>
                        </div>
                      </Menu.Item>
                      <Menu.Item
                        key="logout"
                        danger
                        onClick={() => {
                          Modal.confirm({
                            title: 'Konfirmasi Logout',
                            icon: <ExclamationCircleOutlined />,
                            content: 'Apakah Anda yakin ingin keluar?',
                            okText: 'Keluar',
                            cancelText: 'Batal',
                            okType: 'danger',
                            onOk: () => {
                              logoutMutation.mutate()
                            },
                          })
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
                    className="w-10 h-10 bg-wastra-brown-50 border border-wastra-brown-100 rounded-lg flex items-center justify-center text-wastra-brown-700 hover:bg-wastra-brown-100 transition-colors"
                  >
                    {user?.profile? (
                      <Avatar src={user?.profile} size={32} />
                    ) : (
                      <UserIcon className="w-5 h-5" />
                    )}
                  </button>
                </Dropdown>
              ) : (
                <Link
                  to="/masuk"
                  className="w-10 h-10 bg-wastra-brown-50 border border-wastra-brown-100 rounded-lg flex items-center justify-center text-wastra-brown-700 hover:bg-wastra-brown-100 transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden w-10 h-10 bg-wastra-brown-50 border border-wastra-brown-100 rounded-lg flex items-center justify-center text-wastra-brown-700 hover:bg-wastra-brown-100 transition-colors"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>

            </div>
          </div>
        </div>

        {/* Mobile navigation drawer */}
        <Drawer
          title="Menu"
          placement="left"
          width={280}
          onClose={() => setIsMobileMenuOpen(false)}
          open={isMobileMenuOpen}
        >
          <nav className="flex flex-col gap-2">
            {MENU.filter(menu =>
              menu.roles?.includes(user?.role || 'guest')
            ).map((menu) => {
              // MENU TANPA CHILD (link biasa)
              if (!menu.children) {
                return (
                  <NavLink
                    key={menu.label}
                    to={menu.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-2 px-2 rounded text-sm ${
                        isActive
                          ? 'bg-wastra-brown-100 text-wastra-brown-800 font-semibold'
                          : 'text-wastra-brown-600'
                      }`
                    }
                  >
                    {menu.label}
                  </NavLink>
                )
              }

              // MENU DENGAN CHILD (dropdown)
              return (
                <Collapse
                  key={menu.label}
                  ghost
                  items={[
                    {
                      key: menu.label,
                      label: (
                        <span className="font-medium text-wastra-brown-700">
                          {menu.label}
                        </span>
                      ),
                      children: (
                        <div className="flex flex-col gap-2 pl-3">
                          {menu.children.map((child) => (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={({ isActive }) =>
                                `block py-1 text-sm ${
                                  isActive
                                    ? 'text-wastra-brown-800 font-semibold'
                                    : 'text-wastra-brown-600'
                                }`
                              }
                            >
                              {child.label}
                            </NavLink>
                          ))}
                        </div>
                      ),
                    },
                  ]}
                />
              )
            })}

            {!isAuthenticated && (
              <NavLink
                to="/masuk"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-3 py-2 text-sm text-wastra-brown-700 font-medium"
              >
                Masuk
              </NavLink>
            )}
          </nav>
        </Drawer>
      </div>
    </header>
  )
}

export default Header
