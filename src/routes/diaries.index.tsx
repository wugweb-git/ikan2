import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, NotebookPen } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { accentStyle, IconButton, stateLayer, TopAppBar } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { journeyOf, latestRun } from "@/lib/equip/journey";
import { programmes, upcoming } from "@/lib/equip/programs";
import { useProgramme, type ProgrammeState } from "@/lib/equip/store";

/* The four learning diaries, one per Equip programme. */

export const Route = createFileRoute("/diaries/")({
  head: () => pageMeta("Learning diaries", "One learning diary for each Equip program."),
  component: DiariesPage,
});

function DiariesPage() {
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const states: Record<string, ProgrammeState> = {
    "sleep-tight": useProgramme("sleep-tight").state,
    unburn: useProgramme("unburn").state,
    "stress-buster": useProgramme("stress-buster").state,
  };

  return (
    <IkanShell>
      <TopAppBar
        leading={
          <IconButton label="Back" onClick={() => navigate({ to: "/history" })}>
            <ArrowLeft className="h-6 w-6" />
          </IconButton>
        }
        title="Learning diaries"
      />

      <ul className="mt-2 space-y-3 px-4">
        {programmes.map((p) => {
          const j = journeyOf(p, latestRun(p, states[p.slug]!));
          return (
            <li key={p.slug} style={accentStyle(p.accent)}>
              <Link
                to="/diaries/$slug"
                params={{ slug: p.slug }}
                className={cn(
                  "flex items-center gap-3 rounded-[24px] border border-foreground/10 p-3 pr-4",
                  stateLayer,
                  hydrated && !j.started && "opacity-55 grayscale",
                )}
              >
                <span className="relative shrink-0">
                  <img src={p.cover} alt="" className="h-20 w-20 rounded-[18px] object-cover" />
                  <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-foreground text-background">
                    <NotebookPen className="h-4 w-4" />
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[18px] font-semibold leading-6">
                    {p.name}
                  </span>
                  <span className="block text-[13px] text-muted-foreground">
                    {hydrated && !j.started ? "Not started yet" : "Learning diary"}
                    {hydrated && j.responses
                      ? ` · ${j.responses} ${j.responses === 1 ? "entry" : "entries"}`
                      : ""}
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </li>
          );
        })}
        {upcoming.map((u) => (
          <li
            key={u.name}
            className="flex items-center gap-3 rounded-[24px] border border-dashed border-foreground/20 p-3 pr-4"
          >
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-[18px] bg-secondary text-muted-foreground">
              <NotebookPen className="h-7 w-7" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[18px] font-semibold leading-6">
                {u.name}
              </span>
              <span className="block text-[13px] text-muted-foreground">
                Learning diary · coming soon
              </span>
            </span>
          </li>
        ))}
      </ul>
    </IkanShell>
  );
}
