import { BookOpen, Home, LineChart, MessageSquare, PlusCircle, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useSessionStore } from "@/entities/session/model/store";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

function SidebarLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
          isActive ? "bg-muted text-foreground" : "text-muted-foreground"
        )
      }
    >
      <item.icon className="h-4 w-4" />
      <span>{item.label}</span>
    </NavLink>
  );
}

export function AppSidebar() {
  const user = useSessionStore((s) => s.user);

  const teacherNav: NavItem[] = [
    { to: routes.teacher.home, label: "Классы", icon: Users },
    { to: routes.teacher.home, label: "Создать", icon: PlusCircle },
  ];

  const studentNav: NavItem[] = [
    { to: routes.student.home, label: "Мои классы", icon: Home },
    { to: routes.student.home, label: "Прогресс", icon: LineChart },
  ];

  const common: NavItem[] = [{ to: routes.app, label: "Чат", icon: MessageSquare }];

  const navItems =
    user?.role === "teacher"
      ? [...teacherNav, ...common]
      : user?.role === "student"
        ? [...studentNav, ...common]
        : [];

  if (!user) return null;

  return (
    <aside className="hidden border-r bg-background lg:block w-64 flex-shrink-0">
      <div className="p-4">
        <div className="text-xs uppercase text-muted-foreground mb-2">Навигация</div>
        <div className="grid gap-1">
          {navItems.map((item) => (
            <SidebarLink key={item.to} item={item} />
          ))}
        </div>
        <div className="mt-6 text-xs uppercase text-muted-foreground mb-2">Учебные материалы</div>
        <div className="grid gap-1">
          <SidebarLink item={{ to: routes.app, label: "Уроки", icon: BookOpen }} />
          <SidebarLink item={{ to: routes.app, label: "Домашки", icon: BookOpen }} />
        </div>
      </div>
    </aside>
  );
}


