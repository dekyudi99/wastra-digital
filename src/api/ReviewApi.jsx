import axiosClient from "./AxiosClient";

const reviewApi = {
    getReviewProduct: (id) => {
        return axiosClient.get(`products/${id}/reviews`)
    },
    artisanReview: (id) => {
        return axiosClient.get(`artisan/review/${id}`)
    }
}

export default reviewApi