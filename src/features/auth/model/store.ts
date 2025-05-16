import { create } from "zustand"
import { authApi } from "@/features/auth/api/api"
import type { User, UserRole } from "@/entities/user/model/types"
import type { LoginData, RegisterData } from "./schema"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  activeRole: UserRole | null
  loading: boolean
  error: string | null
  bootstrapped: boolean

  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  setError: (message: string | null) => void
  setRole: (role: UserRole) => void
  setUser: (user: User | null) => void
  setBootstrapped: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  activeRole: null,
  loading: false,
  error: null,
  bootstrapped: false,

  async login(data) {
    set({ loading: true, error: null })
    try {
      const user = await authApi.login(data)
      const storage = data.rememberMe ? localStorage : sessionStorage
      storage.setItem("auth-user", JSON.stringify(user))

      set({
        user,
        isAuthenticated: true,
        activeRole: user.role,
      })
    } catch (e: any) {
      set({ error: e.message || "Ошибка авторизации" })
      throw e
    } finally {
      set({ loading: false })
    }
  },

  async register(data) {
    set({ loading: true, error: null })
    try {
      const user = await authApi.register(data)
      set({
        user,
        isAuthenticated: true,
        activeRole: user.role,
      })
    } catch (e: any) {
      set({ error: e.message || "Ошибка регистрации" })
      throw e
    } finally {
      set({ loading: false })
    }
  },

  async checkAuth() {
    set({ loading: true })
    try {
      const user = await authApi.checkAuth()
      if (user) {
        set({
          user,
          isAuthenticated: true,
          activeRole: user.role,
        })
      }
    } finally {
      set({ loading: false })
    }
  },

  logout() {
    localStorage.removeItem("auth-user")
    sessionStorage.removeItem("auth-user")
    set({
      user: null,
      isAuthenticated: false,
      activeRole: null,
    })
  },

  setError(message) {
    set({ error: message })
  },

  setRole(role) {
    set({ activeRole: role })
  },

  setUser(user) {
    set({
      user,
      isAuthenticated: !!user,
      activeRole: user?.role ?? null,
    })
  },

  setBootstrapped() {
    set({ bootstrapped: true })
  },
}))
