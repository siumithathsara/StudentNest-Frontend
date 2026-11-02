import type { AdminBoarding, AdminStats, BoardingStatus, ManagedUser, UserStatus } from "../types"
import api from "./api"

export const getStats = async () => {
  const res = await api.get("/admin/stats")
  return res.data.data as AdminStats
}

export const getUsers = async (params: { status?: UserStatus; page: number; limit: number }) => {
  const res = await api.get("/admin/users", { params })
  return res.data.data as { items: ManagedUser[]; total: number; page: number; limit: number }
}

export const setUserStatus = async (
  id: string,
  body: { status: "APPROVED" | "REJECTED" | "SUSPENDED"; reason?: string }
) => {
  const res = await api.patch(`/admin/users/${id}/status`, body)
  return res.data
}

export const getBoardings = async (params: { status?: BoardingStatus; page: number; limit: number }) => {
  const res = await api.get("/admin/boardings", { params })
  return res.data.data as { items: AdminBoarding[]; total: number; page: number; limit: number }
}

export const setBoardingStatus = async (
  id: string,
  body: { status: "APPROVED" | "REJECTED"; reason?: string }
) => {
  const res = await api.patch(`/admin/boardings/${id}/status`, body)
  return res.data
}