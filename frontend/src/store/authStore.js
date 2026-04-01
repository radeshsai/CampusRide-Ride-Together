import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (data) => set({
        user: { id: data.id, name: data.name, email: data.email, role: data.role, profilePicture: data.profilePicture },
        token: data.token,
        isAuthenticated: true,
      }),

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
    }),
    {
      name: 'campusride-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)

export default useAuthStore
