import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import AuthIllustration from "../components/AuthIllustration"
import BoardingCard from "../components/BoardingCard"
import { CalendarIcon, CheckIcon, HeartIcon, HomeIcon, SearchIcon } from "../components/icons"
import { useAuth } from "../hooks/useAuth"
import { useFavoriteIds } from "../hooks/useFavorites"
import { browseBoardings } from "../service/browse"
import { getCampuses } from "../service/campus"
import type { BoardingSummary, Campus } from "../types"
import { getSavedCampus, saveCampus } from "../util/campusPref"
import { getErrorMessage } from "../util/errors"
import { inputClass } from "../util/styles"

const STEPS = [
  { icon: SearchIcon, title: "Search", text: "Pick your campus and filter by rent and facilities." },
  { icon: CalendarIcon, title: "Request a room", text: "Choose a move-in date and send a request to the owner." },
  { icon: CheckIcon, title: "Owner approves", text: "You get a notification and the owner's contact details." },
  { icon: HomeIcon, title: "Move in", text: "Contact the owner and settle into your new place." }
]

const TRUST = [
  "Every listing is approved by an admin",
  "Owner contact is shared only after approval",
  "Distance and travel time to your campus",
  "Compare up to 3 boardings side by side"
]

const StudentHome = () => {
  const { user } = useAuth()
  useFavoriteIds() 

  const [campuses, setCampuses] = useState<Campus[]>([])
  const [campusId, setCampusId] = useState<string | null>(null) 
  const [featured, setFeatured] = useState<BoardingSummary[]>([])
  const [featuredCampus, setFeaturedCampus] = useState<{ id: string; name: string } | null>(null)
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
      .catch((err) => {
        if (!active) return
        setError(getErrorMessage(err))
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (campusId === null) return
    let active = true
    setLoading(true)

    browseBoardings(
      campusId
        ? { campusId, radiusKm: 10, sort: "distance", availableOnly: true, limit: 6 }
        : { sort: "newest", availableOnly: true, limit: 6 }
    )
      .then((data) => {
        if (!active) return
        setFeatured(data.items)
        setFeaturedCampus(data.campus ? { id: data.campus.id, name: data.campus.name } : null)
        setError("")
      })
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [campusId])

  const chooseCampus = (id: string) => {
    setCampusId(id)
    if (id) saveCampus(id)
  }

  return (
    <AppLayout>
      <p className="text-nest-300">
        Welcome back, <span className="font-semibold text-sand-100">{user?.name}</span>.
      </p>

      <section className="mt-4 overflow-hidden rounded-3xl bg-nest-800">
        <div className="grid items-center gap-6 p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-sand-400">For students</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-sand-100 sm:text-4xl">
              Find a boarding near your campus
            </h1>
            <p className="mt-3 max-w-lg text-nest-300">
              Search approved boardings, see the distance and travel time to your campus, and request a room.
            </p>
            <div className="mt-6">
              <Link
                to="/boardings"
                className="inline-block rounded-xl bg-sand-400 px-5 py-3 font-semibold text-nest-950 transition hover:bg-sand-500"
              >
                Search boardings
              </Link>
            </div>
          </div>
          <div className="hidden justify-center lg:flex">
            <AuthIllustration className="w-full max-w-sm" />
          </div>
        </div>
      </section>
      <section className="mt-12" aria-label="Boardings near your campus">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-sand-100">Boardings near your campus</h2>
            <p className="text-sm text-nest-300">Available now, closest first. Your campus is remembered.</p>
          </div>

          {campuses.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="home-campus" className="text-sm text-nest-300">
                Campus
              </label>
              <select
                id="home-campus"
                className={`${inputClass} w-auto py-2`}
                value={campusId ?? ""}
                onChange={(e) => chooseCampus(e.target.value)}
              >
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && (
          <div role="alert" className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-nest-800" />
            ))}
          </div>
        )}

        {!loading && !error && featured.length === 0 && (
          <div className="mt-4 rounded-2xl bg-nest-800 p-8 text-center">
            <p className="text-sand-100">
              {featuredCampus
                ? `No available boardings within 10 km of ${featuredCampus.name} yet.`
                : "No boardings available yet."}
            </p>
            <Link to="/boardings" className="mt-3 inline-block font-semibold text-sand-400 hover:underline">
              Search all boardings →
            </Link>
          </div>
        )}

        {!loading && featured.length > 0 && (
          <>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((b) => (
                <BoardingCard key={b.id} b={b} campusId={featuredCampus?.id} campusName={featuredCampus?.name} />
              ))}
            </div>
            <p className="mt-5 text-center text-sm text-nest-300">
              Want to filter by rent, facilities or distance?{" "}
              <Link
                to={`/boardings${featuredCampus ? `?campus=${featuredCampus.id}` : ""}`}
                className="font-semibold text-sand-400 hover:underline"
              >
                See all boardings →
              </Link>
            </p>
          </>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-sand-100">How it works</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <li key={s.title} className="rounded-2xl bg-nest-800 p-5">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-sand-400 text-nest-950">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-semibold text-nest-300">Step {i + 1}</span>
                </div>
                <h3 className="mt-3 font-semibold text-sand-100">{s.title}</h3>
                <p className="mt-1 text-sm text-nest-300">{s.text}</p>
              </li>
            )
          })}
        </ol>
      </section>

      <ul className="mt-12 grid gap-3 rounded-2xl border border-nest-600 bg-nest-900/60 p-5 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST.map((t) => (
          <li key={t} className="flex items-start gap-2.5 text-sm text-nest-100">
            <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-sand-400" />
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <Link to="/bookings" className="rounded-2xl bg-white p-5 text-nest-900 shadow transition hover:-translate-y-0.5">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <CalendarIcon className="h-5 w-5" /> My bookings
          </h3>
          <p className="mt-1 text-sm text-nest-600">Track the requests you have sent.</p>
          <span className="mt-3 inline-block text-sm font-semibold text-nest-800">Open →</span>
        </Link>
        <Link to="/favorites" className="rounded-2xl bg-white p-5 text-nest-900 shadow transition hover:-translate-y-0.5">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <HeartIcon className="h-5 w-5" /> Favorites
          </h3>
          <p className="mt-1 text-sm text-nest-600">Save the boardings you like and compare them.</p>
          <span className="mt-3 inline-block text-sm font-semibold text-nest-800">Open →</span>
        </Link>
      </div>
    </AppLayout>
  )
}

export default StudentHome