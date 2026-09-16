import type { Meta, StoryObj } from "@storybook/react-vite";
import { DayCheckIn } from "./day-check-in";

/* End-of-day rating, always shown inside that day's conclusion. Saves to a "storybook.*"
 * localStorage key as you interact with it, never the real programme's. */

const meta = {
  title: "Equip/Blocks/DayCheckIn",
  component: DayCheckIn,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DayCheckIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { slug: "storybook.sleep-tight", day: 4 },
  render: (args) => (
    <div className="px-4">
      <DayCheckIn {...args} />
    </div>
  ),
};

export const WithConclusionPrompt: Story = {
  args: {
    slug: "storybook.sleep-tight",
    day: 9,
    prompt: "What's one thing you noticed about your sleep this week?",
    text: "",
    onText: () => {},
  },
  render: (args) => (
    <div className="px-4">
      <DayCheckIn {...args} />
    </div>
  ),
};
