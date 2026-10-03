import type { StorybookConfig } from "@storybook/react-vite";

/* The sync's own Storybook, separate from the repo's `.storybook/`.
 *
 * Why it exists: the converter resolves a story title right-to-left to the first segment
 * that is a bundle export, so `UI kit/Button` and `Equip/M3 kit` both land on names we
 * either do not want synced or cannot address individually. `cfg.titleMap` keys on the
 * RESOLVED name, so it cannot separate `UI kit/Badge` from `Kit/Badge` — excluding one
 * excludes both.
 *
 * Narrowing the glob instead gives the sync a scope of its own: it sees only the
 * per-component stories under `../stories`, one title per component. The repo's own
 * Storybook and every file under `src/components/ui` are untouched.
 *
 * The preview re-exports the repo's own decorators rather than copying them, so the
 * reference render and the app's Storybook cannot drift apart.
 */

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],

  framework: {
    name: "@storybook/react-vite",
    options: { builder: { viteConfigPath: ".design-sync/sb-config/vite.config.ts" } },
  },

  addons: ["@storybook/addon-a11y"],
};

export default config;
