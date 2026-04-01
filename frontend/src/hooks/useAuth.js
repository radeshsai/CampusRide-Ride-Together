import useAuthStore from '../store/authStore'
export const useAuth = () => useAuthStore((s) => ({
  user: s.user,
  token: s.token,
  isAuthenticated: s.isAuthenticated,
  login: s.login,
  logout: s.logout,
  updateUser: s.updateUser,
}))
