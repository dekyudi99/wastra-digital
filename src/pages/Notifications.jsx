import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Badge } from 'antd'
import { UserIcon } from '@heroicons/react/24/outline'

const Notifications = () => {
  const navigate = useNavigate()

  const chats = [
    {
      id: 1,
      name: 'Ibu Made Sari',
      lastMessage: 'Ada yang ingin ditanyakan?',
      unread: true,
      // Jangan ada pesan buyer yang otomatis, hanya pesan seller atau kosong
      messages: [
        { from: 'seller', text: 'Ada yang ingin ditanyakan?' }
      ]
    },
    {
      id: 2,
      name: 'Pelangi Weaving',
      lastMessage: 'Produk tersedia',
      unread: true,
      messages: [
        { from: 'seller', text: 'Produk tersedia ya kak' }
      ]
    },
    {
      id: 3,
      name: 'Ibu Wayan Sari',
      lastMessage: 'Pesanan disiapkan',
      unread: false,
      messages: [
        { from: 'seller', text: 'Baik, saya siapkan pesanannya' }
      ]
    }
  ]

  return (
    <div className="h-[calc(100vh-80px)] bg-wastra-brown-50 overflow-x-hidden w-full">
      {/* ================= CHAT LIST ================= */}
      <div className="w-full max-w-4xl mx-auto bg-white shadow-inner overflow-y-auto h-full">

        <div className="sticky top-0 bg-white z-10 px-4 sm:px-5 py-4 border-b-2 border-wastra-brown-200">
          <h1 className="text-lg font-semibold text-wastra-brown-800">
            Pesan
          </h1>
        </div>

        <div className="px-2 sm:px-4">
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => {
                // Navigate langsung ke chat detail page
                navigate(`/chat/${chat.id}`)
              }}
              className="flex gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 cursor-pointer border-b border-wastra-brown-100 hover:bg-wastra-brown-50 transition-colors"
            >
              <Badge dot={chat.unread}>
                <Avatar
                  size={44}
                  icon={<UserIcon className="w-5 h-5" />}
                  className="bg-wastra-brown-300 text-wastra-brown-800 flex-shrink-0"
                />
              </Badge>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-wastra-brown-800 truncate text-sm sm:text-base">
                  {chat.name}
                </p>
                <p className="text-xs sm:text-sm text-wastra-brown-500 truncate mt-1">
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Notifications
