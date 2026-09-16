import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea";

const meta = {
  title: "UI kit/Textarea",
  component: Textarea,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { placeholder: "Write your message here" } };
export const Disabled: Story = { args: { placeholder: "Write your message here", disabled: true } };
