import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LifeBuoy, Lock, X } from "lucide-react";
import { accentStyle, Button, IconButton, LinearProgress, TopAppBar } from "@/components/equip/m3";
import { StepView } from "@/components/equip/steps";
import { diaryRows, getDay, getProgramme } from "@/lib/equip/programs";
import { useProgramme } from "@/lib/equip/store";

export const Route = createFileRoute("/program/$slug/day/$day")({
  loader: ({ params }) => {
    const programme = getProgramme(params.slug);
    const day = programme ? getDay(programme, Number(params.day)) : undefined;
    if (!programme || !day) throw notFound();
    return { slug: programme.slug, day: day.day };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? getProgramme(loaderData.slug) : undefined;
    const d = p && loaderData ? getDay(p, loaderData.day) : undefined;
    return {
      meta: [
        { title: p && d ? `Day ${d.day}: ${d.title} — ${p.name} — iKAN` : "Day — iKAN" },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-8 text-center">
      <div>
        <h1 className="font-display text-xl font-semibold">That day doesn't exist</h1>
        <Link to="/program" className="mt-5 inline-flex h-12 items-center rounded-full bg-foreground px-6 font-semibold text-background">
          Back to programmes
        </Link>
      </div>
    </div>
  ),
  component: DayPage,
});

function DayPage() {
  const { slug, day } = Route.useLoaderData();
  // remount per day so the step index resets
  return <Player key={`${slug}:${day}`} slug={slug} dayNumber={day} />;
}

function Player({ slug, dayNumber }: { slug: string; dayNumber: number }) {
  const programme = getProgramme(slug)!;
  const day = getDay(programme, dayNumber)!;
  const navigate = useNavigate();
  const { state, nextDay, complete } = useProgramme(slug);
  const [index, setIndex] = useState(0);

  const step = day.steps[index];
  const done = state.completed.includes(day.day);
  const toProgramme = () => navigate({ to: "/program/$slug", params: { slug } });

  if (!done && day.day > nextDay) {
    return (
      <div style={accentStyle(programme.accent)} className="mx-auto grid min-h-screen max-w-md place-items-center bg-background px-8 text-center">
        <div>
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary">
            <Lock className="h-7 w-7" />
          </span>
          <h1 className="mt-6 font-display text-[24px] font-semibold">Day {day.day} opens after day {nextDay}</h1>
          <Button className="mt-6" onClick={() => navigate({ to: "/program/$slug/day/$day", params: { slug, day: String(nextDay) } })}>
            Go to day {nextDay}
          </Button>
        </div>
      </div>
    );
  }
  if (!step) return null;

  const go = (i: number) => {
    setIndex(i);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-canvas" style={accentStyle(programme.accent)}>
      <div className="mx-auto min-h-screen w-full max-w-md bg-background">
        <div className="sticky top-0 z-30 bg-background">
          <TopAppBar
            className="static"
            leading={
              <IconButton label="Close" onClick={toProgramme}>
                <X className="h-6 w-6" />
              </IconButton>
            }
            title={`Day ${day.day}`}
            subtitle={day.title}
            trailing={
              <Link to="/support" aria-label="Get support now" className="grid h-12 w-12 place-items-center rounded-full text-alert-strong">
                <LifeBuoy className="h-6 w-6" />
              </Link>
            }
          />
          <div className="px-4 pb-2">
            <LinearProgress value={((index + 1) / day.steps.length) * 100} />
          </div>
        </div>

        <main className="px-4 pb-36 pt-4">
          <div key={step.id} className="animate-fade">
            <StepView
              step={step}
              diaryRows={diaryRows(programme)}
              ctx={{
                slug,
                day: day.day,
                isLast: index === day.steps.length - 1,
                onBack: index > 0 ? () => go(index - 1) : undefined,
                onNext: () => {
                  if (index + 1 < day.steps.length) return go(index + 1);
                  complete(day.day);
                  toProgramme();
                },
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
