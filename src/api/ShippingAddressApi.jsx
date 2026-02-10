import axiosClient from "./AxiosClient";

const shippingAddressApi = {
    get: () => {
        return axiosClient.get('address')
    },
    getById: (id) => {
        return axiosClient.get(`address/${id}`)
    },
    store: (request) => {
        return axiosClient.post('address/store', request)
    },
    update: (id, request) => {
        return axiosClient.put(`address/update/${id}`, request)
    },
    delete: (id) => {
        return axiosClient.delete(`address/delete/${id}`)
    }
}

export default shippingAddressApi