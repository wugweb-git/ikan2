import type { Meta, StoryObj } from "@storybook/react-vite";
import { Splash } from "./splash";

/* Launch screen shown on phones only, before the app decides where to send the visitor. */

const meta = {
  title: "App/Splash",
  component: Splash,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Splash>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
