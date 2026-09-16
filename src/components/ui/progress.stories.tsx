import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./progress";

const meta = {
  title: "UI kit/Progress",
  component: Progress,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Quarter: Story = { args: { value: 25 } };
export const Half: Story = { args: { value: 50 } };
export const Full: Story = { args: { value: 100 } };
