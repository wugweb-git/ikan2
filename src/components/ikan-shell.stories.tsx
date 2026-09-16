import type { Meta, StoryObj } from "@storybook/react-vite";
import { withAuth, withRouter } from "../../.storybook/decorators";
import { IkanShell } from "./ikan-shell";

/* The app's own shell: bottom nav, top bar and the More sheet, wrapped around every page. Needs
 * router context (active tab, navigation) and the real AuthProvider (same as the app when
 * signed out — it makes one real, read-only getSession call to the iKAN backend, no test double).
 * Change the story's path via the router decorator arg below to see a different tab highlighted. */

const meta = {
  title: "App/IkanShell",
  component: IkanShell,
  parameters: { layout: "fullscreen" },
  decorators: [withAuth, withRouter("/")],
} satisfies Meta<typeof IkanShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const page = (
  <div className="p-4">
    <p className="font-display text-[20px] font-semibold">Page content goes here</p>
    <p className="mt-2 text-[14px] text-muted-foreground">
      IkanShell wraps whatever the route renders with the top bar, bottom nav and the More sheet.
    </p>
  </div>
);

export const Home: Story = { args: { children: page } };

export const OnAssessmentsTab: Story = {
  decorators: [withRouter("/assessments")],
  args: { children: page },
};
