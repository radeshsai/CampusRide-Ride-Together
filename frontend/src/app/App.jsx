import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ProtectedRoute from '../routes/ProtectedRoute'

import HomePage        from '../features/home/HomePage'
import LoginPage       from '../features/auth/LoginPage'
import SignupPage      from '../features/auth/SignupPage'
import DashboardPage   from '../features/dashboard/DashboardPage'
import RidesPage       from '../features/rides/RidesPage'
import RideDetailPage  from '../features/rides/RideDetailPage'
import CreateRidePage  from '../features/rides/CreateRidePage'
import BookingsPage    from '../features/bookings/BookingsPage'
import BusTrackingPage from '../features/busTracking/BusTrackingPage'
import ProfilePage     from '../features/profile/ProfilePage'
import NotFoundPage    from '../features/notfound/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/login"        element={<LoginPage />} />
          <Route path="/signup"       element={<SignupPage />} />
          <Route path="/rides"        element={<RidesPage />} />
          <Route path="/rides/:id"    element={<RideDetailPage />} />
          <Route path="/bus-tracking" element={<BusTrackingPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard"    element={<DashboardPage />} />
            <Route path="/rides/create" element={<CreateRidePage />} />
            <Route path="/bookings"     element={<BookingsPage />} />
            <Route path="/profile"      element={<ProfilePage />} />
          </Route>

          <Route path="404" element={<NotFoundPage />} />
          <Route path="*"   element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
