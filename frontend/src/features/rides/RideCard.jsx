import { Link } from 'react-router-dom'
import { formatDateTime, formatTime, formatCurrency } from '../../utils/formatters'
import Avatar from '../../components/ui/Avatar'
import StatusBadge from '../../components/ui/StatusBadge'

export default function RideCard({ ride }) {
  return (
    <Link to={`/rides/${ride.id}`}>
      <div className="card p-5 hover:-translate-y-0.5 transition-transform duration-200 cursor-pointer">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Avatar src={ride.driver?.profilePicture} name={ride.driver?.name} size="sm" />
            <div>
              <p className="font-medium text-slate-800 text-sm">{ride.driver?.name}</p>
              <p className="text-xs text-slate-400">{ride.driver?.collegeName || 'Campus Student'}</p>
            </div>
          </div>
          <StatusBadge status={ride.status} />
        </div>

        {/* Route */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex flex-col items-center gap-1 pt-1">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-500 ring-2 ring-brand-100" />
            <div className="w-px h-8 bg-slate-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-campus-red ring-2 ring-red-100" />
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div>
              <p className="font-semibold text-slate-800 text-sm truncate">{ride.origin}</p>
              <p className="text-xs text-slate-400">{formatTime(ride.departureTime)}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm truncate">{ride.destination}</p>
              <p className="text-xs text-slate-400">Destination</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-slate-600">
              <span className="text-base">🪑</span>
              <span className="font-medium text-slate-800">{ride.availableSeats}</span>
              <span className="text-slate-400">left</span>
            </span>
            {ride.vehicleModel && (
              <span className="text-slate-400 text-xs">• {ride.vehicleModel}</span>
            )}
          </div>
          <div className="font-heading font-bold text-brand-600 text-lg">
            {formatCurrency(ride.pricePerSeat)}
            <span className="text-xs text-slate-400 font-normal">/seat</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
