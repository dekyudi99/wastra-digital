import { useQuery } from '@tanstack/react-query'
import conversationApi from '../api/ConversationsApi'

export const useMessages = (conversationId) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const res = await conversationApi.getByConversation(conversationId)
      return res.data.data
    },
    enabled: !!conversationId,
  })
}
