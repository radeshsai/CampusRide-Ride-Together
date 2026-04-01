import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRides } from '../../services/rideService'
import RideCard from './RideCard'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function RidesPage() {
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState({ origin: '', destination: '' })
  const { isAuthenticated } = useAuth()

  const fetchRides = async (params = {}) => {
    setLoading(true)
    try {
      const { data } = await getRides(params)
      setRides(data)
    } catch {
      toast.error('Failed to load rides')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRides() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchRides({ origin: search.origin, destination: search.destination })
  }

  const handleReset = () => {
    setSearch({ origin: '', destination: '' })
    fetchRides()
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Available Rides</h1>
          <p className="text-slate-500 text-sm mt-1">{rides.length} rides found on campus</p>
        </div>
        {isAuthenticated && (
          <Link to="/rides/create" className="btn-primary">+ Post a Ride</Link>
        )}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input className="input" placeholder="🔍 From (origin)..." value={search.origin}
              onChange={(e) => setSearch({ ...search, origin: e.target.value })} />
          </div>
          <div className="flex-1">
            <input className="input" placeholder="📍 To (destination)..." value={search.destination}
              onChange={(e) => setSearch({ ...search, destination: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary px-6">Search</button>
            {(search.origin || search.destination) && (
              <button type="button" className="btn-secondary" onClick={handleReset}>Reset</button>
            )}
          </div>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : rides.length === 0 ? (
        <EmptyState
          icon="🚗"
          title="No rides available"
          description="Be the first to post a ride for your route!"
          action={isAuthenticated
            ? <Link to="/rides/create" className="btn-primary">Post a Ride</Link>
            : <Link to="/signup" className="btn-primary">Sign up to post</Link>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rides.map((ride) => <RideCard key={ride.id} ride={ride} />)}
        </div>
      )}
    </div>
  )
}
