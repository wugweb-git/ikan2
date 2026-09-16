import type { Meta, StoryObj } from "@storybook/react-vite";
import { Reveal } from "./reveal";

/* Fades and rises children in once they scroll into view — used on the About and info pages.
 * Scroll the canvas to see it trigger. */

const meta = {
  title: "App/Reveal",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ScrollToReveal: Story = {
  render: () => (
    <div className="space-y-[60vh] p-6">
      <p className="text-[13px] text-muted-foreground">Scroll down ↓</p>
      <Reveal className="rounded-[20px] bg-[var(--accent-container)] p-6 text-[15px]">
        This section rises in once it enters the viewport.
      </Reveal>
      <Reveal delay={150} className="rounded-[20px] border border-foreground/10 p-6 text-[15px]">
        This one has a 150ms delay after it.
      </Reveal>
    </div>
  ),
};
