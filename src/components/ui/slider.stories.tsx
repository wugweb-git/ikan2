import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "./slider";

const meta = {
  title: "UI kit/Slider",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: function Interactive() {
    const [value, setValue] = useState([50]);
    return <Slider value={value} onValueChange={setValue} max={100} step={1} className="w-64" />;
  },
};

export const Range: Story = {
  render: function Range() {
    const [value, setValue] = useState([25, 75]);
    return <Slider value={value} onValueChange={setValue} max={100} step={1} className="w-64" />;
  },
};
