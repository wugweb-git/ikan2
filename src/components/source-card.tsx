import { ArrowUpRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { stateLayer } from "@/components/equip/m3";
import type { Resource } from "@/lib/resources";

/* Where a shared piece came from. This used to be a line of italics at the bottom of the prose,
 * which read as an afterthought and buried the one link a reader might actually want: the
 * publisher's own page. It is a card now, after the article and before anything the app is
 * selling, so credit sits where credit is due and the facts about the piece - what it costs,
 * what language it is in, what licence it carries - are legible rather than parenthetical. */
export function SourceCard({ source }: { source: NonNullable<Resource["source"]> }) {
  const facts = [source.cost, source.language, source.licence].filter(Boolean);
  const inner = (
    <>
      <span className="flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.04em] text-muted-foreground uppercase">
        <Info className="h-3.5 w-3.5" aria-hidden="true" /> Source
      </span>
      <span className="mt-1.5 flex items-start gap-3">
        <span className="min-w-0 flex-1">
          <span className="type-title-md block">{source.name}</span>
          {source.note ? (
            <span className="type-body-sm mt-0.5 block text-muted-foreground">{source.note}</span>
          ) : null}
          {facts.length ? (
            <span className="mt-2 flex flex-wrap gap-1.5">
              {facts.map((f) => (
                <span key={f} className="type-label-md rounded-full bg-background px-2.5 py-1">
                  {f}
                </span>
              ))}
            </span>
          ) : null}
        </span>
        {source.url ? (
          <ArrowUpRight
            className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        ) : null}
      </span>
      {source.url ? (
        <span className="type-body-sm font-semibold mt-3 block text-[var(--accent-strong)]">
          Open the original
        </span>
      ) : null}
    </>
  );

  const box = "mt-10 block rounded-[20px] bg-secondary p-4";
  if (!source.url) return <div className={box}>{inner}</div>;
  return (
    <a href={source.url} target="_blank" rel="noopener noreferrer" className={cn(box, stateLayer)}>
      {inner}
    </a>
  );
}
