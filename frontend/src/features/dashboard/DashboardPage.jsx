import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyBookings } from '../../services/bookingService'
import { getRides } from '../../services/rideService'
import { useAuth } from '../../hooks/useAuth'
import { formatDateTime, formatRelative, formatCurrency } from '../../utils/formatters'
import Avatar from '../../components/ui/Avatar'
import StatusBadge from '../../components/ui/StatusBadge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

export default function DashboardPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    getMyBookings()
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false))
  }, [])

  const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length
  const cancelled = bookings.filter(b => b.status === 'CANCELLED').length
  const totalSpent = bookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0)

  const tabs = ['overview', 'bookings']
  const quickActions = [
    { to: '/rides/create', label: 'Post a Ride', icon: '🚗', color: 'bg-brand-50 hover:bg-brand-100 text-brand-700' },
    { to: '/rides', label: 'Find a Ride', icon: '🔍', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700' },
    { to: '/bus-tracking', label: 'Track Buses', icon: '🚍', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700' },
    { to: '/profile', label: 'Edit Profile', icon: '👤', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
  ]

  if (loading) return <Spinner size="lg" className="py-32" />

  return (
    <div className="page-container">
      {/* Profile banner */}
      <div className="card p-6 mb-6 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-0">
        <div className="flex items-center gap-4">
          <Avatar src={user?.profilePicture} name={user?.name} size="xl" />
          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-2xl font-bold truncate">
              Hey, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-brand-100 text-sm mt-0.5 truncate">{user?.email}</p>
            <span className="inline-block mt-2 bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Confirmed Rides',  value: confirmed, icon: '✅', cls: 'text-emerald-600' },
          { label: 'Cancelled',        value: cancelled, icon: '❌', cls: 'text-red-500' },
          { label: 'Total Bookings',   value: bookings.length, icon: '📊', cls: 'text-slate-700' },
          { label: 'Amount Spent',     value: formatCurrency(totalSpent), icon: '💰', cls: 'text-brand-600' },
        ].map(({ label, value, icon, cls }) => (
          <div key={label} className="card p-5">
            <div className="text-2xl mb-2">{icon}</div>
            <div className={`font-heading text-2xl font-bold ${cls}`}>{value}</div>
            <div className="text-slate-400 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {quickActions.map(({ to, label, icon, color }) => (
          <Link key={to} to={to}
            className={`${color} rounded-xl p-4 flex flex-col items-center gap-2 transition-colors text-center group`}>
            <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
              tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-slate-800">Recent Bookings</h2>
            <button onClick={() => setTab('bookings')} className="text-brand-600 text-sm hover:underline">
              See all →
            </button>
          </div>
          {bookings.length === 0 ? (
            <EmptyState icon="🎫" title="No bookings yet"
              description="Find a ride and book your seat!"
              action={<Link to="/rides" className="btn-primary">Browse Rides</Link>} />
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((b) => (
                <Link key={b.id} to={`/rides/${b.rideId}`}
                  className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                    🚗
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">
                      {b.origin} → {b.destination}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {b.driverName} · {formatDateTime(b.departureTime)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-semibold text-brand-600 hidden sm:block">
                      {formatCurrency(b.totalPrice)}
                    </span>
                    <StatusBadge status={b.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'bookings' && (
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <EmptyState icon="🎫" title="No bookings" description="Your booking history will appear here."
              action={<Link to="/rides" className="btn-primary">Find Rides</Link>} />
          ) : bookings.map((b) => (
            <div key={b.id} className="card p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-800 text-sm">{b.origin}</p>
                    <span className="text-slate-400">→</span>
                    <p className="font-semibold text-slate-800 text-sm">{b.destination}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-500">
                    <span>👤 {b.driverName}</span>
                    <span>🕐 {formatDateTime(b.departureTime)}</span>
                    <span>🪑 {b.seatsBooked} seat{b.seatsBooked > 1 ? 's' : ''}</span>
                    <span>💰 {formatCurrency(b.totalPrice)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Booked {formatRelative(b.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={b.status} />
                  <Link to={`/rides/${b.rideId}`} className="text-brand-600 text-xs hover:underline">View →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
