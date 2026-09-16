import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

const meta = {
  title: "UI kit/Select",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select defaultValue="sleep-tight">
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Choose a programme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sleep-tight">Sleep Tight</SelectItem>
        <SelectItem value="unburn">Unburn</SelectItem>
        <SelectItem value="stress-buster">Stress Buster</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Placeholder: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Choose a programme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sleep-tight">Sleep Tight</SelectItem>
        <SelectItem value="unburn">Unburn</SelectItem>
        <SelectItem value="stress-buster">Stress Buster</SelectItem>
      </SelectContent>
    </Select>
  ),
};
