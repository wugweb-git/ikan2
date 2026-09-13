import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration, nightMetrics } from "@/lib/equip/metrics";
import { instruments } from "@/lib/equip/program";
import { useEquipProgress } from "@/lib/equip/store";
import type { Block } from "@/lib/equip/types";
import { BlockHeading, FieldInput, type FieldValue } from "../fields";

const lastNight = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
};

/** The nightly entry, one per night (the diary dedupes on "night"). */
export function DiaryBlock({
  block,
  unit,
}: {
  block: Extract<Block, { kind: "diary" }>;
  unit: number;
}) {
  const { rowsFor, addRow } = useEquipProgress();
  const columns = (instruments["diary"]?.columns ?? []).filter((c) => c.key !== "night");
  const [night] = useState(lastNight);
  const existing = rowsFor("diary", false).find((r) => r["night"] === night);
  const [values, setValues] = useState<Record<string, FieldValue>>(() => ({ ...(existing ?? {}) }));
  const [saved, setSaved] = useState(Boolean(existing));

  const metrics = nightMetrics(values);
  const set = (key: string, value: FieldValue) => {
    setSaved(false);
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <BlockHeading
        eyebrow={`Sleep diary · night of ${night}`}
        title={block.title}
        note={block.note ?? "Rough times are fine. A minute is enough."}
      />

      <div className="mt-5 space-y-4">
        {columns.map((column) => {
          if (column.key === "tried" && values["struggled"] !== true) return null;
          return (
            <label key={column.key} className="block">
              <span className="mb-1.5 block text-xs font-semibold">{column.label}</span>
              <FieldInput
                column={column}
                value={values[column.key]}
                onChange={(v) => set(column.key, v)}
              />
            </label>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-3 divide-x divide-border rounded-2xl bg-secondary/60 py-3 text-center">
        <Metric label="In bed" value={metrics ? formatDuration(metrics.windowMin) : "—"} />
        <Metric label="Asleep" value={metrics ? formatDuration(metrics.asleepMin) : "—"} />
        <Metric label="Efficiency" value={metrics ? `${metrics.efficiency}%` : "—"} />
      </div>

      <Button
        className="mt-4 w-full"
        disabled={!metrics}
        onClick={() => {
          const { id: _id, ...rest } = values as Record<string, FieldValue> & { id?: string };
          addRow("diary", { ...rest, night }, unit);
          setSaved(true);
        }}
      >
        {saved ? (
          <>
            <Check /> Saved for this night
          </>
        ) : (
          "Save entry"
        )}
      </Button>
      {!metrics ? (
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Add when you got in and out of bed to save.
        </p>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <strong className="font-display text-base">{value}</strong>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
