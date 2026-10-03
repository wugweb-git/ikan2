/* Mirrors .storybook/vite.config.ts; the alias is re-pointed because this config sits one
 * directory deeper. Kept separate rather than imported so the sync build cannot be broken
 * by an app-only change to the repo's storybook vite setup. */
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("../../src", import.meta.url)) } },
  server: { allowedHosts: ["localhost", "127.0.0.1"] },
});
