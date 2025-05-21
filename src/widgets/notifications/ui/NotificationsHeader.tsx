import { Bell, CheckCheck } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

interface Props {
  unreadCount: number;
  onMarkAllRead: () => void;
}

export function NotificationsHeader({ unreadCount, onMarkAllRead }: Props) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold flex items-center">
        <Bell className="h-6 w-6 mr-2" />
        Уведомления
        {unreadCount > 0 && (
          <Badge className="ml-2" variant="secondary">
            {unreadCount}
          </Badge>
        )}
      </h1>

      <Button variant="outline" size="sm" onClick={onMarkAllRead} disabled={unreadCount === 0}>
        <CheckCheck className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Прочитать все</span>
      </Button>
    </div>
  );
}
