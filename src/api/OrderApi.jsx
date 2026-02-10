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
    orderIn: () => {
        return axiosClient.get('order/in')
    },
    orderDetail: (id) => {
        return axiosClient.get(`order/show/${id}`)
    },
    updateStatus: (id, status) => {
        return axiosClient.put(`order/update-status/${id}`, { status });
    },
    adminDashboardStats: () => {
        return axiosClient.get('admin/dashboard-stats');
    }
}

export default orderApi