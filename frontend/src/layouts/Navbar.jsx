import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Avatar from '../components/ui/Avatar'
import toast from 'react-hot-toast'
import { useState, useEffect, useRef } from 'react'

const navLinks = [
  { to: '/rides',        label: 'Find Rides' },
  { to: '/bus-tracking', label: '🚍 Bus Tracker' },
]
const authLinks = [
  { to: '/dashboard',    label: '📊 Dashboard' },
  { to: '/rides/create', label: '+ Create Ride' },
  { to: '/bookings',     label: '🎫 My Bookings' },
  { to: '/profile',      label: '👤 Profile' },
]

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [userMenu, setUserMenu] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef()

  useEffect(() => {
    setMobileOpen(false)
    setUserMenu(false)
  }, [location.pathname])

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenu(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Signed out')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">CR</div>
          <span className="font-heading font-bold text-slate-900 text-lg tracking-tight">CampusRide</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(to) ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                <Avatar src={user?.profilePicture} name={user?.name} size="sm" />
                <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">{user?.name}</span>
                <span className="text-slate-400 text-xs">{userMenu ? '▴' : '▾'}</span>
              </button>
              {userMenu && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 animate-fade-in">
                  {authLinks.map(({ to, label }) => (
                    <Link key={to} to={to} onClick={() => setUserMenu(false)}
                      className={`flex items-center px-4 py-2.5 text-sm transition-colors ${
                        isActive(to) ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}>
                      {label}
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      🚪 Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm py-2 px-4">Sign in</Link>
              <Link to="/signup" className="btn-primary text-sm py-2 px-4">Sign up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-slate-100 transition-colors">
          {[0,1,2].map(i => (
            <span key={i} className={`block h-0.5 bg-slate-600 transition-all duration-200 ${
              i === 1 ? 'w-5' : 'w-5'
            } ${mobileOpen && i === 0 ? 'rotate-45 translate-y-2' : ''} ${mobileOpen && i === 1 ? 'opacity-0' : ''} ${mobileOpen && i === 2 ? '-rotate-45 -translate-y-2' : ''}`} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-3 px-4 space-y-1 animate-slide-up">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(to) ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
              }`}>
              {label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <div className="border-t border-slate-100 pt-2 mt-2">
                <div className="flex items-center gap-3 px-4 py-2 mb-1">
                  <Avatar src={user?.profilePicture} name={user?.name} size="sm" />
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.role}</p>
                  </div>
                </div>
                {authLinks.map(({ to, label }) => (
                  <Link key={to} to={to}
                    className="flex items-center px-4 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    {label}
                  </Link>
                ))}
                <button onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors">
                  🚪 Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-2 pt-2 border-t border-slate-100 mt-2">
              <Link to="/login" className="btn-secondary flex-1 text-center text-sm">Sign in</Link>
              <Link to="/signup" className="btn-primary flex-1 text-center text-sm">Sign up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
