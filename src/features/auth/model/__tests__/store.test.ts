import { useAuthStore } from "../store"
import { setAuthApi } from "@/features/auth/api/api"
import { authApiMock } from "@/features/auth/api/mock-api"
import { mockUsers } from "@/features/auth/lib/mock-users"

beforeAll(() => {
  setAuthApi(authApiMock)
})

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    activeRole: null,
    loading: false,
    error: null,
  })
  localStorage.clear()
})

describe("auth store", () => {
  it("should login successfully", async () => {
    const { login } = useAuthStore.getState()
    const validUser = mockUsers[0]

    await login({ email: validUser.email, password: validUser.password })

    const { user, isAuthenticated, activeRole } = useAuthStore.getState()
    expect(user?.email).toBe(validUser.email)
    expect(isAuthenticated).toBe(true)
    expect(activeRole).toBe(validUser.role)
  })

  it("should fail login with wrong password", async () => {
    const { login } = useAuthStore.getState()

    await expect(
      login({ email: "example@school.edu", password: "wrongpass" })
    ).rejects.toThrow("Неверный email или пароль")

    const { isAuthenticated, user, error } = useAuthStore.getState()
    expect(isAuthenticated).toBe(false)
    expect(user).toBeNull()
    expect(error).toBe("Неверный email или пароль")
  })

  it("should logout properly", async () => {
    const { login, logout } = useAuthStore.getState()
    const validUser = mockUsers[0]

    await login({ email: validUser.email, password: validUser.password })
    logout()

    const { user, isAuthenticated, activeRole } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
    expect(activeRole).toBeNull()
  })

  it("should set role manually", () => {
    const { setRole } = useAuthStore.getState()
    setRole("teacher")

    expect(useAuthStore.getState().activeRole).toBe("teacher")
  })

  it("should checkAuth and restore user", async () => {
    const validUser = mockUsers[0]
    localStorage.setItem("auth-user", JSON.stringify(validUser))

    const { checkAuth } = useAuthStore.getState()
    await checkAuth()

    const { isAuthenticated, user } = useAuthStore.getState()
    expect(isAuthenticated).toBe(true)
    expect(user?.email).toBe(validUser.email)
  })
})
