import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorLine, ErrorState, FieldError } from "./status";

/* Empty and failed must not look the same. Empty means "nothing here yet, here is how to
 * start"; failed means "something exists, we could not reach it, try again". Showing an empty
 * state after a failed fetch quietly tells someone their journal is gone — in this app that is
 * the worst possible lie, so these use the error colour and offer a retry, never a
 * "get started" action. */

const meta = { title: "Kit/ErrorState", component: ErrorState } satisfies Meta<typeof ErrorState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onRetry: () => {} },
};

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

export const Line: Story = {
  args: {},
  render: () => <ErrorLine onRetry={() => {}}>Couldn’t load recent results.</ErrorLine>,
};

export const Field: Story = {
  args: {},
  render: () => (
    <div>
      <input
        aria-invalid
        aria-label="Hours slept"
        defaultValue="26"
        className="w-full rounded-t-[4px] border-b border-error bg-secondary px-4 py-3 text-[16px] outline-none"
      />
      <FieldError>Enter a number between 0 and 24</FieldError>
    </div>
  ),
};
