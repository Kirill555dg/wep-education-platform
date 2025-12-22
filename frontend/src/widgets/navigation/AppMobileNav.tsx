import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

import { useSessionStore } from "@/entities/session/model/store";
import { getNavSections } from "@/widgets/navigation/nav";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";

export function AppMobileNav() {
  const user = useSessionStore((s) => s.user);
  if (!user) return null;

  const sections = getNavSections(user.role);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Навигация</DialogTitle>
        </DialogHeader>
        <div className="p-2">
          {sections.map((section) => (
            <div key={section.label} className="p-2">
              <div className="text-xs uppercase text-muted-foreground mb-2">{section.label}</div>
              <div className="grid gap-1">
                {section.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}


