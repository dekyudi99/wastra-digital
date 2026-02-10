import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Tag, Avatar, Rate, Button, Modal, message, Spin } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { 
  ShoppingCartIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import userApi from '../api/UserApi'
import orderApi from '../api/OrderApi'
import conversationApi from '../api/ConversationsApi'

const ArtisanShop = () => {
  const token = localStorage.getItem("AUTH_TOKEN")
  const isAuthenticated = !!token
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const isArtisan = localStorage.getItem("ROLE") == "artisan"

  // 1. FETCH DATA TOKO & PRODUK DARI API
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['artisanShop', id],
    queryFn: () => userApi.getArtisan(id),
    enabled: !!id
  })

  const artisan = response?.data?.data
  const artisanProducts = artisan?.product || []

  // 2. MUTASI UNTUK MENAMBAH KE KERANJANG (API BASED)
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }) => orderApi.addCart(productId, quantity),
    onSuccess: (res) => {
      message.success(res.data.message || 'Berhasil ditambah ke keranjang')
      // Memperbarui badge keranjang secara global jika ada
      queryClient.invalidateQueries(['cartData']) 
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || 'Gagal menambah ke keranjang'
      message.error(errorMsg)
    }
  })

  const handleAddToCart = (product) => {
    // Proteksi: Pengrajin tidak boleh beli barang sendiri/orang lain
    if (isArtisan) {
      Modal.warning({
        title: 'Akses Dibatasi',
        icon: <ExclamationCircleOutlined />,
        content: 'Akun Pengrajin tidak dapat melakukan pembelian. Silakan gunakan akun pembeli.',
      })
      return
    }
    
    // Proteksi: Harus login
    if (!isAuthenticated) {
      Modal.confirm({
        title: 'Login Diperlukan',
        content: 'Silakan login terlebih dahulu untuk menambahkan produk ke keranjang.',
        okText: 'Login',
        onOk: () => navigate(`/onboarding?redirect=${encodeURIComponent(`/artisan/${id}`)}`),
      })
      return
    }
    
    // Eksekusi API addCart
    addToCartMutation.mutate({ productId: product.id, quantity: 1 })
  }

  const getConversation = useMutation({
    mutationFn: (userId) =>
      conversationApi.getOrCreate(userId),
    onSuccess: (res) => {
      navigate(`/chat/${res.data.data.conversation_id}`)
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-wastra-brown-50">
        <Spin size="large" tip="Memuat Toko..." />
      </div>
    )
  }

  if (isError || !artisan) {
    return (
      <div className="min-h-screen bg-wastra-brown-50 py-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-semibold text-wastra-brown-800 mb-4">Toko tidak ditemukan</h1>
          <Button type="primary" onClick={() => navigate('/produk')} className="bg-wastra-brown-600">
            Kembali ke Katalog
          </Button>
        </div>
      </div>
    )
  }

  // Kalkulasi statistik dari data produk API
  const totalProducts = artisanProducts.length
  const averageRating = totalProducts > 0 
    ? artisanProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / totalProducts 
    : 0
  const totalReviews = artisanProducts.reduce((sum, p) => sum + (p.review_count || 0), 0)

  return (
    <div className="min-h-screen bg-wastra-brown-50 py-6 overflow-x-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Toko */}
        <Card className="rounded-2xl shadow-sm mb-6 border-none overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start p-2">
            <Avatar 
              size={130} 
              src={artisan.profile_picture}
              icon={<UserIcon className="w-16 h-16" />}
              className="bg-wastra-brown-100 border-4 border-white shadow-md flex-shrink-0"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-wastra-brown-900 mb-2">{artisan.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-4">
                <Rate disabled defaultValue={averageRating} allowHalf className="text-sm" />
                <span className="text-wastra-brown-700 font-bold">{averageRating.toFixed(1)}</span>
                <span className="text-wastra-brown-400 text-xs">({totalReviews} ulasan)</span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-5 text-wastra-brown-600 mb-6">
                <div className="flex items-center gap-2"><ShoppingBagIcon className="w-5 h-5 text-amber-600"/> {totalProducts} Produk</div>
                <div className="flex items-center gap-2"><MapPinIcon className="w-5 h-5 text-red-500"/> {artisan?.address || "Penjual Belum Mengatur Alamat!"} </div>
              </div>
              <Button
                type="primary"
                size="large"
                icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />}
                onClick={() => getConversation.mutate(artisan.id)}
                className="bg-wastra-brown-600 hover:bg-wastra-brown-700 border-none px-10 rounded-full shadow-lg h-12"
              >
                Chat Penjual
              </Button>
            </div>
          </div>
        </Card>

        {/* Info & Statistik */}
        <Row gutter={[20, 20]} className="mb-8">
          <Col xs={24} md={16}>
            <Card title={<span className="text-lg font-bold">Tentang Toko</span>} className="rounded-xl border-none shadow-sm h-full">
              <p className="text-wastra-brown-700 leading-relaxed text-base">
                Selamat datang di toko resmi **{artisan.name}**. Kami berkomitmen menyediakan kain tradisional Bali 
                terbaik langsung dari pengrajin lokal. Temukan koleksi eksklusif kami mulai dari Endek Sidemen hingga Songket premium.
              </p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card title={<span className="text-lg font-bold">Statistik Performa</span>} className="rounded-xl border-none shadow-sm h-full">
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Koleksi</span>
                  <Tag color="blue" className="font-bold rounded-full">{totalProducts} Item</Tag>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Kepuasan Pelanggan</span>
                  <span className="font-bold text-wastra-brown-800">{averageRating.toFixed(1)} / 5.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Ulasan</span>
                  <span className="font-bold text-wastra-brown-800">{totalReviews} Feedback</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Daftar Produk */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-8 bg-amber-600 rounded-full" />
          <h2 className="text-2xl font-black text-wastra-brown-900 m-0">Katalog Produk Unggulan</h2>
        </div>

        <Row gutter={[20, 20]}>
          {artisanProducts.map((product) => (
            <Col xs={12} sm={8} md={6} lg={4} key={product.id}>
              <Card
                hoverable
                className="rounded-2xl overflow-hidden border-none shadow-sm hover:shadow-md transition-all flex flex-col h-full w-full"
                cover={
                  <Link to={`/produk/${product.id}`}>
                    <div className="h-48 sm:h-56 bg-gray-50 flex items-center justify-center relative group">
                      {product.image_url?.[0] ? (
                        <img src={product.image_url[0]} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      ) : (
                        <ShoppingBagIcon className="w-12 h-12 text-gray-200" />
                      )}
                      {product.discount && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                          DISKON {product.discount}%
                        </div>
                      )}
                    </div>
                  </Link>
                }
              >
                <div className="flex flex-col gap-2 flex-grow w-full">
                  <Tag color="gold" className="w-fit text-[10px] font-bold uppercase rounded-md">{product.category}</Tag>
                  <Link to={`/produk/${product.id}`}>
                    <h3 className="font-bold text-wastra-brown-800 line-clamp-2 hover:text-amber-700 text-sm sm:text-base leading-tight">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-auto">
                    <p className="text-base sm:text-lg font-black text-red-600 mb-3">{formatPrice(product.price)}</p>
                    <Button
                      block
                      type="primary"
                      icon={<ShoppingCartIcon className="w-4 h-4" />}
                      loading={addToCartMutation.isLoading && addToCartMutation.variables?.productId === product.id}
                      onClick={() => handleAddToCart(product)}
                      className="bg-wastra-brown-800 hover:bg-black border-none rounded-xl h-10 font-bold"
                    >
                      Tambah Ke Keranjang
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default ArtisanShop