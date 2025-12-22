import { Link } from "react-router-dom";

import { useSessionStore } from "@/entities/session/model/store";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

export function AppHeader() {
  const user = useSessionStore((s) => s.user);
  const logout = useSessionStore((s) => s.logout);

  return (
    <header className="w-full border-b bg-background">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to={routes.app} className="font-semibold">
          WEP
        </Link>

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
            <Button asChild variant="ghost">
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


