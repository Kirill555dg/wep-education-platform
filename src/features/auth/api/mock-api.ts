import { nanoid } from "nanoid"
import { mockUsers } from "@/entities/user/model/mock"
import { mockCredentials, addMockCredential } from "@/features/auth/lib/mock-auth"
import type { AuthApi } from "./api"
import type { User } from "@/entities/user/model/types"

export const authApiMock: AuthApi = {
  async login({ email, password }) {
    await new Promise((r) => setTimeout(r, 800))

    const expected = mockCredentials[email]
    if (!expected || expected !== password) {
      throw new Error("Неверный email или пароль")
    }

    const user = mockUsers.find((u) => u.email === email)
    if (!user) {
      throw new Error("Пользователь не найден")
    }

    return user
  },

  async register(data) {
    await new Promise((r) => setTimeout(r, 1000))

    const newUser: User = {
      id: nanoid(),
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      email: data.email,
      role: data.role,
      avatar: "https://i.pravatar.cc/150?u=" + data.email,
    }

    mockUsers.push(newUser)
    addMockCredential(data.email, data.password)

    return newUser
  },

  async resetPassword(email) {
    await new Promise((r) => setTimeout(r, 800))
    console.log(`🟡 Reset password email sent to: ${email}`)
  },

  async checkAuth() {
    await new Promise((r) => setTimeout(r, 300))
    const userJson = localStorage.getItem("auth-user") || sessionStorage.getItem("auth-user")
    if (!userJson) return null
    return JSON.parse(userJson) as User
  }
}
