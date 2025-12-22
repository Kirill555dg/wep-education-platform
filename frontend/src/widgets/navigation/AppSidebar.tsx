import { NavLink } from "react-router-dom";
import type { ComponentType } from "react";

import { useSessionStore } from "@/entities/session/model/store";
import { cn } from "@/shared/lib/utils";
import { getNavSections } from "@/widgets/navigation/nav";

function SidebarLink({ item }: { item: { to: string; label: string; icon: ComponentType<{ className?: string }> } }) {
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

  if (!user) return null;
  const sections = getNavSections(user.role);

  return (
    <aside className="hidden border-r bg-background lg:block w-64 flex-shrink-0">
      <div className="p-4">
        {sections.map((section) => (
          <div key={section.label} className="mb-6 last:mb-0">
            <div className="text-xs uppercase text-muted-foreground mb-2">{section.label}</div>
            <div className="grid gap-1">
              {section.items.map((item) => (
                <SidebarLink key={item.to} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}


