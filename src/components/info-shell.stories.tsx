import type { Meta, StoryObj } from "@storybook/react-vite";
import { withAuth, withRouter } from "../../.storybook/decorators";
import { InfoShell } from "./info-shell";

/* About, FAQ, Contact and legal pages: the app's own navigation for a signed-in visitor, or a
 * plain page with a back button for everyone else. Needs router (back navigation) and the real
 * AuthProvider — signed out by default, same as anyone opening these pages without an account. */

const meta = {
  title: "App/InfoShell",
  component: InfoShell,
  parameters: { layout: "fullscreen" },
  decorators: [withAuth, withRouter("/about")],
} satisfies Meta<typeof InfoShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const body = (
  <div className="p-4 text-[15px] leading-6 text-foreground/80">
    iKAN offers self-guided programmes and assessments for stress, sleep and burnout.
  </div>
);

export const SignedOut: Story = {
  args: { title: "About iKAN", children: body },
};
