import type { PlaceResult } from "../types"
import api from "./api"

export const searchPlaces = async (q: string) => {
  const res = await api.get("/geo/search", { params: { q } })
  return res.data.data as PlaceResult[]
}

export const reversePlace = async (lat: number, lng: number) => {
  const res = await api.get("/geo/reverse", { params: { lat, lng } })
  return res.data.data as { address: string; city: string }
}