import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import ReasonDialog from "../components/ReasonDialog"
import StatusBadge from "../components/StatusBadge"
import { getBoardings, setBoardingStatus } from "../service/admin"
import type { AdminBoarding, BoardingStatus } from "../types"
import { getErrorMessage } from "../util/errors"
import { formatRent } from "../util/format"

const TABS: { value: BoardingStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" }
]

const LIMIT = 10

type Action = "approve" | "reject"

const ACTIONS: Record<BoardingStatus, Action[]> = {
  PENDING: ["approve", "reject"],
  APPROVED: ["reject"], 
  REJECTED: ["approve"]
}

const AdminBoardings = () => {
  const [params, setParams] = useSearchParams()
  const status = (TABS.find((t) => t.value === params.get("status"))?.value ?? "PENDING") as BoardingStatus

  const [items, setItems] = useState<AdminBoarding[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  const [dialog, setDialog] = useState<AdminBoarding | null>(null)
  const [working, setWorking] = useState(false)
  const [dialogError, setDialogError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const data = await getBoardings({ status, page, limit: LIMIT })
      setItems(data.items)
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

  const changeTab = (value: BoardingStatus) => {
    setPage(1)
    setExpanded(null)
    setParams({ status: value })
  }

  const apply = async (b: AdminBoarding, newStatus: "APPROVED" | "REJECTED", reason?: string) => {
    setWorking(true)
    setDialogError("")
    setError("")
    try {
      await setBoardingStatus(b.id, { status: newStatus, reason })
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

  const onAction = (b: AdminBoarding, action: Action) => {
    if (action === "reject") {
      setDialogError("")
      setDialog(b)
    } else {
      apply(b, "APPROVED")
    }
  }

  const pages = Math.max(1, Math.ceil(total / LIMIT))

  return (
    <AppLayout title="Boardings">
      <p className="text-nest-300">Check new listings before students can see them.</p>

      <div className="mt-6 flex gap-2 overflow-x-auto" role="tablist" aria-label="Boarding status">
        {TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={status === t.value}
            onClick={() => changeTab(t.value)}
            className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              status === t.value ? "border-sand-400 bg-sand-400 text-nest-950" : "border-nest-300/40 text-nest-100 hover:bg-nest-800"
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
        {!loading && items.length === 0 && <p className="p-6 text-center text-nest-600">No boardings in this list.</p>}

        {!loading &&
          items.map((b) => (
            <div key={b.id} className="border-b border-nest-100 p-4 last:border-b-0">
              <div className="flex flex-col gap-4 sm:flex-row">
                {b.images[0] ? (
                  <img src={b.images[0].url} alt={`${b.title} cover`} loading="lazy" className="h-32 w-full rounded-xl object-cover sm:h-28 sm:w-40" />
                ) : (
                  <div className="grid h-28 w-full place-items-center rounded-xl bg-nest-100 text-sm text-nest-600 sm:w-40">No photo</div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{b.title}</h2>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-sm text-nest-600">
                    {formatRent(b.monthlyRent)} / month · {b.availableRooms} of {b.totalRooms} rooms free · {b.city}
                  </p>
                  <p className="truncate text-sm text-nest-600">{b.address}</p>
                  {b.owner && (
                    <p className="text-sm text-nest-600">
                      Owner: {b.owner.name} · {b.owner.email}
                      {b.owner.phone ? ` · ${b.owner.phone}` : ""}
                    </p>
                  )}
                  {b.rejectionReason && <p className="mt-1 text-sm text-red-700">Reason: {b.rejectionReason}</p>}
                  <button
                    onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                    className="mt-2 text-sm font-semibold text-nest-600 hover:underline"
                    aria-expanded={expanded === b.id}
                  >
                    {expanded === b.id ? "Hide details" : "View details"}
                  </button>
                </div>

                <div className="flex gap-2 sm:flex-col">
                  {ACTIONS[b.status].map((a) => (
                    <button
                      key={a}
                      disabled={working}
                      onClick={() => onAction(b, a)}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
                        a === "reject" ? "border border-red-300 text-red-700 hover:bg-red-50" : "bg-nest-800 text-sand-100 hover:bg-nest-900"
                      }`}
                    >
                      {a === "approve" ? "Approve" : "Reject"}
                    </button>
                  ))}
                </div>
              </div>

              {expanded === b.id && (
                <div className="mt-4 rounded-xl bg-nest-100/50 p-4">
                  <p className="whitespace-pre-line text-sm">{b.description}</p>

                  {b.facilities.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {b.facilities.map((f) => (
                        <span key={f} className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-nest-800">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {b.images.map((img) => (
                      <a key={img.path} href={img.url} target="_blank" rel="noreferrer">
                        <img src={img.url} alt="Boarding photo" loading="lazy" className="h-24 w-full rounded-lg object-cover" />
                      </a>
                    ))}
                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${b.lat},${b.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-sm font-semibold text-nest-600 hover:underline"
                  >
                    View location on Google Maps →
                  </a>
                </div>
              )}
            </div>
          ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-nest-300">
        <span>
          {total} boarding{total === 1 ? "" : "s"}
        </span>
        <div className="flex items-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-xl border border-nest-300/40 px-3 py-2 disabled:opacity-40">
            Previous
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="rounded-xl border border-nest-300/40 px-3 py-2 disabled:opacity-40">
            Next
          </button>
        </div>
      </div>

      {dialog && (
        <ReasonDialog
          title={`Reject "${dialog.title}"`}
          confirmLabel="Reject"
          working={working}
          error={dialogError}
          onCancel={() => setDialog(null)}
          onConfirm={(reason) => apply(dialog, "REJECTED", reason)}
        />
      )}
    </AppLayout>
  )
}

export default AdminBoardings