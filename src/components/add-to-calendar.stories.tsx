import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddToCalendar } from "./add-to-calendar";

/* "Add to calendar" as Google Calendar or the phone's own file — used in Settings, the
 * programme "Up next" card, and after booking a consultation. */

const meta = {
  title: "App/AddToCalendar",
  component: AddToCalendar,
} satisfies Meta<typeof AddToCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DailyReminder: Story = {
  args: {
    event: {
      title: "iKAN: Sleep Tight",
      details: "Daily programme reminder",
      start: new Date(),
      minutes: 5,
      daily: 12,
    },
    time: "20:00",
    filename: "ikan-sleep-tight-reminder.ics",
    label: "Daily reminder",
  },
};

export const OneOffAppointment: Story = {
  args: {
    event: {
      title: "iKAN consultation",
      details: "Video call with your consultant",
      start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      minutes: 30,
      alertBefore: 30,
    },
    filename: "ikan-consultation.ics",
    variant: "row",
  },
};
