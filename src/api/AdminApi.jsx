import axiosClient from "./AxiosClient";

const adminApi = {
    totalPendaftaran: () => {
        return axiosClient.get('admin/totalisArtisan')
    },
    listPendaftaran: (page = 1) => {
        return axiosClient.get(`/admin/artisan/list?page=${page}`)
    },
    confirm: (id) => {
        return axiosClient.put(`admin/confirm/${id}`)
    },
    totalActiveArtisan: () => {
        return axiosClient.get('admin/total/artisan/active')
    },
    listActiveArtisan: () => {
        return axiosClient.get('admin/listActiveArtisan')
    },
    deactive: (id) => {
        return axiosClient.put(`admin/deactive/${id}`)
    },
}

export default adminApi