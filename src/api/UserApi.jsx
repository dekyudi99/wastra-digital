import axiosClient from "./AxiosClient";

const userApi = {
    profile: () => {
        return axiosClient.get('user/profile')
    },
    update: (request) => {
        return axiosClient.post(
            'user/profile/update',
            request,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            },
    )
    },
    changePassword: (request) => {
        return axiosClient.put('user/change-password', request)
    }
}

export default userApi