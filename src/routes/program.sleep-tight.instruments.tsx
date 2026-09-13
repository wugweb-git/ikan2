import { createFileRoute } from "@tanstack/react-router";
import { formatDuration, nightMetrics } from "@/lib/equip/metrics";
import { IkanShell } from "@/components/ikan-shell";
import { displayValue } from "@/components/equip/fields";
import { ProgramHeader, pageMeta } from "@/components/equip/program-header";
import { instruments, standingSet } from "@/lib/equip/program";
import { useEquipProgress } from "@/lib/equip/store";

export const Route = createFileRoute("/program/sleep-tight/instruments")({
  head: () => pageMeta("My instruments · Sleep Tight", "Everything you have built in Sleep Tight."),
  component: InstrumentsPage,
});

/** Thought dumps are deliberately absent — you never have to read them again. */
const shown = [
  "diary",
  "thoughtRecord",
  "distractors",
  "ideation",
  "bedtimeRitual",
  "wakeRitual",
  "dailyActivities",
  "targetHabits",
  "piggyback",
  "successes",
  "energisers",
  "bedSeparation",
  "adherence",
];

function InstrumentsPage() {
  const { state, rowsFor } = useEquipProgress();
  const statements = state.pools["sleepStatements"] ?? [];

  return (
    <IkanShell>
      <ProgramHeader
        back="/program/sleep-tight/units"
        eyebrow="Sleep Tight"
        title="My instruments"
      />
      <p className="px-5 text-sm leading-6 text-muted-foreground">
        A read-only look back at what you have built. These are yours, and they don&rsquo;t end with
        the programme.
      </p>

      <div className="mt-5 space-y-3 px-5">
        {statements.length ? (
          <section className="surface p-4">
            <p className="font-display text-sm font-semibold">Sleep statements</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {statements.map((s) => (
                <span key={s} className="rounded-full bg-secondary px-3 py-1.5 text-xs">
                  {s}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {shown.map((key) => {
          const instrument = instruments[key];
          if (!instrument) return null;
          const rows = rowsFor(key, false).filter((r) => !r.seed);
          const columns = instrument.columns ?? [];
          const from = standingSet.find((s) => s.instrument === key)?.from;
          return (
            <section key={key} className="surface p-4">
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-semibold">{instrument.name}</p>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold">
                  {rows.length}
                </span>
              </div>
              {rows.length === 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Nothing yet
                  {from !== undefined ? ` · collected every sitting from Unit ${from}` : ""}.
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-border">
                  {rows
                    .slice()
                    .reverse()
                    .map((row) => {
                      const metrics = key === "diary" ? nightMetrics(row) : null;
                      return (
                        <li key={row.id} className="py-2.5 text-xs leading-5">
                          {key === "ideation" ? (
                            <p>
                              <span className="text-muted-foreground">
                                {String(row["parent"] ?? "")} →{" "}
                              </span>
                              <strong>{String(row["way"] ?? "")}</strong>
                              {row["chosen"] === true ? " ★" : ""}
                            </p>
                          ) : (
                            <p className="font-semibold">
                              {displayValue(row[columns[0]?.key ?? ""])}
                            </p>
                          )}
                          {metrics ? (
                            <p className="text-muted-foreground">
                              In bed {formatDuration(metrics.windowMin)} · asleep{" "}
                              {formatDuration(metrics.asleepMin)} · {metrics.efficiency}% efficiency
                            </p>
                          ) : key !== "ideation" ? (
                            <p className="text-muted-foreground">
                              {columns
                                .slice(1)
                                .filter((c) => row[c.key] != null)
                                .map((c) => `${c.label}: ${displayValue(row[c.key])}`)
                                .join(" · ")}
                            </p>
                          ) : null}
                        </li>
                      );
                    })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </IkanShell>
  );
}
