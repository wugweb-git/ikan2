/* The wrapper every preview mounts in.
 *
 * .storybook/preview.tsx wraps each story in a phone-width frame carrying one programme's
 * accent tokens. The converter tries to bundle those decorators itself, but ours import
 * src/styles.css, whose `@import "tailwindcss"` esbuild cannot resolve - so the decorator
 * bundle fails and cfg.provider has to supply the same context instead. This mirrors that
 * decorator exactly, minus the stylesheet import (component CSS ships via _ds_bundle.css). */
import type { ReactNode } from "react";
import { accentStyle, type Accent } from "../src/components/equip/m3";

export function DesignFrame({
  children,
  accent = "night",
}: {
  children: ReactNode;
  accent?: Accent;
}) {
  return (
    <div
      className="min-h-screen bg-background p-4 font-sans text-foreground antialiased"
      style={accentStyle(accent)}
    >
      <div className="mx-auto w-full max-w-[375px]">{children}</div>
    </div>
  );
}
