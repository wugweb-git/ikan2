import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";

const meta = {
  title: "UI kit/ScrollArea",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-56 w-56 rounded-md border p-3">
      {items.map((item, i) => (
        <div key={item}>
          <p className="py-1 text-[14px]">{item}</p>
          {i < items.length - 1 ? <Separator /> : null}
        </div>
      ))}
    </ScrollArea>
  ),
};
