import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell } from "lucide-react";
import { Badge } from "@/components/kit/badge";

/* The count that sits on top of something else. It positions itself, so the owner only has to
 * be `relative`. Nothing renders at 0 — callers never need to guard — and the count caps at
 * 9+ so the badge cannot grow wide enough to clip the icon beneath it. */

const meta = { title: "Kit/Badge", component: Badge } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

const owner = (children: ReactNode) => (
  <span className="relative inline-grid h-11 w-11 place-items-center rounded-full bg-secondary">
    <Bell className="h-5 w-5" />
    {children}
  </span>
);

export const Default: Story = {
  args: { count: 3, label: "unread notifications" },
  render: (args) => owner(<Badge {...args} />),
};

export const Counts: Story = {
  args: { count: 3, label: "unread notifications" },
  render: () => (
    <div className="flex gap-6">
      {[0, 1, 9, 42].map((n) => (
        <span key={n}>{owner(<Badge count={n} label="unread notifications" />)}</span>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  args: { count: 3, label: "unread notifications" },
  render: () => (
    <div className="flex gap-6">
      {(["error", "accent", "neutral"] as const).map((t) => (
        <span key={t}>{owner(<Badge count={3} tone={t} label="unread notifications" />)}</span>
      ))}
    </div>
  ),
};
