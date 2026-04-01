import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50">
      <div className="text-center px-4">
        <div className="font-heading text-9xl font-bold text-slate-200 select-none">404</div>
        <h1 className="font-heading text-2xl font-bold text-slate-800 mt-4 mb-2">Page not found</h1>
        <p className="text-slate-500 mb-8">Looks like this ride took a wrong turn.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  )
}
