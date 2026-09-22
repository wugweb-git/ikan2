import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  moodScale,
  painExperienceScale,
  painImpactScale,
  sleepScale,
  stressScale,
  type ScalePoint,
} from "@/lib/journal";
import { BlockHeader, EmojiScaleBlock, NoteBlock, TagsBlock, YesNoBlock } from "./blocks";

/* The Mood Journal's 8 blocks, one story each, inside the same card the check-in uses. */

const meta = {
  title: "App/Journal/Blocks",
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="p-4" style={{ ["--accent" as string]: "#C2607C" }}>
        <div className="rounded-[24px] bg-secondary p-4">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Scale({
  id,
  question,
  subtitle,
  scale,
  step,
  of,
  followUp,
  note,
  start,
}: {
  id: string;
  question: string;
  subtitle: string;
  scale: ScalePoint[];
  step: number;
  of: number;
  followUp?: boolean;
  note?: string;
  start?: number;
}) {
  const [v, setV] = useState<number | undefined>(start);
  return (
    <>
      <BlockHeader
        id={id}
        question={question}
        subtitle={subtitle}
        step={step}
        of={of}
        followUp={Boolean(followUp)}
      />
      <div className="mt-4">
        <EmojiScaleBlock scale={scale} value={v} onPick={setV} label={question} note={note} />
      </div>
    </>
  );
}

export const Mood: Story = {
  render: () => (
    <Scale
      id="mood"
      question="How are you feeling?"
      subtitle="Tap the emoji that matches your vibe"
      scale={moodScale}
      step={1}
      of={6}
    />
  ),
};

export const SleepFromDiary: Story = {
  render: () => (
    <Scale
      id="sleep"
      question="How would you rate your sleep?"
      subtitle="Think about last night"
      scale={sleepScale}
      step={2}
      of={6}
      start={4}
      note="From today’s sleep diary"
    />
  ),
};

export const Stress: Story = {
  render: () => (
    <Scale
      id="stress"
      question="Are you under any stress?"
      subtitle="Be honest, there's no wrong answer"
      scale={stressScale}
      step={3}
      of={6}
    />
  ),
};

export const Pain: Story = {
  render: function Pain() {
    const [v, setV] = useState<boolean>();
    return (
      <>
        <BlockHeader
          id="pain"
          question="Are you in any pain?"
          subtitle="Any kind, physical or otherwise"
          step={4}
          of={v ? 8 : 6}
        />
        <div className="mt-4">
          <YesNoBlock value={v} onPick={setV} label="Are you in any pain?" />
        </div>
      </>
    );
  },
};

export const PainExperience: Story = {
  render: () => (
    <Scale
      id="pain_experience"
      question="How would you describe your pain?"
      subtitle="Pick the closest"
      scale={painExperienceScale}
      step={5}
      of={8}
      followUp
    />
  ),
};

export const PainImpact: Story = {
  render: () => (
    <Scale
      id="pain_impact"
      question="Has pain interfered with your usual activities?"
      subtitle="Today, so far"
      scale={painImpactScale}
      step={6}
      of={8}
      followUp
    />
  ),
};

export const Note: Story = {
  render: function Note() {
    const [v, setV] = useState("");
    return (
      <>
        <BlockHeader
          id="note"
          question="Anything on your mind?"
          subtitle="A quick note to capture this moment"
          step={7}
          of={8}
        />
        <div className="mt-4">
          <NoteBlock value={v} onChange={setV} label="Anything on your mind?" />
        </div>
      </>
    );
  },
};

export const Tags: Story = {
  render: function Tags() {
    const [v, setV] = useState<string[]>(["work"]);
    return (
      <>
        <BlockHeader
          id="tags"
          question="What shaped your day?"
          subtitle="Pick whatever applies, or skip to save"
          step={8}
          of={8}
        />
        <div className="mt-4">
          <TagsBlock value={v} onChange={setV} />
        </div>
      </>
    );
  },
};
