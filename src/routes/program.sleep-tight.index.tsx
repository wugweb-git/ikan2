import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, LifeBuoy, ListChecks, Users } from "lucide-react";
import cover from "@/assets/equip-sleep-tight.jpg";
import { IkanShell } from "@/components/ikan-shell";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { ProgramHeader, pageMeta } from "@/components/equip/program-header";
import { programCard, unitCount } from "@/lib/equip/program";
import { useEquipProgress } from "@/lib/equip/store";

export const Route = createFileRoute("/program/sleep-tight/")({
  head: () => pageMeta("Equip : Sleep Tight", programCard.tagline),
  component: SleepTightCover,
});

function SleepTightCover() {
  const { state, nextUnit } = useEquipProgress();
  const started = Boolean(state.startedAt);
  const [first, second, third] = programCard.notes;

  return (
    <IkanShell>
      <ProgramHeader back="/program" eyebrow="Programme" title="Sleep Tight" />

      <section className="px-5">
        <img
          src={cover}
          alt="A calm, dim bedroom at night"
          className="aspect-[16/11] w-full rounded-[24px] object-cover"
        />
        <h2 className="mt-5 font-display text-[28px] font-semibold leading-tight">
          {programCard.name}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {programCard.tagline} · {unitCount} units
        </p>
      </section>

      <Reveal>
        <section className="mt-6 space-y-3 px-5">
          <InfoCard title="About" icon={null}>
            {programCard.about}
          </InfoCard>
          <InfoCard title="What to expect" icon={<ListChecks className="h-4 w-4" />}>
            {programCard.expect}
          </InfoCard>
          <InfoCard title="Who can participate" icon={<Users className="h-4 w-4" />}>
            {programCard.who}
          </InfoCard>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-6 px-5">
          <p className="eyebrow">Things to note</p>
          <ul className="mt-3 space-y-2.5">
            {[first, second].map((note, i) => (
              <li key={i} className="surface flex gap-3 p-4 text-sm leading-6">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary font-display text-[11px] font-bold">
                  {i + 1}
                </span>
                <span>{note}</span>
              </li>
            ))}
            <li className="flex gap-3 rounded-[20px] border border-alert/25 bg-alert-soft p-4 text-sm leading-6">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-background font-display text-[11px] font-bold">
                3
              </span>
              <span>
                {third}{" "}
                <Link
                  to="/support"
                  className="inline-flex items-center gap-1 font-semibold text-alert-strong underline underline-offset-2"
                >
                  <LifeBuoy className="h-3.5 w-3.5" /> Get support now
                </Link>
              </span>
            </li>
          </ul>
        </section>
      </Reveal>

      <section className="sticky bottom-24 z-10 mt-6 px-5">
        <Button asChild className="h-13 w-full text-base shadow-dock">
          {started ? (
            <Link to="/program/sleep-tight/units">
              Continue · Unit {nextUnit} <ArrowRight />
            </Link>
          ) : (
            <Link to="/program/sleep-tight/start">
              Start the programme <ArrowRight />
            </Link>
          )}
        </Button>
      </section>
    </IkanShell>
  );
}

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="surface p-4">
      <p className="flex items-center gap-2 font-display text-sm font-semibold">
        {icon}
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{children}</p>
    </div>
  );
}
