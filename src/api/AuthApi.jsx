import axiosClient from "./AxiosClient"

const authApi = {
    register: (credentials) => {
        return axiosClient.post(
            'auth/register',
            credentials,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        )
    },
    login: (credentials) => {
        return axiosClient.post('auth/login', credentials)
    },
    otp: (credentials) => {
        return axiosClient.post('auth/email-verify', credentials)
    },
    sendToken: () => {
        return axiosClient.post('auth/send-token')
    },
    logout: () => {
        return axiosClient.post('auth/logout')
    },
    forgetPassword: (email) => {
        return axiosClient.post('auth/forget-password', email)
    }
}

export default authApi