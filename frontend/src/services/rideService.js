import api from './api'

export const getRides = (params) => api.get('/rides', { params })
export const getRide = (id) => api.get(`/rides/${id}`)
export const createRide = (data) => api.post('/rides', data)
export const deleteRide = (id) => api.delete(`/rides/${id}`)
export const getDriverContact = (id) => api.get(`/rides/${id}/driver-contact`)

export const getMyRides = () => api.get('/rides', { params: { my: true } })
