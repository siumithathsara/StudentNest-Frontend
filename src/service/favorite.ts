import type { BoardingSummary } from "../types"
import api from "./api"

export const getFavoriteIds = async () => {
  const res = await api.get("/favorites/ids")
  return res.data.data as string[]
}

export const getFavorites = async () => {
  const res = await api.get("/favorites")
  return res.data.data as BoardingSummary[]
}

export const addFavorite = async (id: string) => {
  await api.put(`/favorites/${id}`)
}

export const removeFavorite = async (id: string) => {
  await api.delete(`/favorites/${id}`)
}