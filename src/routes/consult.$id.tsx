import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  CalendarCheck,
  Check,
  ChevronDown,
  Languages,
  MapPin,
  MessageCircle,
  Monitor,
  Phone,
  Quote,
  GraduationCap,
  Sparkles,
  Star,
  ThumbsUp,
  Video,
  type LucideIcon,
} from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { Avatar } from "@/components/art";
import {
  accentStyle,
  BottomSheet,
  Button,
  IconButton,
  stateLayer,
  TopAppBar,
} from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { AddToCalendar } from "@/components/add-to-calendar";
import {
  getConsultant,
  hourLabel,
  initials,
  nextLabel,
  rupees,
  slotHours,
  useBookings,
  type Consultant,
  type SessionMode,
} from "@/lib/consultants";
import { addDays } from "@/lib/journal";
import { Disclosure } from "@/components/kit/disclosure";

export const Route = createFileRoute("/consult/$id")({
  loader: ({ params }) => {
    const c = getConsultant(params.id);
    if (!c) throw notFound();
    return { id: c.id };
  },
  head: ({ loaderData }) => {
    const c = loaderData ? getConsultant(loaderData.id) : undefined;
    return c
      ? pageMeta(c.name, `${c.role}, ${c.years} years experience, ${c.city}.`)
      : { meta: [{ title: "Consultant — iKAN" }] };
  },
  component: ConsultantPage,
});

const formatIcon: Record<string, LucideIcon> = {
  Online: Monitor,
  Offline: MapPin,
  Call: Phone,
  Chat: MessageCircle,
  Video: Video,
};

function ConsultantPage() {
  const { id } = Route.useLoaderData();
  const c = getConsultant(id)!;
  const navigate = useNavigate();

  return (
    <IkanShell>
      <div style={accentStyle("night")}>
        <TopAppBar
          className="bg-[var(--accent-container)]"
          leading={
            <IconButton label="Back" onClick={() => navigate({ to: "/consult" })}>
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          }
        />
        <header className="bg-[var(--accent-container)] px-4 pb-6 text-[var(--on-accent-container)]">
          <div className="flex items-center gap-4">
            <Avatar text={initials(c.name)} hue={c.hue} size={88} photo={c.photo} />
            <div className="min-w-0">
              <h1 className="font-display text-[24px] font-semibold leading-7">{c.name}</h1>
              <p className="type-body-md mt-1 opacity-80">{c.credentials}</p>
              <p className="type-body-md font-semibold mt-2 inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#E3A008] text-[#E3A008]" /> {c.rating}
                <span className="font-normal opacity-75">({c.reviews} reviews)</span>
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <Fact icon={Briefcase} value={`${c.years} yrs`} label="Experience" />
            <Fact icon={MapPin} value={c.city.replace(", India", "")} label="City" />
            <Fact icon={CalendarCheck} value={nextLabel(c).split(",")[0]!} label="Next open" />
          </div>
        </header>

        <section className="px-4 pt-5">
          <p className="type-body-sm font-semibold text-muted-foreground">{c.role}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {c.formats.map((f) => {
              const Icon = formatIcon[f] ?? Monitor;
              return (
                <span
                  key={f}
                  className="type-body-sm inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-foreground/15 px-3"
                >
                  <Icon className="h-4 w-4" /> {f}
                </span>
              );
            })}
          </div>
          <p className="type-body-md mt-3 flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground" /> {c.languages.join(", ")}
          </p>
        </section>

        <section className="mt-7">
          <h2 className="type-title-md px-4">Concerns I can help with</h2>
          <div className="no-scrollbar mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
            {c.concerns.map((q) => (
              <figure
                key={q}
                className="w-[220px] shrink-0 snap-start rounded-[20px] bg-secondary p-4"
              >
                <Quote className="h-5 w-5 text-[var(--accent)]" />
                <blockquote className="mt-2 text-[15px] leading-6">{q}</blockquote>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-7 px-4">
          <h2 className="type-title-md">I offer therapy for</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {c.therapyFor.map((t) => (
              <span
                key={t}
                className="type-body-sm rounded-[8px] bg-[var(--accent-container)] px-3 py-1.5 text-[var(--on-accent-container)]"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-7 px-4">
          <h2 className="type-title-md">About</h2>
          <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{c.about}</p>
        </section>

        {c.approaches.length ? (
          <section className="mt-7 px-4">
            <h2 className="type-title-md">Approaches</h2>
            <ul className="mt-3 space-y-2">
              {c.approaches.map((a) => (
                <li
                  key={a}
                  className="type-action flex items-center gap-3 rounded-[14px] bg-secondary px-4 py-3"
                >
                  <Sparkles className="h-4 w-4 shrink-0 text-[var(--accent-strong)]" /> {a}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {c.qualifications.length ? (
          <section className="mt-7 px-4">
            <h2 className="type-title-md">Qualifications</h2>
            <ul className="mt-3 space-y-2">
              {c.qualifications.map((q) => (
                <li key={q} className="flex items-start gap-3 text-[15px] leading-6">
                  <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" /> {q}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {c.review ? (
          <section className="mt-7 px-4">
            <h2 className="type-title-md">Reviews ({c.reviews})</h2>
            <figure className="mt-3 rounded-[20px] border border-foreground/10 p-4">
              <div className="type-body-sm flex items-center gap-2">
                <span className="flex" aria-label={`${c.review.rating} out of 5`}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className={
                        i < c.review!.rating
                          ? "h-3.5 w-3.5 fill-[#E3A008] text-[#E3A008]"
                          : "h-3.5 w-3.5 text-foreground/20"
                      }
                    />
                  ))}
                </span>
                <span className="font-semibold">{c.review.name}</span>
                {c.review.verified ? <span className="text-muted-foreground">Verified</span> : null}
              </div>
              <blockquote className="mt-2 text-[15px] leading-6">{c.review.text}</blockquote>
              <figcaption className="type-label-md mt-2 flex items-center gap-1.5 text-muted-foreground">
                <ThumbsUp className="h-3.5 w-3.5" /> Helpful ({c.review.helpful})
              </figcaption>
            </figure>
          </section>
        ) : null}

        {c.faq ? (
          <section className="mt-7 px-4">
            <h2 className="type-title-md">Frequently asked</h2>
            <Disclosure tone="filled" radius={20} title={c.faq.q} className="mt-3">
              <p className="text-[15px] leading-6 text-muted-foreground">{c.faq.a}</p>
            </Disclosure>
          </section>
        ) : null}

        <Booking c={c} />
      </div>
    </IkanShell>
  );
}

function Fact({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="rounded-[16px] bg-background/70 px-2 py-3">
      <Icon className="mx-auto h-5 w-5" />
      <p className="type-body-md font-semibold mt-1 truncate">{value}</p>
      <p className="text-[11px] opacity-70">{label}</p>
    </div>
  );
}

function Booking({ c }: { c: Consultant }) {
  const hydrated = useHydrated();
  const { bookings, book, cancel } = useBookings();
  const [mode, setMode] = useState<SessionMode>(c.sessions[0]!.mode);
  const [dayOffset, setDayOffset] = useState(c.next.inDays);
  const [hour, setHour] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [booked, setBooked] = useState<{ mode: string; startsAt: string } | null>(null);
  const [done, setDone] = useState(false);

  const price = c.sessions.find((s) => s.mode === mode)!.price;
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => c.next.inDays + i);
  const day = addDays(today, dayOffset);
  const openHours = slotHours.filter((h) => {
    if (dayOffset === c.next.inDays && h < c.next.hour) return false;
    if (dayOffset === 0 && h <= today.getHours()) return false;
    return true;
  });
  const mine = hydrated
    ? bookings.filter((b) => b.consultantId === c.id && b.status === "requested")
    : [];

  const startsAt = () => {
    const d = new Date(day);
    d.setHours(hour ?? 0, 0, 0, 0);
    return d;
  };

  return (
    <section id="book" className="mx-4 mt-8 rounded-[28px] border border-foreground/10 p-4">
      <h2 className="type-title-lg font-semibold">Book appointment</h2>

      {mine.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {mine.map((b) => (
            <li
              key={b.id}
              className="flex items-center gap-3 rounded-[16px] bg-[var(--accent-container)] p-3 text-[var(--on-accent-container)]"
            >
              <CalendarCheck className="h-5 w-5 shrink-0" />
              <span className="type-body-md min-w-0 flex-1">
                <span className="block font-semibold">Requested</span>
                {new Date(b.startsAt).toLocaleString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })}
                , {b.mode}
              </span>
              <button
                type="button"
                onClick={() => cancel(b.id)}
                className={cn("type-body-sm font-semibold h-9 rounded-full px-3", stateLayer)}
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="type-body-sm font-semibold mt-4 text-muted-foreground">Session type</p>
      <div
        className={cn("mt-2 grid gap-2", c.sessions.length === 4 ? "grid-cols-2" : "grid-cols-3")}
        role="radiogroup"
        aria-label="Session type"
      >
        {c.sessions.map((s) => {
          const on = s.mode === mode;
          const Icon = formatIcon[s.mode] ?? Monitor;
          return (
            <button
              key={s.mode}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setMode(s.mode)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-[16px] border py-3 transition-colors",
                stateLayer,
                on ? "border-transparent bg-foreground text-background" : "border-foreground/15",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="type-body-sm font-medium">{s.mode}</span>
              <span className="type-body-sm font-semibold">{rupees(s.price)}</span>
            </button>
          );
        })}
      </div>

      <p className="type-body-sm font-semibold mt-5 text-muted-foreground">Date</p>
      <div
        className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4"
        role="radiogroup"
        aria-label="Date"
      >
        {days.map((offset) => {
          const d = addDays(today, offset);
          const on = offset === dayOffset;
          return (
            <button
              key={offset}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => {
                setDayOffset(offset);
                setHour(null);
              }}
              className={cn(
                "flex h-[72px] w-14 shrink-0 flex-col items-center justify-center rounded-[16px] transition-colors",
                stateLayer,
                on ? "bg-[var(--accent-strong)] text-background" : "bg-secondary",
              )}
            >
              <span className="type-label-md opacity-80">
                {offset === 0 ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" })}
              </span>
              <span className="font-display text-[18px] font-semibold">{d.getDate()}</span>
            </button>
          );
        })}
      </div>

      <p className="type-body-sm font-semibold mt-5 text-muted-foreground">Time</p>
      {openHours.length ? (
        <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Time">
          {openHours.map((h) => {
            const on = h === hour;
            return (
              <button
                key={h}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setHour(h)}
                className={cn(
                  "type-label-lg h-11 rounded-[12px] border tabular-nums transition-colors",
                  stateLayer,
                  on
                    ? "border-transparent bg-[var(--accent-container)] text-[var(--on-accent-container)]"
                    : "border-foreground/15",
                )}
              >
                {hourLabel(h)}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="type-body-md mt-2 rounded-[12px] bg-secondary px-4 py-3 text-muted-foreground">
          No times left on this day. Pick another date.
        </p>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-foreground/10 pt-4">
        <span>
          <span className="type-label-md block text-muted-foreground">Session fee</span>
          <span className="font-display text-[22px] font-semibold">{rupees(price)}</span>
        </span>
        <Button disabled={hour === null} onClick={() => setConfirming(true)}>
          Request appointment
        </Button>
      </div>

      <BottomSheet
        open={confirming}
        onClose={() => {
          setConfirming(false);
          setDone(false);
        }}
        title={done ? "Request sent" : "Confirm your request"}
      >
        {done ? (
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)]">
              <Check className="h-8 w-8" strokeWidth={3} />
            </span>
            <p className="mt-4 text-[15px] leading-6 text-muted-foreground">
              Your request with {c.name} is saved in My history. Booking and payment aren’t
              connected in this preview yet.
            </p>
            {booked ? (
              <AddToCalendar
                className="mt-5 w-full"
                label="Add to calendar"
                filename="ikan-consultation"
                event={{
                  title: `iKAN consultation with ${c.name}`,
                  details: `${booked.mode} session. Requested in iKAN; you’ll get a confirmation before it’s final.`,
                  start: new Date(booked.startsAt),
                  minutes: 50,
                  url: "https://app.ikanhealth.in/history",
                  alertBefore: 30,
                }}
              />
            ) : null}
            <div className="mt-3 flex flex-col gap-2">
              <Link
                to="/history"
                className="type-action inline-flex h-12 items-center justify-center rounded-full bg-foreground text-background"
              >
                See my history
              </Link>
              <Button
                variant="text"
                onClick={() => {
                  setConfirming(false);
                  setDone(false);
                }}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 rounded-[20px] bg-secondary p-4">
              <Avatar text={initials(c.name)} hue={c.hue} size={48} photo={c.photo} />
              <div className="min-w-0">
                <p className="font-semibold">{c.name}</p>
                <p className="type-body-md text-muted-foreground">
                  {day.toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                  , {hour !== null ? hourLabel(hour) : ""}
                </p>
                <p className="type-body-md text-muted-foreground">
                  {mode} session, {rupees(price)}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Button
                onClick={() => {
                  const at = startsAt().toISOString();
                  book({ consultantId: c.id, mode, price, startsAt: at });
                  setBooked({ mode, startsAt: at });
                  setHour(null);
                  setDone(true);
                }}
              >
                Send request
              </Button>
              <Button variant="text" onClick={() => setConfirming(false)}>
                Go back
              </Button>
            </div>
          </div>
        )}
      </BottomSheet>
    </section>
  );
}
