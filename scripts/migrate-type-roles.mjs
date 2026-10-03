#!/usr/bin/env node
/* Replace arbitrary text-[Npx] with the type role that matches it.
 *
 * A role sets size, line-height, weight and tracking together. An arbitrary size sets only
 * the size, so swapping one for the other is only safe when the rest already agrees — or
 * when the difference is one the role is meant to supply.
 *
 * Three tiers, chosen per call site:
 *   exact   size, line-height, weight and family all already match the role.
 *           Byte-identical rendering.
 *   weight  size, line-height and family match; the weight differs. Emits `role font-x`,
 *           which resolves correctly because the weight utility wins over the role's own.
 *   leading size and family match and NO line-height was set, so the text currently renders
 *           at the browser's `normal` (~1.2-1.4). The role supplies the designed value.
 *           This CHANGES rendering — usually by a couple of px per line, in the direction
 *           the scale intends — and is opt-in via --leading.
 *
 * Anything else is left alone and reported: a real mismatch needs a human, not a regex.
 *
 * Run: node scripts/migrate-type-roles.mjs [--write] [--leading]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const WRITE = process.argv.includes("--write");
const DO_LEADING = process.argv.includes("--leading");

const ROLES = [
  ["type-display-lg", "display", 52, 58, 600],
  ["type-display-md", "display", 42, 48, 600],
  ["type-display-sm", "display", 34, 40, 600],
  ["type-headline-lg", "display", 32, 40, 600],
  ["type-headline-md", "display", 28, 36, 600],
  ["type-headline-sm", "display", 24, 32, 600],
  ["type-title-lg", "display", 20, 28, 500],
  ["type-title-md", "display", 16, 24, 600],
  ["type-body-xl", "sans", 17, 28, 400],
  ["type-body-lg", "sans", 16, 26, 400],
  ["type-action", "sans", 15, 22, 600],
  ["type-body-md", "sans", 14, 21, 400],
  ["type-label-lg", "sans", 14, 20, 500],
  ["type-body-sm", "sans", 13, 20, 400],
  ["type-label-md", "sans", 12, 16, 500],
];
const WEIGHT = { "font-thin":100,"font-extralight":200,"font-light":300,"font-normal":400,
  "font-medium":500,"font-semibold":600,"font-bold":700,"font-extrabold":800,"font-black":900 };
const WEIGHT_CLASS = Object.fromEntries(Object.entries(WEIGHT).map(([k, v]) => [v, k]));
const LEADING = { "leading-3":12,"leading-4":16,"leading-5":20,"leading-6":24,"leading-7":28,
  "leading-8":32,"leading-9":36,"leading-10":40 };

const files = execSync("grep -rl 'text-\\[' src --include=*.tsx", { encoding: "utf8" })
  .trim().split("\n").filter((f) => !f.includes(".stories."));

const tally = { exact: 0, weight: 0, leading: 0, skipped: 0 };
const skipReasons = {};
let touched = 0;

for (const file of files) {
  const before = readFileSync(file, "utf8");
  const after = before.replace(/"([^"]*text-\[(\d+)px\][^"]*)"/g, (whole, cls, sizeStr) => {
    const size = Number(sizeStr);
    const toks = cls.split(/\s+/).filter(Boolean);
    if (toks.some((t) => t.startsWith("tracking-"))) { tally.skipped++; bump("explicit tracking"); return whole; }

    const display = toks.includes("font-display");
    const fam = display ? "display" : "sans";
    const wTok = toks.find((t) => WEIGHT[t] !== undefined);
    const w = wTok ? WEIGHT[wTok] : undefined;
    const lhTok = toks.find((t) => LEADING[t] !== undefined);
    const lhArb = cls.match(/leading-\[(\d+)px\]/);
    const lh = lhArb ? Number(lhArb[1]) : lhTok ? LEADING[lhTok] : undefined;
    if (!lhArb && toks.some((t) => /^leading-(none|tight|snug|normal|relaxed|loose)$/.test(t))) {
      tally.skipped++; bump("relative leading"); return whole;
    }

    const bySize = ROLES.filter((r) => r[1] === fam && r[2] === size);
    if (!bySize.length) { tally.skipped++; bump(`no ${fam} role at ${size}px`); return whole; }

    let role = null, tier = null;
    const lhMatch = bySize.filter((r) => lh !== undefined && Math.abs(lh - r[3]) < 0.6);
    if (lh !== undefined) {
      if (!lhMatch.length) { tally.skipped++; bump(`${fam} ${size}px line-height ${lh} matches no role`); return whole; }
      const exact = lhMatch.find((r) => w === undefined || w === r[4]);
      if (exact) { role = exact; tier = "exact"; }
      else { role = lhMatch[0]; tier = "weight"; }
    } else {
      if (!DO_LEADING) { tally.skipped++; bump("would gain a line-height (run with --leading)"); return whole; }
      const exact = bySize.find((r) => w === undefined || w === r[4]);
      role = exact ?? bySize[0];
      tier = "leading";
    }

    // build the replacement token list
    const keep = toks.filter((t) =>
      t !== `text-[${size}px]` && t !== "font-display" &&
      LEADING[t] === undefined && !/^leading-\[\d+px\]$/.test(t) &&
      WEIGHT[t] === undefined);
    const out = [role[0]];
    if (w !== undefined && w !== role[4]) out.push(WEIGHT_CLASS[w]);
    tally[tier]++;
    return `"${[...out, ...keep].join(" ")}"`;
  });
  if (after !== before) { touched++; if (WRITE) writeFileSync(file, after); }
}
function bump(k) { skipReasons[k] = (skipReasons[k] || 0) + 1; }

console.log(`${WRITE ? "MIGRATED" : "DRY RUN"}${DO_LEADING ? " (incl. --leading)" : ""}\n`);
console.log(`  exact   ${String(tally.exact).padStart(4)}  identical rendering`);
console.log(`  weight  ${String(tally.weight).padStart(4)}  role + weight override`);
console.log(`  leading ${String(tally.leading).padStart(4)}  gains the role's line-height`);
console.log(`  skipped ${String(tally.skipped).padStart(4)}`);
console.log(`  files   ${String(touched).padStart(4)}\n`);
console.log("LEFT ALONE:");
for (const [k, v] of Object.entries(skipReasons).sort((a, b) => b[1] - a[1]))
  console.log(`  ${String(v).padStart(4)}  ${k}`);
