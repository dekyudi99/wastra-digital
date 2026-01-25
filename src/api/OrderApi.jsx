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
}

export default orderApi