import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { instruments } from "@/lib/equip/program";
import { useEquipProgress } from "@/lib/equip/store";
import type { Block, Column, Row } from "@/lib/equip/types";
import { BlockHeading, FieldInput, displayValue, type FieldValue } from "../fields";

/** Join columns pick from rows the user already built in other instruments. */
const joinSources: Record<string, Record<string, { instrument: string; column: string }>> = {
  piggyback: {
    habit: { instrument: "targetHabits", column: "habit" },
    activity: { instrument: "dailyActivities", column: "activity" },
  },
};

/** How many rows a projection may hold (the piggyback pair is one, and only one). */
const rowCaps: Record<string, number> = { piggyback: 1 };

export function RecordBlock({
  block,
  unit,
}: {
  block: Extract<Block, { kind: "record" }>;
  unit: number;
}) {
  const { rowsFor, addRow, updateRow, removeRow } = useEquipProgress();
  const instrument = instruments[block.instrument];
  const columns = instrument?.columns ?? [];
  const rows = rowsFor(block.instrument);
  const identity = new Set(instrument?.identity ?? []);

  const editableKeys =
    block.fields ??
    (block.mode === "extend"
      ? columns.filter((c) => !identity.has(c.key)).map((c) => c.key)
      : columns.filter((c) => !c.revision).map((c) => c.key));
  const editable = columns.filter((c) => editableKeys.includes(c.key));
  const primary = columns[0];

  const optionsFor = (column: Column) => {
    const source = joinSources[block.instrument]?.[column.key];
    if (!source) return undefined;
    const values = rowsFor(source.instrument, false)
      .map((r) => r[source.column])
      .filter((v): v is string => typeof v === "string" && v.trim() !== "");
    return values.length ? values : undefined;
  };

  const cap = rowCaps[block.instrument];
  const ownRows = rows.filter((r) => !r.seed);
  const canAdd = block.mode === "collect" && (cap === undefined || ownRows.length < cap);

  return (
    <div>
      <BlockHeading
        eyebrow={
          block.mode === "review"
            ? "Look back"
            : block.mode === "extend"
              ? "Go back over it"
              : instrument?.name
        }
        title={block.title}
        note={block.note}
      />

      <div className="mt-5 space-y-2.5">
        {rows.length === 0 && block.mode !== "collect" ? (
          <p className="surface p-4 text-sm text-muted-foreground">
            Nothing recorded yet. Rows you add in earlier sittings show up here.
          </p>
        ) : null}

        {rows.map((row) => (
          <RowCard
            key={String(row["seedOf"] ?? row.id)}
            row={row}
            columns={columns}
            primary={primary}
            editable={block.mode === "extend" ? editable : []}
            showAll={block.mode === "review"}
            onPatch={(patch) => updateRow(block.instrument, row, patch)}
            {...(block.mode === "collect" && !row.seed
              ? { onRemove: () => removeRow(block.instrument, row.id) }
              : {})}
          />
        ))}
      </div>

      {canAdd ? (
        <AddRowForm
          key={ownRows.length}
          columns={editable}
          optionsFor={optionsFor}
          onAdd={(values) => addRow(block.instrument, values, unit)}
        />
      ) : null}
    </div>
  );
}

function RowCard({
  row,
  columns,
  primary,
  editable,
  showAll,
  onPatch,
  onRemove,
}: {
  row: Row;
  columns: Column[];
  primary: Column | undefined;
  editable: Column[];
  showAll: boolean;
  onPatch: (patch: Record<string, FieldValue>) => void;
  onRemove?: () => void;
}) {
  const detail = columns.filter(
    (c) => c !== primary && !editable.includes(c) && (showAll || row[c.key] != null),
  );

  return (
    <div
      className={`rounded-2xl border p-4 ${row.seed ? "border-transparent bg-secondary/80" : "border-border bg-card shadow-[var(--shadow-card)]"}`}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          {row.seed ? <p className="eyebrow mb-1">Example</p> : null}
          <p className="font-display text-sm font-semibold leading-snug">
            {primary ? displayValue(row[primary.key]) : ""}
          </p>
          {detail.length ? (
            <dl className="mt-2 grid gap-1">
              {detail.map((c) => (
                <div key={c.key} className="text-xs leading-5">
                  <dt className="inline text-muted-foreground">{c.label}: </dt>
                  <dd className="inline">{displayValue(row[c.key])}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove row"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      {editable.map((c) => (
        <div key={c.key} className="mt-3">
          <p className="mb-2 text-xs font-semibold">{c.label}</p>
          <FieldInput
            column={c}
            value={row[c.key]}
            onChange={(value) => onPatch({ [c.key]: value })}
          />
        </div>
      ))}
    </div>
  );
}

function AddRowForm({
  columns,
  optionsFor,
  onAdd,
}: {
  columns: Column[];
  optionsFor: (column: Column) => string[] | undefined;
  onAdd: (values: Record<string, FieldValue>) => void;
}) {
  const [values, setValues] = useState<Record<string, FieldValue>>({});
  const first = columns[0];
  const ready = first ? values[first.key] != null && values[first.key] !== "" : false;

  return (
    <form
      className="mt-4 rounded-2xl border border-dashed border-foreground/25 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (ready) onAdd(values);
      }}
    >
      <p className="eyebrow">Add your own</p>
      <div className="mt-3 space-y-3">
        {columns.map((c) => {
          const options = optionsFor(c);
          return (
            <label key={c.key} className="block">
              <span className="mb-1.5 block text-xs font-semibold">{c.label}</span>
              <FieldInput
                column={c}
                value={values[c.key]}
                onChange={(value) => setValues((prev) => ({ ...prev, [c.key]: value }))}
                {...(options ? { options } : {})}
              />
            </label>
          );
        })}
      </div>
      <Button type="submit" className="mt-4 w-full" disabled={!ready}>
        <Plus /> Add row
      </Button>
    </form>
  );
}
