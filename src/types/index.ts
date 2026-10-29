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