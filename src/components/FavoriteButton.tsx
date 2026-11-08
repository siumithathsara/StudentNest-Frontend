import { useAppDispatch, useAppSelector } from "../store/hooks"
import { toggleFavorite } from "../store/favoriteSlice"
import { HeartIcon } from "./icons"

const FavoriteButton = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch()
  const isFavorite = useAppSelector((s) => s.favorites.ids.includes(id))

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleFavorite({ id, currentlyFavorite: isFavorite }))}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={`grid h-10 w-10 place-items-center rounded-full bg-white shadow transition hover:scale-105 ${
        isFavorite ? "text-red-500" : "text-nest-600"
      }`}
    >
      <HeartIcon className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
    </button>
  )
}

export default FavoriteButton