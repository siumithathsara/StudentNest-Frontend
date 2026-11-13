import type { BookingList, BookingStatus, MyBooking, ReceivedBookingList } from "../types"
import api from "./api"

export interface BookingListParams {
  status?: BookingStatus[]
  page?: number
  limit?: number
}

const toParams = (p: BookingListParams) => ({
  page: p.page,
  limit: p.limit,
  status: p.status?.length ? p.status.join(",") : undefined
})

// student
export const createBooking = async (payload: { boardingId: string; moveInDate: string; message?: string }) => {
  const res = await api.post("/bookings", payload)
  return res.data
}

export const getMyBookings = async (p: BookingListParams) => {
  const res = await api.get("/bookings/mine", { params: toParams(p) })
  return res.data.data as BookingList<MyBooking>
}

export const cancelMyBooking = async (id: string) => {
  const res = await api.patch(`/bookings/${id}/cancel`)
  return res.data
}

// owner
export const getReceivedBookings = async (p: BookingListParams) => {
  const res = await api.get("/bookings/received", { params: toParams(p) })
  return res.data.data as ReceivedBookingList
}

export const decideBooking = async (
  id: string,
  body: { status: "APPROVED" | "REJECTED" | "CANCELLED"; reason?: string }
) => {
  const res = await api.patch(`/bookings/${id}/status`, body)
  return res.data
}