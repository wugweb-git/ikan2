import cover from "@/assets/equip-sleep-tight.jpg";
import type { Block } from "@/lib/equip/types";
import { BlockHeading } from "../fields";

export function TeachBlock({ block }: { block: Extract<Block, { kind: "teach" }> }) {
  return (
    <div>
      {block.image ? (
        <img
          src={cover}
          alt=""
          className="mb-6 aspect-[16/10] w-full rounded-[20px] object-cover"
        />
      ) : null}
      <BlockHeading eyebrow="Learn" title={block.title} />
      <div className="mt-4 space-y-4 text-[15px] leading-7 text-foreground/85">
        {block.body?.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {block.bullets?.length ? (
        <ul className="mt-5 space-y-2.5">
          {block.bullets.map((bullet, i) => (
            <li key={bullet} className="surface flex gap-3 p-4 text-sm leading-6">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary font-display text-[11px] font-bold">
                {i + 1}
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
