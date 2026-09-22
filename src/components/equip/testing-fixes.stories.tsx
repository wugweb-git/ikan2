import type { Meta, StoryObj } from "@storybook/react-vite";
import { findStep, getProgramme, diaryRows } from "@/lib/equip/programs";
import { updateProgramme, type ProgrammeState } from "@/lib/equip/store";
import { StepView } from "./steps";

/* One story per fix from the first round of user testing (17–18 Sep 2026), each on the real step
 * from the programme content. Stories that need earlier answers seed them first, under a
 * "storybook.*" programme key so nothing reaches a real account. */

const meta = {
  title: "Equip/Testing fixes",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const now = new Date().toISOString();
const entry = (id: string, day: number, values: Record<string, string | boolean>) => ({
  id,
  day,
  createdAt: now,
  values,
});

function Show({
  slug,
  id,
  seed,
}: {
  slug: "sleep-tight" | "unburn" | "stress-buster";
  id: string;
  seed?: (s: ProgrammeState) => ProgrammeState;
}) {
  const p = getProgramme(slug)!;
  const step = findStep(p, id);
  if (!step) return <p className="p-4">No step {id}</p>;
  const key = `storybook.fix.${slug}.${id}`;
  if (seed) updateProgramme(key, (s) => seed({ ...s, collections: {}, answers: {}, tracker: {} }));
  const day = Number(id.split(".")[0]);
  return (
    <div className="px-4 pt-6">
      <StepView
        step={step}
        ctx={{ slug: key, day, isLast: false, onNext: () => {}, onBack: () => {} }}
        diaryRows={step.view.ui === "diary" ? diaryRows(p) : []}
      />
    </div>
  );
}

export const UnburnDay2SameCards: Story = { render: () => <Show slug="unburn" id="2.2" /> };
export const UnburnDay8YesNoPerExample: Story = { render: () => <Show slug="unburn" id="8.3" /> };
export const UnburnDay15Title: Story = { render: () => <Show slug="unburn" id="15.3" /> };
export const UnburnDay17EmptyHelp: Story = { render: () => <Show slug="unburn" id="17.2" /> };
export const UnburnDay25Labels: Story = {
  render: () => (
    <Show
      slug="unburn"
      id="25.2"
      seed={(s) => ({
        ...s,
        collections: {
          perfectionism: [
            entry("p1", 24, {
              situation: "I have to make a presentation for the half-yearly meeting",
              perfect_outcome: "Everyone applauds and my manager promotes me on the spot",
            }),
          ],
        },
      })}
    />
  ),
};
export const UnburnDay28StatusCounts: Story = {
  render: () => (
    <Show
      slug="unburn"
      id="28.2"
      seed={(s) => ({
        ...s,
        collections: {
          tasks: [
            entry("t1", 27, {
              task_i_will_take_up_today: "Finish the budget sheet",
              timeline: "By Friday",
              when_will_i_begin_it: "10:00",
              task_status: "Ongoing",
            }),
          ],
        },
      })}
    />
  ),
};

export const SleepOnboardingMultiSelect: Story = {
  render: () => <Show slug="sleep-tight" id="0.2" />,
};
export const SleepDiaryBedTimeCheck: Story = {
  render: () => <Show slug="sleep-tight" id="13.2" seed={(s) => ({ ...s, diary: {} })} />,
};
export const SleepDay13NoEmDash: Story = { render: () => <Show slug="sleep-tight" id="13.5" /> };
export const SleepDay17Checklist: Story = { render: () => <Show slug="sleep-tight" id="17.4" /> };
export const SleepDay17DeviceQuestion: Story = {
  render: () => (
    <Show
      slug="sleep-tight"
      id="17.6"
      seed={(s) => ({
        ...s,
        answers: {
          sleep_daily_activities: ["Waiting for food to cook", "Commuting (transit or waiting)"],
        },
      })}
    />
  ),
};
export const SleepDay18ShortlistRituals: Story = {
  render: () => (
    <Show
      slug="sleep-tight"
      id="18.4"
      seed={(s) => ({
        ...s,
        collections: {
          rituals: [
            entry("r1", 16, { ritual: "Read a chapter before bed" }),
            entry("r2", 16, { ritual: "Dim the lights at 10 pm" }),
          ],
        },
      })}
    />
  ),
};
export const SleepDay25HabitWeek: Story = {
  render: () => (
    <Show
      slug="sleep-tight"
      id="25.3"
      seed={(s) => ({
        ...s,
        collections: {
          habits: [entry("h1", 18, { habit_i_want_to_inculcate: "No screens after 10:30 pm" })],
        },
        tracker: {
          "19": { h1: true },
          "20": { h1: true },
          "21": { h1: false },
          "22": { h1: true },
          "23": { h1: true },
          "24": { h1: false },
        },
      })}
    />
  ),
};
export const SleepDay28AskedOnce: Story = {
  render: () => (
    <Show
      slug="sleep-tight"
      id="28.5"
      seed={(s) => ({
        ...s,
        collections: {
          thoughts: [
            entry("th1", 9, {
              situation: "Lying in bed",
              thoughts: "I'll never fall asleep",
              did_it_affect_my_sleep: "✅Yes",
              __answered_day: "26",
            }),
            entry("th2", 12, { situation: "Late email", thoughts: "My boss is angry with me" }),
          ],
        },
      })}
    />
  ),
};

export const StressDay3Copy: Story = { render: () => <Show slug="stress-buster" id="3.3" /> };
export const StressDay5NoBlankRow: Story = {
  render: () => (
    <Show
      slug="stress-buster"
      id="5.4"
      seed={(s) => ({
        ...s,
        collections: {
          joy: [entry("j1", 4, { text: "Reading" }), entry("j2", 4, { text: "  " })],
        },
      })}
    />
  ),
};

export const SleepThoughtLogDateTime: Story = {
  render: () => (
    <Show
      slug="sleep-tight"
      id="9.11"
      seed={(s) => ({
        ...s,
        collections: {
          thoughts: [entry("old", 9, { time: "22:15", situation: "Saved before this change" })],
        },
      })}
    />
  ),
};
export const StressThoughtLogDateTime: Story = {
  render: () => <Show slug="stress-buster" id="12.2" />,
};
