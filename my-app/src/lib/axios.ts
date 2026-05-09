import axios from 'axios'

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/v1' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Dev only: seed a mock token so requests don't fail with 401 ──
if (typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
  localStorage.setItem('accessToken', 'mock-token-replace-when-auth-is-ready')
}
// ─────────────────────────────────────────────────────────────────

export default api 