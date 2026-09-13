import { formatDuration, nightMetrics } from "@/lib/equip/metrics";
import { instruments } from "@/lib/equip/program";
import { useEquipProgress } from "@/lib/equip/store";
import type { Block } from "@/lib/equip/types";
import { BlockHeading, displayValue } from "../fields";

/** Windows count entries, not days. */
const WINDOW = 7;

export function SummariseBlock({ block }: { block: Extract<Block, { kind: "summarise" }> }) {
  const { rowsFor } = useEquipProgress();
  const instrument = instruments[block.instrument];
  const rows = rowsFor(block.instrument, false).slice(-WINDOW);

  if (block.instrument !== "diary") {
    const primary = instrument?.columns?.[0];
    return (
      <div>
        <BlockHeading eyebrow="Summary" title={block.title} note={block.note} />
        <p className="mt-5 font-display text-4xl font-semibold">{rows.length}</p>
        <p className="text-xs text-muted-foreground">
          recent {instrument?.name.toLowerCase()} entries
        </p>
        <ul className="mt-4 space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="surface p-3 text-sm">
              {primary ? displayValue(r[primary.key]) : ""}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const nights = rows.map((r) => ({ row: r, m: nightMetrics(r) })).filter((n) => n.m !== null);
  const avg = (pick: (m: NonNullable<ReturnType<typeof nightMetrics>>) => number) =>
    nights.length ? nights.reduce((sum, n) => sum + pick(n.m!), 0) / nights.length : 0;

  return (
    <div>
      <BlockHeading
        eyebrow="Summary"
        title={block.title}
        note={block.note ?? `Your last ${WINDOW} entries, read as a description, not a target.`}
      />

      {nights.length === 0 ? (
        <p className="surface mt-5 p-4 text-sm leading-6 text-muted-foreground">
          No nights recorded yet. After a few diary entries, your sleep window and efficiency appear
          here.
        </p>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <Stat label="Avg in bed" value={formatDuration(avg((m) => m.windowMin))} />
            <Stat label="Avg asleep" value={formatDuration(avg((m) => m.asleepMin))} />
            <Stat label="Efficiency" value={`${Math.round(avg((m) => m.efficiency))}%`} />
          </div>
          <div className="surface mt-3 p-4">
            <p className="eyebrow">Efficiency by entry</p>
            <div className="mt-4 flex h-32 items-end gap-2">
              {nights.map(({ row, m }) => (
                <div
                  key={row.id}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                >
                  <span className="text-[9px] font-semibold">{m!.efficiency}%</span>
                  <div
                    className="chart-column bg-mind"
                    style={{ height: `${Math.max(8, m!.efficiency)}%` }}
                  />
                  <span className="w-full truncate text-center text-[9px] text-muted-foreground">
                    {String(row["night"] ?? "")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface p-3 text-center">
      <strong className="font-display text-base">{value}</strong>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
