import type { ComponentType } from "react";
import { BarChart3, BookOpen, MessageSquare, Users } from "lucide-react";

import { routes } from "@/shared/config/routes";

export type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export function getNavSections(role: "teacher" | "student"): NavSection[] {
  if (role === "teacher") {
    return [
      {
        label: "Обучение",
        items: [
          { to: routes.teacher.home, label: "Классы", icon: Users },
          { to: routes.teacher.problems, label: "База задач", icon: BookOpen },
          { to: routes.teacher.stats, label: "Статистика", icon: BarChart3 },
        ],
      },
      {
        label: "Коммуникации",
        items: [{ to: routes.chat, label: "Чат", icon: MessageSquare }],
      },
    ];
  }

  return [
    {
      label: "Обучение",
      items: [
        { to: routes.student.home, label: "Мои классы", icon: Users },
        { to: routes.student.stats, label: "Статистика", icon: BarChart3 },
      ],
    },
    {
      label: "Коммуникации",
      items: [{ to: routes.chat, label: "Чат", icon: MessageSquare }],
    },
  ];
}


