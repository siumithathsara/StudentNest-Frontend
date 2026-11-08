import type { BoardingDetail, BoardingSummary, BrowseResult } from "../types"
import api from "./api"

export interface BrowseParams {
  campusId?: string
  radiusKm?: number
  minRent?: number
  maxRent?: number
  facilities?: string[]
  availableOnly?: boolean
  sort?: string
  page?: number
  limit?: number
}
export const browseBoardings = async (p: BrowseParams) => {
  const res = await api.get("/boardings", {
    params: { ...p, facilities: p.facilities?.length ? p.facilities.join(",") : undefined }
  })
  return res.data.data as BrowseResult
}

export const getBoardingDetail = async (id: string, campusId?: string) => {
  const res = await api.get(`/boardings/${id}`, { params: { campusId } })
  return res.data.data as BoardingDetail
}

export const compareBoardings = async (ids: string[], campusId?: string) => {
  const res = await api.get("/boardings/compare", { params: { ids: ids.join(","), campusId } })
  return res.data.data as BoardingSummary[]
}