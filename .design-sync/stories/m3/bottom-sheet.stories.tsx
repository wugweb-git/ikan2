import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomSheet, Button, SelectRow } from "@/components/equip/m3";

/* The app's modal. It portals into <body> so the bottom navigation can never cover it, locks
 * the page behind it, and closes on Escape and on Android's back gesture.
 *
 * `cardMode: "single"` in the sync config: an overlay has nothing to show in a grid cell
 * until it is open, so the open story is the one that represents it. */

const meta = { title: "M3/BottomSheet", component: BottomSheet } satisfies Meta<typeof BottomSheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { open: true, onClose: () => {}, title: "When does it happen?", children: null },
  render: function Open() {
    const [picked, setPicked] = useState("Evening");
    return (
      <BottomSheet open onClose={() => {}} title="When does it happen?">
        <div className="overflow-hidden rounded-[20px] border border-foreground/10">
          {["Morning", "Afternoon", "Evening", "Night"].map((o) => (
            <SelectRow key={o} selected={picked === o} onClick={() => setPicked(o)}>
              {o}
            </SelectRow>
          ))}
        </div>
      </BottomSheet>
    );
  },
};

export const Triggered: Story = {
  args: { open: false, onClose: () => {}, title: "Add a note", children: null },
  render: function Triggered() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Add a note</Button>
        <BottomSheet open={open} onClose={() => setOpen(false)} title="Add a note">
          <p className="text-[15px] leading-6 text-muted-foreground">
            Anything you want to remember about today.
          </p>
          <Button full className="mt-5" onClick={() => setOpen(false)}>
            Save
          </Button>
        </BottomSheet>
      </>
    );
  },
};
