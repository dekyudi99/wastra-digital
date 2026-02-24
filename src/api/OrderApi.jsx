import axiosClient from "./AxiosClient"

const orderApi = {
    addCart: (id, quantity) => {
        return axiosClient.post(`cart/store/${id}`, {quantity})
    },
    getCart: () => {
        return axiosClient.get('cart/get')
    },
    plusCart: (id) => {
        return axiosClient.put(`cart/editCart/${id}?method=plus`)
    },
    minusCart: (id) => {
        return axiosClient.put(`cart/editCart/${id}?method=minus`)
    },
    deleteCart: (id) => {
        return axiosClient.delete(`cart/delete/${id}`)
    },
    cartCount: () => {
        return axiosClient.get(`cart/count`)
    },
    orderFromCart: (request) => {
        return axiosClient.post('/order/cart', request)
    },
    directOrder: (id, request) => {
        return axiosClient.post(`order/direct/${id}`, request)
    },
    orderIn: (page=1, status='all') => {
        return axiosClient.get(`order/in?page=${page}&status=${status}`)
    },
    orderInNewer: () => {
        return axiosClient.get('order/in/newer')
    },
    orderDetail: (id) => {
        return axiosClient.get(`order/show/${id}`)
    },
    updateStatus: (id, status) => {
        return axiosClient.put(`order-items/${id}/status`, { status });
    },
    confirmReceived: (id, status) => {
        return axiosClient.put(`order-items/${id}/confirm`, { status });
    },
    adminDashboardStats: () => {
        return axiosClient.get('admin/dashboard-stats');
    },
    myOrder: async (page = 1, status='semua') => {
        const response = await axiosClient.get(`order/myorder?page=${page}&status=${status}`);
        return response.data;
    },
    orderDetailStatus: (id) => {
        return axiosClient.get(`order/detail/${id}`)
    },
    cancelOrder: (id, reason) => {
        return axiosClient.post(`cancel/${id}`, { reason })
    },
    orderUnpaid: (page =1) => {
        return axiosClient.get(`order/unpaid?page=${page}`)
    },
    cancelOrderUnpaid: (id, reason) => {
        return axiosClient.post(`cancel/order/${id}`, {reason})
    },
    totalTransaction: () => {
        return axiosClient.get('order/total')
    }
}

export default orderApi