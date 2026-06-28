import axios from 'axios'

/**
 * 共用 Axios 實例。
 * - 自動帶上 JWT / CSRF Token
 * - 401 統一導向登入
 */
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 2500,
  withCredentials: true, // 帶 cookie，配合後端 CSRF
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // 從 cookie 取 CSRF token（後端以 XSRF-TOKEN cookie 下發）
  const csrf = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1]
  if (csrf && !['get', 'head', 'options'].includes(config.method)) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrf)
  }
  return config
})

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      localStorage.removeItem('access_token')
      if (location.pathname !== '/login') {
        location.href = `/login?redirect=${encodeURIComponent(location.pathname)}`
      }
    }
    // 後端統一回傳 { code, message, data }
    const message = error.response?.data?.message || error.message || '系統發生錯誤'
    return Promise.reject(new Error(message))
  },
)

export default http
