import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QuickPicks } from "@/components/equip/m3";

/* Answers from earlier days, offered back as one-tap picks. It renders nothing when there are
 * no items, so the caller does not have to guard. Taps suppress the mousedown so the keyboard
 * does not close and move the sheet out from under the finger. */

const meta = { title: "M3/QuickPicks", component: QuickPicks } satisfies Meta<typeof QuickPicks>;
export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { label: "A deadline at work", value: "A deadline at work" },
  { label: "Money worries", value: "Money worries" },
  { label: "An argument at home", value: "An argument at home" },
];

export const Default: Story = {
  args: { items, selected: items[0]!.value, onPick: () => {} },
  render: function Default(args) {
    const [picked, setPicked] = useState(items[0]!.value);
    return <QuickPicks {...args} selected={picked} onPick={setPicked} />;
  },
};

export const CustomTitle: Story = {
  args: { title: "Tap to reuse an earlier answer", items, onPick: () => {} },
};

export const Empty: Story = {
  args: { items: [], onPick: () => {} },
};
