import { User } from "@/entities/user/model/types"

export interface AuthUser extends User {
  password: string
}