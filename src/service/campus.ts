import type { Campus, NearbyCampus } from "../types"
import api from "./api"

export interface CampusInput {
  name: string
  city: string
  lat: number
  lng: number
}

export const getCampuses = async () => {
  const res = await api.get("/campuses")
  return res.data.data as Campus[]
}

export const createCampus = async (data: CampusInput) => {
  const res = await api.post("/campuses", data)
  return res.data
}

export const updateCampus = async (id: string, data: CampusInput) => {
  const res = await api.put(`/campuses/${id}`, data)
  return res.data
}

export const deleteCampus = async (id: string) => {
  const res = await api.delete(`/campuses/${id}`)
  return res.data
}

export const getNearbyCampuses = async (lat: number, lng: number, radiusKm = 10) => {
  const res = await api.get("/campuses/nearby", { params: { lat, lng, radiusKm } })
  return res.data.data as NearbyCampus[]
}