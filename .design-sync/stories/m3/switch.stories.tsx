import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "@/components/equip/m3";

/* M3 switch: a 52×32 track whose thumb grows and gains a tick when on, so the state reads
 * without relying on colour alone. `label` is required — it is the accessible name. */

const meta = { title: "M3/Switch", component: Switch } satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const On: Story = { args: { checked: true, onChange: () => {}, label: "Daily reminder" } };
export const Off: Story = { args: { checked: false, onChange: () => {}, label: "Daily reminder" } };

export const InASettingsRow: Story = {
  args: { checked: true, onChange: () => {}, label: "Daily reminder" },
  render: function InASettingsRow() {
    const [on, setOn] = useState(true);
    const [motion, setMotion] = useState(false);
    return (
      <div className="grid gap-4">
        {[
          ["Daily reminder", on, setOn] as const,
          ["Reduce motion", motion, setMotion] as const,
        ].map(([label, value, set]) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-[15px]">{label}</span>
            <Switch checked={value} onChange={set} label={label} />
          </div>
        ))}
      </div>
    );
  },
};
