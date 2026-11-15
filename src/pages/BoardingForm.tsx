import { useEffect, useMemo, useState, type FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import LocationPicker, { type LatLng, type PickMeta } from "../components/LocationPicker"
import NearbyCampuses from "../components/NearbyCampuses"
import StatusBadge from "../components/StatusBadge"
import { createBoarding, getMyBoarding, updateBoarding } from "../service/boarding"
import type { Boarding, BoardingImage } from "../types"
import { getErrorMessage } from "../util/errors"
import { FACILITY_OPTIONS } from "../util/facilities"
import { inputClass, labelClass, primaryButtonClass } from "../util/styles"
import { compressImage } from "../util/compressImage"

const MAX_IMAGES = 8
const MAX_ORIGINAL_SIZE = 20 * 1024 * 1024
const ALLOWED = ["image/jpeg", "image/png", "image/webp"]

const section = "rounded-2xl bg-nest-800 p-5 sm:p-6"

const BoardingForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: "",
    description: "",
    monthlyRent: "",
    totalRooms: "1",
    availableRooms: "1",
    address: "",
    city: ""
  })
  const [facilities, setFacilities] = useState<string[]>([])
  const [pos, setPos] = useState<LatLng | null>(null)
  const [existing, setExisting] = useState<BoardingImage[]>([])
  const [removed, setRemoved] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<Boarding["status"] | null>(null)
  const [rejection, setRejection] = useState("")

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [photoError, setPhotoError] = useState("")

  const update = (field: keyof typeof form, value: string) => setForm((f) => ({ ...f, [field]: value }))

  useEffect(() => {
    if (!id) return
    let active = true
    getMyBoarding(id)
      .then((b) => {
        if (!active) return
        setForm({
          title: b.title,
          description: b.description,
          monthlyRent: String(b.monthlyRent),
          totalRooms: String(b.totalRooms),
          availableRooms: String(b.availableRooms),
          address: b.address,
          city: b.city
        })
        setFacilities(b.facilities)
        setPos({ lat: b.lat, lng: b.lng })
        setExisting(b.images)
        setStatus(b.status)
        setRejection(b.rejectionReason ?? "")
      })
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id])


  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files])
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews])

  const keptExisting = existing.filter((i) => !removed.includes(i.path))
  const photoCount = keptExisting.length + files.length

  const handlePick = (p: LatLng, meta?: PickMeta) => {
    setPos(p)
    if (meta?.address) setForm((f) => ({ ...f, address: f.address || meta.address! }))
    if (meta?.city) setForm((f) => ({ ...f, city: f.city || meta.city! }))
  }

  const toggleFacility = (name: string) =>
    setFacilities((list) => (list.includes(name) ? list.filter((f) => f !== name) : [...list, name]))

   const addFiles = async (list: FileList | null) => {
    if (!list) return
    const problems: string[] = []
    const valid = Array.from(list).filter((f) => {
      if (!ALLOWED.includes(f.type)) {
        problems.push(`${f.name}: only jpg, png or webp.`)
        return false
      }
      if (f.size > MAX_ORIGINAL_SIZE) {
        problems.push(`${f.name}: larger than 20MB.`)
        return false
      }
      return true
    })
    const room = Math.max(0, MAX_IMAGES - photoCount)
    if (valid.length > room) problems.push(`You can add only ${room} more photo(s) (max ${MAX_IMAGES}).`)

    const compressed = await Promise.all(valid.slice(0, room).map(compressImage))
    setFiles((prev) => [...prev, ...compressed])
    setPhotoError(problems.join(" "))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    const fail = (message: string) => {
      setError(message)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

    if (!pos) return fail("Choose the boarding location on the map.")
    if (Number(form.availableRooms) > Number(form.totalRooms)) return fail("Available rooms cannot be more than total rooms.")
    if (photoCount < 1) return fail("Add at least one photo.")

    const fd = new FormData()
    fd.append("title", form.title.trim())
    fd.append("description", form.description.trim())
    fd.append("monthlyRent", form.monthlyRent)
    fd.append("totalRooms", form.totalRooms)
    fd.append("availableRooms", form.availableRooms)
    fd.append("address", form.address.trim())
    fd.append("city", form.city.trim())
    fd.append("facilities", facilities.join(","))
    fd.append("lat", String(pos.lat))
    fd.append("lng", String(pos.lng))
    files.forEach((f) => fd.append("images", f))
    if (isEdit) fd.append("removeImages", JSON.stringify(removed))

    setSaving(true)
    try {
      const res = isEdit && id ? await updateBoarding(id, fd) : await createBoarding(fd)
      navigate("/owner/boardings", { state: { notice: res.message } })
    } catch (err) {
      fail(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <p className="py-16 text-center text-nest-300">Loading...</p>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl">
        <Link to="/owner/boardings" className="text-sm font-semibold text-sand-400 hover:underline">
          ← Back to my boardings
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-sand-100">{isEdit ? "Edit boarding" : "Add a boarding"}</h1>
          {status && <StatusBadge status={status} />}
        </div>

        {isEdit && status === "REJECTED" && rejection && (
          <div role="status" className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
            This boarding was rejected: {rejection}. Fix the issues and save to send it for approval again.
          </div>
        )}
        {isEdit && status === "APPROVED" && (
          <div role="note" className="mt-4 rounded-xl border border-sand-300/30 bg-sand-300/10 p-3 text-sm text-sand-300">
            Changing the title, description, price, address, location or photos sends this boarding for admin approval again.
            Changing rooms or facilities does not.
          </div>
        )}
        {error && (
          <div role="alert" className="mt-4 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-6">
          
          <section className={section}>
            <h2 className="text-xl font-bold text-sand-100">Basic details</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="title" className={labelClass}>Title</label>
                <input id="title" className={inputClass} value={form.title} onChange={(e) => update("title", e.target.value)} required />
              </div>
              <div>
                <label htmlFor="description" className={labelClass}>Description</label>
                <textarea id="description" rows={4} className={inputClass} value={form.description} onChange={(e) => update("description", e.target.value)} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="rent" className={labelClass}>Monthly rent (Rs.)</label>
                  <input id="rent" type="number" min={1} className={inputClass} value={form.monthlyRent} onChange={(e) => update("monthlyRent", e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="total" className={labelClass}>Total rooms</label>
                  <input id="total" type="number" min={1} max={100} className={inputClass} value={form.totalRooms} onChange={(e) => update("totalRooms", e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="available" className={labelClass}>Available rooms</label>
                  <input id="available" type="number" min={0} max={100} className={inputClass} value={form.availableRooms} onChange={(e) => update("availableRooms", e.target.value)} required />
                </div>
              </div>

              <fieldset>
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
                        className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                          on ? "border-sand-400 bg-sand-400 text-nest-950" : "border-nest-300/40 text-nest-100 hover:bg-nest-700"
                        }`}
                      >
                        {f}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            </div>
          </section>

          {/* location */}
          <section className={section}>
            <h2 className="text-xl font-bold text-sand-100">Location</h2>
            <p className="mt-1 text-sm text-nest-300">
              Search for your place or click on the map. The address is filled in for you and you can edit it. Nearby campuses are found automatically.
            </p>

            <div className="mt-4">
              <LocationPicker value={pos} onChange={handlePick} />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label htmlFor="address" className={labelClass}>Address</label>
                <input id="address" className={inputClass} value={form.address} onChange={(e) => update("address", e.target.value)} required />
              </div>
              <div>
                <label htmlFor="city" className={labelClass}>City</label>
                <input id="city" className={inputClass} value={form.city} onChange={(e) => update("city", e.target.value)} required />
              </div>
            </div>

            <div className="mt-4">
              <NearbyCampuses position={pos} />
            </div>
          </section>

          {/* photos */}
          <section className={section}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-sand-100">Photos</h2>
              <span className="text-sm text-nest-300">
                {photoCount} / {MAX_IMAGES}
              </span>
            </div>
            <p className="mt-1 text-sm text-nest-300">jpg, png or webp, up to 5MB each. The first photo is the cover.</p>

            {photoError && (
              <div role="alert" className="mt-3 rounded-xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
                {photoError}
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {existing.map((img) => {
                const gone = removed.includes(img.path)
                return (
                  <div key={img.path} className="relative">
                    <img src={img.url} alt="Current photo" className={`h-28 w-full rounded-xl object-cover ${gone ? "opacity-30" : ""}`} />
                    <button
                      type="button"
                      onClick={() => setRemoved((r) => (gone ? r.filter((p) => p !== img.path) : [...r, img.path]))}
                      className="absolute bottom-1.5 left-1.5 right-1.5 rounded-lg bg-nest-950/80 py-1 text-xs font-semibold text-sand-100"
                    >
                      {gone ? "Undo" : "Remove"}
                    </button>
                  </div>
                )
              })}

              {previews.map((url, i) => (
                <div key={url} className="relative">
                  <img src={url} alt={`New photo ${i + 1}`} className="h-28 w-full rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={() => setFiles((list) => list.filter((_, idx) => idx !== i))}
                    className="absolute bottom-1.5 left-1.5 right-1.5 rounded-lg bg-nest-950/80 py-1 text-xs font-semibold text-sand-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {photoCount < MAX_IMAGES && (
              <label className="mt-4 inline-block cursor-pointer rounded-xl border border-dashed border-nest-300/60 px-5 py-3 text-sm font-semibold text-sand-100 hover:bg-nest-700">
                Add photos
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    addFiles(e.target.files)
                    e.target.value = ""
                  }}
                />
              </label>
            )}
          </section>

          <button type="submit" disabled={saving} className={primaryButtonClass}>
            {saving ? "Saving..." : isEdit ? "Save changes" : "Submit for approval"}
          </button>
        </form>
      </div>
    </AppLayout>
  )
}

export default BoardingForm