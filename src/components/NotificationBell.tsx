import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchNotifications, fetchUnreadCount, markAllRead, markRead } from "../store/notificationSlice"
import type { AppNotification } from "../types"
import { timeAgo } from "../util/date"
import { BellIcon } from "./icons"

const NotificationBell = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items, unread } = useAppSelector((s) => s.notifications)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dispatch(fetchUnreadCount())
    const id = setInterval(() => dispatch(fetchUnreadCount()), 30000)
    return () => clearInterval(id)
  }, [dispatch])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next) dispatch(fetchNotifications())
  }

  const handleClick = (n: AppNotification) => {
    if (!n.isRead) dispatch(markRead(n._id))
    setOpen(false)
    if (n.link) navigate(n.link)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={toggle}
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
        className="relative grid h-10 w-10 place-items-center rounded-xl border border-nest-300/30 text-sand-100 transition hover:bg-nest-700"
      >
        <BellIcon />
        {unread > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-sand-400 px-1 text-xs font-bold text-nest-950">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-3 top-[4.5rem] z-40 overflow-hidden rounded-2xl bg-white text-nest-900 shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96">
          <div className="flex items-center justify-between border-b border-nest-100 px-4 py-3">
            <h2 className="font-semibold">Notifications</h2>
            {unread > 0 && (
              <button onClick={() => dispatch(markAllRead())} className="text-sm font-medium text-nest-600 hover:underline">
                Mark all as read
              </button>
            )}
          </div>

          <ul className="max-h-96 overflow-y-auto">
            {items.length === 0 && <li className="px-4 py-8 text-center text-sm text-nest-600">No notifications yet.</li>}
            {items.map((n) => (
              <li key={n._id}>
                <button
                  onClick={() => handleClick(n)}
                  className={`flex w-full gap-3 border-b border-nest-100 px-4 py-3 text-left transition hover:bg-nest-100/60 ${
                    n.isRead ? "" : "bg-sand-100"
                  }`}
                >
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.isRead ? "bg-transparent" : "bg-sand-500"}`} />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{n.title}</span>
                    <span className="block text-sm text-nest-600">{n.message}</span>
                    <span className="mt-1 block text-xs text-nest-600/70">{timeAgo(n.createdAt)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default NotificationBell