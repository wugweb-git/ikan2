import type { Meta, StoryObj } from "@storybook/react-vite";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

const meta = {
  title: "UI kit/HoverCard",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger className="underline underline-offset-4">@ikan</HoverCardTrigger>
      <HoverCardContent>
        <p className="text-[14px] font-semibold">iKAN</p>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Self-guided mental health programmes.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
};
