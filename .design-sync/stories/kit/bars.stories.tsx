import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bars } from "@/components/kit/chart";

/* A column series, as the wellness metric rows draw it. Heights are a share of the tallest
 * bar unless `max` fixes a ceiling, so the shape survives any unit. A `null` renders as a
 * stub in the track colour — present but not logged, which is not the same as zero. */

const meta = { title: "Kit/Bars", component: Bars } satisfies Meta<typeof Bars>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SleepHours: Story = {
  args: { values: [6, 7, 5.5, 8, 7.5, 6, 7], label: "Sleep hours over the last 7 days" },
};

export const WithMissingDays: Story = {
  args: { values: [4, 6, null, 7, null, 8, 6], label: "Sleep hours, with days not logged" },
};

export const Rows: Story = {
  args: { values: [4, 6, 5], label: "" },
  render: () => (
    <div className="grid gap-3">
      <Bars values={[6, 7, 5.5, 8, 7.5, 6, 7]} label="Sleep hours this week" />
      <Bars values={[2, 3, 1, 4, 4, 5, 3]} label="Journal entries this week" color="var(--calm)" />
      <Bars
        values={[40, 55, 30, 70, 65, 80, 60]}
        label="Active minutes this week"
        color="var(--mind)"
      />
    </div>
  ),
};
