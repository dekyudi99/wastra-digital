import { useParams } from 'react-router-dom'
import { Input, Button, Spin } from 'antd'
import { useState, useEffect, useRef } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useMessages } from '../hooks/MessagesHooks'
import conversationApi from '../api/ConversationsApi'
import echo from '../lib/echo'

const ChatDetail = () => {
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
    <div className="flex flex-col h-screen">
      {/* MESSAGE LIST */}
      <div className="flex-1 overflow-y-auto px-4 py-4 mb-12">
        {messages.length === 0 && (
          <div className="text-center text-gray-500">
            Belum ada pesan
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`mb-2 flex ${
              msg.sender_id === Number(localStorage.getItem('USER_ID'))
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div className="max-w-xs px-3 py-2 rounded-lg bg-gray-100">
              {msg.body}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="border-t p-3 flex gap-2 fixed bottom-0 w-full">
        <Input.TextArea
          value={body}
          onChange={e => setBody(e.target.value)}
          autoSize={{ minRows: 1, maxRows: 4 }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault()
              sendMessage.mutate(body)
            }
          }}
        />
        <Button
          type="primary"
          onClick={() => sendMessage.mutate(body)}
          disabled={!body.trim()}
        >
          Kirim
        </Button>
      </div>
    </div>
  )
}

export default ChatDetail