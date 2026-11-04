import type { LatLng } from "../components/LocationPicker"

export const inSriLanka = (lat: number, lng: number) => lat >= 5.8 && lat <= 9.95 && lng >= 79.4 && lng <= 82.0

export const parseLocationInput = (text: string): LatLng | null => {
  let t = text.trim()
  try {
    t = decodeURIComponent(t)
  } catch {
  }

  const patterns = [
    /@(-?\d+\.?\d*),(-?\d+\.?\d*)/, // .../@6.9271,79.8612,15z
    /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/, // ...!3d6.9271!4d79.8612
    /[?&](?:q|ll|query)=(-?\d+\.?\d*)[, ]+(-?\d+\.?\d*)/, // ?q=6.9271,79.8612
    /^\s*(-?\d+\.?\d*)\s*[, ]\s*(-?\d+\.?\d*)\s*$/ // 6.9271, 79.8612
  ]

  for (const p of patterns) {
    const m = t.match(p)
    if (m) {
      const lat = Number(m[1])
      const lng = Number(m[2])
      if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng }
    }
  }
  return null
}