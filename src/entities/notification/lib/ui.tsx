import { Bell, Book, Calendar, CheckCircle, UserPlus, UserMinus } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { NotificationType } from "../model/types";

export function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "homework_new":
      return <Book className="h-5 w-5 text-blue-500" />;
    case "homework_graded":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "class_enrollment":
      return <UserPlus className="h-5 w-5 text-purple-500" />;
    case "class_expulsion":
      return <UserMinus className="h-5 w-5 text-red-500" />;
    case "deadline":
      return <Calendar className="h-5 w-5 text-orange-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
}

export function getNotificationBadge(type: NotificationType) {
  switch (type) {
    case "homework_new":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Новое задание
        </Badge>
      );
    case "homework_graded":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Оценка
        </Badge>
      );
    case "class_enrollment":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          Зачисление
        </Badge>
      );
    case "class_expulsion":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Отчисление
        </Badge>
      );
    case "deadline":
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          Дедлайн
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Уведомление
        </Badge>
      );
  }
}
