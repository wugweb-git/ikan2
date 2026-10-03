import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Segmented } from "@/components/equip/m3";

/* The app's tab/choice control: a radiogroup laid out in equal columns, up to five. Used for
 * scale answers and for either/or questions, where it carries the Notion emoji. */

const meta = { title: "M3/Segmented", component: Segmented } satisfies Meta<typeof Segmented>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FivePoint: Story = {
  args: {
    label: "Sleep quality",
    options: ["Very poor", "Poor", "Fair", "Good", "Very good"],
    value: "Fair",
    onChange: () => {},
  },
  render: function FivePoint(args) {
    const [v, setV] = useState<string | undefined>("Fair");
    return <Segmented {...args} value={v} onChange={setV} />;
  },
};

export const TwoOptions: Story = {
  args: {
    label: "Was it a thought or a feeling?",
    options: ["Thought", "Feeling"],
    value: "Thought",
    onChange: () => {},
  },
  render: function TwoOptions(args) {
    const [v, setV] = useState<string | undefined>("Thought");
    return <Segmented {...args} value={v} onChange={setV} />;
  },
};

export const Unanswered: Story = {
  args: {
    label: "Did it help?",
    options: ["✅Yes", "❌No"],
    value: undefined,
    onChange: () => {},
  },
};
