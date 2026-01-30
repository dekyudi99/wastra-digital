import { useNavigate } from 'react-router-dom'
import { Avatar, Badge, Spin } from 'antd'
import { UserIcon } from '@heroicons/react/24/outline'
import { useConversations } from '../hooks/ConversationsHooks'

const Notifications = () => {
  const navigate = useNavigate()
  const { data: chats = [], isLoading } = useConversations()

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spin />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-80px)] bg-wastra-brown-50 overflow-x-hidden w-full">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-inner overflow-y-auto h-full">

        <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b">
          <h1 className="text-lg font-semibold text-wastra-brown-800">
            Pesan
          </h1>
        </div>

        <div className="px-2 sm:px-4">
          {chats.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Belum ada percakapan
            </div>
          )}

          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="flex gap-3 px-4 py-4 cursor-pointer border-b hover:bg-wastra-brown-50"
            >
              {/* Avatar */}
              <Badge>
                <Avatar
                  size={44}
                  icon={<UserIcon className="w-5 h-5" />}
                  className="bg-wastra-brown-300 text-wastra-brown-800"
                />
              </Badge>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-wastra-brown-800 truncate">
                  {chat.user?.name ?? 'User'}
                </p>
                <p className="text-xs text-wastra-brown-500 truncate mt-1">
                  {chat.last_message ?? 'Belum ada pesan'}
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
