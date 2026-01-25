import axiosClient from "./AxiosClient"

const productApi = {
    get: (params) => {
        return axiosClient.get('product', {params: params})
    },
    getById: (id) => {
        return axiosClient.get(`/product/${id}`)
    },
    songket: () => {
        return axiosClient.get('product/songket')
    },
    endek: () => {
        return axiosClient.get('product/endek')
    },
}

export default productApi