import axios from 'axios'

const api = axios.create({
    baseURL: window.location.hostname === 'localhost' 
        ? 'http://localhost:5001/api' 
        : 'https://company-panel-api.altuntech.com/api',
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('currentUser')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api