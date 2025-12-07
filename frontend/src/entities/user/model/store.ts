import { create } from "zustand"
import type { User, UserRole } from "./types"

interface UserState {
  user: User | null
  currentRole: UserRole | null
  setUser: (user: User | null) => void
  setCurrentRole: (role: UserRole) => void
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  currentRole: null,
  
  setUser: (user) => {
    set({ user })
    // Если роль ещё не установлена или это новый пользователь, используем роль из user
    if (user && !get().currentRole) {
      const savedRole = localStorage.getItem("currentRole") as UserRole | null
      set({ currentRole: savedRole || user.role })
    }
  },
  
  setCurrentRole: (role) => {
    set({ currentRole: role })
    localStorage.setItem("currentRole", role)
  },
}))
