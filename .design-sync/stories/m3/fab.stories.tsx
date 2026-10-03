import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { Fab } from "@/components/equip/m3";

/* The floating action button: one per screen at most, for the screen's single obvious
 * action. The extended form shows the label beside the icon. */

const meta = { title: "M3/Fab", component: Fab } satisfies Meta<typeof Fab>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "New entry", children: <Plus className="h-6 w-6" /> },
};

export const Extended: Story = {
  args: { label: "New entry", extended: true, children: <Plus className="h-5 w-5" /> },
};
