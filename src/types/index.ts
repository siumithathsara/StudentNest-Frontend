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
}