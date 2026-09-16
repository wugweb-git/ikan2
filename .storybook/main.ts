import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],

  framework: {
    name: "@storybook/react-vite",
    options: { builder: { viteConfigPath: ".storybook/vite.config.ts" } },
  },

  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest", "@chromatic-com/storybook"],
};

export default config;
