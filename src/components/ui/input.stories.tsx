import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";

const meta = {
  title: "UI kit/Input",
  component: Input,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { placeholder: "Email" } };
export const Disabled: Story = { args: { placeholder: "Email", disabled: true } };
export const Invalid: Story = { args: { placeholder: "Email", "aria-invalid": true } };
