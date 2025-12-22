import { Outlet } from "react-router-dom";

import { SessionBootstrapper } from "@/app/providers/SessionBootstrapper";
import { AppHeader } from "@/widgets/header/AppHeader";
import { AppSidebar } from "@/widgets/navigation/AppSidebar";
import { useSessionStore } from "@/entities/session/model/store";
import { Toaster } from "@/shared/ui/toaster";

export function AppLayout() {
  const user = useSessionStore((s) => s.user);

  // Authenticated layout: sidebar + main area
  if (user) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/10">
        <Toaster />
        <SessionBootstrapper />
        <AppHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1">
            <div className="mx-auto max-w-5xl px-4 py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Guest layout: simple header + centered content
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />
      <SessionBootstrapper />
      <AppHeader />
      <main className="container mx-auto px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
}

