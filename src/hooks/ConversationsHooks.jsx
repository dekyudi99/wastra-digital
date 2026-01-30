import { useQuery } from '@tanstack/react-query'
import conversationApi from '../api/ConversationsApi'

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await conversationApi.getAll()
      return res.data.data
    },
  })
}
