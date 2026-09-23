import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  Play,
  RotateCcw,
  Activity,
  ArrowLeft,
  Brain,
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  FileBarChart,
  Gauge,
  History,
  LifeBuoy,
  Lightbulb,
  ListChecks,
  MousePointerClick,
  ShieldCheck,
  Smile,
  Target,
  TrendingUp,
} from "lucide-react";
import { useHydrated } from "@/hooks/use-hydrated";
import { IkanShell } from "@/components/ikan-shell";
import { Illustration } from "@/components/art";
import { accentStyle, Button, IconButton, stateLayer } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { bannerArt, categoryIcon } from "@/components/assessment/ui";
import { cn } from "@/lib/utils";
import { getAssessment, profiles, type Assessment } from "@/lib/assessment/instruments";
import type { Art } from "@/lib/resources";
import { formatValue, optionLabel } from "@/lib/assessment/scoring";
import { useAssessmentStore } from "@/lib/assessment/store";
import {
  Bento,
  BeforeYouStart,
  Group,
  ImportantNote,
  SubHead,
  useBeforeStart,
} from "@/components/about";
import { assessmentAbout, dedupe } from "@/lib/content/about";

export const Route = createFileRoute("/assessments/$slug/")({
  loader: ({ params }) => {
    const a = getAssessment(params.slug);
    if (!a) throw notFound();
    return { slug: a.slug };
  },
  head: ({ loaderData }) => {
    const a = loaderData ? getAssessment(loaderData.slug) : undefined;
    return a
      ? pageMeta(
          a.title,
          `${a.questions.length} questions, about ${a.minutes} minutes. ${a.instrument}.`,
        )
      : { meta: [{ title: "Assessment — iKAN" }] };
  },
  notFoundComponent: () => (
    <IkanShell>
      <div className="grid min-h-[70vh] place-items-center px-8 text-center">
        <div>
          <h1 className="font-display text-xl font-semibold">We couldn’t find that assessment</h1>
          <Link
            to="/assessments"
            className="mt-5 inline-flex h-12 items-center rounded-full bg-foreground px-6 font-semibold text-background"
          >
            See all assessments
          </Link>
        </div>
      </div>
    </IkanShell>
  ),
  component: AssessmentDetailPage,
});

const measureIcons = [Target, Activity, Gauge, Brain];
const afterIcons = [FileBarChart, Lightbulb, TrendingUp, Compass];
const stepIcon = (t: string) =>
  /minute/i.test(t)
    ? Clock3
    : /week|month|recent|period|past/i.test(t)
      ? CalendarRange
      : /right or wrong|correct/i.test(t)
        ? Smile
        : /choose|option|select/i.test(t)
          ? MousePointerClick
          : CheckCircle2;

function AssessmentDetailPage() {
  const { slug } = Route.useLoaderData();
  const a = getAssessment(slug)!;
  const navigate = useNavigate();
  const store = useAssessmentStore();
  const draft = store.draftFor(slug);
  const past = store.resultsFor(slug);
  const Icon = categoryIcon[a.category];
  const scaleKeys = [...new Set(a.questions.map((q) => q.scale))];
  const answered = draft ? Object.keys(draft.answers).length : 0;
  const about = assessmentAbout(slug, a.minutes);
  const begin = () => navigate({ to: "/assessment-flow", search: { id: slug } });
  const before = useBeforeStart(`assessment.${slug}`, begin);
  const steps = dedupe(about?.how?.bullets ?? []);
  const hydrated = useHydrated();

  return (
    <IkanShell>
      <div style={accentStyle("mind")}>
        <header className="relative h-56 overflow-hidden">
          <Illustration art={bannerArt[a.category]} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-background" />
          <div className="absolute inset-x-0 top-0 p-2">
            <IconButton
              label="Back"
              onClick={() => navigate({ to: "/assessments" })}
              className="bg-background/80 backdrop-blur"
            >
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          </div>
        </header>

        <section className="relative -mt-10 px-4">
          <span className="grid h-14 w-14 place-items-center rounded-[18px] border-4 border-background bg-[var(--accent-container)] text-[var(--on-accent-container)]">
            <Icon className="h-7 w-7" />
          </span>
          <p className="mt-5 text-[14px] font-medium text-[var(--accent-strong)]">{a.name}</p>
          <h1 className="mt-1 font-display text-[28px] font-semibold leading-9">{a.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex h-8 items-center gap-2 rounded-[8px] border border-foreground/20 px-3 text-[14px]">
              <ListChecks className="h-4 w-4" /> {a.questions.length} questions
            </span>
            <span className="inline-flex h-8 items-center gap-2 rounded-[8px] border border-foreground/20 px-3 text-[14px]">
              <Clock3 className="h-4 w-4" /> About {a.minutes} min
            </span>
            {hydrated && past.length ? (
              <Link
                to="/history/assessments/$slug"
                params={{ slug }}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-full bg-[var(--accent-container)] pl-3 pr-2 text-[14px] font-semibold text-[var(--on-accent-container)]",
                  stateLayer,
                )}
              >
                <History className="h-4 w-4" /> {past.length} past{" "}
                {past.length === 1 ? "result" : "results"}
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </section>

        <Group title="About this assessment">
          {about?.what?.paragraphs.map((t, i) => (
            <p key={i} className={cn("text-[15px] leading-6 text-foreground/85", i > 0 && "mt-2")}>
              {t}
            </p>
          ))}
          {about?.looksAt.length ? (
            <>
              <SubHead>What it measures</SubHead>
              <Bento
                items={about.looksAt.map((text, i) => ({ icon: measureIcons[i % 4]!, text }))}
              />
            </>
          ) : null}
          <SubHead>How it’s scored</SubHead>
          <ul className="overflow-hidden rounded-[16px] bg-secondary">
            {a.scores.map((sc, i) => {
              const pr = profiles[sc.profile]!;
              return (
                <li
                  key={sc.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3",
                    i > 0 && "border-t border-background",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium leading-6">{sc.label}</span>
                    <span className="block text-[13px] text-muted-foreground">
                      {sc.instrument}, {formatValue(pr, pr.min)} to {pr.max}
                      {pr.direction === "better" ? ", higher is better" : ""}
                    </span>
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    {pr.bands.length} levels
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-[13px] text-muted-foreground">{a.instrument}</p>
        </Group>

        <Group title="How it works">
          <Bento items={steps.map((text) => ({ icon: stepIcon(text), text }))} offset={1} />
          <details className="group mt-4 rounded-[16px] border border-foreground/10 px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
              See the answer options
              <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
            </summary>
            <div className="mt-3 space-y-3">
              {scaleKeys.map((k) => (
                <div key={k} className="flex flex-wrap gap-2">
                  {a.scales[k]!.options.map((o) => (
                    <span
                      key={o.text}
                      className="rounded-[8px] bg-secondary px-3 py-1.5 text-[13px]"
                    >
                      {optionLabel(o.text)}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </details>
        </Group>

        {about?.youllSee ? (
          <Group title="After you finish">
            <Bento
              items={about.youllSee.bullets.map((text, i) => ({ icon: afterIcons[i % 4]!, text }))}
              offset={2}
            />
            {about.youllSee.paragraphs
              .filter((t) => !/:$/.test(t))
              .map((t) => (
                <p key={t} className="mt-3 text-[15px] font-medium">
                  {t}
                </p>
              ))}
          </Group>
        ) : null}

        {about ? <ImportantNote text={about.importantShort} /> : null}

        <div className="sticky bottom-[88px] z-20 mt-6 bg-gradient-to-t from-background via-background to-transparent px-4 pb-3 pt-6">
          <Button
            className="w-full"
            icon={
              draft ? (
                <Play className="h-5 w-5" />
              ) : past.length ? (
                <RotateCcw className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )
            }
            onClick={draft ? begin : before.request}
          >
            {draft
              ? `Continue, ${answered} of ${a.questions.length} answered`
              : past.length
                ? "Take it again"
                : "Start assessment"}
          </Button>
        </div>
        <BeforeYouStart
          open={before.open}
          onClose={before.close}
          onConfirm={before.confirm}
          items={[
            { icon: ListChecks, text: `${a.questions.length} questions, about ${a.minutes} min` },
            { icon: Clock3, text: steps[0] ?? "Answer based on how you’ve felt recently" },
            { icon: ShieldCheck, text: "A self-help check, not a diagnosis" },
            { icon: LifeBuoy, text: "Not for emergencies. Get support if you feel unsafe" },
          ]}
          cta="Start assessment"
        />
      </div>
    </IkanShell>
  );
}
