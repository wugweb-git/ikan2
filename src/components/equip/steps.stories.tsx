import type { Meta, StoryObj } from "@storybook/react-vite";
import { fixtureCtx, fixtureDiaryRows, fixtureStep } from "@/lib/equip/storybook-fixtures";
import { Footer } from "./steps";
import { StepView } from "./steps";

/* Every kind of Equip day step, dispatched through the real StepView switch. Each story uses a
 * real step pulled from a live programme's content (see storybook-fixtures.ts) rather than a
 * hand-built fake, so this stays true to what a day actually shows. Saved answers go to a
 * "storybook.*" localStorage key, never the real programme's. */

const meta = {
  title: "Equip/Blocks/StepView",
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StepView>;

export default meta;
type Story = StoryObj<typeof meta>;

function render(ui: Parameters<typeof fixtureStep>[0]) {
  const { programme, day, step } = fixtureStep(ui);
  const ctx = fixtureCtx(programme.slug, day.day);
  const diaryRows = ui === "diary" ? fixtureDiaryRows(programme.slug) : [];
  return (
    <div className="px-4 pt-6">
      <StepView step={step} ctx={ctx} diaryRows={diaryRows} />
    </div>
  );
}

export const Lesson: Story = { render: () => render("lesson") };
export const Choice: Story = { render: () => render("choice") };
export const Scale: Story = { render: () => render("scale") };
export const Text: Story = { render: () => render("text") };
export const Diary: Story = { render: () => render("diary") };
export const Sort: Story = { render: () => render("sort") };
export const Statements: Story = { render: () => render("statements") };
export const Conclude: Story = { render: () => render("conclude") };
