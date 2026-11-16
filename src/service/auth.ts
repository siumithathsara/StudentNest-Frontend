import type { RegisterPayload } from "../types"
import api from "./api"

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password })
  return res.data
}

export const register = async (payload: RegisterPayload) => {
  const res = await api.post("/auth/register", payload)
  return res.data
}

export const getMyDetails = async () => {
  const res = await api.get("/auth/me")
  return res.data
}

export const forgotPassword = async (email: string) => {
  const res = await api.post("/auth/forgot-password", { email })
  return res.data
}

export const resetPassword = async (token: string, password: string) => {
  const res = await api.post("/auth/reset-password", { token, password })
  return res.data
}