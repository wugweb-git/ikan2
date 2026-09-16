import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "./steps";

/* Fixed bottom bar every day step shares: Back, Next/Finish, and a hint line while Next is
 * disabled because something required is still empty. */

const meta = {
  title: "Equip/Blocks/Footer",
  component: Footer,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onBack: () => {}, onNext: () => {}, label: "Next" },
};

export const FirstStep: Story = {
  args: { onBack: undefined, onNext: () => {}, label: "Next" },
};

export const RequiresInput: Story = {
  args: {
    onBack: () => {},
    onNext: () => {},
    label: "Next",
    disabled: true,
    hint: "Choose one to continue",
  },
};

export const FinishDay: Story = {
  args: { onBack: () => {}, onNext: () => {}, label: "Finish day 4" },
};
