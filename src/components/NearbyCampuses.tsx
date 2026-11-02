import { useEffect, useState } from "react"
import { getNearbyCampuses } from "../service/campus"
import type { NearbyCampus } from "../types"
import { getErrorMessage } from "../util/errors"
import type { LatLng } from "./LocationPicker"

const NearbyCampuses = ({ position }: { position: LatLng | null }) => {
  const [items, setItems] = useState<NearbyCampus[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const lat = position?.lat
  const lng = position?.lng

  useEffect(() => {
    if (lat === undefined || lng === undefined) {
      setItems(null)
      return
    }
    let active = true
    setLoading(true)

    const timer = setTimeout(async () => {
      try {
        const data = await getNearbyCampuses(lat, lng, 10)
        if (active) {
          setItems(data)
          setError("")
        }
      } catch (err) {
        if (active) setError(getErrorMessage(err))
      } finally {
        if (active) setLoading(false)
      }
    }, 400)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [lat, lng])

  return (
    <div className="rounded-2xl bg-nest-900 p-4" aria-live="polite">
      <h3 className="font-semibold text-sand-100">Nearby campuses (within 10 km)</h3>

      {!position && <p className="mt-2 text-sm text-nest-300">Choose a location to see which campuses are close.</p>}
      {position && loading && <p className="mt-2 text-sm text-nest-300">Checking...</p>}
      {error && <p className="mt-2 text-sm text-red-200">{error}</p>}

      {position && !loading && !error && items && items.length === 0 && (
        <p className="mt-2 text-sm text-sand-300">
          No campus within 10 km. Students searching around a campus will not find this boarding.
        </p>
      )}

      {!loading && items && items.length > 0 && (
        <ul className="mt-3 space-y-2">
          {items.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-nest-800 px-3 py-2 text-sm">
              <span className="font-medium text-sand-100">{c.name}</span>
              <span className="text-nest-300">
                {c.distanceKm} km · ~{c.walkMinutes} min walk · ~{c.vehicleMinutes} min by vehicle
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs text-nest-300/80">Distances and times are approximate estimates.</p>
    </div>
  )
}

export default NearbyCampuses