import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, ChartNoAxesColumn, House, Sparkles, UserRound } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Home", icon: House },
  { to: "/assessment", label: "Assess", icon: ChartNoAxesColumn },
  { to: "/", label: "Programs", icon: Sparkles },
  { to: "/", label: "Journal", icon: BookOpen },
  { to: "/", label: "You", icon: UserRound },
] as const;

export function IkanShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <main className="mx-auto min-h-screen w-full max-w-md bg-background pb-28 shadow-app">{children}</main>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center">
        <nav aria-label="Main navigation" className="pointer-events-auto mb-3 w-full max-w-md px-3">
          <div className="grid grid-cols-5 rounded-[24px] border border-border/80 bg-background/92 p-2 shadow-dock backdrop-blur-xl">
            {navItems.map((item, index) => {
              const active = index === 0 ? pathname === "/" : pathname.startsWith(item.to) && item.to !== "/";
              const Icon = item.icon;
              return (
                <Link
                  key={`${item.label}-${index}`}
                  to={item.to}
                  className={active ? "nav-item text-foreground" : "nav-item text-muted-foreground"}
                >
                  <span className={active ? "nav-icon bg-foreground text-background" : "nav-icon"}>
                    <Icon aria-hidden="true" />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}