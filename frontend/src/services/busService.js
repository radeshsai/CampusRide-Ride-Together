import api from './api'

export const getBuses = () => api.get('/buses')
export const getBusLocation = (id) => api.get(`/buses/${id}/location`)
