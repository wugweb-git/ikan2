import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/equip/m3";

/* The app's button. Six emphases and five heights, all of which appear in the screens:
 * `filled` for the primary action, `tonal` on an accented surface, `outlined` and `text`
 * for secondary ones, `elevated` where the button sits on a card, `destructive` for
 * deleting an account or clearing data. */

const meta = { title: "M3/Button", component: Button } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = { args: { children: "Next" } };

export const Variants: Story = {
  args: { children: "Next" },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Filled</Button>
      <Button variant="tonal">Tonal</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
      <Button variant="elevated">Elevated</Button>
      <Button variant="destructive">Delete account</Button>
    </div>
  ),
};

export const Sizes: Story = {
  args: { children: "Next" },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra large</Button>
    </div>
  ),
};

export const States: Story = {
  args: { children: "Next" },
  render: () => (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Rest</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Saving</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button icon={<Heart className="h-4 w-4" />}>Leading icon</Button>
        <Button trailingIcon={<ArrowRight className="h-4 w-4" />}>Trailing icon</Button>
      </div>
      <Button full>Full width</Button>
    </div>
  ),
};
