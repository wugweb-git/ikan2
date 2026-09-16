import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heart, Moon, ShieldCheck } from "lucide-react";
import { withRouter } from "../../.storybook/decorators";
import { BeforeYouStart, Bento, Group, ImportantNote, SubHead, type Tile } from "./about";

/* Pieces shared by the About/permissions-style pages: a titled group, a bento of bullet tiles,
 * a "good to know" note (its "Need help now?" link needs router context), and the "before you
 * start" consent sheet. */

const meta = {
  title: "App/About",
  parameters: { layout: "fullscreen" },
  decorators: [withRouter("/about")],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const tiles: Tile[] = [
  { icon: Moon, text: "A short sleep diary each morning" },
  { icon: Heart, text: "How you're feeling, once a day" },
  { icon: ShieldCheck, text: "Private to you, never shown to anyone else" },
];

export const GroupAndBento: Story = {
  render: () => (
    <Group title="What to expect">
      <SubHead>Every day</SubHead>
      <Bento items={tiles} />
    </Group>
  ),
};

export const GoodToKnow: Story = {
  render: () => (
    <ImportantNote text="This programme doesn't replace professional care. If you're in crisis, reach out for help right away." />
  ),
};

export const BeforeYouStartSheet: Story = {
  render: function BeforeYouStartSheet() {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button className="m-4 underline" onClick={() => setOpen(true)}>
          Reopen sheet
        </button>
        <BeforeYouStart
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          items={tiles}
          cta="Start Sleep Tight"
        />
      </>
    );
  },
};
