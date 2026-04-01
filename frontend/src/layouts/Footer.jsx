import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">CR</div>
              <span className="font-heading font-bold text-white">CampusRide</span>
            </div>
            <p className="text-sm leading-relaxed">Smart ride-sharing and bus tracking for campus students.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Features</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/rides', label: 'Find Rides' },
                { to: '/rides/create', label: 'Post a Ride' },
                { to: '/bus-tracking', label: 'Bus Tracking' },
                { to: '/bookings', label: 'My Bookings' },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/login', label: 'Sign In' },
                { to: '/signup', label: 'Create Account' },
                { to: '/profile', label: 'My Profile' },
                { to: '/dashboard', label: 'Dashboard' },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs">© 2024 CampusRide. Built for campus students.</p>
          <p className="text-xs">Made with ❤️ using React + Spring Boot</p>
        </div>
      </div>
    </footer>
  )
}
