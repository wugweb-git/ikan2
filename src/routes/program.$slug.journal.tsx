import { createFileRoute, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { IkanShell } from "@/components/ikan-shell";
import { HabitStreaks, NightsChart } from "@/components/equip/journey";
import { BackLink, ProgramHeader, pageMeta } from "@/components/equip/program-header";
import { formatTime } from "@/lib/equip/metrics";
import { getProgramme } from "@/lib/equip/programs";
import { useProgramme, type Entry } from "@/lib/equip/store";

export const Route = createFileRoute("/program/$slug/journal")({
  loader: ({ params }) => {
    const programme = getProgramme(params.slug);
    if (!programme) throw notFound();
    return { slug: programme.slug };
  },
  head: ({ loaderData }) =>
    pageMeta(
      `Your journal${loaderData ? ` · ${getProgramme(loaderData.slug)?.name}` : ""}`,
      "Everything you've recorded in this programme.",
    ),
  component: JournalPage,
});

const v = (e: Entry, key: string) => {
  const x = e.values[key];
  return typeof x === "string" ? x : "";
};

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: ReactNode;
}) {
  return (
    <section className="mt-10 px-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {count !== undefined ? (
          <p className="text-sm tabular-nums text-muted-foreground">{count}</p>
        ) : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function JournalPage() {
  const { slug } = Route.useLoaderData();
  const programme = getProgramme(slug)!;
  const { state, entries } = useProgramme(slug);
  const thoughts = entries("thoughts");
  const ideas = entries("ideas");
  const distractors = entries("distractors");
  const rituals = entries("rituals");

  return (
    <IkanShell>
      <ProgramHeader back={<BackLink to="/program/$slug" slug={slug} />} title={programme.name} />
      <section className="px-5 pt-4">
        <h1 className="font-display text-[36px] font-semibold leading-none tracking-[-0.02em]">
          Your journal
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-muted-foreground">
          What you've recorded so far. It stays yours after the programme ends.
        </p>
      </section>

      <Section title="Your nights">
        <NightsChart diary={state.diary} />
      </Section>

      <Section title="Your habits">
        <HabitStreaks habits={entries("habits")} tracker={state.tracker} field="habit" />
      </Section>

      {thoughts.length ? (
        <Section title="Thoughts and feelings" count={thoughts.length}>
          <ul className="divide-y divide-foreground/[0.07]">
            {thoughts
              .slice()
              .reverse()
              .map((t) => (
                <li key={t.id} className="py-4">
                  <p className="text-[13px] text-muted-foreground">
                    Day {t.day}
                    {v(t, "time") ? `, ${formatTime(v(t, "time"))}` : ""}
                    {t.values["affected_sleep"] === true ? (
                      <span className="ml-2 rounded-full bg-alert-soft px-2 py-0.5 font-semibold text-alert-strong">
                        Affected sleep
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-[15px] font-semibold">{v(t, "situation")}</p>
                  {v(t, "thoughts") ? (
                    <p className="mt-1 text-[15px]">&ldquo;{v(t, "thoughts")}&rdquo;</p>
                  ) : null}
                  <p className="mt-1 text-[14px] text-muted-foreground">
                    {[v(t, "feelings"), v(t, "response")].filter(Boolean).join(". ")}
                  </p>
                </li>
              ))}
          </ul>
        </Section>
      ) : null}

      {distractors.length ? (
        <Section title="What keeps you up" count={distractors.length}>
          <ul className="flex flex-wrap gap-2">
            {distractors.map((d) => (
              <li
                key={d.id}
                className={
                  d.values["in_control"] === true
                    ? "rounded-full bg-foreground px-3.5 py-2 text-sm text-background"
                    : "rounded-full bg-secondary px-3.5 py-2 text-sm"
                }
              >
                {v(d, "distractor")}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] text-muted-foreground">Dark ones are in your control.</p>
        </Section>
      ) : null}

      {ideas.length ? (
        <Section title="Ideas and fixes" count={ideas.length}>
          <ul className="space-y-3">
            {ideas.map((i) => (
              <li key={i.id} className="rounded-[22px] bg-secondary/70 p-4">
                <p className="text-[15px] font-semibold">{v(i, "disturbance")}</p>
                <p className="mt-1 whitespace-pre-line text-[14px] text-muted-foreground">
                  {v(i, "ways")}
                </p>
                {v(i, "fix") ? (
                  <p className="mt-3 text-[14px]">
                    <span className="font-semibold">Balanced fix: </span>
                    {v(i, "fix")}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {rituals.length ? (
        <Section title="Your bedtime ritual" count={rituals.length}>
          <ol className="list-inside list-decimal space-y-2 text-[15px]">
            {rituals.map((r) => (
              <li key={r.id}>{v(r, "ritual")}</li>
            ))}
          </ol>
        </Section>
      ) : null}
    </IkanShell>
  );
}
