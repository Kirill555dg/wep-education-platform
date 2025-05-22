import type { User } from "@/entities/user/model/types"

export interface Student extends Pick<User,
  "id" | "firstName" | "lastName" | "email" | "avatar" | "gender"
> {
  averageGrade: number
  lastActive: string
}


export interface ClassInfo {
  id: number
  name: string
  subject: string
  description: string
  schedule: string
  classroom: string
  entryCode: string
  teacher: string
  activeAssignments: number
  image: string
  students: Student[]
}
