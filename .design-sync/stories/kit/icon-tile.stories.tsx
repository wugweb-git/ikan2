import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlaskConical, Handshake, HeartHandshake, Sparkles } from "lucide-react";
import { IconTile } from "@/components/kit/brand";

/* An icon in a brand hue on an 8% tint of itself — the "Science Backed" flask from the first
 * iKAN site. The tint is mixed from the one hue token rather than stored separately, so a hue
 * can never drift from its own wash, and `color-mix` with transparent means it sits correctly
 * on any surface including the dark theme. */

const meta = { title: "Kit/IconTile", component: IconTile } satisfies Meta<typeof IconTile>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { hue: "coral", children: <FlaskConical /> },
};

export const Hues: Story = {
  args: { children: <FlaskConical /> },
  render: () => (
    <div className="flex items-center gap-4">
      <IconTile hue="teal">
        <HeartHandshake />
      </IconTile>
      <IconTile hue="amber">
        <Sparkles />
      </IconTile>
      <IconTile hue="coral">
        <FlaskConical />
      </IconTile>
      <IconTile hue="slate">
        <Handshake />
      </IconTile>
    </div>
  ),
};

export const SizesAndShapes: Story = {
  args: { children: <FlaskConical /> },
  render: () => (
    <div className="flex items-center gap-4">
      <IconTile hue="coral" size="sm">
        <FlaskConical />
      </IconTile>
      <IconTile hue="coral" size="md">
        <FlaskConical />
      </IconTile>
      <IconTile hue="coral" size="lg">
        <FlaskConical />
      </IconTile>
      <IconTile hue="teal" shape="square">
        <HeartHandshake />
      </IconTile>
      <IconTile hue="amber" bordered>
        <Sparkles />
      </IconTile>
    </div>
  ),
};
