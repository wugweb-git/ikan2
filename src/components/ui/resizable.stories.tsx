import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./resizable";

/* Note: this wrapper (from the shadcn template) is written against react-resizable-panels v3's
 * "direction" prop; the installed v4 renamed it to "orientation" and made pixel-vs-percentage
 * sizing explicit. This story uses the current v4 API so it actually renders — the underlying
 * component in resizable.tsx would need updating to accept "orientation" if this were ever used. */

const meta = {
  title: "UI kit/Resizable",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="h-40 w-96 rounded-md border">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="50">
          <div className="grid h-full place-items-center text-[13px]">Panel one</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="50">
          <div className="grid h-full place-items-center text-[13px]">Panel two</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
