import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bold } from "lucide-react";
import { Toggle } from "./toggle";

const meta = {
  title: "UI kit/Toggle",
  component: Toggle,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { "aria-label": "Bold", children: <Bold /> },
};

export const Outline: Story = {
  args: { variant: "outline", "aria-label": "Bold", children: <Bold /> },
};
