import { Link } from "react-router-dom"
import { clearCompare } from "../store/compareSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"

const CompareTray = () => {
  const dispatch = useAppDispatch()
  const ids = useAppSelector((s) => s.compare.ids)

  if (ids.length === 0) return null

  return (
    <>
      <div className="h-20" aria-hidden="true" />
      <div role="region" aria-label="Compare boardings" className="fixed inset-x-0 bottom-0 z-30 border-t border-nest-600 bg-nest-900 px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <p className="text-sm text-sand-100">
            {ids.length} selected <span className="text-nest-300">(pick 2 or 3 to compare)</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => dispatch(clearCompare())}
              className="rounded-xl border border-nest-300/40 px-4 py-2 text-sm font-semibold text-sand-100 hover:bg-nest-800"
            >
              Clear
            </button>
            {ids.length >= 2 ? (
              <Link to="/compare" className="rounded-xl bg-sand-400 px-4 py-2 text-sm font-semibold text-nest-950 hover:bg-sand-500">
                Compare now
              </Link>
            ) : (
              <span className="rounded-xl bg-sand-400 px-4 py-2 text-sm font-semibold text-nest-950 opacity-50">Compare now</span>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default CompareTray