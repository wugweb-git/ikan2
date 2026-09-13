import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { Check, Clock3, FolderOpen, Lock, Repeat } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { Button } from "@/components/ui/button";
import { ProgramHeader, pageMeta } from "@/components/equip/program-header";
import { unitCount, unitGroups } from "@/lib/equip/program";
import { useEquipProgress } from "@/lib/equip/store";
import type { Unit } from "@/lib/equip/types";

export const Route = createFileRoute("/program/sleep-tight/units")({
  head: () => pageMeta("Your units · Sleep Tight", "The Sleep Tight journey, one unit at a time."),
  component: UnitsPage,
});

const beatOrder = ["teach", "rehearse", "work", "close"] as const;
const beatsOf = (unit: Unit) =>
  beatOrder.filter((beat) => unit.blocks.some((b) => b.beat === beat));

function UnitsPage() {
  const { state, nextUnit } = useEquipProgress();
  const done = state.completed.length;

  return (
    <IkanShell>
      <ProgramHeader
        back="/program/sleep-tight"
        eyebrow="Sleep Tight"
        title="Your units"
        action={
          <Button asChild variant="outline" size="icon" className="h-11 w-11 rounded-full">
            <Link to="/program/sleep-tight/instruments" aria-label="My instruments">
              <FolderOpen />
            </Link>
          </Button>
        }
      />

      <section className="px-5">
        <div className="surface flex items-center gap-4 p-4">
          <div
            className="activity-dial"
            style={{ "--p": `${(done / unitCount) * 100}%` } as CSSProperties}
          >
            <span>{Math.round((done / unitCount) * 100)}%</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-semibold">
              {done} of {unitCount} units done
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Only the next unit opens. Consistency is the key.
            </p>
          </div>
        </div>
      </section>

      <ol className="relative mt-5 space-y-2.5 px-5">
        {unitGroups().map((group) => {
          if (!group.rehearsal) {
            return group.units.map((unit) => (
              <UnitRow
                key={unit.n}
                unit={unit}
                state={stateOf(unit.n, state.completed, nextUnit)}
              />
            ));
          }
          const first = group.units[0]!;
          const last = group.units[group.units.length - 1]!;
          const groupDone = group.units.filter((u) => state.completed.includes(u.n)).length;
          const open = group.units.find((u) => u.n === nextUnit);
          const allDone = groupDone === group.units.length;
          return (
            <li
              key={`r-${first.n}`}
              className={`rounded-[20px] border border-dashed p-4 ${open ? "border-foreground/40 bg-card" : "border-border bg-secondary/40"}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${allDone ? "bg-foreground text-background" : "bg-secondary"}`}
                >
                  {allDone ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <Repeat className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="eyebrow">
                    Units {first.n}–{last.n} · {first.component}
                  </p>
                  <p className="font-display text-sm font-semibold">Practice sittings</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Your standing set, {group.units.length} times · {groupDone} of{" "}
                    {group.units.length} done
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-1">
                {group.units.map((u) => (
                  <span
                    key={u.n}
                    className={`h-1.5 flex-1 rounded-full ${state.completed.includes(u.n) ? "bg-foreground" : u.n === nextUnit ? "bg-foreground/35" : "bg-secondary"}`}
                  />
                ))}
              </div>
              {open ? (
                <Button asChild className="mt-3 w-full">
                  <Link to="/program/sleep-tight/unit/$unit" params={{ unit: String(open.n) }}>
                    Start Unit {open.n}
                  </Link>
                </Button>
              ) : null}
            </li>
          );
        })}
      </ol>
    </IkanShell>
  );
}

type RowState = "done" | "open" | "locked";

const stateOf = (n: number, completed: number[], next: number): RowState =>
  completed.includes(n) ? "done" : n === next ? "open" : "locked";

function UnitRow({ unit, state }: { unit: Unit; state: RowState }) {
  const body = (
    <>
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-sm font-bold ${
          state === "done"
            ? "bg-foreground text-background"
            : state === "open"
              ? "bg-calm-soft text-calm-strong"
              : "bg-secondary text-muted-foreground"
        }`}
      >
        {state === "done" ? (
          <Check className="h-4 w-4" strokeWidth={3} />
        ) : state === "locked" ? (
          <Lock className="h-3.5 w-3.5" />
        ) : (
          unit.n
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="eyebrow truncate">
          Unit {unit.n} · {unit.component}
        </p>
        <p className="truncate font-display text-sm font-semibold">{unit.title}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock3 className="h-3 w-3" /> {unit.minutes} min · {beatsOf(unit).join(" → ")}
        </p>
      </div>
      {state === "open" ? (
        <span className="rounded-full bg-foreground px-3 py-1.5 text-[11px] font-bold text-background">
          Start
        </span>
      ) : null}
    </>
  );

  if (state === "locked") {
    return (
      <li
        className="flex items-center gap-3 rounded-[20px] border border-border p-3.5 opacity-60"
        aria-disabled="true"
      >
        {body}
      </li>
    );
  }
  return (
    <li>
      <Link
        to="/program/sleep-tight/unit/$unit"
        params={{ unit: String(unit.n) }}
        className={`tile flex items-center gap-3 rounded-[20px] border p-3.5 ${state === "open" ? "border-foreground/30 bg-card shadow-[var(--shadow-card)]" : "border-border bg-card"}`}
      >
        {body}
      </Link>
    </li>
  );
}
