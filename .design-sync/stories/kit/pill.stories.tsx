import type { Meta, StoryObj } from "@storybook/react-vite";
import { Clock3, HardDrive, ShieldCheck } from "lucide-react";
import { Pill } from "@/components/kit/chip";

/* The static counterpart to Chip: a label, a count, a status. It renders a <span>, has no
 * states and is never focusable — if it can be tapped, it is a Chip. */

const meta = { title: "Kit/Pill", component: Pill } satisfies Meta<typeof Pill>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "7 min" } };

export const WithIcons: Story = {
  args: { children: "7 min" },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Pill icon={<Clock3 className="h-4 w-4" />}>7 min</Pill>
      <Pill icon={<ShieldCheck className="h-4 w-4" />}>Never shared</Pill>
      <Pill icon={<HardDrive className="h-4 w-4" />}>Stored on this device</Pill>
    </div>
  ),
};

export const Tones: Story = {
  args: { children: "Pill" },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Pill>Neutral</Pill>
      <Pill tone="outline">Outline</Pill>
      <Pill tone="accent">Accent</Pill>
      <Pill tone="success">On track</Pill>
      <Pill tone="danger">Needs attention</Pill>
    </div>
  ),
};
