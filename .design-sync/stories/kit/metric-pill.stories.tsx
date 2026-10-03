import type { Meta, StoryObj } from "@storybook/react-vite";
import { MetricPill } from "@/components/kit/chip";

/* A number above its label, for the stat rows on the home and result screens. The number is
 * tabular so a row of them does not jitter as values change. */

const meta = { title: "Kit/MetricPill", component: MetricPill } satisfies Meta<typeof MetricPill>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { value: "4.2", label: "avg mood" } };

export const ARow: Story = {
  args: { value: "4.2", label: "avg mood" },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <MetricPill value="4.2" label="avg mood" />
      <MetricPill value="12" label="entries" tone="accent" />
      <MetricPill value="7" label="day streak" tone="success" />
      <MetricPill value="6h 20m" label="slept" />
    </div>
  ),
};
