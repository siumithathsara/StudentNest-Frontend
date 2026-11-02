import type { Boarding } from "../types"
import api from "./api"

export const getMyBoardings = async () => {
  const res = await api.get("/boardings/mine")
  return res.data.data as Boarding[]
}

export const getMyBoarding = async (id: string) => {
  const res = await api.get(`/boardings/mine/${id}`)
  return res.data.data as Boarding
}

export const createBoarding = async (form: FormData) => {
  const res = await api.post("/boardings", form)
  return res.data
}

export const updateBoarding = async (id: string, form: FormData) => {
  const res = await api.put(`/boardings/${id}`, form)
  return res.data
}

export const deleteBoarding = async (id: string) => {
  const res = await api.delete(`/boardings/${id}`)
  return res.data
}