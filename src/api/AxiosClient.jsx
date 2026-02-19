import axios from "axios"

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
    console.error("WARNING: VITE_API_BASE_URL is not defined! API requests might fail.");
}

const axiosClient = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
    },
})

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("AUTH_TOKEN")

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('AUTH_TOKEN')
            localStorage.removeItem('ROLE')
            localStorage.removeItem("USER_ID")
            localStorage.removeItem("STATUS")
        }

        return Promise.reject(error)
    }
)

export default axiosClient