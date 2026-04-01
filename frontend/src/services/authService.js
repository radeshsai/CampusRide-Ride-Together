import api from './api'

export const register = (data) => api.post('/api/auth/register', data)
export const login = (data) => api.post('/api/auth/login', data)
export const googleLogin = (token) => api.post('/api/auth/google', { token })
