import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type TouchEvent } from "react";
import { ArrowLeft, ArrowRight, Check, LifeBuoy, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockRenderer } from "@/components/equip/block-renderer";
import { getUnit } from "@/lib/equip/program";
import { useEquipProgress } from "@/lib/equip/store";
import type { Beat, Unit } from "@/lib/equip/types";

export const Route = createFileRoute("/program/sleep-tight/unit/$unit")({
  loader: ({ params }) => {
    const unit = getUnit(Number(params.unit));
    if (!unit) throw notFound();
    return { unit };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `Unit ${loaderData.unit.n} · ${loaderData.unit.title} — Sleep Tight — iKAN`
          : "Unit — Sleep Tight — iKAN",
      },
      {
        name: "description",
        content: "A Sleep Tight sitting: learn, practise and record, one screen at a time.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-canvas px-8 text-center">
      <div>
        <h1 className="font-display text-xl font-semibold">That unit doesn&rsquo;t exist</h1>
        <Button asChild className="mt-5">
          <Link to="/program/sleep-tight/units">Back to your units</Link>
        </Button>
      </div>
    </div>
  ),
  component: UnitPlayer,
});

const beats: { key: Beat; label: string; color: string }[] = [
  { key: "teach", label: "Teach", color: "bg-mind" },
  { key: "rehearse", label: "Rehearse", color: "bg-rest" },
  { key: "work", label: "Work", color: "bg-calm" },
  { key: "close", label: "Close", color: "bg-foreground" },
];

function UnitPlayer() {
  const { unit } = Route.useLoaderData();
  // Remount per unit so the screen index resets when moving between units.
  return <Player key={unit.n} unit={unit} />;
}

function Player({ unit }: { unit: Unit }) {
  const navigate = useNavigate();
  const { state, nextUnit, complete } = useEquipProgress();
  const [index, setIndex] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const total = unit.blocks.length;
  const block = unit.blocks[index];
  const isLast = index === total - 1;
  const isDone = state.completed.includes(unit.n);
  const locked = !isDone && unit.n > nextUnit;

  const go = (delta: number) => {
    setIndex((i) => Math.min(Math.max(i + delta, 0), total - 1));
    window.scrollTo({ top: 0 });
  };

  const finish = () => {
    complete(unit.n);
    navigate({ to: "/program/sleep-tight/units" });
  };

  const onTouchStart = (e: TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("input, textarea, button, [role=radio]")) return;
    const t = e.touches[0];
    touch.current = t ? { x: t.clientX, y: t.clientY } : null;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touch.current;
    const t = e.changedTouches[0];
    touch.current = null;
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(t.clientY - start.y) * 1.5)
      go(dx < 0 ? 1 : -1);
  };

  if (locked) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas px-8 text-center">
        <div className="surface max-w-sm p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="mt-5 font-display text-xl font-semibold">Unit {unit.n} opens later</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Finish Unit {nextUnit} first. One sitting at a time keeps the habit steady.
          </p>
          <Button asChild className="mt-6 w-full">
            <Link to="/program/sleep-tight/unit/$unit" params={{ unit: String(nextUnit) }}>
              Go to Unit {nextUnit}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!block) return null;
  const currentBeat = beats.findIndex((b) => b.key === block.beat);

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background shadow-app">
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-xl">
          <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2 px-4 pt-3">
            <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-full">
              <Link to="/program/sleep-tight/units" aria-label="Close unit">
                <X />
              </Link>
            </Button>
            <div className="min-w-0 text-center">
              <p className="eyebrow">
                Unit {unit.n} · {index + 1} of {total}
              </p>
              <p className="truncate font-display text-sm font-semibold">{unit.title}</p>
            </div>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-full text-alert-strong"
            >
              <Link to="/support" aria-label="Get support now">
                <LifeBuoy />
              </Link>
            </Button>
          </div>

          <div className="flex gap-1 px-4 pt-3" aria-hidden="true">
            {unit.blocks.map((b, i) => {
              const color = beats.find((beat) => beat.key === b.beat)?.color ?? "bg-foreground";
              return (
                <span
                  key={b.id}
                  className={`h-1 flex-1 rounded-full transition-opacity ${color} ${i <= index ? "opacity-100" : "opacity-20"}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between px-4 pb-2.5 pt-2 text-[10px] font-semibold">
            {beats.map((beat, i) => (
              <span
                key={beat.key}
                className={i === currentBeat ? "text-foreground" : "text-muted-foreground/60"}
              >
                {beat.label}
              </span>
            ))}
          </div>
        </header>

        <main
          className="flex-1 px-5 pb-40 pt-7"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div key={block.id} className="animate-fade-in">
            <BlockRenderer block={block} unit={unit} />
          </div>
        </main>

        <footer className="fixed inset-x-0 bottom-0 z-30 flex justify-center">
          <div className="flex w-full max-w-md items-center gap-3 border-t border-border bg-background/92 px-5 pb-6 pt-4 backdrop-blur-xl">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 shrink-0 rounded-full"
              onClick={() => go(-1)}
              disabled={index === 0}
              aria-label="Previous screen"
            >
              <ArrowLeft />
            </Button>
            {isLast ? (
              <Button className="h-12 flex-1 text-base" onClick={finish}>
                <Check /> {isDone ? "Back to units" : "Complete unit"}
              </Button>
            ) : (
              <Button className="h-12 flex-1 text-base" onClick={() => go(1)}>
                Continue <ArrowRight />
              </Button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
