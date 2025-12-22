import { Outlet } from "react-router-dom";

import { SessionBootstrapper } from "@/app/providers/SessionBootstrapper";
import { AppHeader } from "@/widgets/header/AppHeader";
import { Toaster } from "@/shared/ui/toaster";

export function AppLayout() {
  return (
    <>
      <Toaster />
      <SessionBootstrapper />
      <AppHeader />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </>
  );
}

