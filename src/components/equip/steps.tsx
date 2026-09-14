import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, BookOpen, Check, CircleCheckBig, PencilLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration, formatTime, nightMetrics, type DiaryEntry } from "@/lib/equip/metrics";
import { visibleBody, type NBlock } from "@/lib/equip/notion";
import { useProgramme } from "@/lib/equip/store";
import type { Step, UI } from "@/lib/equip/types";
import { Button, IconButton, Pager, Segmented, SelectRow, TextField, stateLayer } from "./m3";
import { EntriesStep, ReviewStep, TrackerStep } from "./cards";

export type StepCtx = {
  slug: string;
  day: number;
  isLast: boolean;
  onNext: () => void;
  onBack: (() => void) | undefined;
  /** replaces "Next" / "Finish day N", e.g. on tool pages */
  finishLabel?: string;
};

export const answerKey = (b: NBlock, day: number) => b.key ?? `${day}.${b.n}`;

/* ------------------------------ shared chrome ------------------------------ */

export function Footer({
  onBack,
  onNext,
  label,
  disabled,
}: {
  onBack: (() => void) | undefined;
  onNext: () => void;
  label: string;
  disabled?: boolean | undefined;
}) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 flex justify-center">
      <div className="flex w-full max-w-app items-center gap-3 border-t border-foreground/[0.08] bg-background px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
        {onBack ? (
          <IconButton label="Back" onClick={onBack} className="h-14 w-14 bg-secondary">
            <ArrowLeft className="h-6 w-6" />
          </IconButton>
        ) : null}
        <Button onClick={onNext} disabled={disabled} className="h-14 flex-1 text-[16px]">
          {label}
        </Button>
      </div>
    </footer>
  );
}

const nextLabel = (ctx: StepCtx) =>
  ctx.finishLabel ?? (ctx.isLast ? `Finish day ${ctx.day}` : "Next");

/** Block title (Notion) and its body text. With no prompt, the title is the headline. */
function BlockText({
  block,
  headline,
  skip,
  icon,
}: {
  block: NBlock;
  headline?: string | undefined;
  skip?: string;
  icon?: ReactNode;
}) {
  const body = visibleBody(block).filter((i) => i.text !== skip);
  const ordered = body.every((i) => i.kind === "ol");
  return (
    <div>
      <div className={cn("flex gap-3", headline ? "items-center" : "flex-col items-start")}>
        {icon ? (
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)] [&_svg]:h-5 [&_svg]:w-5"
          >
            {icon}
          </span>
        ) : null}
        {headline ? (
          <p className="text-[14px] font-semibold leading-5 text-[var(--accent-strong)]">
            {block.title}
          </p>
        ) : (
          <h2 className="font-display text-[26px] font-semibold leading-8 tracking-[-0.01em] text-balance">
            {block.title}
          </h2>
        )}
      </div>
      {body.length ? (
        <div className="mt-4 space-y-4 text-[17px] leading-[1.6] text-foreground/90">
          {body.map((item, i) =>
            item.kind === "p" ? (
              <p key={i} className="whitespace-pre-line">
                {item.text}
              </p>
            ) : (
              <p key={i} className="flex gap-3 pl-1">
                <span className="w-5 shrink-0 text-muted-foreground">
                  {item.kind === "ol" || ordered
                    ? `${body.slice(0, i + 1).filter((x) => x.kind !== "p").length}.`
                    : "•"}
                </span>
                <span>{item.text}</span>
              </p>
            ),
          )}
        </div>
      ) : null}
      {headline ? (
        <h2 className="mt-4 font-display text-[26px] font-semibold leading-8 tracking-[-0.01em] text-balance">
          {headline}
        </h2>
      ) : null}
    </div>
  );
}

/* --------------------------------- steps --------------------------------- */

function LessonStep({
  step,
  view,
  ctx,
}: {
  step: Step;
  view: Extract<UI, { ui: "lesson" }>;
  ctx: StepCtx;
}) {
  // Notion writes some lists inline: "No idea is wrong • Don't critique while writing • …"
  const bullets = Boolean(step.block.body[0]?.text.includes(" • "));
  return (
    <>
      {bullets ? (
        <div>
          <h2 className="font-display text-[26px] font-semibold leading-8">{step.block.title}</h2>
          <ul className="mt-4 divide-y divide-foreground/[0.08] rounded-[16px] bg-secondary">
            {step.block.body[0]!.text.split(" • ").map((item) => (
              <li key={item} className="px-4 py-3.5 text-[16px]">
                {item}
              </li>
            ))}
          </ul>
          {step.block.body.slice(1).map((p) => (
            <p key={p.text} className="mt-4 text-[16px]">
              {p.text}
            </p>
          ))}
        </div>
      ) : (
        <BlockText block={step.block} icon={<BookOpen />} />
      )}
      {view.cards ? (
        <div className="no-scrollbar -mx-4 mt-6 flex snap-x items-start gap-3 overflow-x-auto px-4">
          {view.cards.map((c) => (
            <section
              key={c.title}
              className={cn(
                view.cards!.length > 1 ? "w-[85%]" : "w-full",
                "shrink-0 snap-start rounded-[16px] bg-[var(--accent-container)] p-5 text-[var(--on-accent-container)]",
              )}
            >
              <p className="font-display text-[17px] font-semibold">{c.title}</p>
              {c.text?.filter(Boolean).map((t) => (
                <p key={t} className="mt-2 text-[15px] leading-6">
                  {t}
                </p>
              ))}
              <ul className="mt-3 space-y-2 text-[15px] leading-6">
                {c.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden="true">•</span>
                    {i}
                  </li>
                ))}
              </ul>
              {c.footer ? <p className="mt-3 text-[15px] leading-6">{c.footer}</p> : null}
            </section>
          ))}
        </div>
      ) : null}
      <Footer onBack={ctx.onBack} onNext={ctx.onNext} label={nextLabel(ctx)} />
    </>
  );
}

function ChoiceStep({
  step,
  view,
  ctx,
}: {
  step: Step;
  view: Extract<UI, { ui: "choice" }>;
  ctx: StepCtx;
}) {
  const { state, setAnswer } = useProgramme(ctx.slug);
  const key = answerKey(step.block, ctx.day);
  const raw = state.answers[key];
  const picked = Array.isArray(raw) ? raw : typeof raw === "string" ? [raw] : [];
  const otherKey = `${key}#other`;
  const otherText =
    typeof state.answers[otherKey] === "string" ? (state.answers[otherKey] as string) : "";

  const toggle = (label: string) => {
    if (!view.multi) return setAnswer(key, label);
    setAnswer(key, picked.includes(label) ? picked.filter((p) => p !== label) : [...picked, label]);
  };

  return (
    <>
      <BlockText
        block={step.block}
        headline={view.prompt === step.block.title ? undefined : view.prompt}
        skip={view.prompt}
        icon={<CircleCheckBig />}
      />
      {view.table ? <DataTable rows={view.table} /> : null}
      {view.cards ? (
        // Notion "UI hints: cards"
        <div
          role={view.multi ? "group" : "radiogroup"}
          aria-label={view.prompt}
          className="mt-6 grid grid-cols-2 gap-3"
        >
          {view.options.map((o) => {
            const on = picked.includes(o.label);
            return (
              <button
                key={o.label}
                type="button"
                role={view.multi ? "checkbox" : "radio"}
                aria-checked={on}
                onClick={() => toggle(o.label)}
                className={cn(
                  "flex min-h-[88px] flex-col justify-between rounded-[16px] border p-4 text-left text-[16px] font-medium transition-colors",
                  stateLayer,
                  on
                    ? "border-transparent bg-[var(--accent-container)] text-[var(--on-accent-container)]"
                    : "border-foreground/15",
                )}
              >
                <span
                  className={cn(
                    "grid h-6 w-6 place-items-center rounded-full",
                    on ? "bg-foreground text-background" : "border-2 border-foreground/40",
                  )}
                >
                  {on ? <Check className="h-4 w-4" strokeWidth={3} /> : null}
                </span>
                {o.label}
              </button>
            );
          })}
        </div>
      ) : (
        <div
          role={view.multi ? "group" : "radiogroup"}
          aria-label={view.prompt}
          className="-mx-4 mt-5"
        >
          {view.options.map((o) => (
            <SelectRow
              key={o.label}
              multi={view.multi}
              selected={picked.includes(o.label)}
              glyph={o.glyph}
              onClick={() => toggle(o.label)}
            >
              {o.label}
            </SelectRow>
          ))}
        </div>
      )}
      {view.otherOption && picked.includes(view.otherOption) ? (
        <div className="mt-3">
          <TextField
            label={view.otherOption}
            value={otherText}
            onChange={(v) => setAnswer(otherKey, v)}
            autoFocus
          />
        </div>
      ) : null}
      <Footer
        onBack={ctx.onBack}
        onNext={ctx.onNext}
        label={nextLabel(ctx)}
        disabled={picked.length === 0}
      />
    </>
  );
}

function DataTable({ rows }: { rows: string[][] }) {
  const [head, ...body] = rows;
  return (
    <div className="mt-5 overflow-hidden rounded-[12px] border border-foreground/15">
      <table className="w-full text-left text-[15px]">
        <thead className="bg-secondary">
          <tr>
            {head?.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r) => (
            <tr key={r.join()} className="border-t border-foreground/10">
              {r.map((c, i) => (
                <td key={i} className="px-4 py-3 align-top">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScaleStep({
  step,
  view,
  ctx,
}: {
  step: Step;
  view: Extract<UI, { ui: "scale" }>;
  ctx: StepCtx;
}) {
  const { state, setAnswer } = useProgramme(ctx.slug);
  const key = answerKey(step.block, ctx.day);
  const value = typeof state.answers[key] === "number" ? (state.answers[key] as number) : undefined;
  const ticks = Array.from({ length: view.max - view.min + 1 }, (_, i) => view.min + i);
  const pct = value === undefined ? 0 : ((value - view.min) / (view.max - view.min)) * 100;

  return (
    <>
      <BlockText block={step.block} headline={view.prompt} />
      <p className="mt-10 text-center font-display text-[57px] font-semibold leading-none tabular-nums">
        {value ?? "–"}
      </p>
      <div className="relative mt-10 px-2">
        <div className="relative h-4">
          <div className="absolute inset-y-0 left-0 right-0 my-auto h-4 rounded-full bg-[var(--accent-container)]" />
          <div
            className="absolute inset-y-0 left-0 my-auto h-4 rounded-full bg-[var(--accent)]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={view.min}
          max={view.max}
          step={1}
          value={value ?? view.min}
          aria-label={view.prompt}
          onChange={(e) => setAnswer(key, Number(e.target.value))}
          onClick={(e) => setAnswer(key, Number((e.target as HTMLInputElement).value))}
          className="m3-slider absolute inset-x-2 top-[-12px] h-10 w-[calc(100%-1rem)] cursor-pointer appearance-none bg-transparent"
        />
        <div className="mt-3 flex justify-between text-[13px] tabular-nums text-muted-foreground">
          {ticks.map((t) => (
            <span
              key={t}
              className={cn("w-6 text-center", value === t && "font-semibold text-foreground")}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <Footer
        onBack={ctx.onBack}
        onNext={ctx.onNext}
        label={nextLabel(ctx)}
        disabled={value === undefined}
      />
    </>
  );
}

function TextStep({
  step,
  view,
  ctx,
}: {
  step: Step;
  view: Extract<UI, { ui: "text" }>;
  ctx: StepCtx;
}) {
  const { state, setAnswer } = useProgramme(ctx.slug);
  const key = answerKey(step.block, ctx.day);
  const value = typeof state.answers[key] === "string" ? (state.answers[key] as string) : "";
  const dep = view.dependsOn ? state.answers[view.dependsOn.key] : undefined;
  const hidden = view.dependsOn && dep !== view.dependsOn.equals;

  // Notion rule "dependsOn": skip the question when it doesn't apply.
  useEffect(() => {
    if (hidden) ctx.onNext();
  }, [hidden]); // eslint-disable-line react-hooks/exhaustive-deps

  if (hidden) return null;
  return (
    <>
      <BlockText block={step.block} headline={view.prompt || undefined} icon={<PencilLine />} />
      <div className="mt-6">
        <TextField
          label=""
          ariaLabel={view.prompt || step.block.title}
          placeholder="Write here"
          value={value}
          onChange={(v) => setAnswer(key, v)}
          multiline
        />
      </div>
      <Footer onBack={ctx.onBack} onNext={ctx.onNext} label={nextLabel(ctx)} />
    </>
  );
}

function ConcludeStep({
  step,
  view,
  ctx,
}: {
  step: Step;
  view: Extract<UI, { ui: "conclude" }>;
  ctx: StepCtx;
}) {
  const { state, setAnswer } = useProgramme(ctx.slug);
  const key = `${answerKey(step.block, ctx.day)}@${ctx.day}`;
  const value = typeof state.answers[key] === "string" ? (state.answers[key] as string) : "";
  const [full, setFull] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setFull(true), 100);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center pt-4 text-center">
        <span
          className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-[var(--accent)]"
          aria-hidden="true"
        >
          <span
            className="absolute inset-0 rounded-full bg-background transition-transform duration-[1400ms] ease-[cubic-bezier(.05,.7,.1,1)] motion-reduce:transition-none"
            style={{ transform: full ? "translateX(105%)" : "translateX(30%)" }}
          />
          <Check
            className="relative h-10 w-10 text-background transition-opacity delay-500 duration-500"
            style={{ opacity: full ? 1 : 0 }}
            strokeWidth={2.5}
          />
        </span>
        <p className="mt-6 text-[14px] font-semibold text-[var(--accent-strong)]">
          {step.block.title}
        </p>
        <div className="mt-2 space-y-2">
          {visibleBody(step.block).map((b) => (
            <p
              key={b.text}
              className="font-display text-[22px] font-semibold leading-8 text-balance"
            >
              {b.text}
            </p>
          ))}
        </div>
      </div>
      {view.prompt ? (
        <div className="mt-8">
          <p className="mb-2 text-[16px] font-semibold">{view.prompt}</p>
          <TextField
            label=""
            ariaLabel={view.prompt}
            value={value}
            onChange={(v) => setAnswer(key, v)}
            multiline
          />
        </div>
      ) : null}
      <Footer onBack={ctx.onBack} onNext={ctx.onNext} label={nextLabel(ctx)} />
    </>
  );
}

/* ------------------------------ matrix sort ------------------------------ */

/** Notion comparison-matrix blocks, "showing 2 at a time on 1 card". */
function SortStep({
  step,
  view,
  ctx,
}: {
  step: Step;
  view: Extract<UI, { ui: "sort" }>;
  ctx: StepCtx;
}) {
  const { state, setAnswer } = useProgramme(ctx.slug);
  const pages: (typeof view.items)[] = [];
  for (let i = 0; i < view.items.length; i += view.perCard)
    pages.push(view.items.slice(i, i + view.perCard));
  const [page, setPage] = useState(0);
  const keyOf = (situation: string, line: string) =>
    `${answerKey(step.block, ctx.day)}:${situation}:${line}`;
  const pageDone = (p: typeof view.items) =>
    p.every((it) =>
      it.lines.every((l) => typeof state.answers[keyOf(it.situation, l)] === "string"),
    );

  return (
    <>
      <p className="text-[14px] font-semibold text-[var(--accent-strong)]">{step.block.title}</p>
      <div className="mt-4">
        <Pager
          index={page}
          onIndex={setPage}
          pages={pages.map((p, pi) => (
            <div key={pi} className="space-y-3">
              {p.map((it, ii) => (
                <section key={ii} className="rounded-[16px] bg-secondary p-4">
                  {it.situation ? (
                    <p className="font-display text-[18px] font-semibold leading-6">
                      {it.situation}
                    </p>
                  ) : null}
                  <div className="mt-3 space-y-4">
                    {it.lines.map((line) => (
                      <div key={line}>
                        <p className="text-[15px] leading-6">{line}</p>
                        <div className="mt-2">
                          <Segmented
                            label={line}
                            options={it.labels}
                            value={state.answers[keyOf(it.situation, line)] as string | undefined}
                            onChange={(v) => setAnswer(keyOf(it.situation, line), v)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ))}
        />
      </div>
      <Footer
        onBack={page > 0 ? () => setPage(page - 1) : ctx.onBack}
        onNext={() => (page + 1 < pages.length ? setPage(page + 1) : ctx.onNext())}
        label={page + 1 < pages.length ? "Next card" : nextLabel(ctx)}
        disabled={!pageDone(pages[page] ?? [])}
      />
    </>
  );
}

/* ------------------------------ statements ------------------------------ */

function StatementsStep({
  step,
  view,
  ctx,
}: {
  step: Step;
  view: Extract<UI, { ui: "statements" }>;
  ctx: StepCtx;
}) {
  const { state, setAnswer } = useProgramme(ctx.slug);
  const [page, setPage] = useState(0);
  const keyOf = (s: string) => `${answerKey(step.block, ctx.day)}:${s}`;
  const current = view.statements[page];

  return (
    <>
      <BlockText block={step.block} headline={view.prompt} />
      <div className="mt-6">
        <Pager
          index={page}
          onIndex={setPage}
          pages={view.statements.map((s) => (
            <section
              key={s}
              className="flex min-h-48 flex-col justify-between rounded-[16px] bg-[var(--accent-container)] p-5 text-[var(--on-accent-container)]"
            >
              <p className="font-display text-[20px] font-semibold leading-7">{s}</p>
              <div className="mt-6">
                <Segmented
                  label={s}
                  options={view.options}
                  value={state.answers[keyOf(s)] as string | undefined}
                  onChange={(v) => setAnswer(keyOf(s), v)}
                />
              </div>
            </section>
          ))}
        />
      </div>
      <Footer
        onBack={page > 0 ? () => setPage(page - 1) : ctx.onBack}
        onNext={() => (page + 1 < view.statements.length ? setPage(page + 1) : ctx.onNext())}
        label={page + 1 < view.statements.length ? "Next" : nextLabel(ctx)}
        disabled={!current || typeof state.answers[keyOf(current)] !== "string"}
      />
    </>
  );
}

/* --------------------------------- diary --------------------------------- */

type DiaryQ = { key: keyof DiaryEntry; kind: "time" | "minutes" | "count" | "rating" };

/** Order and input type for the Notion Day 1 diary rows. */
const diaryKinds: DiaryQ[] = [
  { key: "bed", kind: "time" },
  { key: "tried", kind: "time" },
  { key: "latency", kind: "minutes" },
  { key: "wakings", kind: "count" },
  { key: "awake", kind: "minutes" },
  { key: "woke", kind: "time" },
  { key: "up", kind: "time" },
  { key: "quality", kind: "rating" },
];

function DiaryStep({ ctx, rows }: { ctx: StepCtx; rows: string[] }) {
  const { state, saveDiary } = useProgramme(ctx.slug);
  const saved = state.diary[String(ctx.day)];
  const previous = Object.entries(state.diary)
    .filter(([d]) => Number(d) < ctx.day)
    .sort((a, b) => Number(b[0]) - Number(a[0]))[0]?.[1];
  const [entry, setEntry] = useState<DiaryEntry>(() => saved ?? {});
  const [q, setQ] = useState(0);
  const questions = diaryKinds.map((k, i) => ({
    ...k,
    label: (rows[i] ?? "").replace(/:\s*\[.*$/, "").trim(),
  }));
  const question = questions[q];

  const set = (patch: DiaryEntry) => {
    const next = { ...entry, ...patch };
    setEntry(next);
    saveDiary(ctx.day, next);
  };

  if (!question) {
    const m = nightMetrics(entry);
    return (
      <>
        <p className="text-[14px] font-semibold text-[var(--accent-strong)]">Sleep Diary</p>
        {m ? (
          <div className="mt-4 rounded-[16px] bg-[var(--accent-container)] p-5 text-[var(--on-accent-container)]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[13px]">Asleep</p>
                <p className="font-display text-[32px] font-semibold leading-10 tabular-nums">
                  {formatDuration(m.asleep)}
                </p>
              </div>
              <div>
                <p className="text-[13px]">In bed</p>
                <p className="font-display text-[32px] font-semibold leading-10 tabular-nums">
                  {formatDuration(m.inBed)}
                </p>
              </div>
            </div>
            <p className="mt-3 text-[14px]">
              Sleep efficiency <span className="font-semibold tabular-nums">{m.efficiency}%</span>
            </p>
          </div>
        ) : null}
        <ul className="-mx-4 mt-4">
          {questions.map((qq, i) => (
            <li key={qq.key}>
              <button
                type="button"
                onClick={() => setQ(i)}
                className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-2 text-left"
              >
                <span className="text-[15px] text-muted-foreground">{qq.label}</span>
                <span className="shrink-0 text-[15px] font-semibold tabular-nums">
                  {answerText(qq, entry)}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Footer
          onBack={() => setQ(questions.length - 1)}
          onNext={ctx.onNext}
          label={ctx.isLast ? `Finish day ${ctx.day}` : "Save diary"}
        />
      </>
    );
  }

  const answered =
    question.kind === "time"
      ? Boolean(entry[question.key])
      : question.kind === "rating"
        ? entry.quality !== undefined
        : true;

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-semibold text-[var(--accent-strong)]">Sleep Diary</p>
        <p className="text-[13px] tabular-nums text-muted-foreground">
          {q + 1} of {questions.length}
        </p>
      </div>
      <h2
        key={question.key}
        className="animate-fade mt-2 font-display text-[28px] font-semibold leading-9 text-balance"
      >
        {question.label}
      </h2>
      <div className="mt-8">
        {question.kind === "time" ? (
          <>
            <label className="block rounded-[16px] bg-secondary px-5 py-4">
              <span className="text-[12px] text-muted-foreground">Time</span>
              <input
                type="time"
                aria-label={question.label}
                value={(entry[question.key] as string | undefined) ?? ""}
                onChange={(e) => set({ [question.key]: e.target.value })}
                className="block w-full bg-transparent font-display text-[40px] font-semibold tabular-nums outline-none"
              />
            </label>
            {!entry[question.key] && previous?.[question.key] ? (
              <div className="mt-3">
                <Button
                  variant="tonal"
                  onClick={() => set({ [question.key]: previous[question.key] })}
                >
                  Same as last time, {formatTime(previous[question.key] as string)}
                </Button>
              </div>
            ) : null}
          </>
        ) : null}
        {question.kind === "minutes" || question.kind === "count" ? (
          <Counter
            unit={question.kind === "minutes" ? "minutes" : "times"}
            step={question.kind === "minutes" ? 5 : 1}
            value={entry[question.key] as number | undefined}
            onChange={(v) => set({ [question.key]: v })}
          />
        ) : null}
        {question.kind === "rating" ? (
          <Segmented
            label={question.label}
            options={["1", "2", "3", "4", "5"]}
            value={entry.quality?.toString()}
            onChange={(v) => set({ quality: Number(v) })}
          />
        ) : null}
      </div>
      <Footer
        onBack={q === 0 ? ctx.onBack : () => setQ(q - 1)}
        onNext={() => {
          if (
            (question.kind === "minutes" || question.kind === "count") &&
            entry[question.key] === undefined
          )
            set({ [question.key]: 0 });
          setQ(q + 1);
        }}
        label="Next"
        disabled={!answered}
      />
    </>
  );
}

function Counter({
  value,
  onChange,
  unit,
  step,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
  unit: string;
  step: number;
}) {
  const v = value ?? 0;
  return (
    <div className="flex items-center justify-between rounded-[16px] bg-secondary p-3">
      <Button
        variant="tonal"
        className="h-14 w-14 px-0 text-2xl"
        onClick={() => onChange(Math.max(0, v - step))}
      >
        <span aria-label={`Fewer ${unit}`}>−</span>
      </Button>
      <p className="text-center" aria-live="polite">
        <span className="font-display text-[40px] font-semibold tabular-nums">{v}</span>
        <span className="ml-2 text-[15px] text-muted-foreground">{unit}</span>
      </p>
      <Button
        variant="tonal"
        className="h-14 w-14 px-0 text-2xl"
        onClick={() => onChange(v + step)}
      >
        <span aria-label={`More ${unit}`}>+</span>
      </Button>
    </div>
  );
}

function answerText(q: DiaryQ, e: DiaryEntry) {
  const v = e[q.key];
  if (v === undefined) return "–";
  if (q.kind === "time") return formatTime(v as string);
  if (q.kind === "minutes") return `${v} min`;
  return String(v);
}

/* -------------------------------- renderer -------------------------------- */

export function StepView({
  step,
  ctx,
  diaryRows,
}: {
  step: Step;
  ctx: StepCtx;
  diaryRows: string[];
}): ReactNode {
  const v = step.view;
  switch (v.ui) {
    case "lesson":
      return <LessonStep step={step} view={v} ctx={ctx} />;
    case "choice":
      return <ChoiceStep step={step} view={v} ctx={ctx} />;
    case "scale":
      return <ScaleStep step={step} view={v} ctx={ctx} />;
    case "text":
      return <TextStep step={step} view={v} ctx={ctx} />;
    case "diary":
      return <DiaryStep ctx={ctx} rows={diaryRows} />;
    case "sort":
      return <SortStep step={step} view={v} ctx={ctx} />;
    case "statements":
      return <StatementsStep step={step} view={v} ctx={ctx} />;
    case "entries":
      return <EntriesStep step={step} view={v} ctx={ctx} />;
    case "review":
      return <ReviewStep step={step} view={v} ctx={ctx} />;
    case "tracker":
      return <TrackerStep step={step} view={v} ctx={ctx} />;
    case "conclude":
      return <ConcludeStep step={step} view={v} ctx={ctx} />;
  }
}

export { BlockText };
