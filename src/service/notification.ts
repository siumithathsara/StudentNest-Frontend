import type { AppNotification } from "../types"
import api from "./api"

export const getNotifications = async (page = 1, limit = 10) => {
  const res = await api.get("/notifications", { params: { page, limit } })
  return res.data.data as { items: AppNotification[]; total: number; unread: number }
}

export const getUnreadCount = async () => {
  const res = await api.get("/notifications/unread-count")
  return res.data.data.count as number
}

export const markRead = async (id: string) => {
  await api.patch(`/notifications/${id}/read`)
}

export const markAllRead = async () => {
  await api.patch("/notifications/read-all")
}