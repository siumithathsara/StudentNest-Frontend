import { useEffect, useRef, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { ChevronDownIcon, LogoutIcon } from "./icons"

const UserMenu = () => {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  if (!user) return null

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("")

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-xl border border-nest-300/30 py-1.5 pl-1.5 pr-2.5 text-sand-100 transition hover:bg-nest-700"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-sand-400 text-sm font-bold text-nest-950">
          {initials}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-medium leading-tight">{user.name}</span>
          <span className="block text-xs leading-tight text-nest-300">{user.role}</span>
        </span>
        <ChevronDownIcon className="h-4 w-4 text-nest-300" />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-40 mt-2 w-64 rounded-2xl bg-white p-2 text-nest-900 shadow-xl">
          <div className="px-3 py-2">
            <p className="truncate font-semibold">{user.name}</p>
            <p className="truncate text-sm text-nest-600">{user.email}</p>
            <span className="mt-2 inline-block rounded-full bg-sand-300 px-2 py-0.5 text-xs font-semibold text-nest-950">
              {user.role}
            </span>
          </div>
          <div className="my-1 border-t border-nest-100" />
          <button
            role="menuitem"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <LogoutIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu