import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import Spinner from '../../components/ui/Spinner'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phoneNumber: '', collegeName: '', studentId: '' })
  const [loading, setLoading] = useState(false)
  const { login: setAuth } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await register(form)
      setAuth(data)
      toast.success(`Welcome to CampusRide, ${data.name}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 p-4 py-8">
      <div className="w-full max-w-md animate-slide-up">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">CR</div>
            <h1 className="font-heading text-2xl font-bold text-slate-900">Create account</h1>
            <p className="text-slate-500 text-sm mt-1">Join CampusRide and start riding smarter</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="label">Full name</label>
                <input className="input" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-span-2">
                <label className="label">College email</label>
                <input className="input" type="email" name="email" placeholder="you@college.edu" value={form.email} onChange={handleChange} required />
              </div>
              <div className="col-span-2">
                <label className="label">Password</label>
                <input className="input" type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" name="phoneNumber" placeholder="+91 9876543210" value={form.phoneNumber} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Student ID</label>
                <input className="input" name="studentId" placeholder="21BCE1234" value={form.studentId} onChange={handleChange} />
              </div>
              <div className="col-span-2">
                <label className="label">College name</label>
                <input className="input" name="collegeName" placeholder="VIT University" value={form.collegeName} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
              {loading ? <Spinner size="sm" /> : null}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
