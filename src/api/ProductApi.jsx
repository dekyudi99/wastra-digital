import axiosClient from "./AxiosClient"

const productApi = {
    get: (params) => {
        return axiosClient.get('product', {params: params})
    },
    myProduct: () => {
        return axiosClient.get('product/my')
    },
    getById: (id) => {
        return axiosClient.get(`product/${id}`)
    },
    store: (request) => {
        return axiosClient.post(
            `product/store`,
            request,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            },
        )
    },
    update: (id, request) => {
        return axiosClient.post(
            `update/product/${id}`,
            request,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            },
        )
    },
    delete: (id) => {
        return axiosClient.post(`product/delete/${id}`)
    },
    songket: () => {
        return axiosClient.get('product/songket')
    },
    endek: () => {
        return axiosClient.get('product/endek')
    },
}

export default productApi