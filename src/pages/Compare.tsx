import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import { CheckIcon, CloseIcon } from "../components/icons"
import { compareBoardings } from "../service/browse"
import { clearCompare, removeCompare } from "../store/compareSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import type { BoardingSummary } from "../types"
import { getSavedCampus } from "../util/campusPref"
import { getErrorMessage } from "../util/errors"
import { formatRent } from "../util/format"

const best = "rounded-full bg-sand-400 px-2 py-0.5 text-xs font-semibold text-nest-950"

const Compare = () => {
  const dispatch = useAppDispatch()
  const ids = useAppSelector((s) => s.compare.ids)
  const campusId = getSavedCampus()

  const [items, setItems] = useState<BoardingSummary[]>([])
  const [loading, setLoading] = useState(ids.length >= 2)
  const [error, setError] = useState("")

  useEffect(() => {
    if (ids.length < 2) {
      setItems([])
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    compareBoardings(ids, campusId)
      .then((list) => {
        if (active) {
          setItems(list)
          setError("")
        }
      })
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [ids, campusId])

  const minRent = items.length ? Math.min(...items.map((i) => i.monthlyRent)) : 0
  const hasTravel = items.length > 0 && items.every((i) => i.travel)
  const minDistance = hasTravel ? Math.min(...items.map((i) => i.travel!.distanceKm)) : 0
  const facilityRows = Array.from(new Set(items.flatMap((i) => i.facilities)))

  const th = "w-36 border-b border-nest-100 bg-nest-100/50 p-3 text-left text-sm font-semibold text-nest-800 align-top"
  const td = "border-b border-nest-100 p-3 align-top text-sm"

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-sand-100">Compare boardings</h1>

      {ids.length < 2 && (
        <div className="mt-6 rounded-2xl bg-nest-800 p-8 text-center">
          <p className="text-sand-100">Choose 2 or 3 boardings to compare.</p>
          <Link to="/boardings" className="mt-4 inline-block font-semibold text-sand-400 hover:underline">
            Find a boarding →
          </Link>
        </div>
      )}

      {ids.length >= 2 && (
        <>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-nest-300">
              {campusId ? "Distances are from your selected campus." : "Choose a campus on the Find a boarding page to compare distances too."}
            </p>
            <button onClick={() => dispatch(clearCompare())} className="rounded-xl border border-nest-300/40 px-4 py-2 text-sm font-semibold text-sand-100 hover:bg-nest-800">
              Clear all
            </button>
          </div>

          {error && (
            <div role="alert" className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}
          {loading && <p className="mt-8 text-center text-nest-300">Loading...</p>}

          {!loading && items.length > 0 && (
            <div className="mt-5 overflow-x-auto rounded-2xl bg-white text-nest-900 shadow">
              <table className="w-full min-w-[34rem] border-collapse">
                <thead>
                  <tr>
                    <th className={th} scope="col">
                      <span className="sr-only">Detail</span>
                    </th>
                    {items.map((b) => (
                      <th key={b.id} scope="col" className="border-b border-nest-100 p-3 text-left align-top">
                        {b.coverImage && <img src={b.coverImage} alt="" loading="lazy" className="h-28 w-full rounded-xl object-cover" />}
                        <Link to={`/boardings/${b.id}${campusId ? `?campus=${campusId}` : ""}`} className="mt-2 block font-semibold hover:underline">
                          {b.title}
                        </Link>
                        <button
                          onClick={() => dispatch(removeCompare(b.id))}
                          className="mt-1 flex items-center gap-1 text-xs font-medium text-red-700 hover:underline"
                        >
                          <CloseIcon className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className={th}>Monthly rent</th>
                    {items.map((b) => (
                      <td key={b.id} className={td}>
                        <span className="text-lg font-bold">{formatRent(b.monthlyRent)}</span>
                        {items.length > 1 && b.monthlyRent === minRent && (
                          <>
                            {" "}
                            <span className={best}>Lowest rent</span>
                          </>
                        )}
                      </td>
                    ))}
                  </tr>

                  {hasTravel && (
                    <tr>
                      <th scope="row" className={th}>Distance to campus</th>
                      {items.map((b) => (
                        <td key={b.id} className={td}>
                          <span className="font-semibold">{b.travel!.distanceKm} km</span>
                          {b.travel!.distanceKm === minDistance && (
                            <>
                              {" "}
                              <span className={best}>Closest</span>
                            </>
                          )}
                          <br />
                          <span className="text-nest-600">
                            ~{b.travel!.walkMinutes} min walk · ~{b.travel!.vehicleMinutes} min by vehicle
                          </span>
                        </td>
                      ))}
                    </tr>
                  )}

                  <tr>
                    <th scope="row" className={th}>Rooms free</th>
                    {items.map((b) => (
                      <td key={b.id} className={td}>
                        {b.availableRooms === 0 ? <span className="font-semibold text-red-700">Full</span> : `${b.availableRooms} of ${b.totalRooms}`}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <th scope="row" className={th}>City</th>
                    {items.map((b) => (
                      <td key={b.id} className={td}>{b.city}</td>
                    ))}
                  </tr>

                  {facilityRows.map((f) => (
                    <tr key={f}>
                      <th scope="row" className={th}>{f}</th>
                      {items.map((b) => (
                        <td key={b.id} className={td}>
                          {b.facilities.includes(f) ? (
                            <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                              <CheckIcon className="h-4 w-4" />
                              Yes
                            </span>
                          ) : (
                            <span className="text-nest-600/60" aria-label="Not available">
                              -
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AppLayout>
  )
}

export default Compare