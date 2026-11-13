import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import BookingStatusBadge from "../components/BookingStatusBadge"
import ContactCard from "../components/ContactCard"
import { cancelMyBooking, getMyBookings } from "../service/booking"
import type { BookingStatus, MyBooking } from "../types"
import { formatDate } from "../util/date"
import { getErrorMessage } from "../util/errors"
import { formatRent } from "../util/format"

type Tab = "active" | "past"

const TABS: { value: Tab; label: string; statuses: BookingStatus[] }[] = [
  { value: "active", label: "Active", statuses: ["PENDING", "APPROVED"] },
  { value: "past", label: "Past", statuses: ["REJECTED", "CANCELLED"] }
]

const LIMIT = 10

const MyBookings = () => {
  const [tab, setTab] = useState<Tab>("active")
  const [items, setItems] = useState<MyBooking[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [workingId, setWorkingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const statuses = TABS.find((t) => t.value === tab)?.statuses
      const data = await getMyBookings({ status: statuses, page, limit: LIMIT })
      setItems(data.items)
      setTotal(data.total)
      setError("")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [tab, page])

  useEffect(() => {
    load()
  }, [load])

  const changeTab = (value: Tab) => {
    setTab(value)
    setPage(1)
    setNotice("")
  }

  const cancel = async (b: MyBooking) => {
    const text =
      b.status === "APPROVED"
        ? "Cancel your approved booking? The room will be given back to the owner."
        : "Cancel this request?"
    if (!window.confirm(text)) return

    setWorkingId(b.id)
    setError("")
    setNotice("")
    try {
      await cancelMyBooking(b.id)
      setNotice("Booking cancelled.")
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setWorkingId(null)
    }
  }

  const pages = Math.max(1, Math.ceil(total / LIMIT))

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-sand-100">My bookings</h1>
      <p className="mt-1 text-nest-300">
        Requests you have sent. The owner's phone and exact address appear here once a request is approved.
      </p>

      <div className="mt-6 flex gap-2 overflow-x-auto" role="tablist" aria-label="Booking list">
        {TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => changeTab(t.value)}
            className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              tab === t.value
                ? "border-sand-400 bg-sand-400 text-nest-950"
                : "border-nest-300/40 text-nest-100 hover:bg-nest-800"
            }`}
          >
            {t.label}
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

      {loading && <p className="mt-8 text-center text-nest-300">Loading...</p>}

      {!loading && !error && items.length === 0 && (
        <div className="mt-8 rounded-2xl bg-nest-800 p-8 text-center">
          <p className="text-sand-100">
            {tab === "active" ? "You have no active booking requests." : "No past bookings yet."}
          </p>
          <Link to="/boardings" className="mt-4 inline-block font-semibold text-sand-400 hover:underline">
            Find a boarding →
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="mt-6 space-y-4">
          {items.map((b) => (
            <article key={b.id} className="overflow-hidden rounded-2xl bg-white text-nest-900 shadow">
              <div className="flex flex-col gap-4 p-4 sm:flex-row">
                {b.boarding?.coverImage ? (
                  <img
                    src={b.boarding.coverImage}
                    alt={`${b.boarding.title} cover`}
                    loading="lazy"
                    className="h-36 w-full rounded-xl object-cover sm:h-32 sm:w-44"
                  />
                ) : (
                  <div className="grid h-32 w-full place-items-center rounded-xl bg-nest-100 text-sm text-nest-600 sm:w-44">
                    No photo
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {b.boarding ? (
                      <Link to={`/boardings/${b.boarding.id}`} className="font-semibold hover:underline">
                        {b.boarding.title}
                      </Link>
                    ) : (
                      <span className="font-semibold text-nest-600">This boarding is no longer available</span>
                    )}
                    <BookingStatusBadge status={b.status} />
                  </div>

                  {b.boarding && (
                    <p className="text-sm text-nest-600">
                      {b.boarding.city} · {formatRent(b.boarding.monthlyRent)} / month
                    </p>
                  )}
                  <p className="mt-1 text-sm text-nest-600">Move-in: {formatDate(b.moveInDate)}</p>
                  {b.message && <p className="mt-1 text-sm text-nest-600">Your message: “{b.message}”</p>}
                  {b.reason && (b.status === "REJECTED" || b.status === "CANCELLED") && (
                    <p className="mt-2 rounded-lg bg-red-50 p-2 text-sm text-red-700">Reason: {b.reason}</p>
                  )}

                  {(b.status === "PENDING" || b.status === "APPROVED") && (
                    <button
                      onClick={() => cancel(b)}
                      disabled={workingId === b.id}
                      className="mt-3 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                    >
                      {workingId === b.id ? "Cancelling..." : b.status === "APPROVED" ? "Cancel booking" : "Cancel request"}
                    </button>
                  )}
                </div>
              </div>

              {b.contact && (
                <div className="border-t border-nest-100 p-4">
                  <ContactCard contact={b.contact} />
                </div>
              )}
            </article>
          ))}
        </div>
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
    </AppLayout>
  )
}

export default MyBookings