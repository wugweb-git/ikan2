import type { Meta, StoryObj } from "@storybook/react-vite";
import { BellOff, BookOpen } from "lucide-react";
import { EmptyState } from "@/components/kit/empty";

/* An empty state names what will appear here and, where there is something to do, offers it.
 *
 * Two shapes, both taken from the screens that had written them by hand: `filled` where the
 * empty state is the whole screen and should still look finished, `dashed` where it sits
 * inside a screen that has other content, so it reads as a slot waiting to be filled. */

const meta = { title: "Kit/EmptyState", component: EmptyState } satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: {
    art: "mood",
    title: "Nothing here yet",
    children: "Finished assessments, completed programs and journal check-ins appear here.",
    action: (
      <span className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-[14px] font-semibold text-background">
        Log today’s mood
      </span>
    ),
  },
};

export const FilledWithIcon: Story = {
  args: {
    icon: <BellOff className="h-6 w-6" />,
    title: "All quiet",
    children: "Nothing needs you right now.",
  },
};

export const Dashed: Story = {
  args: {
    tone: "dashed",
    icon: <BookOpen className="h-6 w-6" />,
    title: "Nothing here yet",
    children: "What you write during each day shows up here.",
  },
};
