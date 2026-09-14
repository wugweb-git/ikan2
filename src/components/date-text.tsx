import { CalendarDays } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A date with a small calendar icon in front, for anywhere a date is shown. */
export function DateText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 align-middle", className)}>
      <CalendarDays className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
      <span>{children}</span>
    </span>
  );
}
