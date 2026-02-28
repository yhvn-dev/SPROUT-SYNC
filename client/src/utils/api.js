import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_DEV_URL || 'http://localhost:5000',
  withCredentials: true
})

let isRefreshing = false
let refreshSubscribers = []

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken))
  refreshSubscribers = []
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  
  // 🔥 SKIP AUTH HEADER FOR PUBLIC ROUTES
  const publicRoutes = ['/auth/login', '/auth/register']
  if (publicRoutes.some(route => config.url.includes(route))) {
    return config
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const originalUrl = originalRequest?.url || ''

    // 🔥 SKIP REFRESH FOR PUBLIC & REFRESH ROUTES
    const skipRefreshRoutes = [
      '/auth/login', 
      '/auth/register', 
      '/auth/refresh-token'
    ]
    
    if (skipRefreshRoutes.some(route => originalUrl.includes(route))) {
      return Promise.reject(error)
    }

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((token) => {
            if (!token) return reject(error)
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          })
        })
      }

      isRefreshing = true
      try {
        const { data } = await api.post('/auth/refresh-token', {}, { withCredentials: true })
        
        const newToken = data.accessToken
        localStorage.setItem('accessToken', newToken)

        isRefreshing = false
        onRefreshed(newToken)

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (err) {
        isRefreshing = false
        refreshSubscribers.forEach((cb) => cb(null))
        refreshSubscribers = []
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  }
)



export default api
