import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

// Auth calls go through Next.js route handlers (same origin → httpOnly cookie works)
export const authApi = axios.create({ baseURL: '/api/auth' })

// All other API calls go directly to the backend with the bearer token
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/v1',
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const { refreshToken, setAuth, clearAuth } = useAuthStore.getState()
      if (!refreshToken) {
        clearAuth()
        window.location.href = '/login'
        return Promise.reject(error)
      }
      try {
        const { data } = await authApi.post('/refresh', { refreshToken })
        setAuth(
          data.user ?? useAuthStore.getState().user!,
          data.accessToken,
          data.refreshToken
        )
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch {
        clearAuth()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default api