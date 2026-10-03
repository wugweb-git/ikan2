import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressRing } from "@/components/kit/chart";

/* The big score gauge on the wellness screen. The arc animates to its value and respects
 * reduced motion. `value: null` draws an empty ring, for before the first result exists —
 * which is the state a new account is in, so it is not an edge case. */

const meta = {
  title: "Kit/ProgressRing",
  component: ProgressRing,
} satisfies Meta<typeof ProgressRing>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Scored: Story = {
  args: {
    value: 72,
    label: "Wellness score 72 of 100",
    size: 180,
    children: (
      <div>
        <p className="font-display text-[48px] font-bold leading-none tabular-nums">72</p>
        <p className="mt-1 text-[13px] opacity-70">Good · of 100</p>
      </div>
    ),
  },
};

export const NoScoreYet: Story = {
  args: {
    value: null,
    label: "No wellness score yet",
    size: 180,
    children: (
      <div>
        <p className="font-display text-[48px] font-bold leading-none">—</p>
        <p className="mt-1 text-[13px] opacity-70">of 100</p>
      </div>
    ),
  },
};

export const Thin: Story = {
  args: {
    value: 40,
    label: "Forty per cent complete",
    size: 120,
    thickness: 8,
    children: <p className="font-display text-[22px] font-bold tabular-nums">40%</p>,
  },
};
