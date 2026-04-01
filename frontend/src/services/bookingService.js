import api from './api'

export const createBooking = (data) => api.post('/bookings', data)
export const getMyBookings = () => api.get('/bookings/my')
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`)
