import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";

const meta = {
  title: "UI kit/Collapsible",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Default() {
    const [open, setOpen] = useState(false);
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="w-80">
        <CollapsibleTrigger asChild>
          <Button variant="outline">{open ? "Hide" : "Show"} details</Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 text-[14px] text-muted-foreground">
          Extra detail shown once expanded.
        </CollapsibleContent>
      </Collapsible>
    );
  },
};
