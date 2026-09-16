import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateText } from "./date-text";

/* Renders a date server- and client-side identically: plain text on the server, hydrates to the
 * visitor's own locale format once mounted, so there's no flash of mismatched text. */

const meta = {
  title: "App/DateText",
  component: DateText,
} satisfies Meta<typeof DateText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "5 Sep 2026" } };
