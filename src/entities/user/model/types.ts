export interface User {
  id: string
  firstName: string
  lastName: string
  middleName?: string
  email: string
  role: UserRole
  gender?: Gender
  avatar?: string
  phone?: string
  address?: string
  birthDate?: string
  about?: string
  contacts?: {
    telegram?: string
    vk?: string
  }
}

export type UserRole = "student" | "teacher"

export type Gender = "male" | "female"