import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import Logo from "./Logo"

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-dvh">
      <header className="border-b border-nest-600 bg-nest-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" aria-label="StudentNest home">
           <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight text-sand-100">{user?.name}</p>
              <p className="text-xs text-nest-300">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="rounded-xl border border-nest-300/40 px-3 py-2.5text-sm text-sand-100 transition hover:bg-nest-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}

export default AppLayout