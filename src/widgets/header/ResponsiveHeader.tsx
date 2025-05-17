import { useNavigate } from "react-router-dom";
import { Bell, GraduationCap, LogOut, Settings, User as UserIcon, ChevronLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useUserStore } from "@/entities/user/model/store";
import { useAuthStore } from "@/features/auth/model/store";
import { getFullNameAdaptive } from "@/entities/user/lib/format";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";

interface Props {
  title?: string;
  overrideBack?: {
    label: string;
    to: string;
  };
}

export function ResponsiveHeader({ title, overrideBack }: Props) {
  const user = useUserStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const isWide = useMediaQuery("(min-width: 900px)");
  const isMobileWide = useMediaQuery("(min-width: 480px)");

  if (!user) return null;

  const displayName = getFullNameAdaptive(user, user.role === "teacher" && isWide);
  const initials = [user.firstName, user.lastName]
    .map((n) => n?.[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b sticky top-0 z-10 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {/* Левая зона */}
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {overrideBack && (
                <button
                  onClick={() => navigate(overrideBack.to)}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="h-5 w-5" />
                  {isMobileWide && <span className="ml-1 text-sm font-medium">{overrideBack.label}</span>}
                </button>
              )}
              {title && <h1 className="text-sm sm:text-base font-semibold text-gray-900 break-words">{title}</h1>}
            </div>
          </div>

          {/* Центр — Логотип */}
          <div className="flex justify-center pointer-events-none">
            <button onClick={() => navigate("/")} className="flex items-center pointer-events-auto">
              <div className="bg-blue-900 rounded-full p-2">
                <GraduationCap className="text-white h-5 w-5" />
              </div>
              <span className="hidden sm:inline text-xl font-bold text-blue-900 ml-2">WEP</span>
            </button>
          </div>

          {/* Правая зона */}
          <div className="flex justify-end items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                    0
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-4">
                  <h3 className="font-medium mb-2">Уведомления</h3>
                  <p className="text-sm text-muted-foreground">В разработке</p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 max-w-[260px] text-right overflow-hidden">
                  {isMobileWide && (
                    <div className="flex flex-col overflow-hidden">
                      {user.role === "teacher" && (
                        <span className="text-xs text-blue-600 font-medium truncate">Преподаватель</span>
                      )}
                      <span className="text-sm text-gray-700 font-medium truncate">{displayName}</span>
                    </div>
                  )}
                  <UserAvatar size="h-8 w-8" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserIcon className="h-4 w-4 mr-2" /> Профиль
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="h-4 w-4 mr-2" /> Настройки
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" /> Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
