import { useCallback, useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import BookingStatusBadge from "../components/BookingStatusBadge"
import ReasonDialog from "../components/ReasonDialog"
import { decideBooking, getReceivedBookings } from "../service/booking"
import type { BookingCounts, BookingStatus, ReceivedBooking } from "../types"
import { formatDate, timeAgo } from "../util/date"
import { getErrorMessage } from "../util/errors"

const TABS: { value: BookingStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" }
]

const LIMIT = 10

type DialogState = { booking: ReceivedBooking; mode: "REJECTED" | "CANCELLED" } | null

const OwnerBookings = () => {
  const [params, setParams] = useSearchParams()
  const status = (TABS.find((t) => t.value === params.get("status"))?.value ?? "PENDING") as BookingStatus

  const [items, setItems] = useState<ReceivedBooking[]>([])
  const [counts, setCounts] = useState<BookingCounts | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  const [dialog, setDialog] = useState<DialogState>(null)
  const [working, setWorking] = useState(false)
  const [dialogError, setDialogError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getReceivedBookings({ status: [status], page, limit: LIMIT })
      setItems(data.items)
      setTotal(data.total)
      setCounts(data.counts)
      setError("")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [status, page])

  useEffect(() => {
    load()
  }, [load])

  const changeTab = (value: BookingStatus) => {
    setPage(1)
    setNotice("")
    setParams({ status: value })
  }

  const apply = async (b: ReceivedBooking, newStatus: "APPROVED" | "REJECTED" | "CANCELLED", reason?: string) => {
    setWorking(true)
    setDialogError("")
    setError("")
    try {
      await decideBooking(b.id, { status: newStatus, reason })
      setDialog(null)
      setNotice(
        newStatus === "APPROVED"
          ? "Request approved. The student can now see your contact details."
          : newStatus === "REJECTED"
            ? "Request rejected."
            : "Booking cancelled. The room is free again."
      )
      await load()
    } catch (err) {
      const message = getErrorMessage(err)
      if (dialog) setDialogError(message)
      else setError(message)
    } finally {
      setWorking(false)
    }
  }

  const pages = Math.max(1, Math.ceil(total / LIMIT))

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-sand-100">Booking requests</h1>
      <p className="mt-1 text-nest-300">
        Approving a request gives the student your phone, email and exact address, and uses up one room.
      </p>

      <div className="mt-6 flex gap-2 overflow-x-auto" role="tablist" aria-label="Booking status">
        {TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={status === t.value}
            onClick={() => changeTab(t.value)}
            className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              status === t.value
                ? "border-sand-400 bg-sand-400 text-nest-950"
                : "border-nest-300/40 text-nest-100 hover:bg-nest-800"
            }`}
          >
            {t.label}
            {counts ? ` (${counts[t.value]})` : ""}
          </button>
        ))}
      </div>

      {notice && (
        <div role="status" className="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
          {notice}
        </div>
      )}
      {error && (
        <div role="alert" className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl bg-white text-nest-900 shadow">
        {loading && <p className="p-6 text-center text-nest-600">Loading...</p>}
        {!loading && !error && items.length === 0 && (
          <p className="p-6 text-center text-nest-600">No {status.toLowerCase()} requests.</p>
        )}

        {!loading &&
          items.map((b) => (
            <div key={b.id} className="border-b border-nest-100 p-4 last:border-b-0">
              <div className="flex flex-col gap-4 sm:flex-row">
                {b.boarding?.coverImage ? (
                  <img
                    src={b.boarding.coverImage}
                    alt={`${b.boarding.title} cover`}
                    loading="lazy"
                    className="h-32 w-full rounded-xl object-cover sm:h-28 sm:w-40"
                  />
                ) : (
                  <div className="grid h-28 w-full place-items-center rounded-xl bg-nest-100 text-sm text-nest-600 sm:w-40">
                    No photo
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{b.student?.name ?? "Unknown student"}</h2>
                    <BookingStatusBadge status={b.status} />
                  </div>
                  {b.student && <p className="truncate text-sm text-nest-600">{b.student.email}</p>}
                  <p className="mt-1 text-sm text-nest-600">
                    {b.boarding ? `${b.boarding.title} · ${b.boarding.city}` : "Boarding removed"} · requested{" "}
                    {timeAgo(b.createdAt)}
                  </p>
                  <p className="text-sm text-nest-600">
                    Move-in: {formatDate(b.moveInDate)}
                    {b.boarding && ` · ${b.boarding.availableRooms} of ${b.boarding.totalRooms} rooms free`}
                  </p>
                  {b.message && <p className="mt-1 text-sm text-nest-600">Message: “{b.message}”</p>}
                  {b.reason && (b.status === "REJECTED" || b.status === "CANCELLED") && (
                    <p className="mt-2 rounded-lg bg-red-50 p-2 text-sm text-red-700">Reason: {b.reason}</p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {b.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => apply(b, "APPROVED")}
                          disabled={working}
                          className="rounded-xl bg-nest-800 px-4 py-2 text-sm font-semibold text-sand-100 hover:bg-nest-900 disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setDialogError("")
                            setDialog({ booking: b, mode: "REJECTED" })
                          }}
                          className="rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {b.status === "APPROVED" && (
                      <button
                        onClick={() => {
                          setDialogError("")
                          setDialog({ booking: b, mode: "CANCELLED" })
                        }}
                        className="rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                      >
                        Cancel booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {!loading && counts && counts.all === 0 && (
        <p className="mt-6 text-center text-sm text-nest-300">
          Requests appear here when students ask for a room in an approved boarding.{" "}
          <Link to="/owner/boardings" className="font-semibold text-sand-400 hover:underline">
            My boardings →
          </Link>
        </p>
      )}

      {total > LIMIT && (
        <div className="mt-6 flex items-center justify-center gap-3 text-sm text-nest-100">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl border border-nest-300/40 px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-nest-300/40 px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {dialog && (
        <ReasonDialog
          title={dialog.mode === "REJECTED" ? "Reject this request" : "Cancel this booking"}
          confirmLabel={dialog.mode === "REJECTED" ? "Reject request" : "Cancel booking"}
          working={working}
          error={dialogError}
          onConfirm={(reason) => apply(dialog.booking, dialog.mode, reason)}
          onCancel={() => setDialog(null)}
        />
      )}
    </AppLayout>
  )
}

export default OwnerBookings