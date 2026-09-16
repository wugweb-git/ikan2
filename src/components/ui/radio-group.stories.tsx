import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
  title: "UI kit/RadioGroup",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Default() {
    const [value, setValue] = useState("comfortable");
    return (
      <RadioGroup value={value} onValueChange={setValue}>
        {[
          ["default", "Default"],
          ["comfortable", "Comfortable"],
          ["compact", "Compact"],
        ].map(([v, label]) => (
          <div key={v} className="flex items-center gap-2">
            <RadioGroupItem value={v!} id={v} />
            <Label htmlFor={v}>{label}</Label>
          </div>
        ))}
      </RadioGroup>
    );
  },
};
