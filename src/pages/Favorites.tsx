import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import BoardingCard from "../components/BoardingCard"
import { useFavoriteIds } from "../hooks/useFavorites"
import { getFavorites } from "../service/favorite"
import { useAppSelector } from "../store/hooks"
import type { BoardingSummary } from "../types"
import { getSavedCampus } from "../util/campusPref"
import { getErrorMessage } from "../util/errors"

const Favorites = () => {
  useFavoriteIds()
  const favIds = useAppSelector((s) => s.favorites.ids)
  const [items, setItems] = useState<BoardingSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const campusId = getSavedCampus()

  useEffect(() => {
    let active = true
    getFavorites()
      .then((list) => active && setItems(list))
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const visible = items.filter((i) => favIds.includes(i.id))

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-sand-100">Favorites</h1>
      <p className="mt-1 text-nest-300">Boardings you saved. Select 2 or 3 to compare them.</p>

      {error && (
        <div role="alert" className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading && <p className="mt-8 text-center text-nest-300">Loading...</p>}

      {!loading && !error && visible.length === 0 && (
        <div className="mt-8 rounded-2xl bg-nest-800 p-8 text-center">
          <p className="text-sand-100">You have not saved any boarding yet.</p>
          <Link to="/boardings" className="mt-4 inline-block font-semibold text-sand-400 hover:underline">
            Find a boarding →
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((b) => (
          <BoardingCard key={b.id} b={b} campusId={campusId} />
        ))}
      </div>
    </AppLayout>
  )
}

export default Favorites