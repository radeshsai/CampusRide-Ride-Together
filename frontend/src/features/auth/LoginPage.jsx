import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import Spinner from '../../components/ui/Spinner'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login: setAuth } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await login(form)
      setAuth(data)
      toast.success(`Welcome back, ${data.name}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">CR</div>
            <h1 className="font-heading text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your CampusRide account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input className="input" type="email" name="email" placeholder="you@college.edu"
                value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" name="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-2" disabled={loading}>
              {loading ? <Spinner size="sm" /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-600 font-medium hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
