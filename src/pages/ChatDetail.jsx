import { useParams } from 'react-router-dom'
import { Input, Button, Spin } from 'antd'
import { useState, useEffect, useRef } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useMessages } from '../hooks/MessagesHooks'
import conversationApi from '../api/ConversationsApi'
import echo from '../lib/echo'
import formatJam from '../utils/formatJam'
import formatTanggal from '../utils/formatTanggal'

const ChatDetail = () => {
  useEffect(()=>{
    document.title = "Chat | Wastra Digital"  
  }, [])

  const { conversationId } = useParams()
  const [body, setBody] = useState('')
  const queryClient = useQueryClient()
  const messagesEndRef = useRef(null)

  const { data: messages = [], isLoading } = useMessages(conversationId)

  const sendMessage = useMutation({
    mutationFn: (text) =>
      conversationApi.send(conversationId, {
        body: text,
      }),
    onSuccess: () => {
      setBody('')
    },
    onError: (err) => {
      console.error(err)
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!conversationId) return

    const channelName = `chat.${conversationId}`
    const channel = echo.private(channelName)

    const handler = (e) => {
      queryClient.setQueryData(
        ['messages', conversationId],
        (old = []) => {
          if (old.some(msg => msg.id === e.message.id)) {
            return old
          }
          return [...old, e.message]
        }
      )
    }

    channel.listen('.message.sent', handler)

    return () => {
      channel.stopListening('.message.sent', handler)
      echo.leave(channelName)
    }
  }, [conversationId, queryClient])

  return (
    <div className="flex flex-col bg-gray-300 min-h-screen">
      {/* MESSAGE LIST */}
      <div className="flex-1 overflow-y-auto px-4 py-4 mb-12">
        {messages.length === 0 && (
          <div className="text-center text-gray-500">
            Belum ada pesan
          </div>
        )}

        {messages.map((msg, index) => {
          // Ambil pesan sebelumnya untuk perbandingan tanggal
          const prevMsg = messages[index - 1];
          
          // Cek apakah tanggal pesan saat ini berbeda dengan pesan sebelumnya
          // Gunakan formatTanggal yang HANYA mengembalikan tanggal (tanpa jam)
          const isDifferentDay = !prevMsg || formatTanggal(msg.created_at) !== formatTanggal(prevMsg.created_at);

          return (
            <div key={msg.id} className='space-y-4'>
              {/* Tampilkan pembatas tanggal hanya jika harinya berbeda */}
              {isDifferentDay && (
                <div className='flex w-full p-2 justify-center'>
                  <div className='rounded-lg p-2 bg-gray-100 text-xs text-gray-500 font-medium'>
                    {formatTanggal(msg.created_at)}
                  </div>
                </div>
              )}

              <div
                className={`mb-2 flex ${
                  msg.sender_id === Number(localStorage.getItem('USER_ID'))
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div className='flex flex-col'>
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.sender_id === Number(localStorage.getItem('USER_ID'))
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100'
                  }`}>
                    {msg.body}
                  </div>
                  <div className={`text-xs mt-1 mb-2 px-2 ${
                    msg.sender_id === Number(localStorage.getItem('USER_ID')) ? 'text-end' : 'text-start'
                  }`}>
                    {formatJam(msg.created_at)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {messages.length > 3 && (
          <div ref={messagesEndRef} />
        )}
      </div>

      {/* INPUT */}
      <div className="border-t p-3 flex gap-2 fixed bottom-0 w-full bg-white">
        <Input.TextArea
          value={body}
          disabled={sendMessage.isPending}
          onChange={e => setBody(e.target.value)}
          autoSize={{ minRows: 1, maxRows: 4 }}
          onPressEnter={(e) => {
            if (!e.shiftKey && !sendMessage.isPending) {
              e.preventDefault()
              if (body.trim()) {
                sendMessage.mutate(body)
              }
            }
          }}
        />

        <Button
          type="primary"
          loading={sendMessage.isPending}
          onClick={() => {
            if (!body.trim() || sendMessage.isPending) return
            sendMessage.mutate(body)
          }}
          disabled={!body.trim() || sendMessage.isPending}
        >
          Kirim
        </Button>
      </div>
    </div>
  )
}

export default ChatDetail