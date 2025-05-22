import { create } from "zustand"
import type { ClassInfo } from "./types"

interface ClassStore {
  joinedClasses: ClassInfo[]
  addClass: (newClass: ClassInfo) => void
  hasClass: (entryCode: string) => boolean
}

export const useClassStore = create<ClassStore>((set, get) => ({
  joinedClasses: [],

  addClass: (newClass) =>
    set((state) => ({
      joinedClasses: [...state.joinedClasses, newClass],
    })),

  hasClass: (entryCode) =>
    get().joinedClasses.some((cls) => cls.entryCode === entryCode),
}))
