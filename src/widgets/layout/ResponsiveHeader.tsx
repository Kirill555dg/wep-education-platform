import { useNavigate } from "react-router-dom";
import { Bell, ChevronLeft, GraduationCap, LogOut, Settings, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useAuthStore } from "@/features/auth/model/store";
import { getFullName } from "@/entities/user/lib/format";

interface ResponsiveHeaderProps {
  title?: string;
  backUrl?: string;
  pageTitle?: string;
}

export function ResponsiveHeader({ title, backUrl, pageTitle }: ResponsiveHeaderProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  if (!user) return null;

  const initials = [user.firstName, user.lastName]
    .map((n) => n?.[0])
    .join("")
    .toUpperCase();

  const isTeacher = user.role === "teacher";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop */}
        <div className="hidden sm:flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="flex items-center">
              <div className="bg-blue-900 rounded-full p-2">
                <GraduationCap className="text-white h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold text-blue-900 ml-2">WEP</h1>
            </button>

            {backUrl && (
              <div className="flex items-center ml-6">
                <button
                  className="flex items-center text-gray-600 hover:text-gray-900"
                  onClick={() => navigate(backUrl)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span>Назад</span>
                </button>
                {title && <h2 className="text-lg font-bold text-gray-900 ml-4">{title}</h2>}
              </div>
            )}

            {pageTitle && !backUrl && <h1 className="text-xl font-bold text-gray-900 ml-6">{pageTitle}</h1>}
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500" variant="default">
                    3
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

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-3 cursor-pointer">
                  <div className="text-right">
                    {isTeacher && <div className="text-xs text-blue-600 font-medium">Преподаватель</div>}
                    <span className="text-gray-700 font-medium">{getFullName(user)}</span>
                  </div>
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
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

        {/* Mobile */}
        <div className="sm:hidden py-2 space-y-2">
          <div className="flex items-center justify-between h-12">
            <button onClick={() => navigate("/")} className="flex items-center">
              <div className="bg-blue-900 rounded-full p-2">
                <GraduationCap className="text-white h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold text-blue-900 ml-2">WEP</h1>
            </button>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {(backUrl || pageTitle) && (
            <div className="flex items-center justify-between border-t pt-2">
              {backUrl ? (
                <>
                  <button
                    onClick={() => navigate(backUrl)}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    <span>Назад</span>
                  </button>
                  {title && <h2 className="text-base font-bold text-gray-900">{title}</h2>}
                </>
              ) : (
                <h2 className="text-base font-bold text-gray-900">{pageTitle}</h2>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
