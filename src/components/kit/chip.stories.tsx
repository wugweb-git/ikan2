import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check, Clock3 } from "lucide-react";
import { Chip, ChipRow, MetricPill, Pill } from "./chip";

/* Chip is the interactive one (filters, suggestions); Pill is the static label. The selected
 * chip always uses the solid tone, which is what every filter row in the app does. */

const meta = { title: "Kit/Chip", component: Chip } satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Anxiety" } };

export const Tones: Story = {
  args: { children: "Chip" },
  render: () => (
    <ChipRow>
      <Chip tone="neutral">Neutral</Chip>
      <Chip tone="outline">Outline</Chip>
      <Chip tone="accent">Accent</Chip>
      <Chip tone="success">Mild</Chip>
      <Chip tone="danger">Severe</Chip>
      <Chip selected>Selected</Chip>
    </ChipRow>
  ),
};

export const Sizes: Story = {
  args: { children: "Chip" },
  render: () => (
    <ChipRow>
      <Chip size="sm">Small</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="lg">Large</Chip>
    </ChipRow>
  ),
};

export const States: Story = {
  args: { children: "Chip" },
  render: () => (
    <ChipRow>
      <Chip>Rest</Chip>
      <Chip selected icon={<Check className="h-3.5 w-3.5" />}>
        Selected
      </Chip>
      <Chip disabled>Disabled</Chip>
      <Chip onRemove={() => {}} removeLabel="Remove filter">
        Removable
      </Chip>
    </ChipRow>
  ),
};

export const Pills: Story = {
  args: { children: "Chip" },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Pill icon={<Clock3 className="h-4 w-4" />}>7 min</Pill>
      <Pill tone="success">On track</Pill>
      <MetricPill value="4.2" label="avg mood" />
      <MetricPill value="12" label="entries" tone="accent" />
    </div>
  ),
};
