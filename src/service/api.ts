import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { clearTokens } from "../util/storage"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})


const PUBLIC_ENDPOINT = ["/auth/login", "/auth/register", "/auth/refresh"]
const isPublic = (url?: string) => PUBLIC_ENDPOINT.some((p) => url?.includes(p))

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN")
  if (token && !isPublic(config.url)) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined

    if (error.response?.status === 401 && original && !original._retry && !isPublic(original.url)) {
      original._retry = true
      try {
        const refreshToken = localStorage.getItem("REFRESH_TOKEN")
        if (!refreshToken) throw new Error("No refresh token available")

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, { refreshToken })
        const newToken = res.data.data.accessToken as string

        localStorage.setItem("ACCESS_TOKEN", newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        clearTokens()
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export default api