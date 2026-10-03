import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check } from "lucide-react";
import { Disclosure, DisclosureGroup } from "./disclosure";

/* Built on <details> so it opens with JavaScript off and needs no hydration. The chevron
 * direction follows whichever affordance the screen already used. */

const meta = { title: "Kit/Disclosure", component: Disclosure } satisfies Meta<typeof Disclosure>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "How is my data stored?",
    children: (
      <p className="text-[15px] leading-6 text-muted-foreground">
        On this device, and in your account once you sign in. Nothing is shared.
      </p>
    ),
  },
};

export const WithLeadingAndMeta: Story = {
  args: {
    title: "Day 3 — Understanding sleep",
    meta: "6 min",
    leading: (
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-foreground text-background">
        <Check className="h-[18px] w-[18px]" strokeWidth={2.5} />
      </span>
    ),
    children: <p className="text-[15px] text-muted-foreground">What you wrote that day.</p>,
  },
};

export const RightChevron: Story = {
  args: {
    title: "See the answer options",
    chevron: "right",
    radius: 16,
    children: <p className="text-[15px] text-muted-foreground">Not at all → Nearly every day</p>,
  },
};

export const Grouped: Story = {
  args: { title: "One", children: null },
  render: () => (
    <DisclosureGroup>
      {["Is iKAN free?", "Who sees my answers?", "Can I delete everything?"].map((q) => (
        <Disclosure key={q} title={q}>
          <p className="text-[15px] leading-6 text-muted-foreground">Yes.</p>
        </Disclosure>
      ))}
    </DisclosureGroup>
  ),
};
