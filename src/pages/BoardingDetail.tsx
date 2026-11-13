import { useEffect, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import ApproxMap from "../components/ApproxMap"
import ContactCard from "../components/ContactCard"
import CostCalculator from "../components/CostCalculator"
import FavoriteButton from "../components/FavoriteButton"
import ImageGallery from "../components/ImageGallery"
import RequestDialog from "../components/RequestDialog"
import { PinIcon } from "../components/icons"
import { useFavoriteIds } from "../hooks/useFavorites"
import { cancelMyBooking, createBooking } from "../service/booking"
import { getBoardingDetail } from "../service/browse"
import { COMPARE_MAX, toggleCompare } from "../store/compareSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import type { BoardingDetail as Detail } from "../types"
import { getSavedCampus, validCampusId } from "../util/campusPref"
import { formatDate } from "../util/date"
import { getErrorMessage } from "../util/errors"
import { formatRent } from "../util/format"

const BoardingDetail = () => {
  useFavoriteIds()
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const [params] = useSearchParams()
  const campusId = validCampusId(params.get("campus")) ?? getSavedCampus()

  const compareIds = useAppSelector((s) => s.compare.ids)
  const [data, setData] = useState<Detail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [working, setWorking] = useState(false)
  const [dialogError, setDialogError] = useState("")
  const [actionError, setActionError] = useState("")
  const [notice, setNotice] = useState("")

  useEffect(() => {
    if (!id) return
    let active = true
    setLoading(true)
    getBoardingDetail(id, campusId)
      .then((d) => {
        if (active) {
          setData(d)
          setError("")
        }
      })
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id, campusId])

  const refreshDetail = async () => {
    if (!id) return
    try {
      setData(await getBoardingDetail(id, campusId))
    } catch (err) {
      setActionError(getErrorMessage(err))
    }
  }

  const sendRequest = async (values: { moveInDate: string; message?: string }) => {
    if (!id) return
    setWorking(true)
    setDialogError("")
    try {
      await createBooking({ boardingId: id, ...values })
      setDialogOpen(false)
      setActionError("")
      setNotice("Request sent. The owner will review it.")
      await refreshDetail()
    } catch (err) {
      setDialogError(getErrorMessage(err))
    } finally {
      setWorking(false)
    }
  }

  const cancelRequest = async (bookingId: string) => {
    if (!window.confirm("Cancel this request?")) return
    setWorking(true)
    setActionError("")
    setNotice("")
    try {
      await cancelMyBooking(bookingId)
      setNotice("Request cancelled.")
      await refreshDetail()
    } catch (err) {
      setActionError(getErrorMessage(err))
    } finally {
      setWorking(false)
    }
  }

  const back = (
    <Link to="/boardings" className="text-sm font-semibold text-sand-400 hover:underline">
      ← Back to boardings
    </Link>
  )

  if (loading) {
    return (
      <AppLayout>
        {back}
        <p className="py-16 text-center text-nest-300">Loading...</p>
      </AppLayout>
    )
  }

  if (error || !data) {
    return (
      <AppLayout>
        {back}
        <div role="alert" className="mt-6 rounded-xl border border-red-300/30 bg-red-500/10 p-4 text-red-200">
          {error || "This boarding is not available."}
        </div>
      </AppLayout>
    )
  }

  const full = data.availableRooms === 0
  const inCompare = compareIds.includes(data.id)
  const compareFull = compareIds.length >= COMPARE_MAX
  const booking = data.myBooking

  const calcCampuses = data.selectedCampus
    ? [data.selectedCampus, ...data.nearbyCampuses.filter((c) => c.id !== data.selectedCampus?.id)]
    : data.nearbyCampuses

  return (
    <AppLayout>
      {back}

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sand-100">{data.title}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-nest-300">
            <PinIcon className="h-4 w-4" />
            {data.city}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-nest-100">
            <input
              type="checkbox"
              checked={inCompare}
              disabled={!inCompare && compareFull}
              onChange={() => dispatch(toggleCompare(data.id))}
              className="h-4 w-4 accent-sand-400"
            />
            Compare
          </label>
          <FavoriteButton id={data.id} />
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="space-y-6">
          <ImageGallery images={data.images} title={data.title} />

          <section className="rounded-2xl bg-nest-800 p-5">
            <h2 className="text-lg font-bold text-sand-100">About this boarding</h2>
            <p className="mt-2 whitespace-pre-line text-nest-100">{data.description}</p>

            {data.facilities.length > 0 && (
              <>
                <h3 className="mt-5 font-semibold text-sand-100">Facilities</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {data.facilities.map((f) => (
                    <li key={f} className="rounded-full bg-nest-700 px-3 py-1 text-sm font-medium text-sand-100">
                      {f}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {data.ownerName && <p className="mt-5 text-sm text-nest-300">Listed by {data.ownerName}</p>}
          </section>

          <section className="rounded-2xl bg-nest-800 p-5" aria-label="Nearby campuses">
            <h2 className="text-lg font-bold text-sand-100">Nearby campuses</h2>
            {data.nearbyCampuses.length === 0 ? (
              <p className="mt-2 text-sm text-nest-300">No campus within 10 km of this boarding.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {data.nearbyCampuses.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-nest-700 px-3 py-2 text-sm">
                    <span className="font-medium text-sand-100">
                      {c.name} <span className="font-normal text-nest-300">({c.city})</span>
                    </span>
                    <span className="text-nest-100">
                      {c.distanceKm} km · ~{c.walkMinutes} min walk · ~{c.vehicleMinutes} min by vehicle
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-nest-300/80">Distances and times are approximate estimates.</p>
          </section>

          <section className="rounded-2xl bg-nest-800 p-5" aria-label="Location">
            <h2 className="mb-3 text-lg font-bold text-sand-100">Location</h2>
            <ApproxMap lat={data.lat} lng={data.lng} />
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <div className="rounded-2xl bg-white p-5 text-nest-900 shadow">
            <p className="text-3xl font-bold">
              {formatRent(data.monthlyRent)} <span className="text-base font-normal text-nest-600">/ month</span>
            </p>
            <p className={`mt-1 text-sm font-medium ${full ? "text-red-700" : "text-nest-600"}`}>
              {full ? "No rooms free right now" : `${data.availableRooms} of ${data.totalRooms} rooms free`}
            </p>

            {data.selectedCampus && (
              <p className="mt-3 rounded-xl bg-nest-100 p-3 text-sm">
                <span className="font-semibold">{data.selectedCampus.distanceKm} km</span> from {data.selectedCampus.name}
                <br />
                <span className="text-nest-600">
                  ~{data.selectedCampus.walkMinutes} min walk · ~{data.selectedCampus.vehicleMinutes} min by vehicle
                </span>
              </p>
            )}

            {notice && (
              <p role="status" className="mt-4 rounded-xl bg-emerald-100 p-3 text-sm font-medium text-emerald-800">
                {notice}
              </p>
            )}
            {actionError && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {actionError}
              </p>
            )}

            {booking?.status === "APPROVED" ? (
              <div className="mt-4 space-y-3">
                <p className="rounded-xl bg-emerald-100 p-3 text-sm font-semibold text-emerald-800">
                  Your booking is approved. Move-in: {formatDate(booking.moveInDate)}
                </p>
                {data.contact && <ContactCard contact={data.contact} />}
                <Link to="/bookings" className="block text-center text-sm font-semibold text-nest-800 hover:underline">
                  View my bookings →
                </Link>
              </div>
            ) : booking?.status === "PENDING" ? (
              <div className="mt-4 space-y-3">
                <p className="rounded-xl bg-sand-100 p-3 text-sm">
                  <span className="font-semibold">Request sent.</span> Waiting for the owner to reply. Move-in:{" "}
                  {formatDate(booking.moveInDate)}
                </p>
                <button
                  onClick={() => cancelRequest(booking.id)}
                  disabled={working}
                  className="w-full rounded-xl border border-red-300 py-3 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  {working ? "Cancelling..." : "Cancel request"}
                </button>
              </div>
            ) : (
              <>
                <button
                  disabled={!!data.requestBlockedReason}
                  onClick={() => {
                    setDialogError("")
                    setNotice("")
                    setDialogOpen(true)
                  }}
                  className="mt-4 w-full rounded-xl bg-sand-400 py-3 font-semibold text-nest-950 transition hover:bg-sand-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Request a room
                </button>
                {data.requestBlockedReason ? (
                  <p className="mt-2 text-center text-sm text-red-700">{data.requestBlockedReason}</p>
                ) : (
                  <p className="mt-2 text-center text-xs text-nest-600">
                    The owner's phone and exact address are shared after a booking is approved.
                  </p>
                )}
              </>
            )}
          </div>

          <CostCalculator rent={data.monthlyRent} mealsIncluded={data.facilities.includes("Meals")} campuses={calcCampuses} />
        </aside>
      </div>

      {dialogOpen && (
        <RequestDialog
          boardingTitle={data.title}
          working={working}
          error={dialogError}
          onConfirm={sendRequest}
          onCancel={() => setDialogOpen(false)}
        />
      )}
    </AppLayout>
  )
}

export default BoardingDetail