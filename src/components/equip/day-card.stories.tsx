import type { Meta, StoryObj } from "@storybook/react-vite";
import { DayCard } from "./day-card";

/* One finished programme day, collapsed to its title, opening to show what was written or
 * chosen — used on My history and the learning diary pages. */

const meta = {
  title: "Equip/Blocks/DayCard",
  component: DayCard,
} satisfies Meta<typeof DayCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const responses = [
  { title: "Lights out", lines: ["10:45 PM"] },
  { title: "Woke up", lines: ["6:30 AM"] },
  { title: "Sleep quality", lines: ["Fair"] },
];

export const Onboarding: Story = {
  args: { title: "Onboarding", day: 0, responses: [], at: "2026-09-01T09:00:00.000Z" },
};

export const WithAnswers: Story = {
  args: {
    title: "Falling asleep",
    day: 4,
    responses,
    at: "2026-09-05T21:10:00.000Z",
    seconds: 245,
    feedback: { feel: 4, note: "Slept better than I expected.", at: "2026-09-05T21:12:00.000Z" },
  },
};

export const NoTimestamp: Story = {
  args: { title: "Set your goal", day: 1, responses: responses.slice(0, 1) },
};
