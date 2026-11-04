import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useRef, useState } from "react"
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet"
import { reversePlace, searchPlaces } from "../service/geo"
import type { PlaceResult } from "../types"
import { getErrorMessage } from "../util/errors"
import { inSriLanka, parseLocationInput } from "../util/geo"
import { inputClass } from "../util/styles"

export type LatLng = { lat: number; lng: number }
export type PickMeta = { name?: string; address?: string; city?: string }

type Props = {
  value: LatLng | null
  onChange: (pos: LatLng, meta?: PickMeta) => void
}

const COLOMBO: LatLng = { lat: 6.9271, lng: 79.8612 }

const pinIcon = L.divIcon({
  className: "",
  html: `<svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg"><path d="M17 0C7.6 0 0 7.4 0 16.6 0 29 17 44 17 44s17-15 17-27.4C34 7.4 26.4 0 17 0Z" fill="#f3bb8a" stroke="#16302a" stroke-width="2"/><circle cx="17" cy="16" r="6" fill="#16302a"/></svg>`,
  iconSize: [34, 44],
  iconAnchor: [17, 44]
})

const ClickHandler = ({ onPick }: { onPick: (pos: LatLng) => void }) => {
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useMapEvents({
    click: (e) => {
      const pos = { lat: e.latlng.lat, lng: e.latlng.lng }
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => onPick(pos), 250)
    },
    dblclick: () => window.clearTimeout(timer.current)
  })
  return null
}

const FlyTo = ({ target }: { target: LatLng | null }) => {
  const map = useMap()
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 15))
  }, [target, map])
  return null
}

const ResizeFix = ({ trigger }: { trigger: boolean }) => {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 150)
    return () => clearTimeout(t)
  }, [trigger, map])
  return null
}

const MapGestures = ({ expanded }: { expanded: boolean }) => {
  const map = useMap()

  useEffect(() => {
    if (expanded || !L.Browser.mobile) map.dragging.enable()
    else map.dragging.disable()
  }, [expanded, map])

  useEffect(() => {
    const el = map.getContainer()
    let last = 0
    const onWheel = (e: WheelEvent) => {
      if (!expanded && !e.ctrlKey) return
      e.preventDefault()
      const now = Date.now()
      if (now - last < 120) return
      last = now
      map.setZoomAround(map.mouseEventToContainerPoint(e), map.getZoom() + (e.deltaY < 0 ? 1 : -1))
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [expanded, map])

  return null
}

const LocationPicker = ({ value, onChange }: Props) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<PlaceResult[]>([])
  const [searching, setSearching] = useState(false)
  const [message, setMessage] = useState("")
  const [flyTo, setFlyTo] = useState<LatLng | null>(null)
  const [expanded, setExpanded] = useState(false)
  const requestId = useRef(0)

  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(false)
    document.addEventListener("keydown", onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previous
    }
  }, [expanded])

  const pick = async (pos: LatLng) => {
    const id = ++requestId.current
    onChange(pos)
    try {
      const r = await reversePlace(pos.lat, pos.lng)
      if (id === requestId.current) onChange(pos, { address: r.address, city: r.city })
    } catch {
    
    }
  }

  const search = async () => {
    const text = query.trim()
    if (text.length < 3) {
      setMessage("Type at least 3 characters to search.")
      return
    }

    const parsed = parseLocationInput(text)
    if (parsed) {
      const pos = inSriLanka(parsed.lat, parsed.lng)
        ? parsed
        : inSriLanka(parsed.lng, parsed.lat) 
          ? { lat: parsed.lng, lng: parsed.lat }
          : null
      if (!pos) {
        setMessage("Those coordinates are outside Sri Lanka.")
        return
      }
      setResults([])
      setMessage("")
      setFlyTo(pos)
      pick(pos)
      return
    }

    setSearching(true)
    setMessage("")
    setResults([])
    try {
      const found = await searchPlaces(text)
      setResults(found)
      if (found.length === 0) {
        setMessage(
          "Not found. Try a shorter name or add the city (e.g. “ICBT Kandy”). You can also paste a Google Maps link or coordinates, or zoom the map and click the exact spot."
        )
      }
    } catch (err) {
      setMessage(getErrorMessage(err))
    } finally {
      setSearching(false)
    }
  }

  const choose = (p: PlaceResult) => {
    const pos = { lat: p.lat, lng: p.lng }
    requestId.current++ 
    setResults([])
    setFlyTo(pos)
    onChange(pos, { name: p.name.split(",")[0], address: p.name, city: p.city })
  }

  const locate = () => {
    if (!navigator.geolocation) {
      setMessage("Your browser does not support location.")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const pos = { lat: p.coords.latitude, lng: p.coords.longitude }
        setFlyTo(pos)
        pick(pos)
      },
      () => setMessage("Could not get your location. Allow location access, or click on the map."),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const center = value ?? COLOMBO

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className={inputClass}
          placeholder="Search a place, or paste a Google Maps link / coordinates"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              search()
            }
          }}
          aria-label="Search a place"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={search}
            disabled={searching}
            className="rounded-xl bg-sand-400 px-4 py-3 font-semibold text-nest-950 transition hover:bg-sand-500 disabled:opacity-60"
          >
            {searching ? "Searching..." : "Search"}
          </button>
          <button
            type="button"
            onClick={locate}
            className="whitespace-nowrap rounded-xl border border-nest-300/40 px-4 py-3 font-semibold text-sand-100 transition hover:bg-nest-700"
          >
            Use my location
          </button>
        </div>
      </div>

      {message && <p className="mt-2 text-sm text-sand-300">{message}</p>}

      {results.length > 0 && (
        <ul className="mt-2 overflow-hidden rounded-xl bg-white text-nest-900 shadow">
          {results.map((r) => (
            <li key={`${r.lat}-${r.lng}-${r.name}`}>
              <button
                type="button"
                onClick={() => choose(r)}
                className="w-full border-b border-nest-100 px-4 py-2.5 text-left text-sm hover:bg-nest-100/60"
              >
                {r.name}
              </button>
            </li>
          ))}
        </ul>
      )}

     
      <div className={expanded ? "fixed inset-0 z-50 flex flex-col bg-nest-950 p-3" : "relative z-0 mt-3"}>
        {expanded && (
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm text-sand-100">Drag to move, scroll or pinch to zoom, click to place the pin.</p>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="shrink-0 rounded-xl bg-sand-400 px-4 py-2 font-semibold text-nest-950"
            >
              Done
            </button>
          </div>
        )}

        <div className={`relative overflow-hidden rounded-2xl border border-nest-300/30 ${expanded ? "min-h-0 flex-1" : ""}`}>
          {!expanded && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              aria-label="Expand the map to full screen"
              className="absolute right-2 top-2 z-[1000] rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-nest-900 shadow hover:bg-sand-100"
            >
              Expand map
            </button>
          )}

          <MapContainer
            center={[center.lat, center.lng]}
            zoom={value ? 15 : 12}
            scrollWheelZoom={false}
            className={expanded ? "h-full w-full" : "h-72 w-full sm:h-96"}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onPick={pick} />
            <FlyTo target={flyTo} />
            <ResizeFix trigger={expanded} />
            <MapGestures expanded={expanded} />
            {value && (
              <Marker
                position={[value.lat, value.lng]}
                icon={pinIcon}
                draggable
                eventHandlers={{
                  dragend: (e) => {
                    const p = (e.target as L.Marker).getLatLng()
                    pick({ lat: p.lat, lng: p.lng })
                  }
                }}
              />
            )}
          </MapContainer>
        </div>
      </div>

      <p className="mt-2 text-sm text-nest-300">
        {value
          ? `Selected: ${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}. Drag the pin or click the map to adjust.`
          : "No location selected yet. Search for a place, click on the map, or use your location."}
      </p>
      <p className="mt-1 text-xs text-nest-300/80">
        Laptop: hold Ctrl and scroll to zoom. Phone: pinch to zoom, and tap “Expand map” to move around freely.
      </p>
    </div>
  )
}

export default LocationPicker