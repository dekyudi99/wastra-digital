import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button, Card, Row, Col, Tag, Descriptions, Divider, Avatar, Rate, Modal, message, Spin } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { 
  ShoppingCartIcon,
  UserIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import productApi from '../api/ProductApi'
import reviewApi from '../api/ReviewApi'
import formatTanggal from '../utils/formatTanggal'
import orderApi from '../api/OrderApi'

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1)
  const token = localStorage.getItem("AUTH_TOKEN")
  const isAuthenticated = !!token
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isImageModalVisible, setIsImageModalVisible] = useState(false)
  const queryClient = useQueryClient()
  
  const {data: productDetail, isLoading, isError, error} = useQuery({
    queryKey: ["detailProduct", id],
    queryFn: () => productApi.getById(id),
    staleTime: Infinity,
  })

  const addCart = useMutation({
    mutationFn: ({ id, quantity }) =>
      orderApi.addCart(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartCount"] })
      message.success('Produk ditambahkan ke keranjang')
    },
    onError: (error) => {
      message.error(
        error?.response?.data?.message || 'Gagal menambahkan ke keranjang'
      )
    },
  })

  const {data: review, isLoading: loadingReview, isError: errorReview, error: err} = useQuery({
    queryKey: ["review", productDetail?.data?.data[0].id],
    queryFn: () => reviewApi.getReviewProduct(productDetail?.data?.data[0].id),
    staleTime: Infinity,
  })
  
  const isArtisan = localStorage.getItem("ROLE") == "artisan"
  
  if (isLoading || loadingReview) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" />
      </div>
    )
  }
  
  if (isError || errorReview) {
    return (
      <div className="min-h-screen bg-wastra-brown-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-semibold text-wastra-brown-800 mb-4">
            {error?.name || err?.name}
          </h1>
          <p className="text-wastra-brown-600 mb-6">
            {error?.message || err?.message}
          </p>
          <Button
            type="primary"
            onClick={() => navigate('/produk')}
            className="bg-wastra-brown-600 hover:bg-wastra-brown-700"
            >
            Kembali ke Katalog
          </Button>
        </div>
      </div>
    )
  }

  const product = productDetail?.data?.data

  // Mock reviews data
  const reviews = review?.data?.data

  return (
    <div className="min-h-screen bg-wastra-brown-50 py-3 sm:py-4 md:py-6 lg:py-8 ">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <Link to="/produk">
          <Button 
            type="text" 
            icon={<ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="mb-4 sm:mb-6 text-wastra-brown-600 hover:text-wastra-brown-800 text-sm sm:text-base"
          >
            Kembali ke Katalog
          </Button>
        </Link>

        <Row gutter={[12, 12]} className="!mx-0">
        {/* Product Images */}
        <Col xs={24} md={12} className="!px-2 sm:!px-3 md:!px-4">
          <Card className="border border-wastra-brown-200 rounded-xl shadow-sm">
            {/* Main Image */}
            <div 
              className="h-48 sm:h-64 md:h-80 bg-wastra-brown-50 flex items-center justify-center rounded-lg mb-3 sm:mb-4 border border-wastra-brown-100 cursor-pointer hover:opacity-90 transition"
              onClick={() => setIsImageModalVisible(true)}
            >
              <img src={product[0].image_url[selectedImageIndex]} alt="" />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {product[0].image_url.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-square bg-wastra-brown-50 rounded cursor-pointer transition border-2 ${
                    selectedImageIndex === idx 
                      ? 'border-wastra-brown-600 ring-2 ring-wastra-brown-200' 
                      : 'border-wastra-brown-100 hover:border-wastra-brown-300'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <img src={img} alt="" className='h-full w-full'/>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Product Info */}
        <Col xs={24} md={12} className="!px-2 sm:!px-3 md:!px-4">
          <Card className="border border-wastra-brown-200 rounded-xl shadow-sm" bodyStyle={{ padding: '12px' }}>
            <div className="mb-3 sm:mb-4">
              <div className='flex flex-row'>
                <Tag color={product[0].category === 'Endek' ? 'blue' : 'gold'} className="mb-2 text-xs sm:text-sm">
                  {product[0].category === 'Endek' ? 'Endek' : 'Songket'}
                </Tag>
                <Tag color={'orange'} className={product[0].discount !== null && product[0].discount < 1? `hidden` : `mb-2 text-xs sm:text-sm`}>Hemat {product[0].discount}%</Tag>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-wastra-brown-800 leading-tight">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Rate disabled defaultValue={product[0].rating} allowHalf className="text-xs sm:text-sm" />
                <span className="text-wastra-brown-600 text-xs sm:text-sm">
                  {product.rating} ({product[0].review_count} ulasan)
                </span>
              </div>
              <div className='flex flex-row gap-2 items-center'>
                <p className="text-2xl sm:text-3xl font-bold text-red-600 mb-3 sm:mb-4">
                  {formatPrice(product[0].last_price)}
                </p>
                {product[0].discount !==null &&<p className="text-lg sm:text-xl font-bold text-gray-400 line-through mb-3 sm:mb-4">
                  {formatPrice(product[0].price)}
                </p>}
              </div>
            </div>

            <Divider className="my-3 sm:my-4" />

            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
                <Link to={`/artisan/${product[0].user.id}`} className="flex-1 min-w-0">
                  <Button 
                    type="link" 
                    icon={<UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                    className="p-0 text-wastra-brown-600 hover:text-wastra-brown-800 text-sm sm:text-base"
                  >
                    <span className="text-sm sm:text-base md:text-lg truncate block">Toko: {product[0].user.name}</span>
                  </Button>
                </Link>
                <Button
                  type="default"
                  icon={<ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  onClick={() => {
                    if (!isAuthenticated) {
                      Modal.confirm({
                        title: 'Login Diperlukan',
                        icon: <ExclamationCircleOutlined />,
                        content: 'Silakan login terlebih dahulu untuk chat dengan penjual.',
                        okText: 'Login',
                        cancelText: 'Batal',
                        okType: 'primary',
                        onOk: () => {
                          navigate(`/onboarding?redirect=${encodeURIComponent(`/produk/${product.id}`)}`)
                        },
                      })
                      return
                    }
                    navigate(`/chat/${product.artisan.id}?productId=${product.id}`)
                  }}
                  className="border-wastra-brown-300 text-wastra-brown-700 hover:bg-wastra-brown-50 hover:border-wastra-brown-400 text-xs sm:text-sm h-9 sm:h-10"
                >
                  Chat Penjual
                </Button>
              </div>
              {product[0].description && (
                <p className="text-sm sm:text-base text-wastra-brown-700 whitespace-pre-line leading-relaxed">
                  {product[0].description}
                </p>
              )}
            </div>

            <Divider className="my-3 sm:my-4" />

            <Descriptions title="Spesifikasi Produk" bordered column={1} className="mb-4 sm:mb-6 text-xs sm:text-sm">
              <Descriptions.Item label="Bahan">
                {product[0].material}
              </Descriptions.Item>
              <Descriptions.Item label="Lebar">
                {product[0].wide}
              </Descriptions.Item>
              <Descriptions.Item label="Panjang">
                {product[0].long}
              </Descriptions.Item>
            </Descriptions>

            <div className='flex flex-row items-center space-x-2 ml-2'>
              <p>Stock: </p>
              <button
                onClick={() => setQuantity(quantity-1)}
                disabled={quantity <= 1}
                className="p-1 rounded-full border hover:bg-gray-100 disabled:opacity-30"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity+1)}
                disabled={quantity==product[0]?.stock}
                className="p-1 rounded-full border hover:bg-gray-100"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
              <p>{product[0]?.stock} tersedia</p>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3">
              <Button 
                type="default" 
                size="large"
                icon={<ShoppingCartIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                className="flex-1 border-wastra-brown-300 text-wastra-brown-700 hover:bg-wastra-brown-50 hover:border-wastra-brown-400 h-11 sm:h-12 text-sm sm:text-base"
                disabled={isArtisan}
                onClick={() => {
                  if (isArtisan) {
                    Modal.warning({
                      title: 'Akses Dibatasi',
                      icon: <ExclamationCircleOutlined />,
                      content: 'Pengrajin tidak dapat menambahkan produk ke keranjang. Silakan gunakan akun pembeli untuk melakukan pembelian.',
                    })
                    return
                  }
                  
                  if (!isAuthenticated) {
                    Modal.confirm({
                      title: 'Login Diperlukan',
                      icon: <ExclamationCircleOutlined />,
                      content: 'Silakan login terlebih dahulu untuk menambahkan produk ke keranjang.',
                      okText: 'Login',
                      cancelText: 'Batal',
                      okType: 'primary',
                      onOk: () => {
                        navigate(`/masuk?redirect=${encodeURIComponent(`/produk/${product.id}`)}`)
                      },
                    })
                    return
                  }

                  addCart.mutate({
                    id: product[0].id,
                    quantity: quantity,
                  })
                }}
              >
                Tambah ke Keranjang
              </Button>
              <Button 
                type="primary" 
                size="large"
                className="flex-1 bg-red-600 hover:bg-red-700 border-none h-11 sm:h-12 text-sm sm:text-base"
                disabled={isArtisan}
                onClick={() => {
                  // ... validasi isArtisan & isAuthenticated tetap sama ...

                  // 1. Ambil data produk yang sedang dilihat (index 0 karena API Anda mengirim array)
                  const currentProduct = product[0];

                  // 2. Bungkus ke format yang dikenali halaman Checkout (meniru item keranjang)
                  const directItem = {
                    id: `direct-${currentProduct.id}`, // ID sementara agar tidak bentrok
                    product_id: currentProduct.id,
                    quantity: quantity,
                    product: currentProduct // Memasukkan object produk lengkap
                  };

                  const total = currentProduct.last_price * quantity;

                  // 3. Kirim ke checkout
                  navigate('/checkout', { 
                    state: { 
                      cartItemIds: null, // Berikan null untuk menandakan ini BUKAN dari keranjang
                      directProductId: currentProduct.id, // Tambahan info untuk API Direct Order
                      directQuantity: quantity,
                      totalAmount: total,
                      items: [directItem] // Dikirim sebagai array berisi 1 item
                    } 
                  });
                }}
              >
                Pesan Sekarang
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Reviews Section */}
      <div className="mt-12">
        <Card className="border border-wastra-brown-200 rounded-xl shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-wastra-brown-800 mb-2">
              Ulasan Pembeli
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Rate disabled defaultValue={product[0].rating} allowHalf className="text-lg" />
                <span className="text-xl font-semibold text-wastra-brown-800">
                  {product[0].rating}
                </span>
              </div>
              <span className="text-wastra-brown-600">
                dari {product[0].review_count} ulasan
              </span>
            </div>
          </div>

          <Divider className="my-6" />
          {
            reviews?.length === 0?
            <div>Belum ada Ulasan</div>
            :
            <div className="space-y-6">
              {reviews?.data.map((review) => (
                <div key={review.id} className="pb-6 border-b border-wastra-brown-100 last:border-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <Avatar 
                      size={48} 
                      icon={<UserIcon className="w-6 h-6" />}
                      className="bg-wastra-brown-200 text-wastra-brown-600 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-wastra-brown-800 mb-1">
                            {review.reviewer.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Rate disabled defaultValue={review.rating} className="text-sm" />
                            <span className="text-sm text-wastra-brown-500">
                              {formatTanggal(review.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-wastra-brown-700 mt-3 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }

          {reviews.length > 4 && (
            <div className="mt-6 text-center">
              <Button 
                type="link" 
                className="text-wastra-brown-600 hover:text-wastra-brown-800"
              >
                Lihat Semua Ulasan
              </Button>
            </div>
          )}
        </Card>
      </div>
      </div>

      {/* Image Modal */}
      <Modal
        open={isImageModalVisible}
        onCancel={() => setIsImageModalVisible(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: '800px' }}
        centered
        className="image-modal"
      >
        <div className="relative">
          <div className="aspect-square bg-wastra-brown-50 flex items-center justify-center rounded-lg border border-wastra-brown-100 mb-4">
            <img src={product[0].image_url[selectedImageIndex]} alt="" className='h-full'/>
          </div>
          
          {/* Navigation Arrows */}
          {product[0].image_url.length > 1 && (
            <>
              <Button
                type="text"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg border-none z-10"
                icon={<ChevronLeftIcon className="w-6 h-6" />}
                onClick={() => setSelectedImageIndex((prev) => 
                  prev === 0 ? product[0].image_url.length - 1 : prev - 1
                )}
              />
              <Button
                type="text"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg border-none z-10"
                icon={<ChevronRightIcon className="w-6 h-6" />}
                onClick={() => setSelectedImageIndex((prev) => 
                  prev === product[0].image_url.length - 1 ? 0 : prev + 1
                )}
              />
            </>
          )}
          
          {/* Thumbnail Navigation */}
          {product[0].image_url.length > 1 && (
            <div className="flex gap-2 justify-center mt-4">
              {product[0].image_url.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded cursor-pointer transition border-2 ${
                    selectedImageIndex === idx
                      ? 'border-wastra-brown-600 ring-2 ring-wastra-brown-200'
                      : 'border-wastra-brown-100 hover:border-wastra-brown-300'
                  } bg-wastra-brown-50 flex items-center justify-center`}
                >
                  <img src={img} alt="" className='w-full h-full'/> 
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default ProductDetail