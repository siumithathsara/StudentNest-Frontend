import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import { useAuth } from "../hooks/useAuth"
import { getStats, getUsers } from "../service/admin"
import { getNotifications } from "../service/notification"
import type { AdminStats, AppNotification, ManagedUser } from "../types"
import { timeAgo } from "../util/date"
import { getErrorMessage } from "../util/errors"

const card = "rounded-2xl bg-white p-5 text-nest-900 shadow"

const AdminPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [pending, setPending] = useState<ManagedUser[]>([])
  const [activity, setActivity] = useState<AppNotification[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
    
      const [s, p, a] = await Promise.allSettled([
        getStats(),
        getUsers({ status: "PENDING_APPROVAL", page: 1, limit: 5 }),
        getNotifications(1, 5)
      ])
      if (!active) return

      const errs: string[] = []
      if (s.status === "fulfilled") setStats(s.value)
      else errs.push(`Stats: ${getErrorMessage(s.reason)}`)
      if (p.status === "fulfilled") setPending(p.value.items)
      else errs.push(`Pending users: ${getErrorMessage(p.reason)}`)
      if (a.status === "fulfilled") setActivity(a.value.items)
      else errs.push(`Recent activity: ${getErrorMessage(a.reason)}`)

      setErrors(errs)
      setLoading(false)
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const u = stats?.users
  const b = stats?.boardings
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })

  const kpis = [
    { label: "Users waiting for approval", value: u?.pending, to: "/admin/users?status=PENDING_APPROVAL", highlight: true },
    { label: "Boardings waiting for approval", value: b?.pending, to: "/admin/boardings?status=PENDING", highlight: true },
    { label: "Approved users", value: u?.approved, to: "/admin/users?status=APPROVED" },
    { label: "Approved boardings", value: b?.approved, to: "/admin/boardings?status=APPROVED" },
    { label: "Campuses", value: stats?.campuses, to: "/admin/campuses" },
    { label: "Students / Owners", value: u ? `${u.students} / ${u.owners}` : undefined }
  ]

  const segments = u
    ? [
        { label: "Approved", value: u.approved, cls: "bg-nest-600" },
        { label: "Pending", value: u.pending, cls: "bg-sand-400" },
        { label: "Rejected", value: u.rejected, cls: "bg-red-400" },
        { label: "Suspended", value: u.suspended, cls: "bg-slate-400" }
      ]
    : []

  return (
    <AppLayout title="Dashboard">
      <p className="text-nest-300">
        {today}. Welcome back, <span className="font-semibold text-sand-100">{user?.name}</span>.
      </p>

      {errors.length > 0 && (
        <div role="alert" className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
          {errors.map((e) => (
            <p key={e}>{e}</p>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((k) => {
          const body = (
            <>
              <p className="text-sm font-medium text-nest-600">{k.label}</p>
              <p className="mt-1 text-4xl font-bold">{loading ? "…" : (k.value ?? "-")}</p>
            </>
          )
          const cls = `rounded-2xl p-5 shadow ${k.highlight ? "bg-sand-400 text-nest-950" : "bg-white text-nest-900"}`
          return k.to ? (
            <Link key={k.label} to={k.to} className={`${cls} transition hover:-translate-y-0.5`}>
              {body}
            </Link>
          ) : (
            <div key={k.label} className={cls}>
              {body}
            </div>
          )
        })}
      </div>

      {u && (
        <section className={`${card} mt-4`} aria-label="Users by status">
          <h2 className="font-semibold">Users by status</h2>
          <div
            className="mt-3 flex h-3 overflow-hidden rounded-full bg-nest-100"
            role="img"
            aria-label={segments.map((s) => `${s.label}: ${s.value}`).join(", ")}
          >
            {segments.map(
              (s) => s.value > 0 && <div key={s.label} className={s.cls} style={{ width: `${(s.value / Math.max(u.total, 1)) * 100}%` }} />
            )}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-nest-600">
            {segments.map((s) => (
              <li key={s.label} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${s.cls}`} />
                {s.label}: <b className="text-nest-900">{s.value}</b>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
       
        <section className={card} aria-label="Waiting for approval">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Users waiting for approval</h2>
            <Link to="/admin/users?status=PENDING_APPROVAL" className="text-sm font-semibold text-nest-600 hover:underline">
              View all
            </Link>
          </div>
          {!loading && pending.length === 0 && <p className="py-6 text-center text-sm text-nest-600">Nothing is waiting for approval.</p>}
          <ul className="mt-2 divide-y divide-nest-100">
            {pending.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {p.name}{" "}
                    <span className="ml-1 rounded-full bg-nest-100 px-2 py-0.5 text-xs font-semibold text-nest-800">{p.role}</span>
                  </p>
                  <p className="truncate text-sm text-nest-600">
                    {p.email} · {timeAgo(p.createdAt)}
                  </p>
                </div>
                <Link
                  to="/admin/users?status=PENDING_APPROVAL"
                  className="shrink-0 rounded-xl bg-nest-800 px-3 py-1.5 text-sm font-semibold text-sand-100 hover:bg-nest-900"
                >
                  Review
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={card} aria-label="Recent activity">
          <h2 className="font-semibold">Recent activity</h2>
          {!loading && activity.length === 0 && <p className="py-6 text-center text-sm text-nest-600">No activity yet.</p>}
          <ul className="mt-2 divide-y divide-nest-100">
            {activity.map((n) => (
              <li key={n._id} className="flex gap-3 py-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.isRead ? "bg-nest-300" : "bg-sand-500"}`} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-sm text-nest-600">{n.message}</p>
                  <p className="mt-0.5 text-xs text-nest-600/70">{timeAgo(n.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppLayout>
  )
}

export default AdminPage