import { describe, beforeEach, it, expect } from "vitest"
import { useAuthStore } from "../store"
import { setAuthApi } from "@/features/auth/api/api"
import { authApiMock } from "@/features/auth/api/mock-api"
import { mockUsers } from "@/features/auth/lib/mock-auth"

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    activeRole: null,
    loading: false,
    error: null,
  })
  localStorage.clear()

  setAuthApi(authApiMock)
})

describe("auth store", () => {
  it("логин с валидными данными", async () => {
    const validUser = mockUsers[0]
    await useAuthStore.getState().login({ email: validUser.email, password: validUser.password, rememberMe: true })

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user?.email).toBe(validUser.email)
    expect(state.activeRole).toBe(validUser.role)
  })

  it("логин с неверным паролем", async () => {
    const result = useAuthStore.getState().login({ email: "example@school.edu", password: "wrong", rememberMe: true })

    await expect(result).rejects.toThrow("Неверный email или пароль")

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.error).toBe("Неверный email или пароль")
  })

  it("выход из аккаунта", async () => {
    const validUser = mockUsers[0]
    await useAuthStore.getState().login({ email: validUser.email, password: validUser.password, rememberMe: true })

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
    const validUser = mockUsers[0]
    localStorage.setItem("auth-user", JSON.stringify(validUser))

    await useAuthStore.getState().checkAuth()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user?.email).toBe(validUser.email)
  })
})
