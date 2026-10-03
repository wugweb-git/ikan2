import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell } from "lucide-react";
import { Badge, Dot, StatusDot } from "./badge";

/* Badges sit on top of their owner, so the owner only needs to be `relative`. A count of 0
 * renders nothing, which saves every call site a guard. */

const meta = { title: "Kit/Badge", component: Badge } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { count: 3, label: "unread notifications" },
  render: (args) => (
    <span className="relative inline-grid h-11 w-11 place-items-center rounded-full bg-secondary">
      <Bell className="h-5 w-5" />
      <Badge {...args} />
    </span>
  ),
};

export const Counts: Story = {
  args: { count: 1, label: "unread" },
  render: () => (
    <div className="flex gap-6">
      {[0, 1, 9, 42].map((n) => (
        <span
          key={n}
          className="relative inline-grid h-11 w-11 place-items-center rounded-full bg-secondary"
        >
          <Bell className="h-5 w-5" />
          <Badge count={n} label="unread" />
        </span>
      ))}
    </div>
  ),
};

export const Dotted: Story = {
  args: { count: 1, label: "unread" },
  render: () => (
    <span className="relative inline-grid h-11 w-11 place-items-center rounded-full bg-secondary">
      <Bell className="h-5 w-5" />
      <Dot label="Something needs you" />
    </span>
  ),
};

export const Status: Story = {
  args: { count: 1, label: "unread" },
  render: () => (
    <div className="space-y-2">
      <StatusDot color="var(--calm)">Minimal</StatusDot>
      <StatusDot color="var(--rest)">Moderate</StatusDot>
      <StatusDot color="var(--alert)">Severe</StatusDot>
    </div>
  ),
};
