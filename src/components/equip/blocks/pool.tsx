import { useState } from "react";
import { Plus } from "lucide-react";
import { useEquipProgress } from "@/lib/equip/store";
import type { Block } from "@/lib/equip/types";
import { BlockHeading, Chip, inputClass } from "../fields";

const REFUSAL = "I'd prefer not to say";

export function PoolBlock({ block }: { block: Extract<Block, { kind: "pool" }> }) {
  const { state, setPool } = useEquipProgress();
  const picks = state.pools[block.instrument] ?? [];
  const [other, setOther] = useState("");
  const known = new Set(block.options.map((o) => o.label));
  const custom = picks.filter((p) => !known.has(p) && p !== REFUSAL);

  const toggle = (label: string) => {
    if (label === REFUSAL)
      return setPool(block.instrument, picks.includes(REFUSAL) ? [] : [REFUSAL]);
    const base = picks.filter((p) => p !== REFUSAL);
    setPool(
      block.instrument,
      base.includes(label) ? base.filter((p) => p !== label) : [...base, label],
    );
  };

  const addOther = () => {
    const label = other.trim();
    if (!label) return;
    if (!picks.includes(label))
      setPool(block.instrument, [...picks.filter((p) => p !== REFUSAL), label]);
    setOther("");
  };

  return (
    <div>
      <BlockHeading eyebrow="Your turn" title={block.title} note={block.note} />
      <div className="mt-6 flex flex-wrap gap-2">
        {block.options.map((option) => (
          <Chip
            key={option.label}
            active={picks.includes(option.label)}
            onClick={() => toggle(option.label)}
          >
            {option.glyph ? <span aria-hidden="true">{option.glyph}</span> : null}
            {option.label}
          </Chip>
        ))}
        {custom.map((label) => (
          <Chip key={label} active onClick={() => toggle(label)}>
            {label}
          </Chip>
        ))}
        {block.refusal ? (
          <Chip active={picks.includes(REFUSAL)} onClick={() => toggle(REFUSAL)}>
            {REFUSAL}
          </Chip>
        ) : null}
      </div>

      {block.allowOther ? (
        <form
          className="mt-5 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            addOther();
          }}
        >
          <input
            value={other}
            onChange={(e) => setOther(e.target.value)}
            placeholder="Something else? Add it"
            className={inputClass}
          />
          <button
            type="submit"
            aria-label="Add"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-foreground text-background disabled:opacity-40"
            disabled={!other.trim()}
          >
            <Plus className="h-4 w-4" />
          </button>
        </form>
      ) : null}

      <p className="mt-4 text-xs text-muted-foreground">
        {picks.length ? `${picks.length} selected` : "Nothing selected yet"}
      </p>
    </div>
  );
}
