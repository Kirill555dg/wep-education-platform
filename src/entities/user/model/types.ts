export interface User {
  id: string
  firstName: string
  lastName: string
  middleName?: string
  email: string
  role: UserRole
}

export type UserRole = "student" | "teacher"