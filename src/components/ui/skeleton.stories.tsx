import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./skeleton";

/* The shadcn skeleton primitive — unrelated to the app's own loading states in
 * src/components/skeleton.tsx (see App/Skeleton), which is what the app actually uses. */

const meta = {
  title: "UI kit/Skeleton",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  ),
};
