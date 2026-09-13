import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { Button } from "@/components/ui/button";
import { Chip, inputClass } from "@/components/equip/fields";
import { ProgramHeader, pageMeta } from "@/components/equip/program-header";
import { intakeQuestions } from "@/lib/equip/program";
import { useEquipProgress } from "@/lib/equip/store";

export const Route = createFileRoute("/program/sleep-tight/start")({
  head: () =>
    pageMeta("Before we begin · Sleep Tight", "A few questions so the programme fits you."),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const { state, start } = useEquipProgress();
  const [answers, setAnswers] = useState<Record<string, string>>(() => ({ ...state.intake }));
  const set = (key: string, value: string) => setAnswers((prev) => ({ ...prev, [key]: value }));

  const required = intakeQuestions.filter((q) => !("prefilled" in q));
  const ready = required.every((q) => Boolean(answers[q.key]));

  return (
    <IkanShell>
      <ProgramHeader back="/program/sleep-tight" eyebrow="Sleep Tight" title="Before we begin" />

      <form
        className="space-y-4 px-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!ready) return;
          start(answers);
          navigate({ to: "/program/sleep-tight/units" });
        }}
      >
        {intakeQuestions.map((q) => {
          if ("prefilled" in q) {
            return (
              <div key={q.key} className="surface p-4">
                <p className="text-sm font-semibold leading-6">{q.label}</p>
                <div className="mt-2 flex items-center gap-2 rounded-xl bg-secondary px-3.5 py-3 text-sm">
                  <span className="flex-1">{q.prefilled}</span>
                  <Lock
                    className="h-3.5 w-3.5 text-muted-foreground"
                    aria-label="From your account"
                  />
                </div>
              </div>
            );
          }
          return (
            <fieldset key={q.key} className="surface p-4">
              <legend className="sr-only">{q.label}</legend>
              <p className="text-sm font-semibold leading-6" aria-hidden="true">
                {q.label}
              </p>
              {"type" in q && q.type === "date" ? (
                <input
                  type="date"
                  aria-label={q.label}
                  value={answers[q.key] ?? ""}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => set(q.key, e.target.value)}
                  className={`${inputClass} mt-3`}
                />
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {"options" in q &&
                    q.options?.map((option) => (
                      <Chip
                        key={option}
                        active={answers[q.key] === option}
                        onClick={() => set(q.key, option)}
                      >
                        {option}
                      </Chip>
                    ))}
                </div>
              )}
              {"followUp" in q && q.followUp && answers[q.key] === q.followUp.on ? (
                <label className="mt-3 block animate-fade-in">
                  <span className="mb-1.5 block text-xs font-semibold">{q.followUp.label}</span>
                  <textarea
                    value={answers[`${q.key}_detail`] ?? ""}
                    onChange={(e) => set(`${q.key}_detail`, e.target.value)}
                    className={`${inputClass} min-h-20 resize-none`}
                  />
                </label>
              ) : null}
            </fieldset>
          );
        })}

        <p className="px-1 text-[11px] leading-5 text-muted-foreground">
          Your answers stay on this device for now. You can choose &ldquo;I&rsquo;d prefer not to
          answer&rdquo; wherever it appears.
        </p>

        <Button type="submit" className="h-13 w-full text-base" disabled={!ready}>
          Begin Sleep Tight <ArrowRight />
        </Button>
      </form>
    </IkanShell>
  );
}
