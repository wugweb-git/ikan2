import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExternalLink } from "@/components/kit/link";

/* House rule: every link that leaves iKAN ends in an arrow. It is the only cue that the tap is
 * about to leave the app, which matters more here because iKAN also runs installed, where
 * "leaving" means a browser opening over the top of it.
 *
 * The arrow is aria-hidden; the announcement is the visually hidden "(opens in a new tab)". */

const meta = { title: "Kit/ExternalLink", component: ExternalLink } satisfies Meta<
  typeof ExternalLink
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { href: "https://wugweb.com", children: "Wugweb" } };

export const InASentence: Story = {
  args: { href: "https://wugweb.com", children: "Wugweb" },
  render: () => (
    <p className="type-body-lg">
      iKAN is built by <ExternalLink href="https://wugweb.com">Wugweb</ExternalLink>.
    </p>
  ),
};

export const WithoutUnderline: Story = {
  args: { href: "https://wugweb.com", children: "Open in Google Calendar", underline: false },
};
