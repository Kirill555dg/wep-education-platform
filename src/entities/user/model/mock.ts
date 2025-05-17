import { User } from "../model/types"

export const mockUsers: User[] = [
  {
    id: "u1",
    firstName: "Иван",
    lastName: "Иванов",
    middleName: "Сергеевич",
    email: "example@school.edu",
    role: "teacher",
    avatar: "https://i.pravatar.cc/150?img=8",
    phone: "+7 (999) 123-45-67",
    address: "г. Москва, ул. Примерная, д. 42",
    birthDate: "1982-03-15",
    about: "Преподаватель математики. Работаю в школе №123 более 10 лет.",
    contacts: {
      telegram: "https://t.me/ivan_math",
      vk: "https://vk.com/ivan.math",
    },
  },
  {
    id: "u2",
    firstName: "Мария",
    lastName: "Смирнова",
    middleName: "",
    email: "student@school.edu",
    role: "student",
    avatar: "https://i.pravatar.cc/150?img=12",
    phone: "+7 (912) 555-12-12",
    address: "г. Екатеринбург, ул. Школьная, д. 7",
    birthDate: "2009-11-01",
    about: "Ученик 10А класса. Увлекаюсь физикой и веб-дизайном.",
    contacts: {
      telegram: "https://t.me/maria_design",
      vk: "https://vk.com/maria.school",
    },
  },
]
