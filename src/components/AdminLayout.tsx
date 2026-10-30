import { useState, type ReactNode } from "react"
import AdminSidebar from "./AdminSidebar"
import { MenuIcon } from "./icons"
import NotificationBell from "./NotificationBell"
import UserMenu from "./UserMenu"

type AdminLayoutProps = {
  title: string
  children: ReactNode
}

const AdminLayout = ({ title, children }: AdminLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-dvh">
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="lg:pl-64">
       
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-nest-600 bg-nest-800 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-xl border border-nest-300/30 text-sand-100 hover:bg-nest-700 lg:hidden"
            >
              <MenuIcon />
            </button>
            <h1 className="truncate text-xl font-bold text-sand-100">{title}</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell />
            <UserMenu />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout