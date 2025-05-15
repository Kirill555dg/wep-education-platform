import { AuthUser } from "../model/types"

export const mockUsers: AuthUser[] = [
  {
    id: "u1",
    firstName: "Иван",
    lastName: "Иванов",
    middleName: "Сергеевич",
    email: "example@school.edu",
    role: "teacher",
    password: "123456",
  },
  {
    id: "u2",
    firstName: "Мария",
    lastName: "Смирнова",
    email: "student@school.edu",
    role: "student",
    password: "654321",
  },
]
