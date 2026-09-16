import type { Meta, StoryObj } from "@storybook/react-vite";
import { AspectRatio } from "./aspect-ratio";

const meta = {
  title: "UI kit/AspectRatio",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Widescreen: Story = {
  render: () => (
    <div className="w-64">
      <AspectRatio ratio={16 / 9} className="rounded-md bg-secondary" />
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <div className="w-40">
      <AspectRatio ratio={1} className="rounded-md bg-secondary" />
    </div>
  ),
};
