import { useState, useEffect, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { getBuses } from '../../services/busService'
import useWebSocket from '../../hooks/useWebSocket'
import { BUS_ROUTE_COORDS, CAMPUS_CENTER } from '../../utils/constants'
import Spinner from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const busIcon = (color) => L.divIcon({
  html: `<div style="width:32px;height:32px;background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <span style="transform:rotate(45deg);font-size:14px;">🚍</span></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

const BUS_COLORS = ['#0ea5e9', '#16a34a', '#d97706', '#7c3aed']

function FlyToMarker({ lat, lng }) {
  const map = useMap()
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], 16, { duration: 1 })
  }, [lat, lng, map])
  return null
}

export default function BusTrackingPage() {
  const [buses, setBuses] = useState([])
  const [locations, setLocations] = useState({})
  const [selectedBus, setSelectedBus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBuses().then(({ data }) => {
      setBuses(data)
      const locs = {}
      data.forEach(bus => {
        if (bus.currentLocation) locs[bus.id] = bus.currentLocation
      })
      setLocations(locs)
      if (data.length > 0) setSelectedBus(data[0])
    }).catch(() => toast.error('Failed to load buses'))
      .finally(() => setLoading(false))
  }, [])

  const handleBusLocationUpdate = useCallback((busId) => (data) => {
    setLocations(prev => ({ ...prev, [busId]: data }))
  }, [])

  // Subscribe to each bus WS (we'll do it inline for the selected bus approach)
  const BusSubscriber = ({ busId }) => {
    useWebSocket(`/topic/bus/${busId}/location`, handleBusLocationUpdate(busId))
    return null
  }

  const selected = selectedBus
  const selLoc = selected ? locations[selected.id] : null
  const colorIdx = buses.findIndex(b => b.id === selected?.id)

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="section-title flex items-center gap-2">🚍 Live Bus Tracking</h1>
        <p className="text-slate-500 text-sm mt-1">Real-time campus bus locations updating every few seconds</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bus List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-heading font-semibold text-slate-700 text-sm uppercase tracking-wider">Active Buses</h2>

          {loading ? <Spinner className="py-8" /> : buses.length === 0 ? (
            <div className="card p-6 text-center text-slate-400">No active buses</div>
          ) : buses.map((bus, idx) => {
            const loc = locations[bus.id]
            const isSelected = selected?.id === bus.id
            const color = BUS_COLORS[idx % BUS_COLORS.length]
            return (
              <div key={bus.id}>
                <BusSubscriber busId={bus.id} />
                <button onClick={() => setSelectedBus(bus)} className={`w-full text-left card p-4 transition-all duration-200 ${isSelected ? 'ring-2 ring-brand-500 shadow-md' : 'hover:shadow-md'}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0" style={{ background: color }}>
                      {bus.busNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{bus.routeName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{bus.driverName}</p>
                      {loc && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs text-emerald-600 font-medium">Live</span>
                            <span className="text-xs text-slate-400">• {Math.round(loc.speed || 0)} km/h</span>
                          </div>
                          {loc.nextStop && (
                            <p className="text-xs text-slate-500">
                              Next: <strong className="text-slate-700">{loc.nextStop}</strong>
                              {loc.etaMinutes && <span className="text-brand-600"> · {loc.etaMinutes} min</span>}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <span>🏁 {bus.startLocation}</span>
                    <span>🔚 {bus.endLocation}</span>
                  </div>
                </button>
              </div>
            )
          })}
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden" style={{ height: '520px' }}>
            <MapContainer
              center={[CAMPUS_CENTER.lat, CAMPUS_CENTER.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap"
              />

              {/* Route paths */}
              {Object.entries(BUS_ROUTE_COORDS).map(([busIdx, coords], i) => (
                <Polyline key={busIdx} positions={coords}
                  color={BUS_COLORS[i % BUS_COLORS.length]} weight={3} opacity={0.5} dashArray="6 4" />
              ))}

              {/* Bus markers */}
              {buses.map((bus, idx) => {
                const loc = locations[bus.id]
                if (!loc) return null
                const color = BUS_COLORS[idx % BUS_COLORS.length]
                return (
                  <Marker key={bus.id} position={[loc.latitude, loc.longitude]} icon={busIcon(color)}>
                    <Popup>
                      <div className="font-body text-sm">
                        <p className="font-semibold text-slate-800 mb-1">{bus.busNumber} – {bus.routeName}</p>
                        <p className="text-slate-500">Driver: {bus.driverName}</p>
                        {loc.nextStop && <p className="text-slate-500">Next: <strong>{loc.nextStop}</strong></p>}
                        {loc.etaMinutes && <p className="text-brand-600 font-medium">ETA: {loc.etaMinutes} min</p>}
                        <p className="text-slate-400 text-xs mt-1">Speed: {Math.round(loc.speed || 0)} km/h</p>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}

              {selLoc && <FlyToMarker lat={selLoc.latitude} lng={selLoc.longitude} />}
            </MapContainer>
          </div>

          {/* Selected bus info bar */}
          {selected && selLoc && (
            <div className="card p-4 mt-3 flex flex-wrap gap-4 text-sm animate-fade-in">
              <div><span className="text-slate-400">Bus:</span> <strong className="text-slate-800">{selected.busNumber}</strong></div>
              <div><span className="text-slate-400">Route:</span> <strong className="text-slate-800">{selected.routeName}</strong></div>
              <div><span className="text-slate-400">Next stop:</span> <strong className="text-brand-700">{selLoc.nextStop || '—'}</strong></div>
              <div><span className="text-slate-400">ETA:</span> <strong className="text-campus-green">{selLoc.etaMinutes ? `${selLoc.etaMinutes} min` : '—'}</strong></div>
              <div><span className="text-slate-400">Speed:</span> <strong className="text-slate-800">{Math.round(selLoc.speed || 0)} km/h</strong></div>
              <div><span className="text-slate-400">Schedule:</span> <strong className="text-slate-700">{selected.scheduleInfo}</strong></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
