import { useCallback, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import StatusBadge from "../components/StatusBadge"
import { deleteBoarding, getMyBoardings } from "../service/boarding"
import type { Boarding } from "../types"
import { getErrorMessage } from "../util/errors"
import { formatRent } from "../util/format"

const MyBoardings = () => {
  const location = useLocation()
  const notice = (location.state as { notice?: string } | null)?.notice

  const [items, setItems] = useState<Boarding[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await getMyBoardings())
      setError("")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const remove = async (b: Boarding) => {
    if (!window.confirm(`Delete "${b.title}"? Its photos will be removed too.`)) return
    try {
      await deleteBoarding(b.id)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-sand-100">My boardings</h1>
          <p className="mt-1 text-nest-300">New and edited listings are checked by an admin before students can see them.</p>
        </div>
        <Link to="/owner/boardings/new" className="rounded-xl bg-sand-400 px-4 py-2.5 font-semibold text-nest-950 hover:bg-sand-500">
          Add boarding
        </Link>
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

      {!loading && items.length === 0 && !error && (
        <div className="mt-8 rounded-2xl bg-nest-800 p-8 text-center">
          <p className="text-sand-100">You have not added any boarding yet.</p>
          <Link to="/owner/boardings/new" className="mt-4 inline-block font-semibold text-sand-400 hover:underline">
            Add your first boarding →
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((b) => (
          <article key={b.id} className="overflow-hidden rounded-2xl bg-white text-nest-900 shadow">
            {b.images[0] ? (
              <img src={b.images[0].url} alt={`${b.title} cover`} loading="lazy" className="h-44 w-full object-cover" />
            ) : (
              <div className="grid h-44 place-items-center bg-nest-100 text-sm text-nest-600">No photo</div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{b.title}</h2>
                <StatusBadge status={b.status} />
              </div>
              <p className="mt-1 text-sm text-nest-600">
                {formatRent(b.monthlyRent)} / month · {b.availableRooms} of {b.totalRooms} rooms free
              </p>
              <p className="truncate text-sm text-nest-600">{b.address}</p>
              {b.status === "REJECTED" && b.rejectionReason && (
                <p className="mt-2 rounded-lg bg-red-50 p-2 text-sm text-red-700">Rejected: {b.rejectionReason}</p>
              )}
              <div className="mt-4 flex gap-2">
                <Link to={`/owner/boardings/${b.id}/edit`} className="rounded-xl bg-nest-800 px-4 py-2 text-sm font-semibold text-sand-100 hover:bg-nest-900">
                  Edit
                </Link>
                <button onClick={() => remove(b)} className="rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AppLayout>
  )
}

export default MyBoardings