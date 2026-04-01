import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRide } from '../../services/rideService'
import Spinner from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function CreateRidePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    origin: '',
    destination: '',
    departureTime: '',
    totalSeats: 3,
    pricePerSeat: '',
    vehicleModel: '',
    vehicleNumber: '',
    notes: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        origin: form.origin,
        destination: form.destination,
        departureTime: form.departureTime + ':00',
        totalSeats: Number(form.totalSeats),
        pricePerSeat: form.pricePerSeat ? Number(form.pricePerSeat) : null,
        vehicleModel: form.vehicleModel || null,
        vehicleNumber: form.vehicleNumber || null,
        notes: form.notes || null,
      }
      await createRide(payload)
      toast.success('Ride posted successfully!')
      navigate('/rides')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create ride')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container max-w-2xl">
      <div className="mb-8">
        <h1 className="section-title">Post a Ride</h1>
        <p className="text-slate-500 text-sm mt-1">Share your journey with fellow students</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">From (Origin) *</label>
              <input
                className="input"
                name="origin"
                placeholder="e.g. North Campus Hostel"
                value={form.origin}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">To (Destination) *</label>
              <input
                className="input"
                name="destination"
                placeholder="e.g. Main Gate"
                value={form.destination}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Departure Time *</label>
              <input
                className="input"
                type="datetime-local"
                name="departureTime"
                value={form.departureTime}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Available Seats *</label>
              <input
                className="input"
                type="number"
                name="totalSeats"
                min={1}
                max={8}
                value={form.totalSeats}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Price per Seat (₹)</label>
              <input
                className="input"
                type="number"
                name="pricePerSeat"
                placeholder="0 = Free"
                value={form.pricePerSeat}
                onChange={handleChange}
                min={0}
              />
            </div>
            <div>
              <label className="label">Vehicle Model</label>
              <input
                className="input"
                name="vehicleModel"
                placeholder="e.g. Swift Dzire"
                value={form.vehicleModel}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">Vehicle Number</label>
              <input
                className="input"
                name="vehicleNumber"
                placeholder="AP 09 AB 1234"
                value={form.vehicleNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="label">Notes (optional)</label>
            <textarea
              className="input resize-none"
              rows={3}
              name="notes"
              placeholder="Any special instructions for passengers..."
              value={form.notes}
              onChange={handleChange}
              maxLength={500}
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{form.notes.length}/500</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : null}
              {loading ? 'Posting…' : 'Post Ride 🚗'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}