import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "../../.storybook/decorators";
import { NotFoundScreen, OfflineBanner, PageSkeleton, Skeleton } from "./skeleton";

/* Loading, empty and error states shared by every screen in the app. NotFoundScreen and
 * OfflineBanner use real Links, so they need router context; ErrorScreen isn't included here
 * because it needs an actual TanStack Router error boundary to receive its `reset` callback
 * meaningfully — see it live by breaking a route. */

const meta = {
  title: "App/Skeleton",
  parameters: { layout: "fullscreen" },
  decorators: [withRouter("/")],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Piece: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-24 w-full rounded-[20px]" />
    </div>
  ),
};

export const Page: Story = { render: () => <PageSkeleton /> };

export const NotFound: Story = { render: () => <NotFoundScreen /> };

export const Offline: Story = {
  render: () => (
    <div className="relative min-h-[160px]">
      <OfflineBanner />
      <p className="pt-16 text-center text-[13px] text-muted-foreground">
        (Storybook can't force navigator.onLine to false, so this banner only shows in an actual
        offline browser tab.)
      </p>
    </div>
  ),
};
