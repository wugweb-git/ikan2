import type { Meta, StoryObj } from "@storybook/react-vite";
import { Brain, Clock3, ListChecks } from "lucide-react";
import { accentStyle } from "@/components/equip/m3";
import {
  Card,
  CardEyebrow,
  CardFact,
  CardIcon,
  CardMeta,
  CardProgress,
  CardTitle,
  cardClass,
} from "./card";

/* One box, four radii, three fills. The named cards in the app — assessment, programme,
 * resource, consultant, history — are this box with different slots filled in. */

const meta = { title: "Kit/Card", component: Card } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  args: { children: null },
  render: () => (
    <div className="space-y-3">
      {(["filled", "outlined", "plain"] as const).map((tone) => (
        <Card key={tone} tone={tone} inset>
          <CardTitle>{tone}</CardTitle>
        </Card>
      ))}
    </div>
  ),
};

export const AssessmentCard: Story = {
  args: { children: null },
  render: () => (
    <div style={accentStyle("mind")} className={cardClass({ interactive: true, inset: true })}>
      <div className="flex items-center gap-4">
        <CardIcon>
          <Brain className="h-6 w-6" />
        </CardIcon>
        <span className="min-w-0 flex-1">
          <CardEyebrow>PHQ-9</CardEyebrow>
          <CardTitle>Feeling low or hopeless</CardTitle>
          <CardMeta>
            <CardFact icon={<ListChecks className="h-3.5 w-3.5" />}>9 questions</CardFact>
            <CardFact icon={<Clock3 className="h-3.5 w-3.5" />}>3 min</CardFact>
          </CardMeta>
        </span>
      </div>
    </div>
  ),
};

export const ProgrammeCard: Story = {
  args: { children: null },
  render: () => (
    <div style={accentStyle("calm")} className={cardClass({ interactive: true })}>
      <div className="flex">
        <span className="w-[112px] shrink-0 bg-[var(--accent-container)]" />
        <div className="flex min-w-0 flex-1 flex-col p-4">
          <CardTitle size="lg">Sleep Tight</CardTitle>
          <p className="mt-1 line-clamp-2 text-[14px] leading-5 text-muted-foreground">
            Seven days of small changes to how you wind down.
          </p>
          <CardProgress done={3} total={7} caption="Continue with day 4" className="mt-auto pt-3" />
        </div>
      </div>
    </div>
  ),
};
