import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccentWord } from "@/components/kit/brand";

/* One word of a heading in a brand hue, as the first iKAN site set "Born from *personal*
 * experience".
 *
 * It renders a plain <span>, inheriting the heading's size, face and weight and changing only
 * colour, and it uses the text-safe -ink shade: the original used the raw hue at 2.29:1, which
 * the old site's own stylesheet forbids for text. */

const meta = { title: "Kit/AccentWord", component: AccentWord } satisfies Meta<typeof AccentWord>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InAHeading: Story = {
  args: { children: "personal" },
  render: () => (
    <h2 className="font-display text-[28px] font-semibold leading-9">
      Born from <AccentWord>personal</AccentWord> experience
    </h2>
  ),
};

export const Hues: Story = {
  args: { children: "personal" },
  render: () => (
    <div className="grid gap-3 font-display text-[22px] font-semibold">
      <p>
        Born from <AccentWord hue="teal">personal</AccentWord> experience
      </p>
      <p>
        A <AccentWord hue="amber">calmer</AccentWord> way to start
      </p>
      <p>
        <AccentWord hue="coral">Science</AccentWord> backed, always
      </p>
      <p>
        Care that <AccentWord hue="slate">fits</AccentWord> your life
      </p>
    </div>
  ),
};
