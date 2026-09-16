import type { Meta, StoryObj } from "@storybook/react-vite";
import { MadeBy } from "./made-by";

const meta = {
  title: "App/MadeBy",
  component: MadeBy,
} satisfies Meta<typeof MadeBy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
