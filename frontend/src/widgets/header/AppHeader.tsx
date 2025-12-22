import { Link } from "react-router-dom";

import { useSessionStore } from "@/entities/session/model/store";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { BookOpen, MessageSquare, Users } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/shared/lib/utils";

export function AppHeader() {
  const user = useSessionStore((s) => s.user);
  const logout = useSessionStore((s) => s.logout);

  const quickNav = useMemo(() => {
    if (user?.role === "teacher") {
      return [
        { to: routes.teacher.home, label: "Классы", icon: Users },
        { to: routes.app, label: "Чат", icon: MessageSquare },
      ];
    }
    if (user?.role === "student") {
      return [
        { to: routes.student.home, label: "Мои классы", icon: BookOpen },
        { to: routes.app, label: "Чат", icon: MessageSquare },
      ];
    }
    return [];
  }, [user?.role]);

  return (
    <header className="w-full border-b bg-background">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Link to={routes.app} className="font-semibold tracking-tight">
            WEP
          </Link>
          {quickNav.length > 0 ? (
            <nav className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              {quickNav.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:text-foreground hover:bg-muted transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <Badge variant="secondary" data-testid="role-badge">
              {user.role}
            </Badge>
            <span className="text-sm text-muted-foreground" data-testid="user-email">
              {user.email}
            </span>
            <Button variant="outline" onClick={logout} data-testid="logout">
              Выйти
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className={cn("text-sm")}>
              <Link to={routes.login}>Вход</Link>
            </Button>
            <Button asChild>
              <Link to={routes.register}>Регистрация</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}


