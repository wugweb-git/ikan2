import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Clock3, ListChecks } from "lucide-react";
import { Illustration } from "@/components/art";
import { accentStyle, Button, IconButton, LinearProgress, SelectRow } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { categoryIcon } from "@/components/assessment/ui";
import { getAssessment } from "@/lib/assessment/instruments";
import { displayName, useAuth } from "@/lib/auth";
import { useOnboarding } from "@/lib/profile";
import type { Art } from "@/lib/resources";

export const Route = createFileRoute("/welcome")({
  head: () =>
    pageMeta("Welcome to iKAN", "Tell us what brings you here and we’ll suggest where to start."),
  component: WelcomePage,
});

const reasons: { id: string; label: string; slug: string; art: Art }[] = [
  {
    id: "stress",
    label: "I feel stressed or worried",
    slug: "feeling-worried-and-stressed",
    art: "stress",
  },
  {
    id: "anxiety",
    label: "I feel anxious or overwhelmed",
    slug: "feeling-overwhelmed-and-anxious",
    art: "anxiety",
  },
  {
    id: "low",
    label: "I’ve been feeling low",
    slug: "feeling-depressed-and-hopeless",
    art: "mood",
  },
  {
    id: "sleep",
    label: "I’m not sleeping well",
    slug: "struggling-with-quality-sleep",
    art: "sleep",
  },
  {
    id: "work",
    label: "Work is taking over my life",
    slug: "struggling-to-balance-life",
    art: "work",
  },
  {
    id: "burnout",
    label: "I feel drained or burned out",
    slug: "feeling-drained-and-burned-out",
    art: "burnout",
  },
  {
    id: "unsure",
    label: "I’m not sure, I want to check in",
    slug: "unsure-or-general-concern",
    art: "checkup",
  },
];

function WelcomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { finish } = useOnboarding();
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const reason = reasons.find((r) => r.id === choice);
  const assessment = reason ? getAssessment(reason.slug) : undefined;
  const name = displayName(user).split(" ")[0];

  return (
    <div className="min-h-dvh bg-canvas" style={accentStyle("calm")}>
      <div className="mx-auto flex min-h-dvh w-full max-w-app flex-col bg-background shadow-app">
        <header className="flex h-16 items-center gap-1 px-1">
          {step > 0 ? (
            <IconButton label="Back" onClick={() => setStep(0)}>
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          ) : (
            <span className="w-12" />
          )}
          <div className="flex-1 px-2">
            <LinearProgress value={step === 0 ? 50 : 100} />
          </div>
          <button
            type="button"
            onClick={() => {
              finish(choice ?? "");
              navigate({ to: "/", replace: true });
            }}
            className="h-12 px-4 text-[15px] font-semibold text-muted-foreground"
          >
            Skip
          </button>
        </header>

        {step === 0 ? (
          <main className="flex flex-1 flex-col px-4 pb-8">
            <p className="text-[14px] font-medium text-[var(--accent-strong)]">Step 1 of 2</p>
            <h1 className="mt-1 font-display text-[28px] font-semibold leading-9">
              {name ? `Hi ${name}, what brings you here?` : "What brings you here?"}
            </h1>
            <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
              Pick the one that fits best. You can explore everything later.
            </p>
            <div
              role="radiogroup"
              aria-label="What brings you here"
              className="mt-6 overflow-hidden rounded-[20px] border border-foreground/10"
            >
              {reasons.map((r, i) => (
                <div key={r.id} className={i > 0 ? "border-t border-foreground/10" : undefined}>
                  <SelectRow selected={choice === r.id} onClick={() => setChoice(r.id)}>
                    {r.label}
                  </SelectRow>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-6">
              <Button className="w-full" disabled={!choice} onClick={() => setStep(1)}>
                Continue
              </Button>
            </div>
          </main>
        ) : assessment && reason ? (
          <main className="flex flex-1 flex-col px-4 pb-8">
            <p className="text-[14px] font-medium text-[var(--accent-strong)]">Step 2 of 2</p>
            <h1 className="mt-1 font-display text-[28px] font-semibold leading-9">
              Start with a short check
            </h1>
            <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
              It shows where you are today and which program fits. It’s a screening, not a
              diagnosis.
            </p>
            <div className="mt-6 overflow-hidden rounded-[28px] bg-secondary">
              <div className="h-40">
                <Illustration art={reason.art} />
              </div>
              <div className="p-5">
                <p className="flex items-center gap-2 text-[14px] font-medium text-[var(--accent-strong)]">
                  {(() => {
                    const Icon = categoryIcon[assessment.category];
                    return <Icon className="h-4 w-4" />;
                  })()}
                  {assessment.name}
                </p>
                <p className="mt-1 font-display text-[22px] font-semibold leading-7">
                  {assessment.title}
                </p>
                <p className="mt-3 flex gap-4 text-[14px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <ListChecks className="h-4 w-4" /> {assessment.questions.length} questions
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4" /> {assessment.minutes} min
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-auto space-y-2 pt-6">
              <Button
                className="w-full"
                onClick={() => {
                  finish(reason.id);
                  navigate({
                    to: "/assessment-flow",
                    search: { id: assessment.slug },
                    replace: true,
                  });
                }}
              >
                Start assessment
              </Button>
              <Button
                variant="text"
                className="w-full"
                onClick={() => {
                  finish(reason.id);
                  navigate({ to: "/", replace: true });
                }}
              >
                Go to home first
              </Button>
            </div>
          </main>
        ) : null}
      </div>
    </div>
  );
}
