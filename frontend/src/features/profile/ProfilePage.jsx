import { useState, useEffect } from 'react'
import { getProfile, updateProfile } from '../../services/userService'
import { getUserReviews } from '../../services/reviewService'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../../components/ui/Avatar'
import StarRating from '../../components/ui/StarRating'
import Spinner from '../../components/ui/Spinner'
import { formatDate, formatRelative } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [reviews, setReviews] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('profile')
  const [form, setForm] = useState({ name: '', phoneNumber: '', collegeName: '', studentId: '' })

  useEffect(() => {
    Promise.all([getProfile(), user?.id ? getUserReviews(user.id) : Promise.resolve(null)])
      .then(([profileRes, reviewRes]) => {
        const p = profileRes.data
        setProfile(p)
        setForm({ name: p.name, phoneNumber: p.phoneNumber || '', collegeName: p.collegeName || '', studentId: p.studentId || '' })
        if (reviewRes) setReviews(reviewRes.data)
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [user?.id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await updateProfile(form)
      setProfile(data)
      updateUser({ name: data.name })
      setEditing(false)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally { setSaving(false) }
  }

  if (loading) return <Spinner size="lg" className="py-32" />

  return (
    <div className="page-container max-w-2xl">
      <h1 className="section-title mb-6">My Profile</h1>

      {/* Profile card */}
      <div className="card p-6 mb-4">
        <div className="flex items-start gap-5 mb-6 pb-6 border-b border-slate-100">
          <Avatar src={profile?.profilePicture} name={profile?.name} size="xl" />
          <div className="flex-1 min-w-0">
            <h2 className="font-heading text-xl font-bold text-slate-900 truncate">{profile?.name}</h2>
            <p className="text-slate-500 text-sm mt-0.5 truncate">{profile?.email}</p>
            <div className="flex items-center flex-wrap gap-2 mt-2">
              <span className="badge-blue">{profile?.role}</span>
              {profile?.collegeName && <span className="badge-slate">{profile.collegeName}</span>}
              {reviews && (
                <div className="flex items-center gap-1">
                  <StarRating value={Math.round(reviews.averageRating)} readonly size="sm" />
                  <span className="text-xs text-slate-500">({reviews.totalReviews})</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2">Member since {formatDate(profile?.createdAt)}</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-5">
          {['profile', 'reviews'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
              {t} {t === 'reviews' && reviews ? `(${reviews.totalReviews})` : ''}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          editing ? (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', key: 'name', placeholder: 'Your name' },
                  { label: 'Phone Number', key: 'phoneNumber', placeholder: '+91 9876543210' },
                  { label: 'College Name', key: 'collegeName', placeholder: 'University name' },
                  { label: 'Student ID', key: 'studentId', placeholder: 'e.g. 21BCE1234' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="label">{label}</label>
                    <input className="input" value={form[key]} placeholder={placeholder}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditing(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={saving}>
                  {saving ? <Spinner size="sm" /> : null}
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid sm:grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Phone Number', value: profile?.phoneNumber || 'Not set' },
                  { label: 'Student ID', value: profile?.studentId || 'Not set' },
                  { label: 'College', value: profile?.collegeName || 'Not set' },
                  { label: 'Role', value: profile?.role },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3.5">
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <p className="font-medium text-slate-800 text-sm">{value}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setEditing(true)} className="btn-secondary w-full">✏️ Edit Profile</button>
            </div>
          )
        )}

        {tab === 'reviews' && (
          <div>
            {!reviews || reviews.totalReviews === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-3xl mb-2">⭐</p>
                <p>No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl mb-4">
                  <div className="font-heading text-4xl font-bold text-amber-600">
                    {reviews.averageRating}
                  </div>
                  <div>
                    <StarRating value={Math.round(reviews.averageRating)} readonly size="md" />
                    <p className="text-xs text-slate-500 mt-1">Based on {reviews.totalReviews} review{reviews.totalReviews !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                {reviews.reviews.map((r) => (
                  <div key={r.id} className="border border-slate-100 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{r.reviewerName}</p>
                        <p className="text-xs text-slate-400">{formatRelative(r.createdAt)}</p>
                      </div>
                      <StarRating value={r.rating} readonly size="sm" />
                    </div>
                    {r.comment && <p className="text-slate-600 text-sm">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
