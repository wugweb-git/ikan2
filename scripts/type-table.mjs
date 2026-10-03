#!/usr/bin/env node
/* Print the type-scale table straight from src/styles.css.
 *
 * The table in DESIGN-SYSTEM.md was hand-maintained and drifted twice in one session —
 * silently, because an edit that does not match just does nothing. Generating it means the
 * doc cannot disagree with the stylesheet.
 *
 * Run: node scripts/type-table.mjs            print
 *      node scripts/type-table.mjs --write    splice into DESIGN-SYSTEM.md
 */
import { readFileSync, writeFileSync } from "node:fs";

const css = readFileSync("src/styles.css", "utf8");
const LABEL = {
  "display-lg": "Display L",
  "display-md": "Display M",
  "display-sm": "Display S",
  "headline-lg": "Headline L",
  "headline-md": "Headline M",
  "headline-sm": "Headline S",
  "title-lg": "Title L",
  subhead: "Subhead",
  "title-md": "Title M",
  "body-xl": "Body XL",
  "body-lg": "Body L",
  body: "Body",
  action: "Action",
  "body-md": "Body M",
  "body-sm": "Body S",
  "label-lg": "Label L",
  "label-md": "Label M",
};
const ORDER = Object.keys(LABEL);

const rows = [];
for (const key of ORDER) {
  const m = css.match(new RegExp(`@utility type-${key} \\{([\\s\\S]*?)\\n\\}`));
  if (!m) continue;
  const b = m[1];
  const get = (p) => (b.match(new RegExp(`${p}:\\s*([^;]+);`)) || [, "—"])[1].trim();
  rows.push([
    LABEL[key],
    `\`type-${key}\``,
    /--font-display/.test(b) ? "Sora" : "Manrope",
    get("font-size"),
    get("line-height"),
    get("font-weight"),
    get("letter-spacing").replace("-0.", "−0."),
  ]);
}
const head = ["Role", "Class", "Family", "Size", "Line-height", "Weight", "Tracking"];
const table = [head, head.map(() => "---"), ...rows].map((r) => `| ${r.join(" | ")} |`).join("\n");

if (!process.argv.includes("--write")) {
  console.log(table);
  process.exit(0);
}

const doc = readFileSync("DESIGN-SYSTEM.md", "utf8");
const start = doc.indexOf("| Role");
const end = doc.indexOf("\n\n", start);
writeFileSync("DESIGN-SYSTEM.md", doc.slice(0, start) + table + doc.slice(end));
console.log(`✓ DESIGN-SYSTEM.md table regenerated: ${rows.length} roles`);
