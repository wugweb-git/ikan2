import type { Decorator, Preview } from "@storybook/react-vite";
import { accentStyle, type Accent } from "../src/components/equip/m3";
import "../src/styles.css";

/* Every story renders inside a phone-width frame with one programme's accent,
 * so the kit is seen the way the app shows it. Pick the accent in the toolbar. */

const accents: Accent[] = ["night", "ember", "calm", "mind", "mood"];

const frame: Decorator = (Story, ctx) => (
  <div
    className="min-h-screen bg-background p-4 font-sans text-foreground antialiased"
    style={accentStyle((ctx.globals["accent"] as Accent) ?? "night")}
  >
    <div className="mx-auto w-full max-w-[375px]">
      <Story />
    </div>
  </div>
);

const preview: Preview = {
  decorators: [frame],
  globalTypes: {
    accent: {
      description: "Programme accent",
      toolbar: {
        title: "Accent",
        icon: "paintbrush",
        items: accents.map((a) => ({ value: a, title: a })),
      },
    },
  },
  initialGlobals: { accent: "night" },
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
    options: {
      storySort: { order: ["Equip", "App", "UI kit"] },
    },
  },
};

export default preview;
