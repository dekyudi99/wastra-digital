import { Link } from 'react-router-dom'
import { Button, Card } from 'antd'
import { 
  SparklesIcon,
  LightBulbIcon,
  ArrowRightIcon,
  MapPinIcon,
  UserGroupIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import { useRevealOnScroll } from '../utils/useRevealOnScroll'
import endekImg from '../assets/endek.jpg'
import songketImg from '../assets/songket.jpg'
import { useQuery } from '@tanstack/react-query'
import productApi from '../api/ProductApi'

const LandingPage = () => {
  useRevealOnScroll()
  const {data: songket, isLoading: loadingSongket} = useQuery({
    queryKey: ['songket'],
    queryFn: productApi.songket,
    staleTime: Infinity,
  })

  const {data: endek, isLoading: loadingEndek} = useQuery({
    queryKey: ['endek'],
    queryFn: productApi.endek,
    staleTime: Infinity,
  })
  
  const {data: product, isLoading, isError, error} = useQuery({
    queryKey: ["product"],
    queryFn: productApi.get,
    staleTime: Infinity,
  })

  const categories = [
    {
      id: 1,
      name: 'Kain Endek',
      count: loadingEndek? 'Memuat...' : endek?.data?.data?.total || 0,
      image: endekImg,
      overlayFrom: 'from-wastra-brown-700/70',
      overlayVia: 'via-wastra-brown-600/35',
      overlayTo: 'to-transparent',
      textClass: 'text-wastra-brown-800',
      subTextClass: 'text-wastra-brown-600',
    },
    {
      id: 2,
      name: 'Kain Songket',
      count: loadingSongket? 'Memuat...' : songket?.data?.data?.total || 0,
      image: songketImg,
      overlayFrom: 'from-wastra-brown-600/60',
      overlayVia: 'via-wastra-brown-500/30',
      overlayTo: 'to-transparent',
      textClass: 'text-wastra-brown-800',
      subTextClass: 'text-wastra-brown-600',
    },
  ]

  const featuredProducts = [
    { id: 1, name: 'Kain Endek Sidemen Motif Geometris', price: 350000, image: '/product-1.jpg', discount: 5 },
    { id: 2, name: 'Kain Songket Emas Klasik', price: 850000, image: '/product-2.jpg' },
    { id: 3, name: 'Kain Endek Modern Pattern', price: 420000, image: '/product-3.jpg', discount: 8 },
    { id: 4, name: 'Kain Songket Tradisional Bali', price: 950000, image: '/product-4.jpg' },
    { id: 5, name: 'Kain Endek Premium Warna Alam', price: 680000, image: '/product-5.jpg', discount: 6 },
  ]

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* Hero Section - Clean & Minimalist */}
      <section className="bg-wastra-brown-50 py-20 reveal">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-sm text-wastra-brown-600 bg-white/70 border border-wastra-brown-100 rounded-full px-4 py-2 w-fit">
                  <MapPinIcon className="w-4 h-4" />
                  Desa Sidemen • Karangasem • Bali
                </div>
                <h1 className="text-5xl lg:text-6xl font-light text-wastra-brown-800 leading-tight">
                  Marketplace Wastra
                  <br />
                  <span className="font-semibold">Endek & Songket</span>
                </h1>
                <p className="text-lg text-wastra-brown-600 leading-relaxed max-w-lg">
                  Koleksi eksklusif kain Endek dan Songket dari pengrajin terbaik 
                  Desa Sidemen, Karangasem, Bali. Setiap helai kain adalah karya seni 
                  yang mempertahankan warisan budaya.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <Link to="/produk">
                  <Button 
                    size="large"
                    className="bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white border-none h-12 px-8 rounded-lg font-medium"
                  >
                    Jelajahi Katalog
                  </Button>
                </Link>
                <a href="#cara-kerja">
                  <Button
                    size="large"
                    className="bg-white hover:bg-wastra-brown-50 text-wastra-brown-700 border border-wastra-brown-200 h-12 px-8 rounded-lg"
                  >
                    Cara Kerja
                  </Button>
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-gradient-to-br from-wastra-brown-50 to-wastra-brown-100 rounded-2xl p-8 aspect-square overflow-hidden shadow-lg">
                {/* Main Fabric Image/Pattern - Visual Product Display */}
                <div className="absolute inset-0">
                  <div className="relative w-full h-full">
                    {/* Primary Endek Pattern - Main Visual */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-xl"
                      style={{ 
                        backgroundImage: `url(${endekImg})`,
                        backgroundSize: 'cover',
                        filter: 'brightness(1.05) saturate(1.1)',
                        transform: 'scale(1.1)',
                        transformOrigin: 'center'
                      }}
                    />
                    {/* Songket Pattern Overlay - Secondary Visual */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-xl opacity-40 mix-blend-overlay"
                      style={{ 
                        backgroundImage: `url(${songketImg})`,
                        backgroundSize: 'cover',
                        transform: 'scale(0.85) rotate(-8deg)',
                        transformOrigin: 'center'
                      }}
                    />
                    {/* Subtle Gradient Overlay for Depth */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-wastra-brown-50/10 to-wastra-brown-100/20 rounded-xl" />
                    {/* Light vignette effect */}
                    <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-wastra-brown-100/15 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category - Clean Cards */}
      <section className="py-16 bg-white reveal" style={{ '--reveal-delay': '60ms' }}>
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-wastra-brown-800">
              Beli Berdasarkan Kategori
            </h2>
            <p className="text-wastra-brown-600 mt-2">
              Temukan produk berdasarkan jenis kain dan koleksi.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to="/produk"
                className="max-w-xs mx-auto w-full no-underline hover:no-underline"
              >
                <Card
                  hoverable
                  className="bg-white border border-wastra-brown-100 rounded-xl overflow-hidden transition-all hover:shadow-md shadow-sm"
                  cover={
                    <div className="relative h-48">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${category.image})` }}
                      />
                      <div className={`absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t ${category.overlayFrom} ${category.overlayVia} ${category.overlayTo}`} />
                    </div>
                  }
                >
                  <div className="bg-white px-3 py-3 rounded-b-xl text-center">
                    <h3 className={`font-semibold mb-1 ${category.textClass}`}>{category.name}</h3>
                    <p className={`text-sm ${category.subTextClass}`}>{category.count} Produk</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Clean Grid */}
      <section className="py-16 bg-wastra-brown-50 reveal" style={{ '--reveal-delay': '80ms' }}>
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-wastra-brown-800">
              Produk Unggulan
            </h2>
            <p className="text-wastra-brown-600 mt-2">
              Koleksi terpilih dari pengrajin terbaik
            </p>
          </div>

          <div className="w-full overflow-hidden">
            <div className="px-16 sm:px-20 md:px-24 lg:px-28 xl:px-32 2xl:px-40">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 justify-items-center">
                {
                  isLoading?
                  <p className='text-center text-black p-4'>Memuat...</p>
                  :
                  isError?
                  <p className='text-center text-red-600'>{error?.message}</p>
                  :
                  product?.data?.data?.length === 0?
                  <p className='text-center text-black p-4'>Tidak ada produk tersedia!</p>
                  :
                  product?.data?.data.map((product)=>(
                    <Link
                      key={product.id}
                      to={`/produk/${product.id}`}
                      className="block no-underline hover:no-underline w-full"
                    >
                      <Card
                        hoverable
                        className="bg-white border border-wastra-brown-100 rounded-xl overflow-hidden transition-all hover:shadow-lg h-full flex flex-col w-full"
                        bodyStyle={{ padding: '16px 16px 18px 16px' }}
                        cover={
                          <div className="bg-wastra-brown-50 h-40 flex items-center justify-center" style={{ backgroundImage: `url(${product.image_url[0]})` }}>
                            {/* <div className="w-20 h-20 bg-wastra-brown-200 rounded-lg flex items-center justify-center" >
                              <SparklesIcon className="w-10 h-10 text-wastra-brown-400" />
                            </div> */}
                          </div>
                        }
                      >
                        <div className="py-2 flex flex-col gap-1.5 h-full">
                          {product.discount && (
                            <span className="inline-block bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full w-fit mb-1">
                              -{product.discount}% OFF
                            </span>
                          )}
                          <h3 className="font-medium text-wastra-brown-800 text-sm leading-snug line-clamp-2 min-h-[2.25rem]">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1,2,3,4,5].map(i => (
                                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <p className="text-lg font-semibold text-wastra-brown-800 leading-tight">
                              {formatPrice(product.last_price)}
                            </p>
                            <button
                              type="button"
                              className="w-10 h-10 bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white rounded-full flex items-center justify-center transition-colors"
                              aria-label="Tambah ke keranjang"
                            >
                              <ShoppingBagIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))
                }
            {/* {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/produk/${product.id}`}
                className="block no-underline hover:no-underline w-full"
              >
                <Card
                  hoverable
                  className="bg-white border border-wastra-brown-100 rounded-xl overflow-hidden transition-all hover:shadow-lg h-full flex flex-col w-full"
                  bodyStyle={{ padding: '16px 16px 18px 16px' }}
                  cover={
                    <div className="bg-wastra-brown-50 h-40 flex items-center justify-center">
                      <div className="w-20 h-20 bg-wastra-brown-200 rounded-lg flex items-center justify-center">
                        <SparklesIcon className="w-10 h-10 text-wastra-brown-400" />
                      </div>
                    </div>
                  }
                >
                  <div className="py-2 flex flex-col gap-1.5 h-full">
                    {product.discount && (
                      <span className="inline-block bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full w-fit mb-1">
                        -{product.discount}% OFF
                      </span>
                    )}
                    <h3 className="font-medium text-wastra-brown-800 text-sm leading-snug line-clamp-2 min-h-[2.25rem]">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1,2,3,4,5].map(i => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <p className="text-lg font-semibold text-wastra-brown-800 leading-tight">
                        {formatPrice(product.price)}
                      </p>
                      <button
                        type="button"
                        className="w-10 h-10 bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white rounded-full flex items-center justify-center transition-colors"
                        aria-label="Tambah ke keranjang"
                      >
                        <ShoppingBagIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))} */}
              </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link to="/produk">
              <Button className="bg-white hover:bg-wastra-brown-50 text-wastra-brown-700 border border-wastra-brown-200 rounded-lg h-11 px-6">
                Lihat Semua Produk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Storytelling: Sidemen & Artisans */}
      <section className="py-16 bg-white reveal" style={{ '--reveal-delay': '100ms' }}>
        <div className="w-full px-3 sm:px-4 md:px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-light text-wastra-brown-800 mb-3">
                Cerita di Balik Setiap Helai
              </h2>
              <p className="text-wastra-brown-600 leading-relaxed">
                Wastra Digital hadir untuk membantu pengrajin tenun Endek dan Songket di Desa Sidemen
                memasarkan produknya secara digital. Dengan membeli produk asli, Anda ikut menjaga
                warisan budaya dan mendukung ekonomi lokal.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <UserGroupIcon className="w-5 h-5 text-wastra-brown-600" />
                <p className="text-sm text-wastra-brown-600">
                  Produk asli pengrajin
                </p>
              </div>
            </div>
            <div className="bg-wastra-brown-50 border border-wastra-brown-100 rounded-2xl p-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-wastra-brown-100 rounded-xl p-5">
                  <p className="text-xs text-wastra-brown-500">Pengrajin</p>
                  <p className="text-2xl font-semibold text-wastra-brown-800 mt-1">12+</p>
                </div>
                <div className="bg-white border border-wastra-brown-100 rounded-xl p-5">
                  <p className="text-xs text-wastra-brown-500">Produk</p>
                  <p className="text-2xl font-semibold text-wastra-brown-800 mt-1">50+</p>
                </div>
                <div className="bg-white border border-wastra-brown-100 rounded-xl p-5 col-span-2">
                  <p className="text-xs text-wastra-brown-500">Fokus</p>
                  <p className="text-sm text-wastra-brown-700 mt-1">
                    Endek • Songket
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Clean Icons */}
      <section className="py-20 bg-white reveal" style={{ '--reveal-delay': '120ms' }}>
        <div className="w-full px-3 sm:px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-wastra-brown-800 mb-4">
              Mengapa Wastra Digital?
            </h2>
            <p className="text-wastra-brown-600 max-w-2xl mx-auto">
              Platform terpercaya untuk membeli kain tradisional Bali berkualitas tinggi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-wastra-brown-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="w-8 h-8 text-wastra-brown-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-wastra-brown-800">
                Koleksi Terbaik
              </h3>
              <p className="text-wastra-brown-600 text-sm leading-relaxed">
                Kain endek dan songket berkualitas tinggi langsung dari pengrajin terbaik Desa Sidemen
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-wastra-brown-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LightBulbIcon className="w-8 h-8 text-wastra-brown-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-wastra-brown-800">
                AI Design
              </h3>
              <p className="text-wastra-brown-600 text-sm leading-relaxed">
                Buat motif tenun unik sesuai gaya Anda dengan teknologi AI yang canggih
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="cara-kerja" className="py-16 bg-wastra-brown-50 reveal" style={{ '--reveal-delay': '140ms' }}>
        <div className="w-full px-3 sm:px-4 md:px-6 max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-light text-wastra-brown-800">Cara Belanja</h2>
            <p className="text-wastra-brown-600 mt-2">Alur sederhana untuk menemukan dan membeli wastra pilihan Anda.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-wastra-brown-100 rounded-2xl p-6">
              <div className="w-10 h-10 bg-wastra-brown-100 rounded-lg flex items-center justify-center mb-4">
                <SparklesIcon className="w-5 h-5 text-wastra-brown-700" />
              </div>
              <h3 className="text-base font-semibold text-wastra-brown-800">1) Pilih Kategori</h3>
              <p className="text-sm text-wastra-brown-600 mt-2">Mulai dari Endek, Songket, atau koleksi tenun tradisional.</p>
            </div>
            <div className="bg-white border border-wastra-brown-100 rounded-2xl p-6">
              <div className="w-10 h-10 bg-wastra-brown-100 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBagIcon className="w-5 h-5 text-wastra-brown-700" />
              </div>
              <h3 className="text-base font-semibold text-wastra-brown-800">2) Lihat Detail</h3>
              <p className="text-sm text-wastra-brown-600 mt-2">Baca cerita produk, spesifikasi, dan profil pengrajin.</p>
            </div>
            <div className="bg-white border border-wastra-brown-100 rounded-2xl p-6">
              <div className="w-10 h-10 bg-wastra-brown-100 rounded-lg flex items-center justify-center mb-4">
                <ArrowRightIcon className="w-5 h-5 text-wastra-brown-700" />
              </div>
              <h3 className="text-base font-semibold text-wastra-brown-800">3) Checkout</h3>
              <p className="text-sm text-wastra-brown-600 mt-2">Selesaikan pembelian dengan mudah (fitur checkout menyusul).</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Clean & Professional */}
      <section className="py-20 bg-wastra-brown-600 reveal" style={{ '--reveal-delay': '160ms' }}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-light text-white mb-4">
            Siap Memulai Perjalanan Anda?
          </h2>
          <p className="text-wastra-brown-100 text-lg mb-8 max-w-2xl mx-auto">
            Jelajahi koleksi kain tradisional kami dan temukan keindahan warisan budaya Bali
          </p>
          <Link to="/produk">
            <Button 
              size="large" 
              className="bg-white hover:bg-wastra-brown-50 text-wastra-brown-700 border-none h-12 px-8 rounded-lg font-medium"
              icon={<ArrowRightIcon className="w-5 h-5" />}
              iconPosition="end"
            >
              Jelajahi Katalog Produk
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
