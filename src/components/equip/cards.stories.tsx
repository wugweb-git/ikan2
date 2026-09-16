import type { Meta, StoryObj } from "@storybook/react-vite";
import { fixtureCtx, fixtureStep } from "@/lib/equip/storybook-fixtures";
import { EntriesStep, ReviewStep, TrackerStep } from "./cards";

/* The three list-shaped Equip blocks: multi-entry logs, the end-of-programme review of what was
 * logged, and the daily habit tracker. Each uses a real step from production content (see
 * storybook-fixtures.ts). They're fully interactive — adding, editing and removing an entry here
 * really saves, but to a "storybook.*" localStorage key, never the real programme's. */

const meta = {
  title: "Equip/Blocks",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Entries: Story = {
  render: () => {
    const { programme, day, step } = fixtureStep("entries");
    return (
      <div className="px-4 pt-6">
        <EntriesStep step={step} view={step.view} ctx={fixtureCtx(programme.slug, day.day)} />
      </div>
    );
  },
};

export const Review: Story = {
  render: () => {
    const { programme, day, step } = fixtureStep("review");
    return (
      <div className="px-4 pt-6">
        <ReviewStep step={step} view={step.view} ctx={fixtureCtx(programme.slug, day.day)} />
      </div>
    );
  },
};

export const Tracker: Story = {
  render: () => {
    const { programme, day, step } = fixtureStep("tracker");
    return (
      <div className="px-4 pt-6">
        <TrackerStep step={step} view={step.view} ctx={fixtureCtx(programme.slug, day.day)} />
      </div>
    );
  },
};
