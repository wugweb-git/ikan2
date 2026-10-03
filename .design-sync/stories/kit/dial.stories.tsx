import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dial } from "@/components/kit/chart";

/* A small conic dial for one share — "4 of 7 days". Drawn with a conic gradient rather than
 * SVG so it matches the `ring-dial` utility already in the stylesheet, and the two stay
 * interchangeable. */

const meta = { title: "Kit/Dial", component: Dial } satisfies Meta<typeof Dial>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 4, max: 7, label: "4 of 7 days logged", children: "4/7" },
};

export const ARow: Story = {
  args: { value: 4, max: 7, label: "4 of 7 days logged", children: "4/7" },
  render: () => (
    <div className="flex items-center gap-4">
      <Dial value={2} max={7} label="2 of 7 days logged">
        2/7
      </Dial>
      <Dial value={4} max={7} label="4 of 7 days logged" color="var(--mind)">
        4/7
      </Dial>
      <Dial value={7} max={7} label="7 of 7 days logged" color="var(--calm)">
        7/7
      </Dial>
      <Dial value={60} max={100} label="60 per cent" size={60} color="var(--rest)">
        60%
      </Dial>
    </div>
  ),
};
