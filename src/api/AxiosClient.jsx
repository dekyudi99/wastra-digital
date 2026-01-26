import axios from "axios"

const axiosClient = axios.create({
    // baseURL: 'http://localhost:8000/api/',
    baseURL: 'https://apiwastradigital.ikya.my.id/api/',
    headers: {
        "Content-Type": "application/json",
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
            // localStorage.removeItem('wastra.user')
            // localStorage.removeItem('wastra.role')
            
            // window.location.href = '/masuk'
        }

        
        return Promise.reject(error)
    }
)

export default axiosClient