import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check } from "lucide-react";
import { Chip, ChipRow } from "@/components/kit/chip";

/* The interactive chip: a filter, a choice, a suggestion. A selected chip always switches to
 * the solid tone, which is what every filter row in the app does, so `selected` wins over
 * whatever `tone` is set. */

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
  render: function States() {
    const [on, setOn] = useState("Sleep");
    return (
      <div className="grid gap-3">
        <ChipRow>
          {["Sleep", "Stress", "Mood"].map((t) => (
            <Chip key={t} selected={on === t} onClick={() => setOn(t)}>
              {t}
            </Chip>
          ))}
        </ChipRow>
        <ChipRow>
          <Chip selected icon={<Check className="h-3.5 w-3.5" />}>
            Selected
          </Chip>
          <Chip disabled>Disabled</Chip>
          <Chip onRemove={() => {}} removeLabel="Remove filter">
            Removable
          </Chip>
        </ChipRow>
      </div>
    );
  },
};
