import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkline } from "@/components/kit/chart";

/* A value over time: mood across a fortnight, an assessment score across repeats.
 *
 * A gap in the data is a gap in the line. `null` breaks the series into segments rather than
 * dropping it to the floor, because a missing day drawn as zero reads as a terrible day.
 *
 * `label` is required — a chart with no text alternative is a decoration, and a decoration
 * passes an empty label to mark itself `aria-hidden`. */

const meta = { title: "Kit/Sparkline", component: Sparkline } satisfies Meta<typeof Sparkline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const MoodOverTime: Story = {
  args: {
    values: [3, 4, 4, 2, 3, 5, 4],
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
    gridAt: [1, 3, 5],
    label: "Mood over the last 7 days, with days not logged",
  },
};

export const ScoreTrend: Story = {
  args: {
    values: [18, 15, 12, 11, 7],
    min: 0,
    max: 27,
    label: "PHQ-9 score across five sittings, 0 to 27",
    stroke: "var(--calm-strong)",
    dot: "var(--calm-strong)",
  },
};
