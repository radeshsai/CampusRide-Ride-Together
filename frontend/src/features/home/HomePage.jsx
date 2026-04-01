import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const stats = [
  { label: 'Active Riders', value: '2,400+' },
  { label: 'Rides Completed', value: '18,000+' },
  { label: 'Campus Routes', value: '12' },
]

const features = [
  { icon: '🚗', title: 'Share Rides', desc: 'Post or join rides with verified campus students. Split costs effortlessly.' },
  { icon: '🚍', title: 'Live Bus Tracker', desc: 'Track campus buses in real-time with live location and arrival times.' },
  { icon: '🔒', title: 'Campus Verified', desc: 'Only students with college email can join. Safe, trusted community.' },
  { icon: '💬', title: 'Contact Drivers', desc: 'WhatsApp and phone contact unlocked after confirmed booking.' },
]

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            🎓 Built for campus students
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            Ride Together,<br />
            <span className="text-brand-200">Save Together</span>
          </h1>
          <p className="text-brand-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            The smartest way to get around campus. Share rides, track buses live,
            and connect with fellow students — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rides" className="bg-white text-brand-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-50 transition-colors shadow-lg">
              Find a Ride →
            </Link>
            {isAuthenticated
              ? <Link to="/rides/create" className="bg-brand-800/60 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-800/80 transition-colors border border-white/20">
                  + Post a Ride
                </Link>
              : <Link to="/signup" className="bg-brand-800/60 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-800/80 transition-colors border border-white/20">
                  Sign Up Free
                </Link>
            }
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
            {stats.map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="font-heading text-3xl font-bold text-white">{value}</div>
                <div className="text-brand-200 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-bold text-slate-900 mb-3">Everything you need on campus</h2>
            <p className="text-slate-500 max-w-xl mx-auto">CampusRide brings students together with smart ride-sharing and live transit tracking.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="card p-6 group hover:-translate-y-1 transition-transform duration-200">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-heading font-semibold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Ready to ride smarter?</h2>
          <p className="text-slate-400 mb-8">Join thousands of students already using CampusRide every day.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="btn-primary">Create Account</Link>
            <Link to="/bus-tracking" className="btn-secondary bg-transparent text-white border-white/20 hover:bg-white/10">
              Track Buses Live 🚍
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
