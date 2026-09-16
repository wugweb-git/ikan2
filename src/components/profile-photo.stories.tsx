import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProfilePhoto } from "./profile-photo";

/* The person's photo filling its circle; falls back to initials (passed as children) if there's
 * no photo, or if the photo fails to load. */

const meta = {
  title: "App/ProfilePhoto",
  component: ProfilePhoto,
  decorators: [
    (Story) => (
      <div className="h-24 w-24 overflow-hidden rounded-full bg-[var(--accent-container)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProfilePhoto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InitialsOnly: Story = {
  args: {
    children: (
      <span className="grid h-full w-full place-items-center font-display text-[28px] font-semibold text-[var(--on-accent-container)]">
        VS
      </span>
    ),
  },
};

export const BrokenPhoto: Story = {
  args: {
    src: "https://this-domain-does-not-exist.example/broken.jpg",
    children: (
      <span className="grid h-full w-full place-items-center font-display text-[28px] font-semibold text-[var(--on-accent-container)]">
        VS
      </span>
    ),
  },
};
