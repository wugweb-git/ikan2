import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "@/components/equip/m3";

/* M3 filled text field. The label sits above the value rather than floating into it, because
 * programme questions come from Notion and can be long enough to wrap. */

const meta = { title: "M3/TextField", component: TextField } satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "The demand", value: "", onChange: () => {}, hint: "e.g. A deadline at work" },
  render: function Default(args) {
    const [v, setV] = useState("");
    return <TextField {...args} value={v} onChange={setV} />;
  },
};

export const Variants: Story = {
  args: { label: "The demand", value: "", onChange: () => {} },
  render: function Variants() {
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
      </div>
    );
  },
};

export const WithError: Story = {
  args: {
    label: "Hours slept",
    value: "",
    onChange: () => {},
    inputMode: "numeric",
    error: "Enter a number between 0 and 24",
  },
};

export const WithCounter: Story = {
  args: { label: "Anything else?", value: "", onChange: () => {} },
  render: function WithCounter() {
    const [v, setV] = useState("A few lines about the day.");
    return (
      <TextField label="Anything else?" value={v} onChange={setV} multiline maxLength={280} />
    );
  },
};
