import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectRow } from "@/components/equip/m3";

/* One row of a choice list: a radio by default, a checkbox with `multi`. 56dp tall, and the
 * whole row is the target rather than just the control. */

const meta = { title: "M3/SelectRow", component: SelectRow } satisfies Meta<typeof SelectRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: { selected: true, onClick: () => {}, children: "A thought" },
  render: function Single() {
    const [picked, setPicked] = useState("A thought");
    return (
      <div className="overflow-hidden rounded-[20px] border border-foreground/10">
        {["A thought", "A feeling", "A sensation"].map((o) => (
          <SelectRow key={o} selected={picked === o} onClick={() => setPicked(o)}>
            {o}
          </SelectRow>
        ))}
      </div>
    );
  },
};

export const Multi: Story = {
  args: { selected: true, multi: true, onClick: () => {}, children: "A feeling" },
  render: function Multi() {
    const [on, setOn] = useState<string[]>(["Tight chest"]);
    const toggle = (o: string) =>
      setOn((cur) => (cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o]));
    return (
      <div className="overflow-hidden rounded-[20px] border border-foreground/10">
        {["Tight chest", "Restless legs", "Racing thoughts"].map((o) => (
          <SelectRow key={o} multi selected={on.includes(o)} onClick={() => toggle(o)}>
            {o}
          </SelectRow>
        ))}
      </div>
    );
  },
};

export const WithGlyph: Story = {
  args: { selected: true, onClick: () => {}, glyph: "A", children: "A thought" },
  render: function WithGlyph() {
    const [picked, setPicked] = useState("A");
    return (
      <div className="overflow-hidden rounded-[20px] border border-foreground/10">
        {[
          ["A", "Activating event"],
          ["B", "Belief about it"],
          ["C", "Consequence"],
        ].map(([g, t]) => (
          <SelectRow key={g} glyph={g} selected={picked === g} onClick={() => setPicked(g!)}>
            {t}
          </SelectRow>
        ))}
      </div>
    );
  },
};
