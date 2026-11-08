import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Circle, MapContainer, TileLayer } from "react-leaflet"

const ApproxMap = ({ lat, lng }: { lat: number; lng: number }) => (
  <div>
    <div className="relative z-0 overflow-hidden rounded-2xl border border-nest-300/30">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        dragging={!L.Browser.mobile} 
        className="h-64 w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle center={[lat, lng]} radius={150} pathOptions={{ color: "#ea9f61", fillColor: "#f3bb8a", fillOpacity: 0.35 }} />
      </MapContainer>
    </div>
    <p className="mt-2 text-sm text-nest-300">
      This is the approximate area. The exact address is shared with you after the owner approves your booking.
    </p>
  </div>
)

export default ApproxMap