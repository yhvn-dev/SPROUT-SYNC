import axios from 'axios'


const api = axios.create({
  baseURL: 'http://sproutsync.online', // changed from http://localhost:5000
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
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (originalRequest.url.includes('/auth/refresh-token')) {
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
        const { data } = await axios.post(
          'http://sproutsync.online/auth/refresh-token', // changed from http://localhost:5000
          {},
          { withCredentials: true }
        )

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
