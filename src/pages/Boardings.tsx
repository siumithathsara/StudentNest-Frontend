import { useEffect, useState } from "react"
import AppLayout from "../components/AppLayout"
import BoardingCard from "../components/BoardingCard"
import { FiltersIcon } from "../components/icons"
import { useFavoriteIds } from "../hooks/useFavorites"
import { browseBoardings } from "../service/browse"
import { getCampuses } from "../service/campus"
import type { BrowseResult, Campus } from "../types"
import { getSavedCampus, saveCampus } from "../util/campusPref"
import { getErrorMessage } from "../util/errors"
import { FACILITY_OPTIONS } from "../util/facilities"
import { inputClass, labelClass } from "../util/styles"

const LIMIT = 9

const SORTS = [
  { value: "distance", label: "Nearest first" },
  { value: "price_asc", label: "Lowest rent" },
  { value: "price_desc", label: "Highest rent" },
  { value: "newest", label: "Newest" }
]

const Boardings = () => {
  useFavoriteIds()

  const [campuses, setCampuses] = useState<Campus[]>([])
  const [campusesLoaded, setCampusesLoaded] = useState(false)
  const [campusId, setCampusId] = useState("")
  const [radiusKm, setRadiusKm] = useState(5)
  const [minRent, setMinRent] = useState("")
  const [maxRent, setMaxRent] = useState("")
  const [facilities, setFacilities] = useState<string[]>([])
  const [availableOnly, setAvailableOnly] = useState(false)
  const [sort, setSort] = useState("distance")
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [result, setResult] = useState<BrowseResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    getCampuses()
      .then((list) => {
        if (!active) return
        setCampuses(list)
        const saved = getSavedCampus()
        setCampusId(list.find((c) => c.id === saved)?.id ?? list[0]?.id ?? "")
      })
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => {
        if (active) setCampusesLoaded(true)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!campusesLoaded) return
    let active = true
    setLoading(true)

    const timer = setTimeout(async () => {
      try {
        const data = await browseBoardings({
          campusId: campusId || undefined,
          radiusKm,
          minRent: minRent === "" ? undefined : Number(minRent),
          maxRent: maxRent === "" ? undefined : Number(maxRent),
          facilities,
          availableOnly: availableOnly || undefined,
          sort,
          page,
          limit: LIMIT
        })
        if (active) {
          setResult(data)
          setError("")
        }
      } catch (err) {
        if (active) setError(getErrorMessage(err))
      } finally {
        if (active) setLoading(false)
      }
    }, 350)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [campusesLoaded, campusId, radiusKm, minRent, maxRent, facilities, availableOnly, sort, page])

  const resetPage = () => setPage(1)

  const toggleFacility = (f: string) => {
    setFacilities((list) => (list.includes(f) ? list.filter((x) => x !== f) : [...list, f]))
    resetPage()
  }

  const clearFilters = () => {
    setRadiusKm(5)
    setMinRent("")
    setMaxRent("")
    setFacilities([])
    setAvailableOnly(false)
    setSort("distance")
    resetPage()
  }

  const chooseCampus = (id: string) => {
    setCampusId(id)
    if (id) saveCampus(id)
    resetPage()
  }

  const pages = result ? Math.max(1, Math.ceil(result.total / LIMIT)) : 1
  const campusName = result?.campus?.name

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-sand-100">Find a boarding</h1>
      <p className="mt-1 text-nest-300">Pick your campus to see boardings nearby, with distance and travel time.</p>

      <button
        type="button"
        onClick={() => setFiltersOpen((o) => !o)}
        aria-expanded={filtersOpen}
        className="mt-5 flex items-center gap-2 rounded-xl border border-nest-300/40 px-4 py-2.5 font-semibold text-sand-100 hover:bg-nest-800 lg:hidden"
      >
        <FiltersIcon className="h-5 w-5" />
        Filters
      </button>

      <div className="mt-5 lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:gap-6">
      
        <aside className={`${filtersOpen ? "block" : "hidden"} rounded-2xl bg-nest-800 p-5 lg:sticky lg:top-24 lg:block`} aria-label="Filters">
          <div>
            <label htmlFor="campus" className={labelClass}>Your campus</label>
            <select id="campus" className={inputClass} value={campusId} onChange={(e) => chooseCampus(e.target.value)}>
              {campuses.length === 0 && <option value="">No campuses yet</option>}
              {campuses.length > 0 && <option value="">Any (no distances)</option>}
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.city})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5">
            <label htmlFor="radius" className={labelClass}>
              Within {radiusKm} km of campus
            </label>
            <input
              id="radius"
              type="range"
              min={1}
              max={25}
              step={0.5}
              value={radiusKm}
              disabled={!campusId}
              onChange={(e) => {
                setRadiusKm(Number(e.target.value))
                resetPage()
              }}
              className="w-full accent-sand-400 disabled:opacity-50"
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="min-rent" className={labelClass}>Min rent</label>
              <input
                id="min-rent"
                type="number"
                min={0}
                placeholder="0"
                className={inputClass}
                value={minRent}
                onChange={(e) => {
                  setMinRent(e.target.value)
                  resetPage()
                }}
              />
            </div>
            <div>
              <label htmlFor="max-rent" className={labelClass}>Max rent</label>
              <input
                id="max-rent"
                type="number"
                min={0}
                placeholder="Any"
                className={inputClass}
                value={maxRent}
                onChange={(e) => {
                  setMaxRent(e.target.value)
                  resetPage()
                }}
              />
            </div>
          </div>

          <fieldset className="mt-5">
            <legend className={labelClass}>Facilities</legend>
            <div className="flex flex-wrap gap-2">
              {FACILITY_OPTIONS.map((f) => {
                const on = facilities.includes(f)
                return (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleFacility(f)}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                      on ? "border-sand-400 bg-sand-400 text-nest-950" : "border-nest-300/40 text-nest-100 hover:bg-nest-700"
                    }`}
                  >
                    {f}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <label className="mt-5 flex cursor-pointer items-center gap-2 text-sm text-nest-100">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => {
                setAvailableOnly(e.target.checked)
                resetPage()
              }}
              className="h-4 w-4 accent-sand-400"
            />
            Only boardings with free rooms
          </label>

          <button type="button" onClick={clearFilters} className="mt-5 w-full rounded-xl border border-nest-300/40 py-2.5 text-sm font-semibold text-sand-100 hover:bg-nest-700">
            Clear filters
          </button>
        </aside>

        <section aria-label="Results" className="mt-6 lg:mt-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-nest-100" aria-live="polite">
              {loading && !result
                ? "Searching..."
                : result
                  ? `${result.total} boarding${result.total === 1 ? "" : "s"}${campusName ? ` near ${campusName}` : ""}`
                  : ""}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-nest-300">Sort by</label>
              <select
                id="sort"
                className={`${inputClass} w-auto py-2`}
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value)
                  resetPage()
                }}
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.value === "distance" && !campusId ? "Newest (choose a campus for distance)" : s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div role="alert" className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {!error && result && result.items.length === 0 && !loading && (
            <div className="mt-6 rounded-2xl bg-nest-800 p-8 text-center">
              <p className="font-semibold text-sand-100">No boardings found.</p>
              <p className="mt-1 text-sm text-nest-300">Try a bigger distance, a higher rent, or fewer facilities.</p>
            </div>
          )}

          <div className={`mt-4 grid gap-4 transition-opacity sm:grid-cols-2 2xl:grid-cols-3 ${loading ? "opacity-60" : ""}`}>
            {result?.items.map((b) => (
              <BoardingCard key={b.id} b={b} campusId={result.campus?.id} campusName={result.campus?.name} />
            ))}
          </div>

          {result && result.total > LIMIT && (
            <div className="mt-6 flex items-center justify-between text-sm text-nest-300">
              <span>
                Page {page} of {pages}
              </span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-xl border border-nest-300/40 px-4 py-2 disabled:opacity-40">
                  Previous
                </button>
                <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="rounded-xl border border-nest-300/40 px-4 py-2 disabled:opacity-40">
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  )
}

export default Boardings