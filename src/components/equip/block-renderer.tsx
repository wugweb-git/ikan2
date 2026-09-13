import type { Block, Unit } from "@/lib/equip/types";
import { CloseBlock } from "./blocks/close";
import { DiaryBlock } from "./blocks/diary";
import { DrillBlock } from "./blocks/drill";
import { NestedBlock } from "./blocks/nested";
import { PoolBlock } from "./blocks/pool";
import { RecordBlock } from "./blocks/record";
import { ScaleBlock } from "./blocks/scale";
import { SummariseBlock } from "./blocks/summarise";
import { TeachBlock } from "./blocks/teach";
import { TimedBlock } from "./blocks/timed";

/** One block per screen. Role (beat) and interaction (kind) stay separate. */
export function BlockRenderer({ block, unit }: { block: Block; unit: Unit }) {
  switch (block.kind) {
    case "teach":
      return <TeachBlock block={block} />;
    case "drill":
      return <DrillBlock block={block} />;
    case "pool":
      return <PoolBlock block={block} />;
    case "record":
      return <RecordBlock block={block} unit={unit.n} />;
    case "nested":
      return <NestedBlock block={block} unit={unit.n} />;
    case "timed":
      return <TimedBlock block={block} unit={unit.n} />;
    case "scale":
      return <ScaleBlock block={block} unit={unit.n} />;
    case "diary":
      return <DiaryBlock block={block} unit={unit.n} />;
    case "summarise":
      return <SummariseBlock block={block} />;
    case "close":
      return <CloseBlock block={block} unit={unit} />;
  }
}
