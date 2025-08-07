import { create } from "zustand"
import { persist } from "zustand/middleware"
import { getTokenFromStorage, decodeToken, removeTokenFromStorage } from "@/lib/auth-utils"
import { authApi, ApiError } from "@/lib/api"
import { LoginRequest, RegisterRequest, User } from "@/types/types"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({      
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.login(credentials)
          const user = decodeToken(response.access_token)

          if (user) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error("Invalid token received")
          }
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : "Login failed. Please try again."

          set({
            error: errorMessage,
            isLoading: false,
            user: null,
            isAuthenticated: false,
          })
          throw error
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.register(userData)
          const user = decodeToken(response.access_token)

          if (user) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error("Invalid token received")
          }
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : "Registration failed. Please try again."

          set({
            error: errorMessage,
            isLoading: false,
            user: null,
            isAuthenticated: false,
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await authApi.logout()
        } catch (error) {
          console.error("Logout error:", error)
        } finally {
          removeTokenFromStorage()
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        }
      },

      clearError: () => {
        set({ error: null })
      },

      initializeAuth: () => {
        const token = getTokenFromStorage()
        if (token) {
          const user = decodeToken(token)
          if (user) {
            set({ user, isAuthenticated: true })
          } else {
            removeTokenFromStorage()
            set({ user: null, isAuthenticated: false })
          }
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
