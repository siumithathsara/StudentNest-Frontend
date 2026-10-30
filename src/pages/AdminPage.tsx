import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import { getStats } from "../service/admin"
import type { AdminStats } from "../types"
import { getErrorMessage } from "../util/errors"

const AdminPage = () => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) => setError(getErrorMessage(err)))
  }, [])

  const u = stats?.users
  const cards = [
    { label: "Pending approval", value: u?.pending, to: "/admin/users?status=PENDING_APPROVAL", highlight: true },
    { label: "Approved users", value: u?.approved, to: "/admin/users?status=APPROVED" },
    { label: "Rejected", value: u?.rejected, to: "/admin/users?status=REJECTED" },
    { label: "Suspended", value: u?.suspended, to: "/admin/users?status=SUSPENDED" },
    { label: "Students", value: u?.students },
    { label: "Owners", value: u?.owners }
  ]

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-sand-100">Admin dashboard</h1>
      <p className="mt-1 text-nest-300">A quick look at who is using StudentNest.</p>

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const body = (
            <>
              <p className="text-sm font-medium text-nest-600">{c.label}</p>
              <p className="mt-1 text-4xl font-bold">{c.value ?? "-"}</p>
            </>
          )
          const cls = `rounded-2xl p-5 shadow ${c.highlight ? "bg-sand-400 text-nest-950" : "bg-white text-nest-900"}`
          return c.to ? (
            <Link key={c.label} to={c.to} className={`${cls} transition hover:-translate-y-0.5`}>
              {body}
            </Link>
          ) : (
            <div key={c.label} className={cls}>
              {body}
            </div>
          )
        })}
      </div>
    </AppLayout>
  )
}

export default AdminPage