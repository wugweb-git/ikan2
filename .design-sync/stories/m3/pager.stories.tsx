import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Brain, Heart } from "lucide-react";
import { Pager } from "@/components/equip/m3";

/* One card per page, swiped sideways, with dots that are also tabs. With `peek` the next card
 * shows its edge, so it is clear there is more than one. */

const meta = { title: "M3/Pager", component: Pager } satisfies Meta<typeof Pager>;
export default meta;
type Story = StoryObj<typeof meta>;

const card = (title: string, body: string, Icon: typeof Brain) => (
  <div className="rounded-[24px] border border-foreground/10 bg-background p-4">
    <Icon className="mb-2 h-5 w-5" aria-hidden="true" />
    <p className="font-display text-[16px] font-semibold">{title}</p>
    <p className="mt-1 text-[14px] text-muted-foreground">{body}</p>
  </div>
);

const pages = [
  card("I'll never finish this", "Thought", Brain),
  card("Tight chest, restless", "Feeling", Heart),
  card("I got through it before", "Reframe", Brain),
];

export const Peeking: Story = {
  args: { pages, index: 0, onIndex: () => {} },
  render: function Peeking() {
    const [i, setI] = useState(0);
    return <Pager pages={pages} index={i} onIndex={setI} />;
  },
};

export const FullWidth: Story = {
  args: { pages, index: 0, onIndex: () => {}, peek: false },
  render: function FullWidth() {
    const [i, setI] = useState(0);
    return <Pager pages={pages} index={i} onIndex={setI} peek={false} />;
  },
};
