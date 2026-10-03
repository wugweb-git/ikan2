import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Snackbar, useSnack } from "@/components/equip/m3";

/* A brief confirmation, fixed above the bottom navigation. It shows for 2.8 seconds each time
 * a new message id arrives, which is what `useSnack` produces — so the same text can be shown
 * twice in a row and still re-appear.
 *
 * `cardMode: "single"`: like the sheet, it is an overlay and only the shown story represents it. */

const meta = { title: "M3/Snackbar", component: Snackbar } satisfies Meta<typeof Snackbar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Shown: Story = {
  args: { message: { text: "Entry saved", id: 1 } },
};

export const Triggered: Story = {
  args: { message: null },
  render: function Triggered() {
    const snack = useSnack();
    return (
      <>
        <Button onClick={() => snack.show("Entry saved")}>Save</Button>
        <Snackbar message={snack.message} />
      </>
    );
  },
};
