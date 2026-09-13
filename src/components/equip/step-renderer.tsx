import type { Step } from "@/lib/equip/types";
import { ChoiceStep, ConcludeStep, LessonStep, ReflectStep, ScaleStep } from "./steps/basic";
import { EntriesStep, ReviewStep, TrackerStep } from "./steps/cards";
import { DiaryStep } from "./steps/diary";
import { SortStep } from "./steps/sort";

type Props = {
  step: Step;
  slug: string;
  day: number;
  isLastDay: boolean;
  onNext: () => void;
  onBack: (() => void) | undefined;
};

export function StepRenderer({ step, isLastDay, ...ctx }: Props) {
  switch (step.kind) {
    case "lesson":
      return <LessonStep step={step} {...ctx} />;
    case "choice":
      return <ChoiceStep step={step} {...ctx} />;
    case "scale":
      return <ScaleStep step={step} {...ctx} />;
    case "reflect":
      return <ReflectStep step={step} {...ctx} />;
    case "diary":
      return <DiaryStep {...ctx} />;
    case "sort":
      return <SortStep step={step} {...ctx} />;
    case "entries":
      return <EntriesStep step={step} {...ctx} />;
    case "review":
      return <ReviewStep step={step} {...ctx} />;
    case "tracker":
      return <TrackerStep step={step} {...ctx} />;
    case "conclude":
      return <ConcludeStep step={step} isLastDay={isLastDay} {...ctx} />;
  }
}
