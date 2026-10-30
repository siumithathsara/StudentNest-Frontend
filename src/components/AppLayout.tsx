import type { ReactNode } from "react"
import { useAuth } from "../hooks/useAuth"
import AdminLayout from "./AdminLayout"
import SiteLayout from "./SiteLayout"

type AppLayoutProps = {
  title?: string
  children: ReactNode
}

const AppLayout = ({ title = "", children }: AppLayoutProps) => {
  const { user } = useAuth()

  // Admin → sidebar layout, Owner/Student → modern website layout
  if (user?.role === "ADMIN") return <AdminLayout title={title}>{children}</AdminLayout>
  return <SiteLayout>{children}</SiteLayout>
}

export default AppLayout