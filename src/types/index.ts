export type Role = "ADMIN" | "OWNER" | "STUDENT"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  phone?: string
  status?: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role: Exclude<Role, "ADMIN">
  phone?: string
}

export type UserStatus = "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "SUSPENDED"

export interface ManagedUser {
  id: string
  name: string
  email: string
  phone?: string
  role: Role
  status: UserStatus
  rejectionReason?: string
  createdAt: string
}

export interface AppNotification {
  _id: string
  type: string
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: string
}

export interface AdminStats {
  users: {
    total: number
    pending: number
    approved: number
    rejected: number
    suspended: number
    students: number
    owners: number
  }
  boardings: { total: number; pending: number; approved: number; rejected: number }
  bookings: { total: number; pending: number; approved: number }
  campuses: number
}

export interface Campus {
  id: string
  name: string
  city: string
  lat: number
  lng: number
}

export interface NearbyCampus {
  id: string
  name: string
  city: string
  distanceKm: number
  walkMinutes: number
  vehicleMinutes: number
}

export interface PlaceResult {
  name: string
  lat: number
  lng: number
  city: string
}

export type BoardingStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface BoardingImage {
  url: string
  path: string
}

export interface Boarding {
  id: string
  title: string
  description: string
  city: string
  address: string
  monthlyRent: number
  totalRooms: number
  availableRooms: number
  facilities: string[]
  lat: number
  lng: number
  images: BoardingImage[]
  status: BoardingStatus
  rejectionReason?: string
  createdAt: string
}

export interface AdminBoarding extends Boarding {
  owner: { id: string; name: string; email: string; phone?: string } | null
}

export interface Travel {
  distanceKm: number
  walkMinutes: number
  vehicleMinutes: number
}

export interface BoardingSummary {
  id: string
  title: string
  city: string
  monthlyRent: number
  totalRooms: number
  availableRooms: number
  facilities: string[]
  coverImage: string | null
  imageCount: number
  lat: number
  lng: number
  travel?: Travel
}

export interface BrowseResult {
  items: BoardingSummary[]
  total: number
  page: number
  limit: number
  campus: { id: string; name: string; city: string } | null
}

export interface BoardingDetail {
  id: string
  title: string
  description: string
  city: string
  monthlyRent: number
  totalRooms: number
  availableRooms: number
  facilities: string[]
  images: string[]
  lat: number
  lng: number
  ownerName: string | null
  nearbyCampuses: NearbyCampus[]
  selectedCampus: NearbyCampus | null
  isFavorite: boolean
  contactVisible: boolean
  myBooking: { id: string; status: BookingStatus; moveInDate: string } | null
  requestBlockedReason: string | null
  contact: BookingContact | null
}
export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"

export interface BookingContact {
  ownerName: string | null
  phone: string | null
  email: string | null
  address: string
  lat: number
  lng: number
}

export interface MyBooking {
  id: string
  status: BookingStatus
  moveInDate: string
  message: string | null
  reason: string | null
  createdAt: string
  decidedAt: string | null
  boarding: { id: string; title: string; city: string; monthlyRent: number; coverImage: string | null } | null
  contact: BookingContact | null
}

export interface ReceivedBooking {
  id: string
  status: BookingStatus
  moveInDate: string
  message: string | null
  reason: string | null
  createdAt: string
  decidedAt: string | null
  student: { name: string; email: string } | null
  boarding: {
    id: string
    title: string
    city: string
    availableRooms: number
    totalRooms: number
    coverImage: string | null
  } | null
}

export interface BookingList<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export interface BookingCounts {
  PENDING: number
  APPROVED: number
  REJECTED: number
  CANCELLED: number
  all: number
}

export interface ReceivedBookingList extends BookingList<ReceivedBooking> {
  counts: BookingCounts
}