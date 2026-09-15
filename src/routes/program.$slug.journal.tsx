import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { accentStyle, IconButton, TopAppBar } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { cn } from "@/lib/utils";
import { formatDuration, formatTime, nightMetrics } from "@/lib/equip/metrics";
import { getProgramme } from "@/lib/equip/programs";
import { useProgramme } from "@/lib/equip/store";
import type { Field, Programme, UI } from "@/lib/equip/types";

export const Route = createFileRoute("/program/$slug/journal")({
  loader: ({ params }) => {
    const programme = getProgramme(params.slug);
    if (!programme) throw notFound();
    return { slug: programme.slug };
  },
  head: ({ loaderData }) =>
    pageMeta(
      `Your entries${loaderData ? ` · ${getProgramme(loaderData.slug)?.name}` : ""}`,
      "Everything you've written in this programme.",
    ),
  component: JournalPage,
});

/** Each collection, labelled by the first Notion block that creates it, with that block's fields. */
function collectionsOf(p: Programme) {
  const seen = new Map<string, { title: string; fields: Field[] }>();
  for (const d of p.days) {
    for (const s of d.steps) {
      const v = s.view as UI;
      if (v.ui !== "entries" && v.ui !== "review") continue;
      const fields = v.ui === "entries" ? v.fields : [...(v.addFields ?? []), ...v.fields];
      const prev = seen.get(v.collection);
      if (!prev) seen.set(v.collection, { title: s.block.title, fields });
      else
        for (const f of fields) if (!prev.fields.some((x) => x.key === f.key)) prev.fields.push(f);
    }
  }
  return [...seen.entries()];
}

function JournalPage() {
  const { slug } = Route.useLoaderData();
  const programme = getProgramme(slug)!;
  const navigate = useNavigate();
  const { state, entries } = useProgramme(slug);
  const nights = Object.entries(state.diary)
    .map(([day, e]) => ({ day: Number(day), m: nightMetrics(e) }))
    .filter((n) => n.m)
    .sort((a, b) => a.day - b.day);
  const maxBed = Math.max(600, ...nights.map((n) => n.m!.inBed));

  return (
    <div className="min-h-dvh bg-canvas" style={accentStyle(programme.accent)}>
      <div className="mx-auto min-h-dvh w-full max-w-app bg-background pb-16">
        <TopAppBar
          leading={
            <IconButton
              label="Back"
              onClick={() => navigate({ to: "/program/$slug", params: { slug } })}
            >
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          }
          title="Your entries"
          subtitle={programme.name}
        />

        {nights.length ? (
          <section className="px-4 pt-2">
            <h2 className="font-display text-[16px] font-semibold">Sleep Diary</h2>
            <div className="mt-3 rounded-[16px] bg-[var(--accent-container)] p-4 text-[var(--on-accent-container)]">
              <div
                className="flex h-40 items-end gap-1.5"
                role="img"
                aria-label="Time asleep within time in bed for each diary day"
              >
                {nights.slice(-14).map(({ day, m }) => (
                  <div
                    key={day}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                  >
                    <div
                      className="relative w-full overflow-hidden rounded-[6px] bg-[var(--accent)]/30"
                      style={{ height: `${(m!.inBed / maxBed) * 100}%` }}
                    >
                      <div
                        className="absolute inset-x-0 bottom-0 rounded-[6px] bg-[var(--accent)]"
                        style={{ height: `${(m!.asleep / m!.inBed) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] tabular-nums">{day}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[13px]">
                Darker bar: time asleep. Lighter bar: time in bed. By day.
              </p>
            </div>
            <ul className="-mx-4 mt-2">
              {nights
                .slice()
                .reverse()
                .map(({ day, m }) => (
                  <li key={day} className="flex min-h-14 items-center justify-between px-4">
                    <span className="text-[16px]">{day === 0 ? "Onboarding" : `Day ${day}`}</span>
                    <span className="text-[14px] tabular-nums text-muted-foreground">
                      {formatDuration(m!.asleep)} asleep, {m!.efficiency}%
                    </span>
                  </li>
                ))}
            </ul>
          </section>
        ) : null}

        {Object.keys(state.tracker).length ? (
          <section className="mt-6 px-4">
            <h2 className="font-display text-[16px] font-semibold">Tracking</h2>
            <ul className="mt-3 space-y-4">
              {entries("habits").map((h) => {
                const days = Object.keys(state.tracker)
                  .map(Number)
                  .sort((a, b) => a - b);
                return (
                  <li key={h.id}>
                    <p className="text-[16px]">{String(Object.values(h.values)[0] ?? "")}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {days.map((d) => (
                        <span
                          key={d}
                          title={`Day ${d}`}
                          className={cn(
                            "grid h-8 w-8 place-items-center rounded-full text-[11px] tabular-nums",
                            state.tracker[String(d)]?.[h.id]
                              ? "bg-[var(--accent)] text-background"
                              : "bg-secondary text-muted-foreground",
                          )}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {!nights.length &&
        !Object.keys(state.tracker).length &&
        !collectionsOf(programme).some(([c]) => entries(c).length) ? (
          <div className="mx-4 mt-6 flex flex-col items-center rounded-[16px] border border-dashed border-foreground/25 px-6 py-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)]">
              <BookOpen className="h-6 w-6" />
            </span>
            <p className="mt-3 text-[16px] font-medium">Nothing here yet</p>
            <p className="mt-1 text-[14px] text-muted-foreground">
              What you write during each day shows up here.
            </p>
          </div>
        ) : null}

        {collectionsOf(programme).map(([collection, { title, fields }]) => {
          const list = entries(collection);
          if (!list.length) return null;
          return (
            <section key={collection} className="mt-6 px-4">
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-[16px] font-semibold">{title}</h2>
                <span className="text-[14px] tabular-nums text-muted-foreground">
                  {list.length}
                </span>
              </div>
              <ul className="mt-3 space-y-3">
                {list.map((e) => (
                  <li key={e.id} className="rounded-[16px] bg-secondary p-4">
                    <p className="text-[12px] text-muted-foreground">Day {e.day}</p>
                    <dl className="mt-1 space-y-2">
                      {Object.entries(e.values).map(([k, v]) => {
                        if (v === null || v === "" || v === undefined) return null;
                        const f = fields.find((x) => x.key === k);
                        const shown =
                          f?.type === "time" && typeof v === "string" ? formatTime(v) : String(v);
                        return (
                          <div key={k}>
                            {f?.label ? (
                              <dt className="text-[12px] text-muted-foreground">{f.label}</dt>
                            ) : null}
                            <dd className="whitespace-pre-line text-[15px] leading-6">{shown}</dd>
                          </div>
                        );
                      })}
                    </dl>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
