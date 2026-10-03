import type { Meta, StoryObj } from "@storybook/react-vite";
import { LinearProgress } from "@/components/equip/m3";

/* Progress through a programme day, as a percentage. The filled segment uses the
 * programme's accent and the remainder its container tint. */

const meta = {
  title: "M3/LinearProgress",
  component: LinearProgress,
} satisfies Meta<typeof LinearProgress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { value: 45 } };

export const Range: Story = {
  args: { value: 45 },
  render: () => (
    <div className="grid gap-4">
      {[0, 25, 50, 75, 100].map((v) => (
        <LinearProgress key={v} value={v} />
      ))}
    </div>
  ),
};
