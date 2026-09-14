import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import {
  accentStyle,
  BottomSheet,
  Button,
  IconButton,
  LinearProgress,
  SelectRow,
} from "@/components/equip/m3";
import { assessments, getAssessment } from "@/lib/assessment/instruments";
import { optionLabel, type Answers } from "@/lib/assessment/scoring";
import { readAssessmentState, useAssessmentStore } from "@/lib/assessment/store";

type Search = { id?: string };

export const Route = createFileRoute("/assessment-flow")({
  validateSearch: (search: Record<string, unknown>): Search =>
    typeof search["id"] === "string" ? { id: search["id"] } : {},
  head: () => ({
    meta: [{ title: "Assessment — iKAN" }, { name: "robots", content: "noindex" }],
  }),
  component: AssessmentFlowPage,
});

function AssessmentFlowPage() {
  const { id } = Route.useSearch();
  const a = getAssessment(id ?? "") ?? assessments[0]!;
  const navigate = useNavigate();
  const store = useAssessmentStore();

  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [resumed, setResumed] = useState(false);
  const seconds = useRef(0);
  const loaded = useRef(false);
  const advance = useRef<number | undefined>(undefined);

  // resume a partial run once storage is readable
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const draft = readAssessmentState().drafts[a.slug];
    if (draft && Object.keys(draft.answers).length > 0) {
      setAnswers(draft.answers);
      setIndex(Math.min(draft.index, a.questions.length - 1));
      seconds.current = draft.seconds;
      setResumed(true);
    }
  }, [a.slug, a.questions.length]);

  // time on task, counted only while the page is visible
  useEffect(() => {
    const t = window.setInterval(() => {
      if (document.visibilityState === "visible") seconds.current += 1;
    }, 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => () => window.clearTimeout(advance.current), []);

  const total = a.questions.length;
  const question = a.questions[index]!;
  const scale = a.scales[question.scale]!;
  const selected = answers[question.id];
  const answeredCount = Object.keys(answers).length;
  const isLast = index === total - 1;

  // multi-instrument assessments say which part a question belongs to
  const part =
    a.category === "general" ? a.scores.findIndex((s) => question.scores.includes(s.id)) : -1;
  const partLabel =
    a.category === "general"
      ? part >= 0
        ? `${a.scores[part]!.label}`
        : "One more question"
      : null;

  const finish = (final: Answers) => {
    const result = store.saveResult(a.slug, final, seconds.current);
    navigate({
      to: "/assessments/$slug/result/$id",
      params: { slug: a.slug, id: result.id },
      replace: true,
    });
  };

  const choose = (value: number) => {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    setResumed(false);
    store.saveDraft(a.slug, {
      answers: next,
      index: isLast ? index : index + 1,
      seconds: seconds.current,
    });
    window.clearTimeout(advance.current);
    if (!isLast)
      advance.current = window.setTimeout(() => setIndex((i) => Math.min(i + 1, total - 1)), 260);
  };

  const firstUnanswered = a.questions.findIndex((qq) => answers[qq.id] === undefined);
  const exit = () => navigate({ to: "/assessments/$slug", params: { slug: a.slug } });

  // keyboard: 1–6 picks an answer, ← goes back, → or Enter moves on once answered
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (leaving || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.key === "Enter" && target?.closest("button, a")) return;
      const n = Number(e.key);
      const options = a.scales[question.scale]!.options;
      if (Number.isInteger(n) && n >= 1 && n <= options.length) {
        e.preventDefault();
        choose(options[n - 1]!.value);
      } else if (e.key === "ArrowLeft" && index > 0) {
        window.clearTimeout(advance.current);
        setIndex((i) => Math.max(0, i - 1));
      } else if (
        (e.key === "ArrowRight" || e.key === "Enter") &&
        answers[question.id] !== undefined
      ) {
        e.preventDefault();
        if (!isLast) setIndex((i) => Math.min(i + 1, total - 1));
        else if (firstUnanswered === -1) finish(answers);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="min-h-dvh bg-canvas" style={accentStyle("mind")}>
      <div className="mx-auto flex min-h-dvh w-full max-w-app flex-col bg-background shadow-app">
        <header className="sticky top-0 z-30 bg-background">
          <div className="flex h-16 items-center gap-1 px-1">
            <IconButton
              label="Close"
              onClick={() => (answeredCount > 0 ? setLeaving(true) : exit())}
            >
              <X className="h-6 w-6" />
            </IconButton>
            <p className="min-w-0 flex-1 truncate px-2 font-display text-[18px] font-semibold">
              {a.name}
            </p>
            <p className="px-4 text-[14px] tabular-nums text-muted-foreground" aria-live="polite">
              {index + 1} of {total}
            </p>
          </div>
          <div className="px-4 pb-2">
            <LinearProgress value={(answeredCount / total) * 100} />
          </div>
        </header>

        <main className="flex-1 px-4 pb-36 pt-6">
          {resumed ? (
            <p className="mb-5 rounded-[12px] bg-[var(--accent-container)] px-4 py-3 text-[14px] text-[var(--on-accent-container)]">
              Picking up where you left off.
            </p>
          ) : null}

          <div key={question.id} className="animate-fade">
            {partLabel ? (
              <p className="text-[14px] font-medium text-[var(--accent-strong)]">{partLabel}</p>
            ) : null}
            {scale.prompt ? (
              <p className="mt-1 text-[15px] leading-6 text-muted-foreground">{scale.prompt}</p>
            ) : null}
            <h1 className="mt-2 font-display text-[24px] font-semibold leading-8">
              {question.text}
            </h1>

            <div
              role="radiogroup"
              aria-label={question.text}
              className="mt-6 overflow-hidden rounded-[20px] border border-foreground/10"
            >
              {scale.options.map((o, i) => (
                <div key={o.text} className={i > 0 ? "border-t border-foreground/10" : undefined}>
                  <SelectRow selected={selected === o.value} onClick={() => choose(o.value)}>
                    {optionLabel(o.text)}
                  </SelectRow>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="fixed inset-x-0 bottom-0 z-30 flex justify-center">
          <div className="flex w-full max-w-app items-center gap-3 border-t border-foreground/10 bg-background px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-3">
            <Button
              variant="outlined"
              className="w-12 px-0"
              disabled={index === 0}
              onClick={() => {
                window.clearTimeout(advance.current);
                setIndex((i) => Math.max(0, i - 1));
              }}
            >
              <ArrowLeft className="h-5 w-5" aria-label="Previous question" />
            </Button>
            {isLast ? (
              <Button
                className="flex-1"
                disabled={selected === undefined}
                onClick={() =>
                  firstUnanswered === -1 ? finish(answers) : setIndex(firstUnanswered)
                }
              >
                {firstUnanswered === -1
                  ? "See my result"
                  : `Answer question ${firstUnanswered + 1}`}
              </Button>
            ) : (
              <Button
                className="flex-1"
                disabled={selected === undefined}
                onClick={() => {
                  window.clearTimeout(advance.current);
                  setIndex((i) => Math.min(i + 1, total - 1));
                }}
              >
                Next
              </Button>
            )}
          </div>
        </footer>

        <BottomSheet
          open={leaving}
          onClose={() => setLeaving(false)}
          title="Leave this assessment?"
        >
          <p className="text-[15px] leading-6 text-muted-foreground">
            Your {answeredCount} {answeredCount === 1 ? "answer is" : "answers are"} saved. You can
            finish this assessment later.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={() => setLeaving(false)}>Keep going</Button>
            <Button variant="text" onClick={exit}>
              Leave for now
            </Button>
          </div>
        </BottomSheet>
      </div>
    </div>
  );
}
