import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "@/components/equip/m3";

/* Programme content is authored in Notion, where options are written like "✅Yes". Label
 * gives the emoji its own box so it cannot overlap the word, and keeps the full string
 * available to screen readers. */

const meta = { title: "M3/Label", component: Label } satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = { args: { text: "Thought or feeling?" } };

export const WithEmoji: Story = {
  args: { text: "✅Yes" },
  render: () => (
    <div className="grid gap-2 text-[16px]">
      <Label text="✅Yes" />
      <Label text="❌No" />
      <Label text="😊 Woke up rested" />
      <Label text="No emoji here" />
    </div>
  ),
};
