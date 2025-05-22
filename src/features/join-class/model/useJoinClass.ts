import { useState } from "react"
import { getClassByCode } from "../api/class-api-mock"
import { useClassStore } from "@/entities/class/model/store"

export function useJoinClass() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const addClass = useClassStore((s) => s.addClass)
  const hasClass = useClassStore((s) => s.hasClass)

  const joinClass = async (code: string) => {
    setLoading(true)
    setError(null)

    try {
      const found = await getClassByCode(code)
      if (!found) throw new Error("Класс с таким кодом не найден")
      if (hasClass(found.entryCode)) throw new Error("Вы уже присоединились к этому классу")

      addClass(found)
    } catch (err: any) {
      setError(err.message || "Не удалось присоединиться к классу")
    } finally {
      setLoading(false)
    }
  }

  return { joinClass, loading, error }
}
