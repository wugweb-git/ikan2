import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LifeBuoy, Lock, X } from "lucide-react";
import { StepRenderer } from "@/components/equip/step-renderer";
import { allDays, getDay, getProgramme } from "@/lib/equip/programs";
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
    <div className="grid min-h-screen place-items-center bg-canvas px-8 text-center">
      <div>
        <h1 className="font-display text-xl font-semibold">That day doesn't exist</h1>
        <Link
          to="/program"
          className="mt-5 inline-flex h-12 items-center rounded-full bg-foreground px-6 font-semibold text-background"
        >
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

  const steps = day.steps;
  const step = steps[index];
  const isDone = state.completed.includes(day.day);
  const lastDay = allDays(programme).at(-1)?.day ?? 0;

  if (!isDone && day.day > nextDay) {
    return (
      <div className="mx-auto grid min-h-screen max-w-md place-items-center bg-background px-8 text-center">
        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-semibold">Day {day.day} opens later</h1>
          <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
            Finish day {nextDay} first. One day at a time keeps the habit steady.
          </p>
          <Link
            to="/program/$slug/day/$day"
            params={{ slug, day: String(nextDay) }}
            className="mt-7 inline-flex h-13 items-center rounded-full bg-foreground px-7 font-display font-semibold text-background"
          >
            Go to day {nextDay}
          </Link>
        </div>
      </div>
    );
  }

  if (!step) return null;

  const go = (i: number) => {
    setIndex(i);
    window.scrollTo({ top: 0 });
  };

  const onNext = () => {
    if (index + 1 < steps.length) return go(index + 1);
    complete(day.day);
    navigate({ to: "/program/$slug", params: { slug } });
  };

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto min-h-screen w-full max-w-md bg-background shadow-app">
        <header className="sticky top-0 z-20 bg-background/90 px-3 pb-3 pt-3 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Link
              to="/program/$slug"
              params={{ slug }}
              aria-label="Close"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full active:bg-secondary"
            >
              <X className="h-5 w-5" />
            </Link>
            <div className="flex flex-1 gap-1" aria-label={`Step ${index + 1} of ${steps.length}`}>
              {steps.map((s, i) => (
                <span
                  key={i}
                  className={
                    i <= index
                      ? "h-1 flex-1 rounded-full bg-foreground transition-colors"
                      : "h-1 flex-1 rounded-full bg-secondary transition-colors"
                  }
                />
              ))}
            </div>
            <Link
              to="/support"
              aria-label="Get support now"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-alert-strong active:bg-secondary"
            >
              <LifeBuoy className="h-5 w-5" />
            </Link>
          </div>
          <p className="mt-2 px-2 text-[13px] text-muted-foreground">
            Day {day.day}: {day.title}
          </p>
        </header>

        <main className="px-5 pb-40 pt-5">
          <div key={index} className="animate-fade">
            <StepRenderer
              step={step}
              slug={slug}
              day={day.day}
              isLastDay={day.day === lastDay}
              onNext={onNext}
              onBack={index > 0 ? () => go(index - 1) : undefined}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
