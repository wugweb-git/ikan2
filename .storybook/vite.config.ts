// Storybook builds the components on their own, without TanStack Start or nitro.
// The app's vite.config.ts is a full server-rendered setup, so Storybook points at this one.
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The same "@/..." paths the app uses, resolved here without the tsconfig plugin
  // so Vite's dependency scan can follow them too.
  resolve: { alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) } },
  // Storybook is opened at 127.0.0.1 as well as localhost.
  server: { allowedHosts: ["localhost", "127.0.0.1"] },
});
