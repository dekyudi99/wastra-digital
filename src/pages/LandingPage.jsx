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

const LandingPage = () => {
  useRevealOnScroll()

  const categories = [
    { id: 1, name: 'Kain Endek', count: 24, image: '/category-endek.jpg' },
    { id: 2, name: 'Kain Songket', count: 18, image: '/category-songket.jpg' },
    { id: 3, name: 'Tenun Tradisional', count: 15, image: '/category-tenun.jpg' },
    { id: 4, name: 'Aksesoris', count: 12, image: '/category-aksesoris.jpg' },
  ]

  const featuredProducts = [
    { id: 1, name: 'Kain Endek Sidemen Motif Geometris', price: 350000, image: '/product-1.jpg', discount: 5 },
    { id: 2, name: 'Kain Songket Emas Klasik', price: 850000, image: '/product-2.jpg' },
    { id: 3, name: 'Kain Endek Modern Pattern', price: 420000, image: '/product-3.jpg', discount: 8 },
    { id: 4, name: 'Kain Songket Tradisional Bali', price: 950000, image: '/product-4.jpg' },
  ]

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="w-full bg-white">
      {/* Hero Section - Clean & Minimalist */}
      <section className="bg-wastra-brown-50 py-20 reveal">
        <div className="container mx-auto px-6">
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
              <div className="bg-gradient-to-br from-wastra-brown-100 to-wastra-brown-200 rounded-2xl p-12 aspect-square flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-wastra-brown-300 rounded-full mx-auto flex items-center justify-center">
                    <SparklesIcon className="w-16 h-16 text-wastra-brown-600" />
                  </div>
                  <p className="text-wastra-brown-700 text-sm">Koleksi Pilihan • Kualitas Terjaga</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category - Clean Cards */}
      <section className="py-16 bg-white reveal" style={{ '--reveal-delay': '60ms' }}>
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-wastra-brown-800">
              Beli Berdasarkan Kategori
            </h2>
            <p className="text-wastra-brown-600 mt-2">
              Temukan produk berdasarkan jenis kain dan koleksi.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} to="/produk">
                <Card
                  hoverable
                  className="border border-wastra-brown-100 rounded-xl overflow-hidden transition-all hover:shadow-lg"
                  cover={
                    <div className="bg-wastra-brown-50 aspect-square flex items-center justify-center">
                      <div className="w-20 h-20 bg-wastra-brown-200 rounded-full flex items-center justify-center">
                        <SparklesIcon className="w-10 h-10 text-wastra-brown-500" />
                      </div>
                    </div>
                  }
                >
                  <div className="text-center py-2">
                    <h3 className="font-medium text-wastra-brown-800 mb-1">{category.name}</h3>
                    <p className="text-sm text-wastra-brown-500">{category.count} Produk</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Clean Grid */}
      <section className="py-16 bg-wastra-brown-50 reveal" style={{ '--reveal-delay': '80ms' }}>
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-wastra-brown-800 mb-2">
              Produk Unggulan
            </h2>
            <p className="text-wastra-brown-600">
              Koleksi terpilih dari pengrajin terbaik
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/produk/${product.id}`}>
                <Card
                  hoverable
                  className="bg-white border border-wastra-brown-100 rounded-xl overflow-hidden transition-all hover:shadow-lg"
                  cover={
                    <div className="bg-wastra-brown-50 aspect-square flex items-center justify-center">
                      <div className="w-24 h-24 bg-wastra-brown-200 rounded-lg flex items-center justify-center">
                        <SparklesIcon className="w-12 h-12 text-wastra-brown-400" />
                      </div>
                    </div>
                  }
                >
                  <div className="py-3">
                    {product.discount && (
                      <span className="inline-block bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded mb-2">
                        -{product.discount}% OFF
                      </span>
                    )}
                    <h3 className="font-medium text-wastra-brown-800 mb-2 text-sm line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[1,2,3,4,5].map(i => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-wastra-brown-800">
                        {formatPrice(product.price)}
                      </p>
                      <Button 
                        size="small"
                        className="bg-wastra-brown-600 hover:bg-wastra-brown-700 text-white border-none rounded-lg"
                      >
                        + Keranjang
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
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
        <div className="container mx-auto px-6">
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
                  Transparan • Produk asli pengrajin • Cerita dan edukasi budaya
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
                    Endek • Songket • Tenun Tradisional Sidemen
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Clean Icons */}
      <section className="py-20 bg-white reveal" style={{ '--reveal-delay': '120ms' }}>
        <div className="container mx-auto px-6">
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
        <div className="container mx-auto px-6">
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
