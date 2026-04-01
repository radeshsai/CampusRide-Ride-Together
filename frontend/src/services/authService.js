import api from './api'

export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const googleLogin = (token) => api.post('/auth/google', { token })
