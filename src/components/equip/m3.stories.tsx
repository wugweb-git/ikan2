import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLeft, Brain, Heart } from "lucide-react";
import {
  Button,
  Fab,
  IconButton,
  Label,
  LinearProgress,
  Pager,
  QuickPicks,
  Segmented,
  SelectField,
  SelectRow,
  Switch,
  TextField,
  TopAppBar,
} from "./m3";

/* The Material 3 kit every Equip day screen is built from. One story per piece,
 * plus a whole-kit view for checking spacing and accent colours together. */

const meta = {
  title: "Equip/M3 kit",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Section({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <p className="mb-2 font-display text-[13px] font-semibold text-muted-foreground">{name}</p>
      {children}
    </section>
  );
}

export const Buttons: Story = {
  render: () => (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Next</Button>
        <Button variant="tonal">Learning diary</Button>
        <Button variant="outlined">Edit</Button>
        <Button variant="text">Skip</Button>
        <Button variant="elevated">Share</Button>
        <Button variant="destructive">Delete account</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra large</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled>Disabled</Button>
        <Button loading>Saving</Button>
        <Button icon={<Heart className="h-4 w-4" />}>With icon</Button>
        <Button trailingIcon={<ArrowLeft className="h-4 w-4 rotate-180" />}>Trailing</Button>
      </div>
      <Button full>Full width</Button>
      <div className="flex items-center gap-3">
        <Fab label="New entry">
          <Heart className="h-6 w-6" />
        </Fab>
        <Fab label="New entry" extended>
          <Heart className="h-5 w-5" />
        </Fab>
      </div>
    </div>
  ),
};

export const Fields: Story = {
  render: function Fields() {
    const [text, setText] = useState("");
    const [note, setNote] = useState("Woke at 3am and couldn't get back to sleep.");
    const [time, setTime] = useState("22:30");
    return (
      <div className="grid gap-4">
        <TextField
          label="The demand"
          value={text}
          onChange={setText}
          hint="e.g. A deadline at work"
        />
        <TextField label="What happened?" value={note} onChange={setNote} multiline rows={3} />
        <TextField label="Lights out" value={time} onChange={setTime} type="time" />
        <TextField
          label="Hours slept"
          value=""
          onChange={() => {}}
          inputMode="numeric"
          error="Enter a number between 0 and 24"
        />
      </div>
    );
  },
};

export const Choices: Story = {
  render: function Choices() {
    const [quality, setQuality] = useState<string | undefined>("Fair");
    const [picked, setPicked] = useState("A deadline at work");
    const [on, setOn] = useState(true);
    return (
      <div className="grid gap-6">
        <Section name="Segmented">
          <Segmented
            label="Sleep quality"
            options={["Very poor", "Poor", "Fair", "Good", "Very good"]}
            value={quality}
            onChange={setQuality}
          />
        </Section>
        <Section name="Select rows">
          <div className="overflow-hidden rounded-[20px] border border-foreground/10">
            <SelectRow selected onClick={() => {}} glyph="A">
              A thought
            </SelectRow>
            <SelectRow selected={false} multi onClick={() => {}}>
              A feeling
            </SelectRow>
          </div>
        </Section>
        <Section name="Quick picks">
          <QuickPicks
            title="Tap to reuse an earlier answer"
            items={[
              { label: "A deadline at work", value: "A deadline at work" },
              { label: "Money worries", value: "Money worries" },
            ]}
            selected={picked}
            onPick={setPicked}
          />
        </Section>
        <Section name="Switch">
          <div className="flex items-center justify-between">
            <span className="text-[15px]">Daily reminder</span>
            <Switch checked={on} onChange={setOn} label="Daily reminder" />
          </div>
        </Section>
      </div>
    );
  },
};

export const Navigation: Story = {
  render: () => (
    <div className="grid gap-6">
      <Section name="Top app bar">
        <TopAppBar
          title="Day 4"
          leading={
            <IconButton label="Back">
              <ArrowLeft className="h-5 w-5" />
            </IconButton>
          }
        />
      </Section>
      <Section name="Progress">
        <LinearProgress value={0.45} />
      </Section>
      <Section name="Label">
        <Label text="Thought or feeling?" />
      </Section>
    </div>
  ),
};

export const Cards: Story = {
  render: function Cards() {
    const [i, setI] = useState(0);
    const page = (title: string, body: string, Icon: typeof Brain) => (
      <div className="rounded-[24px] border border-foreground/10 bg-background p-4">
        <Icon className="mb-2 h-5 w-5" aria-hidden="true" />
        <p className="font-display text-[16px] font-semibold">{title}</p>
        <p className="mt-1 text-[14px] text-muted-foreground">{body}</p>
      </div>
    );
    return (
      <Pager
        index={i}
        onIndex={setI}
        peek={false}
        pages={[
          page("I'll never finish this", "Thought", Brain),
          page("Tight chest, restless", "Feeling", Heart),
        ]}
      />
    );
  },
};

export const SelectSheet: Story = {
  render: function SelectSheet() {
    const [value, setValue] = useState("Evening");
    return (
      <SelectField
        label="When does it happen?"
        value={value}
        options={["Morning", "Afternoon", "Evening", "Night"]}
        onChange={setValue}
      />
    );
  },
};
