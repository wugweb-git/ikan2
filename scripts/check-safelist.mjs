#!/usr/bin/env node
/* Every @utility in styles.css must be listed in its @source inline(...).
 *
 * Tailwind emits a utility only where it sees one used, so an @utility that nothing
 * references today compiles to nothing — it is defined, inert, and silently absent from the
 * shipped stylesheet. Typing it does nothing and reports nothing. Four of the nine type roles
 * were in that state before the safelist existed.
 *
 * The safelist fixes it but has to be kept in step by hand, and it already drifted once: a
 * parallel branch added state-spin, state-wash and media-pulse without updating it. This turns
 * that silent drift into a failing check.
 *
 * Run: node scripts/check-safelist.mjs [--fix]
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/styles.css";
/* max-w-app is a container query helper, not a class anyone writes by hand */
const EXEMPT = new Set(["max-w-app"]);

const css = readFileSync(FILE, "utf8");
const declared = [...css.matchAll(/^@utility\s+([a-z0-9-]+)/gm)]
  .map((m) => m[1])
  .filter((n) => !EXEMPT.has(n))
  .sort();

const block = css.match(/@source inline\("\{([^}]*)\}"\);/);
if (!block) {
  console.error(`✗ ${FILE}: no @source inline(...) block found.`);
  process.exit(1);
}
const listed = new Set(block[1].split(",").filter(Boolean));
const missing = declared.filter((n) => !listed.has(n));
const stale = [...listed].filter((n) => !declared.includes(n));

if (!missing.length && !stale.length) {
  console.log(`✓ safelist in step: ${declared.length} utilities`);
  process.exit(0);
}

if (process.argv.includes("--fix")) {
  writeFileSync(
    FILE,
    css.replace(/@source inline\("\{[^}]*\}"\);/, `@source inline("{${declared.join(",")}}");`),
  );
  console.log(`✓ safelist regenerated: ${declared.length} utilities`);
  process.exit(0);
}

if (missing.length) {
  console.error(`✗ declared but not safelisted — these compile to nothing unless used:`);
  for (const n of missing) console.error(`    ${n}`);
}
if (stale.length) {
  console.error(`✗ safelisted but no longer declared:`);
  for (const n of stale) console.error(`    ${n}`);
}
console.error(`\n  Fix: node scripts/check-safelist.mjs --fix`);
process.exit(1);
