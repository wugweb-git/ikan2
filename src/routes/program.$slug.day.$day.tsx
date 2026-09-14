import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useActiveTime, formatSeconds } from "@/hooks/use-active-time";
import { moodScale } from "@/lib/journal";
import { cn } from "@/lib/utils";
import { LifeBuoy, Lock, X } from "lucide-react";
import {
  accentStyle,
  Button,
  IconButton,
  LinearProgress,
  stateLayer,
  TextField,
  TopAppBar,
} from "@/components/equip/m3";
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
    <div className="grid min-h-dvh place-items-center px-8 text-center">
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
  const { state, nextDay, complete, addTime, saveFeedback } = useProgramme(slug);
  const [index, setIndex] = useState(0);
  const [asking, setAsking] = useState(false);

  const step = day.steps[index];
  // active time on each step (and so the day); the feedback screen counts as its own step
  useActiveTime(asking ? "feedback" : (step?.id ?? "none"), (stepId, seconds) =>
    addTime(day.day, stepId, seconds),
  );
  const done = state.completed.includes(day.day);
  const toProgramme = () => navigate({ to: "/program/$slug", params: { slug } });

  if (!done && day.day > nextDay) {
    return (
      <div
        style={accentStyle(programme.accent)}
        className="mx-auto grid min-h-dvh max-w-app place-items-center bg-background px-8 text-center"
      >
        <div>
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary">
            <Lock className="h-7 w-7" />
          </span>
          <h1 className="mt-6 font-display text-[24px] font-semibold">
            Day {day.day} opens after day {nextDay}
          </h1>
          <Button
            className="mt-6"
            onClick={() =>
              navigate({ to: "/program/$slug/day/$day", params: { slug, day: String(nextDay) } })
            }
          >
            Go to day {nextDay}
          </Button>
        </div>
      </div>
    );
  }
  if (!step) return null;

  const finish = () => {
    complete(day.day);
    // the last day opens the programme result, like finishing an assessment
    const allDone = programme.days.every(
      (d) => d.day === day.day || state.completed.includes(d.day),
    );
    if (allDone) {
      void navigate({ to: "/program/$slug/result", params: { slug }, search: { done: true } });
      return;
    }
    try {
      sessionStorage.setItem("ikan.equip.finished", `${slug}:${day.day}`);
    } catch {
      /* the confirmation is a nicety; storage may be unavailable */
    }
    toProgramme();
  };

  const go = (i: number) => {
    setIndex(i);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-dvh bg-canvas" style={accentStyle(programme.accent)}>
      <div className="mx-auto min-h-dvh w-full max-w-app bg-background">
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
              <Link
                to="/support"
                aria-label="Get support now"
                className="grid h-12 w-12 place-items-center rounded-full text-alert-strong"
              >
                <LifeBuoy className="h-6 w-6" />
              </Link>
            }
          />
          <div className="flex items-center gap-3 px-4 pb-2">
            <div className="flex-1">
              <LinearProgress value={((index + 1) / day.steps.length) * 100} />
            </div>
            <span className="text-[12px] tabular-nums text-muted-foreground" aria-live="polite">
              {index + 1} of {day.steps.length}
            </span>
          </div>
        </div>

        <main className="px-4 pb-36 pt-4">
          {asking ? (
            <SessionCheck
              seconds={state.time?.[String(day.day)]?.total ?? 0}
              onDone={(fb) => {
                if (fb) saveFeedback(day.day, fb);
                finish();
              }}
            />
          ) : (
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
                    // ask how the session went, once per day
                    if (!state.feedback?.[String(day.day)]) {
                      setAsking(true);
                      window.scrollTo({ top: 0 });
                      return;
                    }
                    finish();
                  },
                }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const helpfulScale = ["Not at all", "A little", "Somewhat", "Very", "Extremely"];

/** End of a day: how helpful the session was and how the person feels now. Both optional. */
function SessionCheck({
  seconds,
  onDone,
}: {
  seconds: number;
  onDone: (fb: { helpful?: number; feel?: number; note?: string } | null) => void;
}) {
  const [helpful, setHelpful] = useState<number>();
  const [feel, setFeel] = useState<number>();
  const [note, setNote] = useState("");
  return (
    <div className="animate-fade">
      <p className="text-[14px] font-semibold text-[var(--accent-strong)]">Before you go</p>
      <h1 className="mt-1 font-display text-[26px] font-semibold leading-8">How was today?</h1>
      {seconds >= 30 ? (
        <p className="mt-1 text-[14px] text-muted-foreground">
          You spent {formatSeconds(seconds)} on today’s session.
        </p>
      ) : null}

      <section className="mt-6">
        <h2 className="text-[16px] font-semibold">How helpful was this session?</h2>
        <div className="mt-3 grid grid-cols-5 gap-2" role="radiogroup">
          {helpfulScale.map((label, i) => {
            const v = i + 1;
            const on = helpful === v;
            return (
              <button
                key={label}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setHelpful(v)}
                className={cn(
                  "flex h-[72px] flex-col items-center justify-center gap-1 rounded-[16px] text-center",
                  stateLayer,
                  on ? "bg-foreground text-background" : "bg-secondary",
                )}
              >
                <span className="font-display text-[20px] font-semibold leading-6">{v}</span>
                <span className="px-1 text-[10px] leading-3">{label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-[16px] font-semibold">How do you feel now?</h2>
        <div className="mt-3 grid grid-cols-5 gap-2" role="radiogroup">
          {moodScale.map((m) => {
            const on = feel === m.value;
            return (
              <button
                key={m.value}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={m.label}
                onClick={() => setFeel(m.value)}
                className={cn(
                  "flex h-[72px] flex-col items-center justify-center gap-1 rounded-[16px]",
                  stateLayer,
                  on ? "bg-[var(--accent-container)] ring-2 ring-[var(--accent)]" : "bg-secondary",
                )}
              >
                <span className="text-[26px] leading-none" aria-hidden="true">
                  {m.emoji}
                </span>
                <span className="text-[10px]">{m.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-6">
        <TextField
          label="Anything you’d like to add? (optional)"
          value={note}
          onChange={setNote}
          multiline
        />
      </div>

      <div className="mt-8 flex flex-col gap-2">
        <Button
          onClick={() =>
            onDone({
              ...(helpful ? { helpful } : {}),
              ...(feel ? { feel } : {}),
              ...(note.trim() ? { note: note.trim() } : {}),
            })
          }
          disabled={!helpful && !feel && !note.trim()}
        >
          Finish day
        </Button>
        <Button variant="text" onClick={() => onDone(null)}>
          Skip
        </Button>
      </div>
    </div>
  );
}
