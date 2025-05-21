import { useEffect, useMemo, useState } from "react"
import { Notification, NotificationType } from "@/entities/notification/model/types"
import { notificationsApi } from "../api/notifications-api"
import { TabType } from "./types"

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState<TabType>("all")

  useEffect(() => {
    notificationsApi.getAll().then(setNotifications)
  }, [])

  const markAsRead = async (id: number) => {
    await notificationsApi.markAsRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = async () => {
    await notificationsApi.markAllAsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === "all") return true
      if (activeTab === "unread") return !n.read
      return n.type === activeTab
    })
  }, [notifications, activeTab])

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  return {
    activeTab,
    setActiveTab,
    filteredNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  }
}
