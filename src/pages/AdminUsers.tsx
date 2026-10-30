import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import ReasonDialog from "../components/ReasonDialog"
import { getUsers, setUserStatus } from "../service/admin"
import type { ManagedUser, UserStatus } from "../types"
import { getErrorMessage } from "../util/errors"

const TABS: { value: UserStatus; label: string }[] = [
  { value: "PENDING_APPROVAL", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "SUSPENDED", label: "Suspended" }
]

const LIMIT = 10

type Action = "approve" | "reject" | "suspend" | "reactivate"

const ACTIONS: Record<UserStatus, Action[]> = {
  PENDING_APPROVAL: ["approve", "reject"],
  APPROVED: ["suspend"],
  REJECTED: ["approve"],
  SUSPENDED: ["reactivate"]
}

const LABELS: Record<Action, string> = {
  approve: "Approve",
  reject: "Reject",
  suspend: "Suspend",
  reactivate: "Reactivate"
}

const AdminUsers = () => {
  const [params, setParams] = useSearchParams()
  const status = (TABS.find((t) => t.value === params.get("status"))?.value ?? "PENDING_APPROVAL") as UserStatus

  const [users, setUsers] = useState<ManagedUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [dialog, setDialog] = useState<{ user: ManagedUser; action: "reject" | "suspend" } | null>(null)
  const [working, setWorking] = useState(false)
  const [dialogError, setDialogError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const data = await getUsers({ status, page, limit: LIMIT })
      setUsers(data.items)
      setTotal(data.total)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [status, page])

  useEffect(() => {
    load()
  }, [load])

  const changeTab = (value: UserStatus) => {
    setPage(1)
    setParams({ status: value })
  }

  const apply = async (user: ManagedUser, action: Action, reason?: string) => {
    setWorking(true)
    setDialogError("")
    setError("")
    try {
      const newStatus = action === "reject" ? "REJECTED" : action === "suspend" ? "SUSPENDED" : "APPROVED"
      await setUserStatus(user.id, { status: newStatus, reason })
      setDialog(null)
      await load()
    } catch (err) {
      const message = getErrorMessage(err)
      if (dialog) setDialogError(message)
      else setError(message)
    } finally {
      setWorking(false)
    }
  }

  const onAction = (user: ManagedUser, action: Action) => {
    if (action === "reject" || action === "suspend") {
      setDialogError("")
      setDialog({ user, action })
    } else {
      apply(user, action)
    }
  }

  const pages = Math.max(1, Math.ceil(total / LIMIT))

  return (
    <AppLayout title="Users">
      <p className="text-nest-300">Approve new students and boarding owners.</p>

      <div className="mt-6 flex gap-2 overflow-x-auto" role="tablist" aria-label="User status">
        {TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={status === t.value}
            onClick={() => changeTab(t.value)}
            className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-semibold transition ${status === t.value
                ? "border-sand-400 bg-sand-400 text-nest-950"
                : "border-nest-300/40 text-nest-100 hover:bg-nest-800"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div role="alert" className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl bg-white text-nest-900 shadow">
        {loading && <p className="p-6 text-center text-nest-600">Loading...</p>}
        {!loading && users.length === 0 && <p className="p-6 text-center text-nest-600">No users in this list.</p>}

        {!loading &&
          users.map((u) => (
            <div key={u.id} className="flex flex-col gap-3 border-b border-nest-100 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold">
                  {u.name}{" "}
                  <span className="ml-1 rounded-full bg-nest-100 px-2 py-0.5 text-xs font-semibold text-nest-800">{u.role}</span>
                </p>
                <p className="truncate text-sm text-nest-600">
                  {u.email}
                  {u.phone ? ` · ${u.phone}` : ""}
                </p>
                {u.rejectionReason && <p className="mt-1 text-sm text-red-700">Reason: {u.rejectionReason}</p>}
              </div>
              <div className="flex gap-2">
                {ACTIONS[u.status].map((a) => (
                  <button
                    key={a}
                    disabled={working}
                    onClick={() => onAction(u, a)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${a === "reject" || a === "suspend"
                        ? "border border-red-300 text-red-700 hover:bg-red-50"
                        : "bg-nest-800 text-sand-100 hover:bg-nest-900"
                      }`}
                  >
                    {LABELS[a]}
                  </button>
                ))}
              </div>
            </div>
          ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-nest-300">
        <span>
          {total} user{total === 1 ? "" : "s"}
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl border border-nest-300/40 px-3 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-nest-300/40 px-3 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {dialog && (
        <ReasonDialog
          title={`${LABELS[dialog.action]} ${dialog.user.name}`}
          confirmLabel={LABELS[dialog.action]}
          working={working}
          error={dialogError}
          onCancel={() => setDialog(null)}
          onConfirm={(reason) => apply(dialog.user, dialog.action, reason)}
        />
      )}
    </AppLayout>
  )
}

export default AdminUsers