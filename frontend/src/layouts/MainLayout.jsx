import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { Toaster } from 'react-hot-toast'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" toastOptions={{
        className: 'font-body text-sm',
        style: { borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', padding: '12px 16px' },
        success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
        error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
      }} />
    </div>
  )
}
