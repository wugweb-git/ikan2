import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CalendarCheck, ListChecks, NotebookPen, Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/equip/metrics";
import { useProgramme, type Entry } from "@/lib/equip/store";
import { earlierFieldValues } from "@/lib/equip/earlier";
import type { EntryValues, Field, Step, UI } from "@/lib/equip/types";
import { BlockText, Footer, type StepCtx } from "./steps";
import {
  BottomSheet,
  Button,
  IconButton,
  Pager,
  Segmented,
  Snackbar,
  QuickPicks,
  TextField,
  useSnack,
} from "./m3";

const nextLabel = (ctx: StepCtx) =>
  ctx.finishLabel ??
  (ctx.isLast ? (ctx.day === 0 ? "Finish onboarding" : `Finish day ${ctx.day}`) : "Next");

const display = (f: Field | undefined, v: EntryValues[string] | undefined) => {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (f?.type === "time") return formatTime(v);
  if (f?.type === "date")
    return new Date(v).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  if (f?.type === "datetime")
    return new Date(v).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  return v;
};

/** Short examples shown inside empty fields, so people know what kind of answer fits. */
const hints: Record<string, string> = {
  situation: "Where were you, what was going on?",
  "what happened?": "Where were you, what was going on?",
  event: "What happened, in a few words",
  thoughts: "What went through your mind?",
  thought: "What went through your mind?",
  feelings: "Name the feeling, e.g. anxious, low",
  feeling: "Name the feeling, e.g. anxious, low",
  response: "What did you do next?",
  disturbance: "e.g. Phone notifications",
  "ways to reduce": "One small change you could try",
  pros: "What’s good about it?",
  cons: "What’s hard about it?",
  ritual: "e.g. Dim the lights, read a few pages",
  activity: "e.g. A short walk",
  "habit i want to inculcate": "e.g. No screens after 10 pm",
  effort: "What did you put in?",
  "expected reward": "What did you hope to get back?",
  "general outcome": "What actually happened?",
  "the ‘why’": "Why does this matter to you?",
  "things that kept me up": "e.g. Worrying about tomorrow",
  "how will you get rid of them?": "One step you can take",
  "perfect outcome": "If everything went perfectly…",
  "realistic outcome": "What’s likely and good enough?",
  "realistic goal i’d like to set": "Something you can do this week",
  "steps i can take towards achieving that goal": "First step, then the next",
  "task i will take up today": "One task, small enough to finish",
  timeline: "e.g. By 5 pm",
  "how can you reduce these demands?": "e.g. Say no to one extra task",
  "how can you increase your resources?": "e.g. Ask someone for help",
  "i understand that": "What you can accept about this",
  "my alternate thoughts": "A kinder, more balanced way to see it",
  "how they make me feel now": "How do you feel after rethinking it?",
};
const hintFor = (f: Field) => hints[f.label.trim().toLowerCase()];

const nowTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

function FieldInput({
  field,
  value,
  onChange,
  hideLabel,
  error,
}: {
  field: Field;
  value: EntryValues[string] | undefined;
  onChange: (v: string) => void;
  hideLabel?: boolean;
  error?: string | undefined;
}) {
  if (field.type === "yesno" || field.type === "select") {
    return (
      <div>
        {field.label && !hideLabel ? (
          <p className="mb-2 text-[14px] font-semibold">{field.label}</p>
        ) : null}
        <Segmented
          label={field.label}
          options={field.options ?? []}
          value={typeof value === "string" ? value : undefined}
          onChange={onChange}
        />
      </div>
    );
  }
  const type =
    field.type === "time"
      ? "time"
      : field.type === "date"
        ? "date"
        : field.type === "datetime"
          ? "datetime-local"
          : "text";
  return (
    <TextField
      label={field.label}
      ariaLabel={field.label || "Write here"}
      type={type}
      value={typeof value === "string" ? value : ""}
      onChange={onChange}
      multiline={field.type === "longtext"}
      rows={field.type === "longtext" ? 2 : undefined}
      placeholder={hintFor(field)}
      maxLength={field.type === "longtext" ? 2000 : field.type === "text" ? 200 : undefined}
      error={error}
    />
  );
}

/** Written fields must have words in them; a date must be a real one within a year either way. */
function entryErrors(fields: Field[], values: EntryValues) {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const raw = values[f.key];
    const v = typeof raw === "string" ? raw.trim() : "";
    if ((f.type === "text" || f.type === "longtext") && f.key === "text" && !v)
      errors[f.key] = "Write something here first.";
    if (f.type === "date" && v) {
      const d = new Date(`${v}T00:00:00`);
      const year = 366 * 24 * 3_600_000;
      if (Number.isNaN(d.getTime()) || Math.abs(d.getTime() - Date.now()) > year)
        errors[f.key] = "Pick a date within a year of today.";
    }
  }
  return errors;
}

function EntryForm({
  fields,
  onSubmit,
  submitLabel,
  history = [],
  initial,
}: {
  fields: Field[];
  onSubmit: (v: EntryValues) => void;
  submitLabel: string;
  initial?: EntryValues;
  /** earlier entries in the same collection, offered back per field */
  history?: Entry[];
}) {
  // time fields start at now, since most entries are logged as things happen
  const [values, setValues] = useState<EntryValues>(
    () =>
      initial ??
      Object.fromEntries(fields.filter((f) => f.type === "time").map((f) => [f.key, nowTime()])),
  );
  const [tried, setTried] = useState(false);
  const ready = fields.some((f) => f.type !== "time" && String(values[f.key] ?? "").trim());
  const errors = entryErrors(fields, values);
  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (!ready || Object.keys(errors).length) return;
        onSubmit(values);
        setTried(false);
      }}
    >
      {fields.map((f) => (
        <div key={f.key}>
          <FieldInput
            field={f}
            value={values[f.key]}
            onChange={(v) => setValues((p) => ({ ...p, [f.key]: v }))}
            error={tried ? errors[f.key] : undefined}
          />
          {f.type === "text" || f.type === "longtext" || f.type === "time" ? (
            <QuickPicks
              title="Used before"
              items={earlierFieldValues(history, f.key).map((v) => ({
                label: f.type === "time" ? formatTime(v) : v,
                value: v,
              }))}
              selected={typeof values[f.key] === "string" ? (values[f.key] as string) : undefined}
              onPick={(v) => setValues((p) => ({ ...p, [f.key]: v }))}
            />
          ) : null}
        </div>
      ))}
      <Button type="submit" disabled={!ready} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}

/** Cards older than a retention window (Notion: "deleted after 24 hours") are removed. */
function useVisibleEntries(
  slug: string,
  collection: string,
  scope: "today" | "all",
  day: number,
  retentionHours?: number,
) {
  const { entries, removeEntry } = useProgramme(slug);
  const all = entries(collection);
  const now = Date.now();
  const expired = retentionHours
    ? all.filter((e) => now - Date.parse(e.createdAt) > retentionHours * 3_600_000)
    : [];
  useEffect(() => {
    expired.forEach((e) => removeEntry(collection, e.id));
  }, [expired.length]); // eslint-disable-line react-hooks/exhaustive-deps
  return all.filter((e) => !expired.includes(e) && (scope === "all" || e.day === day));
}

function CardShell({
  children,
  tone = "surface",
}: {
  children: ReactNode;
  tone?: "surface" | "example";
}) {
  return (
    <article
      className={cn(
        "h-full rounded-[16px] p-4",
        tone === "surface"
          ? "bg-secondary"
          : "bg-[var(--accent-container)] text-[var(--on-accent-container)]",
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

function EmptyCards({ onAdd, canAdd }: { onAdd: () => void; canAdd: boolean }) {
  return (
    <div className="flex flex-col items-center rounded-[16px] border border-dashed border-foreground/25 px-6 py-8 text-center">
      <p className="text-[16px] font-medium">No entries yet</p>
      {canAdd ? (
        <Button
          variant="tonal"
          className="mt-4"
          icon={<Plus className="h-5 w-5" />}
          onClick={onAdd}
        >
          Add New Entry
        </Button>
      ) : null}
    </div>
  );
}

const countLabel = (n: number) => `${n} ${n === 1 ? "entry" : "entries"}`;

/* --------------------------------- entries --------------------------------- */

export function EntriesStep({
  step,
  view,
  ctx,
}: {
  step: Step;
  view: Extract<UI, { ui: "entries" }>;
  ctx: StepCtx;
}) {
  const { addEntry, removeEntry, patchEntry, entries } = useProgramme(ctx.slug);
  const list = useVisibleEntries(
    ctx.slug,
    view.collection,
    view.scope,
    ctx.day,
    view.retentionHours,
  );
  const [sheet, setSheet] = useState(false);
  const hasExample = Boolean(view.example && Object.keys(view.example).length);
  // open on today's entries: earlier days are carried forward to the left
  const firstToday = list.findIndex((e) => e.day >= ctx.day);
  const [page, setPage] = useState(() =>
    firstToday >= 0 ? firstToday + (hasExample ? 1 : 0) : (hasExample ? 1 : 0) + list.length - 1,
  );
  const [editing, setEditing] = useState<Entry | null>(null);
  const full = view.limit !== undefined && list.length >= view.limit;
  const snack = useSnack();

  if (view.list) return <ListEntries step={step} view={view} ctx={ctx} list={list} />;

  const pages = [
    ...(hasExample
      ? [
          <CardShell key="example" tone="example">
            <p className="mb-3 text-[13px] font-semibold">Entry #1</p>
            <Values entry={{ values: view.example! }} fields={view.fields} />
          </CardShell>,
        ]
      : []),
    ...list.map((e, i) => (
      <CardShell key={e.id}>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[13px] font-semibold text-muted-foreground">Entry #{i + 1}</p>
          {e.day === ctx.day ? (
            <IconButton
              label={`Delete entry ${i + 1}`}
              className="-mr-3 -mt-3"
              onClick={() => removeEntry(view.collection, e.id)}
            >
              <Trash2 className="h-5 w-5" />
            </IconButton>
          ) : (
            <span className="-mr-3 -mt-3 flex items-center">
              <span className="text-[12px] text-muted-foreground">Day {e.day}</span>
              <IconButton label={`Edit entry ${i + 1}`} onClick={() => setEditing(e)}>
                <Pencil className="h-5 w-5" />
              </IconButton>
            </span>
          )}
        </div>
        <Values entry={e} fields={view.fields.filter((f) => !view.editable?.includes(f.key))} />
        {view.fields
          .filter((f) => view.editable?.includes(f.key))
          .map((f) => (
            <div key={f.key} className="mt-4">
              <FieldInput
                field={f}
                value={e.values[f.key]}
                onChange={(v) => patchEntry(view.collection, e.id, { [f.key]: v })}
              />
            </div>
          ))}
      </CardShell>
    )),
  ];

  return (
    <>
      <BlockText block={step.block} headline={view.prompt} icon={<NotebookPen />} />
      {list.length ? (
        <p className="mt-3 text-[14px] text-muted-foreground">{countLabel(list.length)}</p>
      ) : null}
      <div className="mt-4">
        {pages.length ? (
          <Pager pages={pages} index={Math.min(page, pages.length - 1)} onIndex={setPage} />
        ) : (
          <EmptyCards canAdd={!full} onAdd={() => setSheet(true)} />
        )}
      </div>
      {full || !pages.length ? null : (
        <div className="mt-4 flex justify-center">
          <Button
            variant="tonal"
            icon={<Plus className="h-5 w-5" />}
            onClick={() => setSheet(true)}
          >
            Add New Entry
          </Button>
        </div>
      )}
      <BottomSheet open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit entry">
        {editing ? (
          <EntryForm
            key={editing.id}
            fields={view.fields}
            initial={editing.values}
            submitLabel="Save changes"
            onSubmit={(v) => {
              patchEntry(view.collection, editing.id, v);
              setEditing(null);
              snack.show("Entry updated");
            }}
          />
        ) : null}
      </BottomSheet>
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title={step.block.title}>
        <EntryForm
          fields={view.fields}
          submitLabel="Add entry"
          history={entries(view.collection)}
          onSubmit={(v) => {
            addEntry(view.collection, v, ctx.day);
            setSheet(false);
            setPage((hasExample ? 1 : 0) + list.length);
            snack.show("Entry added");
          }}
        />
      </BottomSheet>
      <Snackbar message={snack.message} />
      <Footer onBack={ctx.onBack} onNext={ctx.onNext} label={nextLabel(ctx)} />
    </>
  );
}

/** Plain lists: "add 3 things with add more once 3 have been entered", "User lists things down. Limit to 10." */
function ListEntries({
  step,
  view,
  ctx,
  list,
}: {
  step: Step;
  view: Extract<UI, { ui: "entries" }>;
  ctx: StepCtx;
  list: Entry[];
}) {
  const initial = view.list?.initial ?? 3;
  const max = view.list?.max ?? Infinity;
  const [extra, setExtra] = useState(0);
  const f = view.fields[0]!;
  // earlier days' answers come first and stay locked until Edit; today starts on a fresh row
  const carried = list.filter((e) => e.day < ctx.day);
  const today = list.filter((e) => e.day >= ctx.day);
  const todaySlots = Math.min(
    Math.max(0, max - carried.length),
    Math.max(carried.length ? 1 : initial, today.length) + extra,
  );
  const slots = carried.length + todaySlots;
  const filled = today.filter((e) => String(e.values[f.key] ?? "").trim()).length;
  const canAddMore = slots < max;
  const allFilled = filled >= todaySlots;

  return (
    <>
      <BlockText block={step.block} headline={view.prompt} icon={<ListChecks />} />
      <ol className="mt-6 space-y-3">
        {Array.from({ length: slots }, (_, i) => {
          const isCarried = i < carried.length;
          const entry = isCarried ? carried[i] : today[i - carried.length];
          return (
            <li
              key={isCarried ? entry!.id : `slot-${i - carried.length}`}
              className="flex items-start gap-3"
            >
              <span className="mt-4 w-5 shrink-0 text-right text-[15px] tabular-nums text-muted-foreground">
                {i + 1}.
              </span>
              <div className="flex-1">
                {isCarried ? (
                  <CarriedSlot
                    entry={entry!}
                    fieldKey={f.key}
                    collection={view.collection}
                    ctx={ctx}
                  />
                ) : (
                  <ListSlot
                    label={`${view.prompt ?? step.block.title} ${i + 1}`}
                    entry={entry}
                    fieldKey={f.key}
                    collection={view.collection}
                    ctx={ctx}
                    onCreated={() =>
                      i - carried.length >= Math.max(carried.length ? 1 : initial, today.length) &&
                      setExtra((x) => Math.max(0, x - 1))
                    }
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 flex items-center justify-between">
        {canAddMore ? (
          <Button
            variant="text"
            icon={<Plus className="h-5 w-5" />}
            disabled={!allFilled}
            onClick={() => setExtra((x) => x + 1)}
          >
            Add another
          </Button>
        ) : (
          <span />
        )}
        {max !== Infinity && list.length > 0 ? (
          <p className="text-[13px] tabular-nums text-muted-foreground">
            {list.length} of {max}
          </p>
        ) : null}
      </div>
      <Footer onBack={ctx.onBack} onNext={ctx.onNext} label={nextLabel(ctx)} />
    </>
  );
}

/** An answer from an earlier day: shown as saved, editable only after tapping Edit. */
function CarriedSlot({
  entry,
  fieldKey,
  collection,
  ctx,
}: {
  entry: Entry;
  fieldKey: string;
  collection: string;
  ctx: StepCtx;
}) {
  const { patchEntry } = useProgramme(ctx.slug);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(entry.values[fieldKey] ?? ""));
  if (editing)
    return (
      <div>
        <TextField
          label=""
          ariaLabel="Edit"
          value={value}
          onChange={setValue}
          autoFocus
          maxLength={200}
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button
            variant="text"
            onClick={() => {
              setValue(String(entry.values[fieldKey] ?? ""));
              setEditing(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="tonal"
            disabled={!value.trim()}
            onClick={() => {
              patchEntry(collection, entry.id, { [fieldKey]: value.trim() });
              setEditing(false);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    );
  return (
    <div className="flex min-h-14 items-center gap-2 rounded-[4px] bg-foreground/[0.035] py-2 pl-4 pr-1">
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] leading-6">{String(entry.values[fieldKey] ?? "")}</span>
        <span className="block text-[12px] text-muted-foreground">From day {entry.day}</span>
      </span>
      <IconButton label="Edit" onClick={() => setEditing(true)}>
        <Pencil className="h-5 w-5" />
      </IconButton>
    </div>
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
      placeholder="Write one thing"
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

export function ReviewStep({
  step,
  view,
  ctx,
}: {
  step: Step;
  view: Extract<UI, { ui: "review" }>;
  ctx: StepCtx;
}) {
  const { state, addEntry, patchEntry, entries } = useProgramme(ctx.slug);
  const list = useVisibleEntries(ctx.slug, view.collection, view.scope, ctx.day);
  const [sheet, setSheet] = useState(false);
  const [page, setPage] = useState(0);
  const snack = useSnack();
  const reviewKeys = new Set(view.fields.map((f) => f.key));
  const hydrated =
    Object.keys(state.answers).length > 0 || Object.keys(state.collections).length > 0;

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
      picks
        .filter((p) => !have.has(p))
        .forEach((p) => addEntry(view.collection, { [view.seedFrom!.field]: p }, ctx.day));
    }
    if (view.seeds) {
      const have = new Set(all.map((e) => JSON.stringify(Object.values(e.values)[0])));
      view.seeds
        .filter((s) => !have.has(JSON.stringify(Object.values(s)[0])))
        .forEach((s) => addEntry(view.collection, s, ctx.day));
    }
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const labels = useMemo(
    () => new Map((view.addFields ?? []).map((f) => [f.key, f])),
    [view.addFields],
  );
  const infoFields = (e: Entry): Field[] =>
    Object.keys(e.values)
      .filter((k) => !reviewKeys.has(k) && !k.startsWith("aligns"))
      .map((k) => labels.get(k) ?? { key: k, label: "", type: "longtext" as const });

  const answered = list.filter((e) =>
    view.fields.every((f) => String(e.values[f.key] ?? "").trim()),
  ).length;

  const pages = [
    ...(view.example
      ? [
          <CardShell key="example" tone="example">
            <p className="mb-3 text-[13px] font-semibold">Example Card</p>
            <ol className="space-y-2">
              {view.example.map((line, i) => (
                <li key={i} className="text-[16px] leading-6">
                  {i > 0 ? (
                    <span aria-hidden="true" className="mr-1 opacity-60">
                      →
                    </span>
                  ) : null}
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
      <BlockText block={step.block} headline={view.prompt || undefined} icon={<NotebookPen />} />
      {list.length ? (
        <p className="mt-3 text-[14px] text-muted-foreground">
          {answered} of {list.length} done
        </p>
      ) : null}
      <div className="mt-4">
        {pages.length ? (
          <Pager pages={pages} index={Math.min(page, pages.length - 1)} onIndex={setPage} />
        ) : (
          <EmptyCards canAdd={Boolean(view.addFields)} onAdd={() => setSheet(true)} />
        )}
      </div>
      {view.addFields && pages.length ? (
        <div className="mt-4 flex justify-center">
          <Button
            variant="tonal"
            icon={<Plus className="h-5 w-5" />}
            onClick={() => setSheet(true)}
          >
            Add New Entry
          </Button>
        </div>
      ) : null}
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title={step.block.title}>
        <EntryForm
          fields={[...(view.addFields ?? []), ...view.fields]}
          submitLabel="Add entry"
          history={entries(view.collection)}
          onSubmit={(v) => {
            addEntry(view.collection, v, ctx.day);
            setSheet(false);
            setPage((view.example ? 1 : 0) + list.length);
            snack.show("Entry added");
          }}
        />
      </BottomSheet>
      <Snackbar message={snack.message} />
      <Footer onBack={ctx.onBack} onNext={ctx.onNext} label={nextLabel(ctx)} />
    </>
  );
}

/* --------------------------------- tracker --------------------------------- */

export function TrackerStep({
  step,
  view,
  ctx,
}: {
  step: Step;
  view: Extract<UI, { ui: "tracker" }>;
  ctx: StepCtx;
}) {
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
      <BlockText block={step.block} headline={view.prompt} icon={<CalendarCheck />} />
      {view.note ? <p className="mt-2 text-[15px] text-muted-foreground">{view.note}</p> : null}
      <ul className="-mx-4 mt-4 divide-y divide-foreground/[0.08]">
        {habits.map((h) => (
          <li key={h.id} className="px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[16px] font-medium leading-6">
                {String(h.values[view.field] ?? "")}
              </p>
              <span className="flex shrink-0 gap-1" aria-label="Earlier days">
                {days.map((d) => (
                  <span
                    key={d}
                    title={`Day ${d}`}
                    className={cn(
                      "h-2 w-2 rounded-full",
                      state.tracker[String(d)]?.[h.id] ? "bg-[var(--accent)]" : "bg-foreground/15",
                    )}
                  />
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
        <p className="mt-4 text-[15px] text-muted-foreground">
          No habits yet. Add the habit you want to build.
        </p>
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
          history={entries(view.collection)}
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
