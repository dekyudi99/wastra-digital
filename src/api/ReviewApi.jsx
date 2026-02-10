import axiosClient from "./AxiosClient";

const reviewApi = {
    getReviewProduct: (id) => {
        return axiosClient.get(`review/product/${id}`)
    },
}

export default reviewApi