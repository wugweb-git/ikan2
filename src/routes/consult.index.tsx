import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeCheck,
  CalendarClock,
  ChevronRight,
  Clock3,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { Avatar } from "@/components/art";
import { accentStyle, stateLayer } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { getAssessment } from "@/lib/assessment/instruments";
import { useAssessmentStore } from "@/lib/assessment/store";
import {
  consultants,
  fits,
  fromPrice,
  getConsultant,
  hourLabel,
  initials,
  matchesFor,
  nextLabel,
  rupees,
  useBookings,
  type Consultant,
} from "@/lib/consultants";

export const Route = createFileRoute("/consult/")({
  head: () =>
    pageMeta(
      "Find your consultant",
      "Connect with experienced mental health professionals who understand your needs.",
    ),
  component: ConsultPage,
});

const roles = ["All", "Therapist", "Psychiatrist", "Counselor", "Family Therapist"] as const;
const when = ["Any time", "Today", "Tomorrow", "This week"] as const;

function ConsultPage() {
  const hydrated = useHydrated();
  const { results } = useAssessmentStore();
  const { bookings } = useBookings();
  const [role, setRole] = useState<(typeof roles)[number]>("All");
  const [time, setTime] = useState<(typeof when)[number]>("Any time");

  const latest = hydrated
    ? [...results].sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0]
    : undefined;
  const latestAssessment = latest ? getAssessment(latest.slug) : undefined;
  const areas = latestAssessment ? (matchesFor[latestAssessment.category] ?? []) : [];
  const upcoming = hydrated
    ? bookings.find((b) => b.status === "requested" && new Date(b.startsAt) > new Date())
    : undefined;
  const upcomingWith = upcoming ? getConsultant(upcoming.consultantId) : undefined;

  const list = consultants
    .filter((c) => role === "All" || c.role === role)
    .filter((c) =>
      time === "Any time"
        ? true
        : time === "Today"
          ? c.next.inDays === 0
          : time === "Tomorrow"
            ? c.next.inDays <= 1
            : c.next.inDays <= 6,
    )
    .sort((a, b) => Number(fits(b, areas)) - Number(fits(a, areas)));

  return (
    <IkanShell>
      <div style={accentStyle("night")}>
        <header className="px-4 pb-1 pt-8">
          <h1 className="font-display text-[32px] font-semibold leading-10">
            Find your consultant
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Connect with experienced mental health professionals who understand your needs.
          </p>
        </header>

        {upcoming && upcomingWith ? (
          <Link
            to="/consult/$id"
            params={{ id: upcomingWith.id }}
            className={cn(
              "mx-4 mt-5 flex items-center gap-3 rounded-[24px] bg-foreground p-4 text-background",
              stateLayer,
            )}
          >
            <Avatar text={initials(upcomingWith.name)} hue={upcomingWith.hue} size={48} />
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] opacity-75">Upcoming session</span>
              <span className="block truncate font-display text-[16px] font-semibold">
                {upcomingWith.name}
              </span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[13px] opacity-85">
                <CalendarClock className="h-4 w-4" />
                {new Date(upcoming.startsAt).toLocaleString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })}
                , {upcoming.mode}
              </span>
            </span>
            <ChevronRight className="h-5 w-5 opacity-70" />
          </Link>
        ) : null}

        {latestAssessment ? (
          <div className="mx-4 mt-4 flex gap-3 rounded-[20px] bg-[var(--accent-container)] p-4 text-[var(--on-accent-container)]">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-[14px] leading-5">
              Based on your latest {latestAssessment.name.toLowerCase()} assessment, consultants who
              work with {areas.join(" or ").toLowerCase()} are shown first.
            </p>
          </div>
        ) : (
          <Link
            to="/assessment"
            className={cn(
              "mx-4 mt-4 flex items-center gap-3 rounded-[20px] bg-secondary p-4",
              stateLayer,
            )}
          >
            <Sparkles className="h-5 w-5 shrink-0 text-[var(--accent-strong)]" />
            <span className="flex-1 text-[14px] leading-5">
              Take an assessment and we’ll show the consultants who fit first.
            </span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        )}

        <div className="mt-5 space-y-2">
          <Chips label="Role" options={roles} value={role} onChange={setRole} />
          <Chips label="Availability" options={when} value={time} onChange={setTime} />
        </div>

        <p className="mt-4 px-4 text-[13px] text-muted-foreground">
          {list.length} {list.length === 1 ? "consultant" : "consultants"} found
        </p>

        <ul className="mt-2 space-y-3 px-4">
          {list.map((c) => (
            <li key={c.id}>
              <ConsultantCard c={c} recommended={fits(c, areas)} />
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-6 max-w-xs px-4 text-center text-[12px] leading-5 text-muted-foreground">
          In a crisis, don’t wait for a booking.{" "}
          <Link
            to="/support"
            className="font-semibold text-foreground underline underline-offset-4"
          >
            Get support now
          </Link>
        </p>
      </div>
    </IkanShell>
  );
}

function Chips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      className="no-scrollbar flex gap-2 overflow-x-auto px-4"
      role="radiogroup"
      aria-label={label}
    >
      {options.map((o) => {
        const on = o === value;
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o)}
            className={cn(
              "inline-flex h-9 shrink-0 items-center rounded-[8px] border px-3.5 text-[14px] font-medium transition-colors",
              stateLayer,
              on
                ? "border-transparent bg-[var(--accent-container)] text-[var(--on-accent-container)]"
                : "border-foreground/20",
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function ConsultantCard({ c, recommended }: { c: Consultant; recommended: boolean }) {
  return (
    <Link
      to="/consult/$id"
      params={{ id: c.id }}
      className={cn(
        "block rounded-[24px] border border-foreground/10 bg-background p-4",
        stateLayer,
      )}
    >
      <div className="flex gap-3">
        <Avatar text={initials(c.name)} hue={c.hue} size={64} />
        <div className="min-w-0 flex-1">
          {recommended ? (
            <span className="mb-1 inline-flex h-6 items-center gap-1 rounded-full bg-[var(--accent-container)] px-2 text-[12px] font-semibold text-[var(--on-accent-container)]">
              <BadgeCheck className="h-3.5 w-3.5" /> Recommended
            </span>
          ) : null}
          <p className="font-display text-[17px] font-semibold leading-6">{c.name}</p>
          <p className="text-[13px] text-muted-foreground">{c.credentials}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
            <span className="inline-flex items-center gap-1 font-semibold">
              <Star className="h-3.5 w-3.5 fill-[#E3A008] text-[#E3A008]" /> {c.rating}
              <span className="font-normal text-muted-foreground">({c.reviews})</span>
            </span>
            <span className="text-muted-foreground">{c.role}</span>
            <span className="text-muted-foreground">{c.years}+ yrs</span>
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[13px] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {c.city}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {c.specializes.map((s) => (
          <span key={s} className="rounded-[8px] bg-secondary px-2.5 py-1 text-[12px]">
            {s}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3 border-t border-foreground/10 pt-3">
        <span className="min-w-0 flex-1">
          <span className="block text-[12px] text-muted-foreground">From</span>
          <span className="block font-display text-[17px] font-semibold">
            {rupees(fromPrice(c))}
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--accent-strong)]">
          <Clock3 className="h-4 w-4" /> {nextLabel(c)}
        </span>
        <span className="inline-flex h-10 items-center rounded-full bg-foreground px-4 text-[14px] font-semibold text-background">
          Book
        </span>
      </div>
    </Link>
  );
}
