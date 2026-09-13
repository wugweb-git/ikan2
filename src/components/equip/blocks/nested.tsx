import { useState } from "react";
import { Plus, Star } from "lucide-react";
import { instruments } from "@/lib/equip/program";
import { useEquipProgress } from "@/lib/equip/store";
import type { Block, Row } from "@/lib/equip/types";
import { BlockHeading, inputClass } from "../fields";
import { CountdownBar, useCountdown } from "./countdown";

/** Parent disturbance rows, each holding up to `childCap` ideas. */
export function NestedBlock({
  block,
  unit,
}: {
  block: Extract<Block, { kind: "nested" }>;
  unit: number;
}) {
  const { rowsFor, addRow, updateRow } = useEquipProgress();
  const instrument = instruments[block.instrument];
  const cap = instrument?.childCap ?? 10;
  const children = rowsFor(block.instrument);
  const clock = useCountdown(block.timeBoxSeconds ?? 0);
  const timed = Boolean(block.timeBoxSeconds);
  const locked = timed && (!clock.started || clock.done);

  // Only disturbances the user marked as in their control are worth solving.
  const parents = Array.from(
    new Set([
      ...children.map((r) => String(r["parent"] ?? "")),
      ...rowsFor("distractors")
        .filter((r) => r["in_my_control"] !== false)
        .map((r) => String(r["distractor"] ?? "")),
    ]),
  ).filter(Boolean);

  const [newParent, setNewParent] = useState("");

  return (
    <div>
      <BlockHeading
        eyebrow={block.evaluationAllowed ? "Converge" : "Brainstorm"}
        title={block.title}
        note={block.note}
      />

      {timed ? (
        <div className="mt-5">
          <CountdownBar total={block.timeBoxSeconds ?? 0} clock={clock} />
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {parents.map((parent) => {
          const ideas = children.filter((r) => r["parent"] === parent);
          return (
            <div key={parent} className="surface p-4">
              <p className="eyebrow">Disturbance</p>
              <p className="mt-1 font-display text-sm font-semibold">{parent}</p>
              <div className="mt-3 space-y-2">
                {ideas.map((idea) =>
                  block.evaluationAllowed ? (
                    <EvaluateIdea
                      key={String(idea["seedOf"] ?? idea.id)}
                      idea={idea}
                      onPatch={(patch) => updateRow(block.instrument, idea, patch)}
                      onChoose={() => {
                        ideas.forEach((other) => {
                          if (other.id !== idea.id && other["chosen"] === true)
                            updateRow(block.instrument, other, { chosen: false });
                        });
                        updateRow(block.instrument, idea, { chosen: idea["chosen"] !== true });
                      }}
                    />
                  ) : (
                    <p
                      key={idea.id}
                      className={`rounded-xl px-3 py-2.5 text-sm ${idea.seed ? "bg-secondary/80 text-muted-foreground" : "bg-secondary/40"}`}
                    >
                      {String(idea["way"] ?? "")}
                    </p>
                  ),
                )}
              </div>
              {!block.evaluationAllowed && block.mode === "collect" && ideas.length < cap ? (
                <AddIdea
                  disabled={locked}
                  onAdd={(way) => addRow(block.instrument, { parent, way }, unit)}
                />
              ) : null}
              <p className="mt-2 text-[10px] text-muted-foreground">
                {ideas.length} of {cap} ideas
              </p>
            </div>
          );
        })}
      </div>

      {!block.evaluationAllowed ? (
        <form
          className="mt-4 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const label = newParent.trim();
            if (!label) return;
            addRow("distractors", { distractor: label, in_my_control: true }, unit);
            setNewParent("");
          }}
        >
          <input
            value={newParent}
            onChange={(e) => setNewParent(e.target.value)}
            placeholder="Add another disturbance"
            className={inputClass}
          />
          <button
            type="submit"
            aria-label="Add disturbance"
            disabled={!newParent.trim()}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-border bg-card disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </form>
      ) : null}
    </div>
  );
}

function AddIdea({ disabled, onAdd }: { disabled: boolean; onAdd: (way: string) => void }) {
  const [way, setWay] = useState("");
  return (
    <form
      className="mt-2 flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!way.trim() || disabled) return;
        onAdd(way.trim());
        setWay("");
      }}
    >
      <input
        value={way}
        disabled={disabled}
        onChange={(e) => setWay(e.target.value)}
        placeholder={disabled ? "Start the timer to add ideas" : "A way around it…"}
        className={inputClass}
      />
      <button
        type="submit"
        aria-label="Add idea"
        disabled={disabled || !way.trim()}
        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-foreground text-background disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </form>
  );
}

function EvaluateIdea({
  idea,
  onPatch,
  onChoose,
}: {
  idea: Row;
  onPatch: (patch: Record<string, string>) => void;
  onChoose: () => void;
}) {
  const chosen = idea["chosen"] === true;
  return (
    <div
      className={`rounded-xl border p-3 ${chosen ? "border-foreground" : "border-border"} ${idea.seed ? "bg-secondary/60" : "bg-card"}`}
    >
      <div className="flex items-start gap-2">
        <p className="flex-1 text-sm font-semibold">{String(idea["way"] ?? "")}</p>
        <button
          type="button"
          onClick={onChoose}
          aria-pressed={chosen}
          className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${chosen ? "bg-foreground text-background" : "bg-secondary"}`}
        >
          <Star className="h-3 w-3" /> {chosen ? "My solution" : "Choose"}
        </button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <input
          aria-label="Pros"
          defaultValue={String(idea["pros"] ?? "")}
          onBlur={(e) => onPatch({ pros: e.target.value })}
          placeholder="Pros"
          className={`${inputClass} py-2 text-xs`}
        />
        <input
          aria-label="Cons"
          defaultValue={String(idea["cons"] ?? "")}
          onBlur={(e) => onPatch({ cons: e.target.value })}
          placeholder="Cons"
          className={`${inputClass} py-2 text-xs`}
        />
      </div>
    </div>
  );
}
