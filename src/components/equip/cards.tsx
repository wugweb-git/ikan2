import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/equip/metrics";
import { useProgramme, type Entry } from "@/lib/equip/store";
import type { EntryValues, Field, Step, UI } from "@/lib/equip/types";
import { BlockText, Footer, type StepCtx } from "./steps";
import { BottomSheet, Button, IconButton, Pager, Segmented, TextField } from "./m3";

const nextLabel = (ctx: StepCtx) => ctx.finishLabel ?? (ctx.isLast ? `Finish day ${ctx.day}` : "Next");

const display = (f: Field | undefined, v: EntryValues[string] | undefined) => {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (f?.type === "time") return formatTime(v);
  if (f?.type === "date") return new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  if (f?.type === "datetime") return new Date(v).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
  return v;
};

function FieldInput({
  field,
  value,
  onChange,
  hideLabel,
}: {
  field: Field;
  value: EntryValues[string] | undefined;
  onChange: (v: string) => void;
  hideLabel?: boolean;
}) {
  if (field.type === "yesno" || field.type === "select") {
    return (
      <div>
        {field.label && !hideLabel ? <p className="mb-2 text-[14px] font-semibold">{field.label}</p> : null}
        <Segmented label={field.label} options={field.options ?? []} value={typeof value === "string" ? value : undefined} onChange={onChange} />
      </div>
    );
  }
  const type = field.type === "time" ? "time" : field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : "text";
  return (
    <TextField
      label={field.label}
      ariaLabel={field.label || "Write here"}
      type={type}
      value={typeof value === "string" ? value : ""}
      onChange={onChange}
      multiline={field.type === "longtext"}
    />
  );
}

function EntryForm({ fields, onSubmit, submitLabel }: { fields: Field[]; onSubmit: (v: EntryValues) => void; submitLabel: string }) {
  const [values, setValues] = useState<EntryValues>({});
  const ready = fields.some((f) => String(values[f.key] ?? "").trim());
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) onSubmit(values);
      }}
    >
      {fields.map((f) => (
        <FieldInput key={f.key} field={f} value={values[f.key]} onChange={(v) => setValues((p) => ({ ...p, [f.key]: v }))} />
      ))}
      <Button type="submit" disabled={!ready} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}

/** Cards older than a retention window (Notion: "deleted after 24 hours") are removed. */
function useVisibleEntries(slug: string, collection: string, scope: "today" | "all", day: number, retentionHours?: number) {
  const { entries, removeEntry } = useProgramme(slug);
  const all = entries(collection);
  const now = Date.now();
  const expired = retentionHours ? all.filter((e) => now - Date.parse(e.createdAt) > retentionHours * 3_600_000) : [];
  useEffect(() => {
    expired.forEach((e) => removeEntry(collection, e.id));
  }, [expired.length]); // eslint-disable-line react-hooks/exhaustive-deps
  return all.filter((e) => !expired.includes(e) && (scope === "all" || e.day === day));
}

function CardShell({ children, tone = "surface" }: { children: ReactNode; tone?: "surface" | "example" }) {
  return (
    <article
      className={cn(
        "min-h-[260px] rounded-[16px] p-5",
        tone === "surface" ? "bg-secondary" : "bg-[var(--accent-container)] text-[var(--on-accent-container)]",
      )}
    >
      {children}
    </article>
  );
}

function Values({ entry, fields }: { entry: Entry | { values: EntryValues }; fields: Field[] }) {
  return (
    <dl className="space-y-3">
      {fields.map((f) => {
        const v = display(f, entry.values[f.key]);
        return v ? (
          <div key={f.key}>
            {f.label ? <dt className="text-[12px] leading-4 opacity-70">{f.label}</dt> : null}
            <dd className="mt-0.5 whitespace-pre-line text-[16px] leading-6">{v}</dd>
          </div>
        ) : null;
      })}
    </dl>
  );
}

/* --------------------------------- entries --------------------------------- */

export function EntriesStep({ step, view, ctx }: { step: Step; view: Extract<UI, { ui: "entries" }>; ctx: StepCtx }) {
  const { addEntry, removeEntry, patchEntry } = useProgramme(ctx.slug);
  const list = useVisibleEntries(ctx.slug, view.collection, view.scope, ctx.day, view.retentionHours);
  const [sheet, setSheet] = useState(false);
  const [page, setPage] = useState(0);
  const full = view.limit !== undefined && list.length >= view.limit;
  const hasExample = Boolean(view.example && Object.keys(view.example).length);

  if (view.listOf) return <ListEntries step={step} view={view} ctx={ctx} list={list} />;

  const pages = [
    ...(hasExample ? [
      <CardShell key="example" tone="example">
        <p className="mb-3 text-[13px] font-semibold">Entry #1</p>
        <Values entry={{ values: view.example! }} fields={view.fields} />
      </CardShell>,
    ] : []),
    ...list.map((e, i) => (
      <CardShell key={e.id}>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[13px] font-semibold text-muted-foreground">Entry #{i + 1}</p>
          {e.day === ctx.day ? (
            <IconButton label={`Delete entry ${i + 1}`} className="-mr-3 -mt-3" onClick={() => removeEntry(view.collection, e.id)}>
              <Trash2 className="h-5 w-5" />
            </IconButton>
          ) : null}
        </div>
        <Values entry={e} fields={view.fields.filter((f) => !view.editable?.includes(f.key))} />
        {view.fields
          .filter((f) => view.editable?.includes(f.key))
          .map((f) => (
            <div key={f.key} className="mt-4">
              <FieldInput field={f} value={e.values[f.key]} onChange={(v) => patchEntry(view.collection, e.id, { [f.key]: v })} />
            </div>
          ))}
      </CardShell>
    )),
  ];

  return (
    <>
      <BlockText block={step.block} headline={view.prompt} />
      <div className="mt-5">
        {pages.length ? (
          <Pager pages={pages} index={Math.min(page, pages.length - 1)} onIndex={setPage} />
        ) : (
          <p className="rounded-[16px] border border-dashed border-foreground/25 p-6 text-center text-[15px] text-muted-foreground">
            No entries yet
          </p>
        )}
      </div>
      {full ? null : (
        <div className="mt-4 flex justify-center">
          <Button variant="tonal" icon={<Plus className="h-5 w-5" />} onClick={() => setSheet(true)}>
            Add New Entry
          </Button>
        </div>
      )}
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title={step.block.title}>
        <EntryForm
          fields={view.fields}
          submitLabel="Add entry"
          onSubmit={(v) => {
            addEntry(view.collection, v, ctx.day);
            setSheet(false);
            setPage((hasExample ? 1 : 0) + list.length);
          }}
        />
      </BottomSheet>
      <Footer onBack={ctx.onBack} onNext={ctx.onNext} label={nextLabel(ctx)} />
    </>
  );
}

/** "Give options to add 3 things with add more once 3 have been entered". */
function ListEntries({ step, view, ctx, list }: { step: Step; view: Extract<UI, { ui: "entries" }>; ctx: StepCtx; list: Entry[] }) {
  const target = view.listOf ?? 3;
  const [extra, setExtra] = useState(0);
  const f = view.fields[0]!;
  // Slots are keyed by position, so a blank row keeps focus when it becomes a saved entry.
  const slots = Math.max(target, list.length) + extra;
  const filled = list.filter((e) => String(e.values[f.key] ?? "").trim()).length;

  return (
    <>
      <BlockText block={step.block} headline={view.prompt} />
      <ol className="mt-6 space-y-3">
        {Array.from({ length: slots }, (_, i) => (
          <li key={`slot-${i}`} className="flex items-start gap-3">
            <span className="mt-4 w-5 shrink-0 text-right text-[15px] tabular-nums text-muted-foreground">{i + 1}.</span>
            <div className="flex-1">
              <ListSlot
                label={`${view.prompt ?? step.block.title} ${i + 1}`}
                entry={list[i]}
                fieldKey={f.key}
                collection={view.collection}
                ctx={ctx}
                onCreated={() => extra > 0 && i >= target && setExtra(extra - 1)}
              />
            </div>
          </li>
        ))}
      </ol>
      {filled >= Math.max(target, list.length) && extra === 0 ? (
        <div className="mt-3">
          <Button variant="text" icon={<Plus className="h-5 w-5" />} onClick={() => setExtra(1)}>
            Add more
          </Button>
        </div>
      ) : null}
      <Footer onBack={ctx.onBack} onNext={ctx.onNext} label={nextLabel(ctx)} />
    </>
  );
}

function ListSlot({
  label,
  entry,
  fieldKey,
  collection,
  ctx,
  onCreated,
}: {
  label: string;
  entry: Entry | undefined;
  fieldKey: string;
  collection: string;
  ctx: StepCtx;
  onCreated: () => void;
}) {
  const { addEntry, patchEntry } = useProgramme(ctx.slug);
  const id = useRef<string | undefined>(entry?.id);
  if (entry) id.current = entry.id;
  const [value, setValue] = useState(String(entry?.values[fieldKey] ?? ""));
  return (
    <TextField
      label=""
      ariaLabel={label}
      value={value}
      onChange={(v) => {
        setValue(v);
        if (id.current) patchEntry(collection, id.current, { [fieldKey]: v });
        else if (v.trim()) {
          id.current = addEntry(collection, { [fieldKey]: v }, ctx.day).id;
          onCreated();
        }
      }}
    />
  );
}

/* --------------------------------- review --------------------------------- */

export function ReviewStep({ step, view, ctx }: { step: Step; view: Extract<UI, { ui: "review" }>; ctx: StepCtx }) {
  const { state, addEntry, patchEntry } = useProgramme(ctx.slug);
  const list = useVisibleEntries(ctx.slug, view.collection, view.scope, ctx.day);
  const [sheet, setSheet] = useState(false);
  const [page, setPage] = useState(0);
  const reviewKeys = new Set(view.fields.map((f) => f.key));
  const hydrated = Object.keys(state.answers).length > 0 || Object.keys(state.collections).length > 0;

  // Pull up the checklist picks (Notion "Show all things selected (including others)") and preset situations.
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current || !hydrated) return;
    seeded.current = true;
    const all = state.collections[view.collection] ?? [];
    if (view.seedFrom) {
      const raw = state.answers[view.seedFrom.choiceKey];
      const picks = (Array.isArray(raw) ? raw : []).filter((p) => !/^Other/i.test(p));
      const other = state.answers[`${view.seedFrom.choiceKey}#other`];
      if (typeof other === "string" && other.trim()) picks.push(other.trim());
      const have = new Set(all.map((e) => String(e.values[view.seedFrom!.field] ?? "")));
      picks.filter((p) => !have.has(p)).forEach((p) => addEntry(view.collection, { [view.seedFrom!.field]: p }, ctx.day));
    }
    if (view.seeds) {
      const have = new Set(all.map((e) => JSON.stringify(Object.values(e.values)[0])));
      view.seeds.filter((s) => !have.has(JSON.stringify(Object.values(s)[0]))).forEach((s) => addEntry(view.collection, s, ctx.day));
    }
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const labels = useMemo(() => new Map((view.addFields ?? []).map((f) => [f.key, f])), [view.addFields]);
  const infoFields = (e: Entry): Field[] =>
    Object.keys(e.values)
      .filter((k) => !reviewKeys.has(k) && !k.startsWith("aligns"))
      .map((k) => labels.get(k) ?? { key: k, label: "", type: "longtext" as const });

  const answered = list.filter((e) => view.fields.every((f) => String(e.values[f.key] ?? "").trim())).length;

  const pages = [
    ...(view.example
      ? [
          <CardShell key="example" tone="example">
            <p className="mb-3 text-[13px] font-semibold">Example Card</p>
            <ol className="space-y-2">
              {view.example.map((line, i) => (
                <li key={i} className="text-[16px] leading-6">
                  {i > 0 ? <span aria-hidden="true" className="mr-1 opacity-60">→</span> : null}
                  {line}
                </li>
              ))}
            </ol>
          </CardShell>,
        ]
      : []),
    ...list.map((e) => (
      <CardShell key={e.id}>
        <Values entry={e} fields={infoFields(e)} />
        <div className="mt-4 space-y-4 border-t border-foreground/10 pt-4">
          {view.fields.map((f) => (
            <FieldInput
              key={f.key}
              field={f}
              hideLabel={f.label === view.prompt}
              value={e.values[f.key]}
              onChange={(v) => patchEntry(view.collection, e.id, { [f.key]: v })}
            />
          ))}
        </div>
      </CardShell>
    )),
  ];

  return (
    <>
      <BlockText block={step.block} headline={view.fields.length === 1 && view.fields[0]!.label === view.prompt ? view.prompt : view.prompt || undefined} />
      {list.length ? (
        <p className="mt-2 text-[14px] text-muted-foreground">
          {answered} of {list.length} done
        </p>
      ) : null}
      <div className="mt-4">
        {pages.length ? (
          <Pager pages={pages} index={Math.min(page, pages.length - 1)} onIndex={setPage} />
        ) : (
          <p className="rounded-[16px] border border-dashed border-foreground/25 p-6 text-center text-[15px] text-muted-foreground">
            No entries yet
          </p>
        )}
      </div>
      {view.addFields ? (
        <div className="mt-4 flex justify-center">
          <Button variant="tonal" icon={<Plus className="h-5 w-5" />} onClick={() => setSheet(true)}>
            Add New Entry
          </Button>
        </div>
      ) : null}
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title={step.block.title}>
        <EntryForm
          fields={[...(view.addFields ?? []), ...view.fields]}
          submitLabel="Add entry"
          onSubmit={(v) => {
            addEntry(view.collection, v, ctx.day);
            setSheet(false);
            setPage((view.example ? 1 : 0) + list.length);
          }}
        />
      </BottomSheet>
      <Footer onBack={ctx.onBack} onNext={ctx.onNext} label={nextLabel(ctx)} />
    </>
  );
}

/* --------------------------------- tracker --------------------------------- */

export function TrackerStep({ step, view, ctx }: { step: Step; view: Extract<UI, { ui: "tracker" }>; ctx: StepCtx }) {
  const { state, entries, setTracked, addEntry } = useProgramme(ctx.slug);
  const habits = entries(view.collection);
  const today = state.tracker[String(ctx.day)] ?? {};
  const [sheet, setSheet] = useState(false);
  const days = Object.keys(state.tracker)
    .map(Number)
    .filter((d) => d < ctx.day)
    .sort((a, b) => a - b)
    .slice(-6);

  return (
    <>
      <BlockText block={step.block} headline={view.prompt} />
      {view.note ? <p className="mt-2 text-[15px] text-muted-foreground">{view.note}</p> : null}
      <ul className="-mx-4 mt-4 divide-y divide-foreground/[0.08]">
        {habits.map((h) => (
          <li key={h.id} className="px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[16px] font-medium leading-6">{String(h.values[view.field] ?? "")}</p>
              <span className="flex shrink-0 gap-1" aria-label="Earlier days">
                {days.map((d) => (
                  <span key={d} title={`Day ${d}`} className={cn("h-2 w-2 rounded-full", state.tracker[String(d)]?.[h.id] ? "bg-[var(--accent)]" : "bg-foreground/15")} />
                ))}
              </span>
            </div>
            <div className="mt-3">
              <Segmented
                label={String(h.values[view.field] ?? "")}
                options={["✅Yes", "❌No"]}
                value={today[h.id] === true ? "✅Yes" : today[h.id] === false ? "❌No" : undefined}
                onChange={(v) => setTracked(ctx.day, h.id, v === "✅Yes")}
              />
            </div>
          </li>
        ))}
      </ul>
      {habits.length === 0 ? (
        <p className="mt-4 text-[15px] text-muted-foreground">No habits yet. Add the habit you want to build.</p>
      ) : null}
      <div className="mt-4 flex justify-center">
        <Button variant="tonal" icon={<Plus className="h-5 w-5" />} onClick={() => setSheet(true)}>
          Add New Entry
        </Button>
      </div>
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title={step.block.title}>
        <EntryForm
          fields={[{ key: view.field, label: "Habit I want to inculcate", type: "text" }]}
          submitLabel="Add entry"
          onSubmit={(v) => {
            addEntry(view.collection, v, ctx.day);
            setSheet(false);
          }}
        />
      </BottomSheet>
      <Footer onBack={ctx.onBack} onNext={ctx.onNext} label={nextLabel(ctx)} />
    </>
  );
}

