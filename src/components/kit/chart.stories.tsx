import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bars, Dial, ProgressRing, Sparkline } from "./chart";

/* Four shapes cover every chart in the app. `label` is required: a chart with no text
 * alternative is a decoration, and a decoration passes an empty label instead. */

const meta = { title: "Kit/Chart", component: Sparkline } satisfies Meta<typeof Sparkline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const MoodLine: Story = {
  args: {
    values: [3, 4, 4, 2, null, 5, 4],
    min: 1,
    max: 5,
    gridAt: [1, 3, 5],
    label: "Mood over the last 7 days, 1 to 5",
  },
};

export const GapsBreakTheLine: Story = {
  args: {
    values: [2, null, null, 4, 5, null, 3],
    min: 1,
    max: 5,
    label: "Mood with missing days",
  },
};

export const Ring: Story = {
  args: { values: [], label: "" },
  render: () => (
    <div className="flex gap-6 rounded-[24px] bg-foreground p-6 text-white">
      <ProgressRing value={72} label="Wellness score 72 of 100" size={160}>
        <div>
          <p className="font-display text-[44px] font-bold leading-none tabular-nums">72</p>
          <p className="mt-1 text-[13px] opacity-70">Good · of 100</p>
        </div>
      </ProgressRing>
      <ProgressRing value={null} label="No score yet" size={160}>
        <p className="font-display text-[44px] font-bold leading-none">—</p>
      </ProgressRing>
    </div>
  ),
};

export const Columns: Story = {
  args: { values: [], label: "" },
  render: () => (
    <div className="space-y-3">
      <Bars values={[4, 6, 5, 7, null, 8, 6]} label="Sleep hours this week" />
      <Bars values={[2, 3, 1, 4, 4, 5, 3]} label="Journal entries this week" color="var(--calm)" />
    </div>
  ),
};

export const Dials: Story = {
  args: { values: [], label: "" },
  render: () => (
    <div className="flex gap-4">
      <Dial value={4} max={7} label="4 of 7 days">
        4/7
      </Dial>
      <Dial value={7} max={7} label="7 of 7 days" color="var(--mind)">
        7/7
      </Dial>
    </div>
  ),
};
