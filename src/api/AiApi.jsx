import axiosClient from "./AxiosClient";

const aiApi = {
    getTopics: () => axiosClient.get('ai/topics').then(res => res.data),
    getMessages: (id) => axiosClient.get(`ai/topics/${id}/messages`).then(res => res.data),
    createTopic: () => axiosClient.post('ai/topics').then(res => res.data),
};

export default aiApi;