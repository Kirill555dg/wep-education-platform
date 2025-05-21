import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/features/notifications/model/useNotifications";
import { NotificationsHeader } from "@/widgets/notifications/ui/NotificationsHeader";
import { NotificationsFilterTabs } from "@/features/notifications/ui/NotificationsFilterTabs";
import { NotificationsList } from "@/widgets/notifications/ui/NotificationsList";
import { MainLayout } from "@/widgets/layout/MainLayout";
import { TabType } from "@/features/notifications/model/types";
import { NotificationsFilterDropdown } from "@/features/notifications/ui/NotificationsFilterDropdown";

export default function NotificationsPage() {
  const { filteredNotifications, unreadCount, activeTab, setActiveTab, markAsRead, markAllAsRead } = useNotifications();

  const navigate = useNavigate();

  return (
    <MainLayout title="Уведомления">
      <div className="w-full sm:max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Заголовок и кнопка "Прочитать всё" */}
        <NotificationsHeader unreadCount={unreadCount} onMarkAllRead={markAllAsRead} />

        {/* Табы фильтра */}
        <div className="hidden sm:block mb-6">
          <NotificationsFilterTabs value={activeTab} onChange={(val) => setActiveTab(val as TabType)} />
        </div>

        {/* Mobile filter */}
        <div className="sm:hidden mb-4">
          <NotificationsFilterDropdown value={activeTab} onChange={setActiveTab} />
        </div>

        {/* Список уведомлений */}
        <NotificationsList notifications={filteredNotifications} onMarkRead={markAsRead} onNavigate={navigate} />
      </div>
    </MainLayout>
  );
}
