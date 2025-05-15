import { mockUsers } from "@/features/auth/lib/mock-users"
import type { AuthApi } from "./api"
import type { AuthUser } from "@/features/auth/model/types"
import { nanoid } from "nanoid"

export const authApiMock: AuthApi = {
  async login({ email, password }) {
    await new Promise((r) => setTimeout(r, 800))
    const user = mockUsers.find((u) => u.email === email && u.password === password)
    if (!user) throw new Error("Неверный email или пароль")
    const { password: _, ...safeUser } = user
    return safeUser
  },

  async register(data) {
    await new Promise((r) => setTimeout(r, 1000))
    const { password, ...safe } = data
    const newUser: AuthUser = {
      id: nanoid(),
      ...safe,
      password,
    }
    mockUsers.push(newUser)
    const { password: _, ...safeUser } = newUser
    return safeUser
  },

  async resetPassword(email) {
    await new Promise((r) => setTimeout(r, 800))
    console.log(`🟡 Reset password email sent to: ${email}`)
  },

  async checkAuth() {
    await new Promise((r) => setTimeout(r, 300))
    const userJson = localStorage.getItem("auth-user")
    if (!userJson) return null
    const user = JSON.parse(userJson)
    return user
  }
}