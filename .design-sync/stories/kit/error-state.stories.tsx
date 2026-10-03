import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorState } from "@/components/kit/status";

/* Failed is not empty. Empty says "nothing here yet, here is how to start"; failed says
 * "something exists, we could not reach it, try again". Showing an empty state after a failed
 * fetch tells someone their journal is gone, so this uses the error colour, names what failed
 * and offers a retry — never a "get started" action, which would be the wrong invitation. */

const meta = { title: "Kit/ErrorState", component: ErrorState } satisfies Meta<typeof ErrorState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onRetry: () => {} } };

export const Named: Story = {
  args: {
    title: "Couldn't load your journal",
    children: "Your entries are safe on this device.",
    onRetry: () => {},
  },
};

export const Offline: Story = {
  args: { offline: true, onRetry: () => {}, retryLabel: "Check again" },
};

export const NoRetry: Story = {
  args: { title: "That assessment isn't available", children: "It may have been withdrawn." },
};
