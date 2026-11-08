import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchFavoriteIds } from "../store/favoriteSlice"

export const useFavoriteIds = () => {
  const dispatch = useAppDispatch()
  const loaded = useAppSelector((s) => s.favorites.loaded)

  useEffect(() => {
    if (!loaded) dispatch(fetchFavoriteIds())
  }, [loaded, dispatch])
}