import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEquipProgress } from "@/lib/equip/store";
import type { Block } from "@/lib/equip/types";
import { BlockHeading } from "../fields";
import { CountdownBar, useCountdown } from "./countdown";

/** Full writing surface with a countdown and a hard stop. Entries are never shown back. */
export function TimedBlock({
  block,
  unit,
}: {
  block: Extract<Block, { kind: "timed" }>;
  unit: number;
}) {
  const { addRow } = useEquipProgress();
  const clock = useCountdown(block.seconds);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!text.trim()) return;
    addRow(block.instrument, { text }, unit);
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-center">
        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-calm-soft">
            <Check className="h-7 w-7 text-calm-strong" strokeWidth={3} />
          </div>
          <p className="mt-5 font-display text-xl font-semibold">Put down. Let it go.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {block.retentionNote ?? "You need not visit it again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BlockHeading eyebrow="Timed" title={block.title} note={block.note} />
      {block.retentionNote ? (
        <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-calm-strong">
          <ShieldCheck className="h-4 w-4" /> {block.retentionNote}
        </p>
      ) : null}
      <div className="mt-5">
        <CountdownBar total={block.seconds} clock={clock} />
      </div>
      <textarea
        aria-label={block.title}
        value={text}
        disabled={!clock.started || clock.done}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          clock.started
            ? "Write whatever comes. Don't stop to fix it."
            : "Start the timer to begin writing"
        }
        className="mt-3 min-h-[42vh] w-full resize-none rounded-[20px] border border-border bg-card p-4 text-[15px] leading-7 outline-none focus:border-foreground/40 disabled:bg-secondary/40"
      />
      {clock.done || (clock.started && text.trim()) ? (
        <Button className="mt-3 w-full" onClick={save} disabled={!text.trim()}>
          {clock.done ? "Put it down" : "I'm done early"}
        </Button>
      ) : null}
    </div>
  );
}
