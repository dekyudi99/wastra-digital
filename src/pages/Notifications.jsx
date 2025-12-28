import { useState } from 'react'
import { Avatar, Badge, Input } from 'antd'
import { UserIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

const Notifications = () => {
  const [activeChat, setActiveChat] = useState(null)
  const [message, setMessage] = useState('')

  const chats = [
    {
      id: 1,
      name: 'Ibu Made Sari',
      lastMessage: 'Ada yang ingin ditanyakan?',
      unread: true,
      messages: [
        { from: 'seller', text: 'Ada yang ingin ditanyakan?' },
        { from: 'user', text: 'Apakah stok masih ada?' }
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

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return
    activeChat.messages.push({ from: 'user', text: message })
    setMessage('')
  }

  return (
    <div className="h-[calc(100vh-80px)] bg-wastra-brown-50 flex overflow-hidden">

      {/* ================= LEFT : CHAT LIST ================= */}
      <div className="w-[360px] bg-white border-r-4 border-wastra-brown-200 shadow-inner overflow-y-auto">

        <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b-2 border-wastra-brown-200">
          <h1 className="text-lg font-semibold text-wastra-brown-800">
            Pesan
          </h1>
        </div>

        {chats.map(chat => (
          <div
            key={chat.id}
            onClick={() => setActiveChat(chat)}
            className={`flex gap-4 px-5 py-4 cursor-pointer border-b border-wastra-brown-100
              hover:bg-wastra-brown-50
              ${activeChat?.id === chat.id ? 'bg-wastra-brown-100' : ''}`}
          >
            <Badge dot={chat.unread}>
              <Avatar
                size={44}
                icon={<UserIcon className="w-5 h-5" />}
                className="bg-wastra-brown-300 text-wastra-brown-800"
              />
            </Badge>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-wastra-brown-800 truncate">
                {chat.name}
              </p>
              <p className="text-sm text-wastra-brown-500 truncate">
                {chat.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= RIGHT : CHAT DETAIL ================= */}
      <div className="flex-1 flex flex-col bg-white border-l-4 border-wastra-brown-200 shadow-inner">

        {!activeChat ? (
          <div className="flex-1 flex items-center justify-center text-wastra-brown-400">
            Pilih chat untuk mulai percakapan
          </div>
        ) : (
          <>
            {/* Header Chat */}
            <div className="px-6 py-4 border-b-2 border-wastra-brown-200 font-medium text-wastra-brown-800 bg-white">
              {activeChat.name}
            </div>

            {/* Messages */}
            <div className="flex-1 px-6 py-4 overflow-y-auto space-y-3 bg-wastra-brown-50">
              {activeChat.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[60%] px-4 py-2 rounded-2xl text-sm shadow-sm
                    ${msg.from === 'user'
                      ? 'ml-auto bg-wastra-brown-600 text-white'
                      : 'bg-white border border-wastra-brown-200 text-wastra-brown-700'
                    }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t-2 border-wastra-brown-200 bg-white flex items-center gap-3">
              <Input
                placeholder="Ketik pesan..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onPressEnter={sendMessage}
              />
              <button
                onClick={sendMessage}
                className="w-11 h-11 rounded-full bg-wastra-brown-600 flex items-center justify-center text-white hover:bg-wastra-brown-700"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Notifications
