import type { Meta, StoryObj } from "@storybook/react-vite";
import { BellOff } from "lucide-react";
import { EmptyLine, EmptyState } from "./empty";

/* An empty state names what will appear here, and offers the way to make that happen when
 * there is one. */

const meta = { title: "Kit/EmptyState", component: EmptyState } satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithArt: Story = {
  args: {
    art: "mood",
    title: "Nothing here yet",
    children: "Finished assessments, completed programs and journal check-ins appear here.",
    action: (
      <span className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-[14px] font-semibold text-background">
        Write an entry
      </span>
    ),
  },
};

export const WithIcon: Story = {
  args: {
    icon: <BellOff className="h-6 w-6" />,
    title: "All quiet",
    children: "Nothing needs you right now.",
  },
};

export const Line: Story = {
  args: { title: "x", children: "y" },
  render: () => <EmptyLine>No results yet.</EmptyLine>,
};
