import { useEffect, useState } from "react"
import { Notification } from "@/entities/notification/model/types"
import { notificationsApi } from "../api/notifications-api"

export function useNotificationPreview() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    notificationsApi.getAll().then(setNotifications)
  }, [])

  const unread = notifications.filter((n) => !n.read)
  const unreadCount = unread.length
  const unreadPreview = unread.slice(0, 5)

  return { unreadCount, unreadPreview }
}
