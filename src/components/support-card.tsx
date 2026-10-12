import { Link } from "@tanstack/react-router";
import { CalendarDays, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { consultants } from "@/lib/consultants";

export function SupportCard({
  city,
  className = "mx-4",
}: {
  city: string;
  className?: string | undefined;
}) {
  return (
    <section className={cn("rounded-[22px] border border-error/20 bg-error/5 p-4", className)}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-background text-on-error-container">
          <Heart className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="type-label-md font-semibold text-on-error-container">Support</p>
          <h2 className="type-title-md">Let’s talk about it</h2>
          <p className="type-body-sm mt-0.5 text-muted-foreground">
            {consultants.length} consultants{city ? ` for you in ${city}` : ""}, with video, call
            and chat sessions.
          </p>
        </div>
      </div>
      <Link
        to="/consult"
        className="type-body-md font-semibold mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-on-error-container text-error-container transition-transform active:scale-[.98]"
      >
        <CalendarDays className="h-4 w-4" /> Book a consultation
      </Link>
    </section>
  );
}
