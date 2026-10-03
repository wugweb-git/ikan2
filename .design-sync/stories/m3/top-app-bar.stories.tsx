import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { IconButton, TopAppBar } from "@/components/equip/m3";

/* The 64dp bar at the top of a programme screen. It carries the notch padding itself, so it
 * uses a minimum height rather than a fixed one. */

const meta = { title: "M3/TopAppBar", component: TopAppBar } satisfies Meta<typeof TopAppBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithBack: Story = {
  args: {
    title: "Day 4",
    leading: (
      <IconButton label="Back">
        <ArrowLeft className="h-5 w-5" />
      </IconButton>
    ),
  },
};

export const WithSubtitleAndAction: Story = {
  args: {
    title: "Sleep Tight",
    subtitle: "Day 4 of 7",
    leading: (
      <IconButton label="Back">
        <ArrowLeft className="h-5 w-5" />
      </IconButton>
    ),
    trailing: (
      <IconButton label="More">
        <MoreVertical className="h-5 w-5" />
      </IconButton>
    ),
  },
};
