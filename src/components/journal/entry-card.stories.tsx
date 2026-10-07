import type { Meta, StoryObj } from "@storybook/react-vite";
import { EntryCard } from "./entry-card";

/* One saved check-in, as the journal and its history show it. */

const meta = {
  title: "App/Journal/EntryCard",
  component: EntryCard,
  parameters: { layout: "padded" },
} satisfies Meta<typeof EntryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { id: "j-1", date: "2026-09-22", createdAt: "2026-09-22T09:40:00.000Z" };

export const WithPain: Story = {
  args: {
    entry: {
      ...base,
      mood_rating: 4,
      sleep_rating: 3,
      stress_level: 2,
      pain_exist: true,
      pain_experience: 3,
      pain_impact: 2,
      freehand_text_content: "Back ache after the long drive.",
      context_tags: ["work", "health"],
    },
  },
};

export const NoPain: Story = {
  args: {
    entry: {
      ...base,
      mood_rating: 5,
      sleep_rating: 5,
      stress_level: 1,
      pain_exist: false,
      context_tags: ["fun"],
    },
    showDate: true,
  },
};

export const BeforeTheNewTemplate: Story = {
  args: {
    entry: { ...base, mood_rating: 3, energy: 4, stress_level: 2, context_tags: ["health"] },
    showDate: true,
  },
};
