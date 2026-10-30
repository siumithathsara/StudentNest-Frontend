import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { CloseIcon, MenuIcon } from "./icons"
import Logo from "./Logo"
import { navItems } from "./navItems"
import NotificationBell from "./NotificationBell"
import UserMenu from "./UserMenu"

const SiteNavbar = () => {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const items = user ? navItems[user.role] : []

  return (
    <header className="sticky top-0 z-30 border-b border-nest-600 bg-nest-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" aria-label="StudentNest home">
            <Logo size="sm" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {items.map((item) =>
              item.soon ? (
                <span
                  key={item.label}
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-nest-300/60"
                >
                  {item.label}
                  <span className="rounded-full bg-nest-800 px-1.5 py-0.5 text-[10px] font-semibold text-nest-300">Soon</span>
                </span>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive ? "bg-nest-700 text-sand-400" : "text-nest-100 hover:bg-nest-800"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationBell />
          <UserMenu />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-xl border border-nest-300/30 text-sand-100 hover:bg-nest-700 md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="space-y-1 border-t border-nest-600 px-4 py-3 md:hidden" aria-label="Mobile">
          {items.map((item) => {
            const Icon = item.icon
            return item.soon ? (
              <div
                key={item.label}
                aria-disabled="true"
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-nest-300/60"
              >
                <Icon />
                <span className="flex-1">{item.label}</span>
                <span className="rounded-full bg-nest-800 px-2 py-0.5 text-[11px] font-semibold text-nest-300">Soon</span>
              </div>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive ? "bg-nest-700 text-sand-400" : "text-nest-100 hover:bg-nest-800"
                  }`
                }
              >
                <Icon />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      )}
    </header>
  )
}

export default SiteNavbar