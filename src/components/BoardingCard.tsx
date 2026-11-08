import { Link } from "react-router-dom"
import { COMPARE_MAX, toggleCompare } from "../store/compareSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import type { BoardingSummary } from "../types"
import { formatRent } from "../util/format"
import FavoriteButton from "./FavoriteButton"
import { PinIcon } from "./icons"

type Props = {
  b: BoardingSummary
  campusId?: string
  campusName?: string
}

const BoardingCard = ({ b, campusId, campusName }: Props) => {
  const dispatch = useAppDispatch()
  const compareIds = useAppSelector((s) => s.compare.ids)
  const selected = compareIds.includes(b.id)
  const limitReached = compareIds.length >= COMPARE_MAX
  const full = b.availableRooms === 0
  const to = `/boardings/${b.id}${campusId ? `?campus=${campusId}` : ""}`

  return (
    <article className="relative flex flex-col overflow-hidden rounded-2xl bg-white text-nest-900 shadow">
      <Link to={to} className="block" aria-label={`View ${b.title}`}>
        {b.coverImage ? (
          <img src={b.coverImage} alt={`${b.title} cover`} loading="lazy" className="h-44 w-full object-cover" />
        ) : (
          <div className="grid h-44 place-items-center bg-nest-100 text-sm text-nest-600">No photo</div>
        )}
      </Link>

      <div className="absolute right-3 top-3">
        <FavoriteButton id={b.id} />
      </div>
      {full && (
        <span className="absolute left-3 top-3 rounded-full bg-nest-950/85 px-2.5 py-1 text-xs font-semibold text-sand-100">
          Full
        </span>
      )}

      <div className="flex flex-1 flex-col p-4">
        <Link to={to} className="font-semibold hover:underline">
          {b.title}
        </Link>
        <p className="text-sm text-nest-600">{b.city}</p>

        <p className="mt-2 text-xl font-bold">
          {formatRent(b.monthlyRent)} <span className="text-sm font-normal text-nest-600">/ month</span>
        </p>

        {b.travel && (
          <div className="mt-1">
            <p className="flex items-center gap-1.5 text-sm font-medium text-nest-800">
              <PinIcon className="h-4 w-4" />
              {b.travel.distanceKm} km from {campusName ?? "your campus"}
            </p>
            <p className="text-xs text-nest-600">
              ~{b.travel.walkMinutes} min walk · ~{b.travel.vehicleMinutes} min by vehicle
            </p>
          </div>
        )}

        {b.facilities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {b.facilities.slice(0, 3).map((f) => (
              <span key={f} className="rounded-full bg-nest-100 px-2.5 py-0.5 text-xs font-medium text-nest-800">
                {f}
              </span>
            ))}
            {b.facilities.length > 3 && (
              <span className="rounded-full bg-nest-100 px-2.5 py-0.5 text-xs font-medium text-nest-800">
                +{b.facilities.length - 3}
              </span>
            )}
          </div>
        )}

        <p className="mt-2 text-sm text-nest-600">{full ? "No rooms free" : `${b.availableRooms} of ${b.totalRooms} rooms free`}</p>

        <label className="mt-auto flex cursor-pointer items-center gap-2 pt-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={selected}
            disabled={!selected && limitReached}
            onChange={() => dispatch(toggleCompare(b.id))}
            className="h-4 w-4 accent-nest-800"
          />
          Compare
          {!selected && limitReached && <span className="text-xs font-normal text-nest-600">(max {COMPARE_MAX})</span>}
        </label>
      </div>
    </article>
  )
}

export default BoardingCard