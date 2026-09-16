import type { Meta, StoryObj } from "@storybook/react-vite";
import { BrandTitle, PrintHeader, ShareButton } from "./result-share";

/* Small pieces shared by every printable/shareable result page: the brand mark, a print-only
 * header, and the "Share" button that opens the phone's own share sheet or falls back to email. */

const meta = {
  title: "App/ResultShare",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Brand: Story = { render: () => <BrandTitle /> };

export const PrintOnlyHeader: Story = {
  render: () => (
    <div className="p-4">
      <p className="mb-2 text-[13px] text-muted-foreground">
        Hidden on screen, shown only when printed — open your browser's print preview to see it.
      </p>
      <PrintHeader title="PHQ-9: Depression" />
    </div>
  ),
};

export const Share: Story = {
  render: () => (
    <div className="p-4">
      <ShareButton subject="My iKAN result" body="Here's my latest PHQ-9 result from iKAN." />
    </div>
  ),
};
