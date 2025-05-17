import { describe, beforeEach, it, expect } from "vitest"
import { useAuthStore } from "../store"
import { setAuthApi } from "@/features/auth/api/api"
import { authApiMock } from "@/features/auth/api/mock-api"
import { mockUsers } from "@/entities/user/model/mock"
import { mockCredentials } from "@/features/auth/lib/mock-auth"

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    activeRole: null,
    loading: false,
    error: null,
    bootstrapped: false,
  })
  localStorage.clear()
  sessionStorage.clear()

  setAuthApi(authApiMock)
})

describe("auth store", () => {
  it("логин с валидными данными", async () => {
    const user = mockUsers[0]
    const password = mockCredentials[user.email]

    await useAuthStore.getState().login({ email: user.email, password, rememberMe: true })

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user?.email).toBe(user.email)
    expect(state.activeRole).toBe(user.role)
  })

  it("логин с неверным паролем", async () => {
    const result = useAuthStore.getState().login({
      email: "example@school.edu",
      password: "wrong",
      rememberMe: true,
    })

    await expect(result).rejects.toThrow("Неверный email или пароль")

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.error).toBe("Неверный email или пароль")
  })

  it("выход из аккаунта", async () => {
    const user = mockUsers[0]
    const password = mockCredentials[user.email]

    await useAuthStore.getState().login({ email: user.email, password, rememberMe: true })

    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.activeRole).toBeNull()
  })

  it("переключение роли", () => {
    useAuthStore.getState().setRole("teacher")
    expect(useAuthStore.getState().activeRole).toBe("teacher")
  })

  it("восстановление пользователя через checkAuth", async () => {
    const user = mockUsers[0]
    localStorage.setItem("auth-user", JSON.stringify(user))

    await useAuthStore.getState().checkAuth()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user?.email).toBe(user.email)
  })
})
