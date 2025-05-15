
import { toast as shadcnToast } from "@/shared/hooks/use-toast"

export const toast = {
  success: (title: string, description?: string) =>
    shadcnToast({ title, description, variant: "default" }),

  error: (title: string, description?: string) =>
    shadcnToast({ title, description, variant: "destructive" }),

  info: (title: string, description?: string) =>
    shadcnToast({ title, description, variant: "default" }),
}
