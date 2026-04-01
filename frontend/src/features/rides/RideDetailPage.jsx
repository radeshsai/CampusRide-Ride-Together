import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRide, getDriverContact } from '../../services/rideService'
import { createBooking } from '../../services/bookingService'
import { formatDateTime, formatCurrency } from '../../utils/formatters'
import Avatar from '../../components/ui/Avatar'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import { useAuth } from '../../hooks/useAuth'
import useWebSocket from '../../hooks/useWebSocket'
import toast from 'react-hot-toast'

export default function RideDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [contact, setContact] = useState(null)
  const [contactModal, setContactModal] = useState(false)
  const [loadingContact, setLoadingContact] = useState(false)

  const onSeatUpdate = useCallback((seats) => {
    setRide((r) => r ? { ...r, availableSeats: seats } : r)
  }, [])

  useWebSocket(`/topic/rides/${id}/seats`, onSeatUpdate)

  useEffect(() => {
    getRide(id).then(({ data }) => setRide(data)).catch(() => toast.error('Ride not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleBook = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setBooking(true)
    try {
      await createBooking({ rideId: Number(id), seatsBooked: 1 })
      toast.success('Ride booked successfully! 🎉')
      const { data } = await getRide(id)
      setRide(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally { setBooking(false) }
  }

  const handleContactDriver = async () => {
    setLoadingContact(true)
    try {
      const { data } = await getDriverContact(id)
      setContact(data)
      setContactModal(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Book the ride first to see driver contact')
    } finally { setLoadingContact(false) }
  }

  if (loading) return <Spinner size="lg" className="py-32" />
  if (!ride) return <div className="page-container text-center text-slate-500 py-20">Ride not found</div>

  const isOwner = user?.email === ride.driver?.email
  const isFull = ride.availableSeats === 0

  return (
    <div className="page-container max-w-3xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 text-sm transition-colors">
        ← Back to rides
      </button>

      <div className="card p-6 mb-4">
        {/* Driver info */}
        <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Avatar src={ride.driver?.profilePicture} name={ride.driver?.name} size="lg" />
            <div>
              <p className="font-heading font-semibold text-slate-800 text-lg">{ride.driver?.name}</p>
              <p className="text-slate-400 text-sm">{ride.driver?.collegeName || 'Campus Student'}</p>
            </div>
          </div>
          <StatusBadge status={ride.status} />
        </div>

        {/* Route */}
        <div className="flex gap-4 mb-6">
          <div className="flex flex-col items-center gap-1 mt-1">
            <div className="w-3 h-3 rounded-full bg-brand-500 ring-2 ring-brand-100" />
            <div className="w-px flex-1 bg-slate-200" />
            <div className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-100" />
          </div>
          <div className="flex flex-col gap-6 flex-1">
            <div>
              <p className="text-sm text-slate-400 mb-0.5">From</p>
              <p className="font-semibold text-slate-800 text-lg">{ride.origin}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-0.5">To</p>
              <p className="font-semibold text-slate-800 text-lg">{ride.destination}</p>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl mb-6">
          {[
            { label: 'Departure', value: formatDateTime(ride.departureTime), icon: '🕐' },
            { label: 'Seats Left', value: `${ride.availableSeats} / ${ride.totalSeats}`, icon: '🪑' },
            { label: 'Price/seat', value: formatCurrency(ride.pricePerSeat), icon: '💰' },
            { label: 'Vehicle', value: ride.vehicleModel || 'Not specified', icon: '🚗' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <p className="font-semibold text-slate-800 text-sm">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {ride.vehicleNumber && <p className="text-sm text-slate-500 mb-2">🔖 Vehicle: <strong>{ride.vehicleNumber}</strong></p>}
        {ride.notes && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4">
            <p className="text-amber-800 text-sm"><span className="font-medium">📝 Note:</span> {ride.notes}</p>
          </div>
        )}

        {/* Actions */}
        {!isOwner && ride.status === 'ACTIVE' && (
          <div className="flex gap-3 mt-2">
            <button className="btn-primary flex-1 flex items-center justify-center gap-2"
              onClick={handleBook} disabled={booking || isFull}>
              {booking ? <Spinner size="sm" /> : null}
              {isFull ? 'Fully Booked' : booking ? 'Booking…' : '🎫 Book Seat'}
            </button>
            <button className="btn-secondary flex items-center gap-2"
              onClick={handleContactDriver} disabled={loadingContact}>
              {loadingContact ? <Spinner size="sm" /> : '📞'}
              Driver Contact
            </button>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <Modal isOpen={contactModal} onClose={() => setContactModal(false)} title="Driver Contact">
        {contact && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <Avatar name={contact.name} size="md" />
              <div>
                <p className="font-semibold text-slate-800">{contact.name}</p>
                <p className="text-slate-500 text-sm">{contact.phoneNumber || 'No phone provided'}</p>
              </div>
            </div>
            {contact.phoneNumber && (
              <a href={`tel:${contact.phoneNumber}`} className="btn-secondary w-full flex items-center justify-center gap-2">
                📞 Call Driver
              </a>
            )}
            {contact.whatsappLink && (
              <a href={contact.whatsappLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors">
                💬 WhatsApp Driver
              </a>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
