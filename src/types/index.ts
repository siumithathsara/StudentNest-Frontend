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