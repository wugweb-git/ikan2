import type { Meta, StoryObj } from "@storybook/react-vite";
import { BookOpen } from "lucide-react";
import { withRouter } from "../../../.storybook/decorators";
import { IconButton } from "./m3";
import { BackLink, ProgramHeader } from "./program-header";

/* The header every Equip day and programme page shares: a back control, an optional title, and
 * an optional action on the right. BackLink needs router context (it's a real Link), so that
 * story is decorated; ProgramHeader itself takes plain nodes and doesn't require it. */

const meta = {
  title: "Equip/Blocks/ProgramHeader",
  component: ProgramHeader,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ProgramHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const plainBack = (
  <IconButton label="Back" onClick={() => {}} className="h-11 w-11 rounded-full bg-secondary/70">
    <span aria-hidden="true">←</span>
  </IconButton>
);

export const TitleOnly: Story = {
  args: { back: plainBack, title: "Day 4" },
};

export const WithAction: Story = {
  args: {
    back: plainBack,
    title: "Sleep Tight",
    action: (
      <IconButton label="Learning diary" onClick={() => {}} className="h-11 w-11">
        <BookOpen className="h-5 w-5" />
      </IconButton>
    ),
  },
};

export const RealBackLink: Story = {
  decorators: [withRouter("/program/sleep-tight")],
  args: { back: <BackLink to="/program/$slug" slug="sleep-tight" />, title: "Day 4" },
};
