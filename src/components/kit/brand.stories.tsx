import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlaskConical, Handshake, HeartHandshake, Sparkles } from "lucide-react";
import { AccentWord, BrandDots, BrandWash, IconTile } from "./brand";

/* The brand accent patterns from the first iKAN site. The raw hues are fills; anything
 * carrying a word uses the -ink shade, which is the part the original got wrong. */

const meta = { title: "Kit/Brand", component: IconTile } satisfies Meta<typeof IconTile>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Palette: Story = {
  args: { children: null },
  render: () => (
    <div className="grid gap-5">
      <BrandDots />
      <div className="grid gap-2 text-[13px]">
        {(["teal", "amber", "coral", "slate"] as const).map((h) => (
          <div key={h} className="flex items-center gap-3">
            <span className="h-6 w-10 rounded-[6px]" style={{ background: `var(--brand-${h})` }} />
            <span style={{ color: `var(--brand-${h}-ink)` }} className="font-semibold">
              {h} — fill vs ink
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const AccentHeading: Story = {
  args: { children: null },
  render: () => (
    <h2 className="font-display text-[28px] font-semibold leading-9">
      Born from <AccentWord>personal</AccentWord> experience
    </h2>
  ),
};

export const IconTiles: Story = {
  args: { children: null },
  render: () => (
    <div className="flex items-center gap-4">
      <IconTile hue="coral">
        <FlaskConical />
      </IconTile>
      <IconTile hue="slate">
        <Handshake />
      </IconTile>
      <IconTile hue="teal" shape="square">
        <HeartHandshake />
      </IconTile>
      <IconTile hue="amber" size="lg" bordered>
        <Sparkles />
      </IconTile>
    </div>
  ),
};

export const ValueCard: Story = {
  args: { children: null },
  render: () => (
    <div className="grid gap-3">
      {(
        [
          [
            "coral",
            FlaskConical,
            "Science backed",
            "Research-led, validated by practising psychologists.",
          ],
          ["slate", Handshake, "Our promise", "Mental health care is for everyone."],
        ] as const
      ).map(([hue, Icon, title, body]) => (
        <div key={title} className="flex items-start gap-4 rounded-[20px] bg-secondary p-4">
          <IconTile hue={hue}>
            <Icon />
          </IconTile>
          <div className="min-w-0">
            <p className="font-display text-[17px] font-semibold">{title}</p>
            <p className="mt-1 text-[14px] text-muted-foreground">{body}</p>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Wash: Story = {
  args: { children: null },
  render: () => (
    <BrandWash>
      <h3 className="font-display text-[20px] font-semibold">
        A <AccentWord>calmer</AccentWord> way to start
      </h3>
      <p className="mt-2 text-[15px] text-muted-foreground">
        The themed section ground, mixed from the one hue token.
      </p>
    </BrandWash>
  ),
};
