import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Avatar, Input, Button } from 'antd'
import { 
  ArrowLeftIcon,
  UserIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'
import { formatPrice } from '../utils/format'
import { getProductById } from '../utils/mockProducts'

const ChatDetail = () => {
  const { sellerId } = useParams()
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('productId')
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef(null)
  
  // Ensure message is always empty when component mounts or productId changes
  useEffect(() => {
    setMessage('')
  }, [productId, sellerId])

  // Mock seller data
  const seller = {
    id: parseInt(sellerId),
    name: sellerId === '1' ? 'Ibu Made Sari' : sellerId === '2' ? 'Pelangi Weaving' : 'Ibu Wayan Sari',
    isOnline: true
  }

  // Data produk jika productId ada
  const product = productId ? getProductById(productId) : null

  // Mock messages - jika ada productId (chat baru dari produk), mulai dengan chat kosong atau hanya pesan seller
  // Jika tidak ada productId (chat yang sudah ada), tampilkan riwayat chat
  const [messages, setMessages] = useState(() => {
    // Jika ada productId, ini chat baru dari produk, jangan ada pesan buyer yang otomatis
    if (productId) {
      // Hanya pesan seller pertama atau kosong
      return [
        {
          id: 1,
          sender: 'seller',
          text: 'Halo, terima kasih sudah tertarik dengan produk kami. Ada yang ingin ditanyakan?',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }
    // Jika tidak ada productId, tampilkan riwayat chat yang sudah ada
    return [
      {
        id: 1,
        sender: 'seller',
        text: 'Halo, terima kasih sudah tertarik dengan produk kami. Ada yang ingin ditanyakan?',
        time: '10:30'
      },
      {
        id: 2,
        sender: 'buyer',
        text: 'Halo, saya tertarik dengan produk ini. Apakah masih tersedia?',
        time: '10:32'
      },
      {
        id: 3,
        sender: 'seller',
        text: 'Ya, masih tersedia. Ada yang ingin ditanyakan lebih lanjut?',
        time: '10:33'
      }
    ]
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'buyer',
        text: message.trim(),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMessage])
      setMessage('')
      
      // Simulate seller reply after 1 second
      setTimeout(() => {
        const reply = {
          id: messages.length + 2,
          sender: 'seller',
          text: 'Terima kasih atas pesan Anda. Saya akan membalas segera.',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, reply])
      }, 1000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-wastra-brown-50 flex flex-col overflow-x-hidden w-full">
      {/* Header Chat */}
      <div className="bg-white border-b border-wastra-brown-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <button
              onClick={() => {
                if (productId) {
                  navigate(`/produk/${productId}`)
                } else {
                  navigate(-1)
                }
              }}
              className="flex items-center gap-1 flex-shrink-0 text-wastra-brown-600 hover:text-wastra-brown-800"
            >
              <ArrowLeftIcon className="w-6 h-6" />
              <span className="text-sm font-medium hidden sm:inline">Kembali</span>
            </button>
            
            <Avatar 
              size={40} 
              icon={<UserIcon className="w-5 h-5" />}
              className="bg-wastra-brown-200 text-wastra-brown-600 flex-shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-wastra-brown-800 text-lg">
                {seller.name}
              </h2>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${seller.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className="text-xs text-wastra-brown-500">
                  {seller.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Product Card if productId exists */}
          {product && (
            <Card className="mb-4 border border-wastra-brown-200 rounded-xl shadow-sm bg-wastra-brown-50">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-wastra-brown-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-wastra-brown-400 text-xs text-center px-2">
                    {product.name}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-wastra-brown-800 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-red-600">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Messages */}
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[70%] ${msg.sender === 'buyer' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.sender === 'seller' && (
                    <Avatar 
                      size={32} 
                      icon={<UserIcon className="w-4 h-4" />}
                      className="bg-wastra-brown-200 text-wastra-brown-600 flex-shrink-0"
                    />
                  )}
                  <div className={`rounded-2xl px-4 py-2 ${
                    msg.sender === 'buyer' 
                      ? 'bg-wastra-brown-600 text-white' 
                      : 'bg-white border border-wastra-brown-200 text-wastra-brown-800'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'buyer' ? 'text-white/70' : 'text-wastra-brown-500'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                  {msg.sender === 'buyer' && (
                    <Avatar 
                      size={32} 
                      icon={<UserIcon className="w-4 h-4" />}
                      className="bg-wastra-brown-400 text-white flex-shrink-0"
                    />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-wastra-brown-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-end gap-3">
            <Input.TextArea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              className="flex-1 rounded-lg border-wastra-brown-200"
            />
            <Button
              type="primary"
              icon={<PaperAirplaneIcon className="w-5 h-5" />}
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-wastra-brown-600 hover:bg-wastra-brown-700 border-none h-10 px-6 rounded-lg flex-shrink-0"
            >
              Kirim
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatDetail

