import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyBookings, cancelBooking } from '../../services/bookingService'
import { formatDateTime, formatCurrency, formatRelative } from '../../utils/formatters'
import StatusBadge from '../../components/ui/StatusBadge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import toast from 'react-hot-toast'

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)

  const fetchBookings = async () => {
    try {
      const { data } = await getMyBookings()
      setBookings(data)
    } catch { toast.error('Failed to load bookings') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBookings() }, [])

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return
    setCancellingId(id)
    try {
      await cancelBooking(id)
      toast.success('Booking cancelled')
      fetchBookings()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel')
    } finally { setCancellingId(null) }
  }

  if (loading) return <Spinner size="lg" className="py-32" />

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title">My Bookings</h1>
        <p className="text-slate-500 text-sm mt-1">{bookings.length} total bookings</p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState icon="🎫" title="No bookings yet"
          description="Book a ride and it will appear here."
          action={<Link to="/rides" className="btn-primary">Find Rides</Link>} />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Route */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-semibold text-slate-800">{booking.origin}</span>
                    <span className="text-slate-400 text-sm">→</span>
                    <span className="font-semibold text-slate-800">{booking.destination}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-slate-400 text-xs mb-0.5">Departure</p>
                      <p className="font-medium text-slate-700">{formatDateTime(booking.departureTime)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-0.5">Driver</p>
                      <p className="font-medium text-slate-700">{booking.driverName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-0.5">Seats</p>
                      <p className="font-medium text-slate-700">{booking.seatsBooked}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-0.5">Total</p>
                      <p className="font-medium text-slate-700">{formatCurrency(booking.totalPrice)}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-2">Booked {formatRelative(booking.createdAt)}</p>
                </div>

                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <StatusBadge status={booking.status} />
                  <div className="flex gap-2">
                    <Link to={`/rides/${booking.rideId}`} className="btn-secondary text-xs py-1.5 px-3">View Ride</Link>
                    {booking.status === 'CONFIRMED' && (
                      <button onClick={() => handleCancel(booking.id)} disabled={cancellingId === booking.id}
                        className="btn-danger text-xs py-1.5 px-3 flex items-center gap-1">
                        {cancellingId === booking.id ? <Spinner size="sm" /> : null}
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
