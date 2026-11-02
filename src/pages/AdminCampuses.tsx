import { useCallback, useEffect, useState, type FormEvent } from "react"
import AppLayout from "../components/AppLayout"
import LocationPicker, { type LatLng, type PickMeta } from "../components/LocationPicker"
import { createCampus, deleteCampus, getCampuses, updateCampus } from "../service/campus"
import type { Campus } from "../types"
import { getErrorMessage } from "../util/errors"
import { inputClass, labelClass, primaryButtonClass } from "../util/styles"

const AdminCampuses = () => {
  const [campuses, setCampuses] = useState<Campus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Campus | null>(null)
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [pos, setPos] = useState<LatLng | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setCampuses(await getCampuses())
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

  const openNew = () => {
    setEditing(null)
    setName("")
    setCity("")
    setPos(null)
    setFormError("")
    setShowForm(true)
  }

  const openEdit = (c: Campus) => {
    setEditing(c)
    setName(c.name)
    setCity(c.city)
    setPos({ lat: c.lat, lng: c.lng })
    setFormError("")
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePick = (p: LatLng, meta?: PickMeta) => {
    setPos(p)
    if (meta?.name) setName((n) => n || meta.name!)
    if (meta?.city) setCity((c) => c || meta.city!)
  }

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setFormError("")
    if (!pos) {
      setFormError("Choose the campus location on the map.")
      return
    }
    setSaving(true)
    try {
      const data = { name: name.trim(), city: city.trim(), lat: pos.lat, lng: pos.lng }
      if (editing) await updateCampus(editing.id, data)
      else await createCampus(data)
      setShowForm(false)
      await load()
    } catch (err) {
      setFormError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (c: Campus) => {
    if (!window.confirm(`Delete "${c.name}"?`)) return
    try {
      await deleteCampus(c.id)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <AppLayout title="Campuses">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-nest-300">Students search for boardings around these campuses.</p>
        {!showForm && (
          <button onClick={openNew} className="rounded-xl bg-sand-400 px-4 py-2.5 font-semibold text-nest-950 hover:bg-sand-500">
            Add campus
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={save} className="mt-6 rounded-2xl bg-nest-800 p-5 sm:p-6">
          <h2 className="text-xl font-bold text-sand-100">{editing ? "Edit campus" : "Add a campus"}</h2>

          {formError && (
            <div role="alert" className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
              {formError}
            </div>
          )}

          <div className="mt-5">
            <p className={labelClass}>Find the campus on the map</p>
         
            <LocationPicker key={editing?.id ?? "new"} value={pos} onChange={handlePick} />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="campus-name" className={labelClass}>Campus name</label>
              <input id="campus-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="campus-city" className={labelClass}>City</label>
              <input id="campus-city" className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="w-full rounded-xl border border-nest-300/40 py-3 font-semibold text-sand-100 hover:bg-nest-700"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className={primaryButtonClass}>
              {saving ? "Saving..." : "Save campus"}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div role="alert" className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl bg-white text-nest-900 shadow">
        {loading && <p className="p-6 text-center text-nest-600">Loading...</p>}
        {!loading && campuses.length === 0 && <p className="p-6 text-center text-nest-600">No campuses yet. Add the first one.</p>}
        {!loading &&
          campuses.map((c) => (
            <div key={c.id} className="flex flex-col gap-3 border-b border-nest-100 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-nest-600">
                  {c.city} · {c.lat.toFixed(4)}, {c.lng.toFixed(4)}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)} className="rounded-xl bg-nest-800 px-4 py-2 text-sm font-semibold text-sand-100 hover:bg-nest-900">
                  Edit
                </button>
                <button onClick={() => remove(c)} className="rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </AppLayout>
  )
}

export default AdminCampuses