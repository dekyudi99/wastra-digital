import axiosClient from "./AxiosClient";

const conversationApi = {
    getAll: () => {
        return axiosClient.get('conversations')
    },
    getByConversation: (conversationId) => {
        return axiosClient.get(`conversations/${conversationId}/messages`)
    },
    send: (conversationId, payload) => {
        return axiosClient.post(`messages/${conversationId}`, payload)
    },
}

export default conversationApi