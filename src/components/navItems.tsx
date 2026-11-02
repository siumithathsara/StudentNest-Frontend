import type { ComponentType } from "react"
import type { Role } from "../types"
import {
  BuildingIcon,
  CalendarIcon,
  CapIcon,
  DashboardIcon,
  HeartIcon,
  HomeIcon,
  SearchIcon,
  UsersIcon,
  type IconProps
} from "./icons"

export type NavItem = {
  to: string
  label: string
  icon: ComponentType<IconProps>
  end?: boolean
  soon?: boolean // tempory one 
}

export const navItems: Record<Role, NavItem[]> = {
  ADMIN: [
    { to: "/admin", label: "Dashboard", icon: DashboardIcon, end: true },
    { to: "/admin/users", label: "Users", icon: UsersIcon },
    { to: "/admin/boardings", label: "Boardings", icon: BuildingIcon },
    { to: "/admin/campuses", label: "Campuses", icon: CapIcon }
  ],
  OWNER: [
    { to: "/", label: "Home", icon: HomeIcon, end: true },
    { to: "/owner/boardings", label: "My boardings", icon: BuildingIcon},
    { to: "/owner/bookings", label: "Booking requests", icon: CalendarIcon, soon: true }
  ],
  STUDENT: [
    { to: "/", label: "Home", icon: HomeIcon, end: true },
    { to: "/boardings", label: "Find a boarding", icon: SearchIcon, soon: true },
    { to: "/bookings", label: "My bookings", icon: CalendarIcon, soon: true },
    { to: "/favorites", label: "Favorites", icon: HeartIcon, soon: true }
  ]
}