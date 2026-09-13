import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, Moon, Wind } from "lucide-react";
import cover from "@/assets/equip-sleep-tight.jpg";
import { IkanShell } from "@/components/ikan-shell";
import { Reveal } from "@/components/reveal";
import { ProgramHeader, pageMeta } from "@/components/equip/program-header";
import { programCard, unitCount } from "@/lib/equip/program";
import { useEquipProgress } from "@/lib/equip/store";

export const Route = createFileRoute("/program/")({
  head: () =>
    pageMeta(
      "Programs",
      "Self-paced Equip programmes that build skills for sleep, stress and more.",
    ),
  component: ProgramsPage,
});

const comingSoon = [
  {
    name: "Equip : Stressbuster",
    body: "Skills for when stress is what keeps you up.",
    icon: Wind,
  },
];

function ProgramsPage() {
  const { state, nextUnit } = useEquipProgress();
  const done = state.completed.length;
  const percent = Math.round((done / unitCount) * 100);

  return (
    <IkanShell>
      <ProgramHeader back="/" eyebrow="iKAN Equip" title="Programs" />

      <Reveal>
        <section className="px-5">
          <Link to="/program/sleep-tight" className="hero-card tile block min-h-[300px]">
            <img src={cover} alt="" className="hero-media" />
            <div className="hero-veil" />
            <div className="relative flex min-h-[260px] flex-col">
              <span className="hero-chip self-start">
                {state.startedAt ? "In progress" : "Self-paced"}
              </span>
              <div className="mt-auto">
                <p className="font-display text-[28px] font-semibold leading-tight">
                  {programCard.name}
                </p>
                <p className="mt-1.5 text-sm opacity-85">{programCard.tagline}</p>
                <div className="mt-4 flex items-center gap-3 text-xs opacity-80">
                  <span className="flex items-center gap-1.5">
                    <Moon className="h-3.5 w-3.5" /> {unitCount} units
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" /> 10–50 min a sitting
                  </span>
                </div>
                {state.startedAt ? (
                  <div className="mt-4">
                    <div className="hero-track">
                      <i style={{ width: `${percent}%` }} />
                    </div>
                    <p className="mt-2 text-xs opacity-80">
                      {done} of {unitCount} done · next up: Unit {nextUnit}
                    </p>
                  </div>
                ) : null}
                <span className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-background px-4 text-sm font-semibold text-foreground">
                  {state.startedAt ? "Continue" : "See the programme"}{" "}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </section>
      </Reveal>

      <section className="mt-7 px-5">
        <p className="eyebrow">Coming soon</p>
        <div className="mt-3 space-y-3">
          {comingSoon.map(({ name, body, icon: Icon }) => (
            <div
              key={name}
              className="surface grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4 opacity-75"
            >
              <div className="score-tile score-mind">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold">{name}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{body}</p>
              </div>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold">
                Soon
              </span>
            </div>
          ))}
        </div>
      </section>
    </IkanShell>
  );
}
