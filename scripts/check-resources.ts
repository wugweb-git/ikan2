/* The house rules for Resources, as a check that fails CI when a piece breaks one.
 *
 * Every article is an HTML string in src/lib/content/articles.json, rendered through .prose-ikan
 * (src/styles.css), and listed in src/lib/resources.ts. They were imported from several places
 * (the old site, Notion, hand-written) and each import brought its own habits: section titles as
 * plain paragraphs, bullets as "·" paragraphs, a TL;DR inside a heading, sources as a line of
 * italics, raw web addresses as link text. Each of those looked different on screen. This script
 * is the one vocabulary they now share, so a new piece either uses the same styles or does not
 * ship.
 *
 * Run: bun scripts/check-resources.ts
 * The map from each part to the CSS that draws it: src/lib/content/RESOURCES.md
 *
 * THE VOCABULARY
 *
 * Listing (resources.ts)
 *   - title: Title Case, no full stop at the end (a ? is fine).
 *   - every piece has a body in articles.json, with an author and a standfirst (`description`).
 *   - an article's `minutes` is its word count / 150, rounded up: generous, because plenty of
 *     people read slowly. Video and audio give their running time instead.
 *   - reported, not failed (content is the author's): a standfirst that does not end a sentence
 *     or runs past 220 characters.
 *   - its own cover scene (`art`, no two alike) and a cover file at
 *     public/resources/covers/<slug>.webp.
 *
 * Body (articles.json)
 *   - blocks: p, h2, h3, ul, ol, figure, table, section.sources. No h1 (the title is the h1),
 *     nothing outside a block, no empty paragraph.
 *   - h2 for sections, h3 only under an h2. Headings are sentence case with no full stop.
 *   - lists are ul/ol. A "Label: text" item leads with <strong>Label:</strong>.
 *   - a picture: <figure><a href="/resources/x.webp"><img src width height loading="lazy" alt>
 *     </a>[<figcaption>]</figure>, the file in public/resources, and alt text that carries what
 *     the picture says. Kept for illustrations and infographics only.
 *   - a graph: <figure class="chart"><figcaption class="chart-title">…</figcaption><ol><li
 *     style="--v:0.000">(class="is-key")<span class="bar-label"/><span class="bar-value"/><span
 *     class="bar" aria-hidden="true"><i></i></span></li>…</ol>(<p class="chart-note">)</figure>.
 *   - a table is either a score table (no class, three columns: score, band, what next) or
 *     <table class="data-table"> with a <thead> and data-label on every cell after the first.
 *   - sources, when there are any, come last: <section class="sources"><h2>Sources</h2>, then
 *     optional h3 groups and ul lists, each item opening with <strong>Who (year).</strong>.
 *   - a link that leaves iKAN: target="_blank" rel="noopener noreferrer", a visually hidden
 *     "(opens in a new tab)", and words as its text, never a web address.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { resources, slugOf, mediumOf } from "../src/lib/resources";
import articles from "../src/lib/content/articles.json";

type Article = { author: string; description: string; html: string };
const bodies = articles as Record<string, Article>;
const root = join(import.meta.dir, "..");
const problems: string[] = [];
const fail = (where: string, what: string) => problems.push(`${where}: ${what}`);
/* Content is the author's call, not the build's: what an article says, its standfirst and its
 * read time are reported for the author to look at, never failed on and never rewritten. */
const notes: string[] = [];
const note = (where: string, what: string) => notes.push(`${where}: ${what}`);

const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/g, "x")
    .split(/\s+/)
    .filter(Boolean);

/* ---------- the listing ---------- */

const arts = new Map<string, string>();
for (const r of resources) {
  const where = `"${r.title}"`;
  if (/\.\s*$/.test(r.title)) fail(where, "title ends in a full stop");
  if (/\s{2,}|^\s|\s$/.test(r.title)) fail(where, "title has stray spaces");
  if (arts.has(r.art)) fail(where, `cover art "${r.art}" is already used by "${arts.get(r.art)}"`);
  arts.set(r.art, r.title);
  if (!existsSync(join(root, "public/resources/covers", `${slugOf(r)}.webp`)))
    fail(where, `no cover file public/resources/covers/${slugOf(r)}.webp`);

  const a = bodies[r.id];
  if (!a) {
    fail(where, "no body in articles.json");
    continue;
  }
  if (!a.author?.trim()) fail(where, "no author");
  const d = a.description?.trim() ?? "";
  if (!d) fail(where, "no standfirst (description)");
  else {
    if (!/[.?!]$/.test(d)) note(where, `standfirst does not end a sentence: "${d.slice(-40)}"`);
    if (d.length > 220) note(where, `standfirst is ${d.length} characters (aim for 220 or less)`);
  }
  if (mediumOf(r) === "article") {
    const want = Math.max(1, Math.ceil(text(a.html).length / 150));
    if (r.minutes !== want)
      fail(where, `says ${r.minutes} min; at 150 words a minute it is ${want}`);
  } else if (!r.src) fail(where, `a ${mediumOf(r)} piece with no src`);
}
for (const id of Object.keys(bodies))
  if (!resources.some((r) => r.id === id)) fail(id, "body in articles.json with no listing");

/* ---------- the body ---------- */

const ALLOWED: Record<string, string[]> = {
  p: ["class"],
  h2: [],
  h3: [],
  ul: [],
  ol: [],
  li: ["style", "class"],
  strong: [],
  em: [],
  a: ["href", "target", "rel"],
  span: ["class", "aria-hidden"],
  i: [],
  figure: ["class"],
  figcaption: ["class"],
  img: ["src", "width", "height", "loading", "alt"],
  table: ["class"],
  thead: [],
  tbody: [],
  tr: [],
  th: [],
  td: ["data-label"],
  section: ["class"],
};
const CLASSES: Record<string, string[]> = {
  p: ["chart-note"],
  li: ["is-key"],
  span: ["sr-only", "bar-label", "bar-value", "bar"],
  figure: ["chart"],
  figcaption: ["chart-title"],
  table: ["data-table"],
  section: ["sources"],
};
const BLOCKS = new Set(["p", "h2", "h3", "ul", "ol", "figure", "table", "section"]);
const VOID = new Set(["img"]);

type Node = { tag: string; attrs: Record<string, string>; kids: (Node | string)[] };

function parse(html: string, where: string): Node {
  const top: Node = { tag: "#root", attrs: {}, kids: [] };
  const stack = [top];
  const re = /<\/?([a-z0-9]+)((?:\s+[a-z-]+(?:="[^"]*")?)*)\s*\/?>|([^<]+)/g;
  for (const m of html.matchAll(re)) {
    const cur = stack.at(-1)!;
    if (m[3] !== undefined) {
      cur.kids.push(m[3]);
      continue;
    }
    const tag = m[1]!;
    if (m[0].startsWith("</")) {
      if (cur.tag !== tag) fail(where, `</${tag}> closes <${cur.tag}>`);
      else stack.pop();
      continue;
    }
    const attrs: Record<string, string> = {};
    for (const a of (m[2] ?? "").matchAll(/([a-z-]+)(?:="([^"]*)")?/g)) attrs[a[1]!] = a[2] ?? "";
    const node: Node = { tag, attrs, kids: [] };
    cur.kids.push(node);
    if (!VOID.has(tag)) stack.push(node);
  }
  if (stack.length > 1) fail(where, `<${stack.at(-1)!.tag}> is never closed`);
  return top;
}

const inner = (n: Node | string): string =>
  typeof n === "string" ? n : n.kids.map(inner).join("");
const walk = (n: Node, f: (n: Node, parent: Node) => void) =>
  n.kids.forEach((k) => {
    if (typeof k !== "string") {
      f(k, n);
      walk(k, f);
    }
  });
const firstEl = (n: Node) => n.kids.find((k): k is Node => typeof k !== "string");
const looksLikeAddress = (s: string) =>
  /^(https?:\/\/|www\.)|^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(s.trim());

for (const r of resources) {
  const a = bodies[r.id];
  if (!a) continue;
  const where = `"${r.title}"`;
  const doc = parse(a.html, where);

  /* top level: blocks only, nothing loose */
  let seenH2 = false;
  doc.kids.forEach((k, i) => {
    if (typeof k === "string") {
      if (k.trim()) fail(where, `text outside any block: "${k.trim().slice(0, 50)}"`);
      return;
    }
    if (!BLOCKS.has(k.tag)) fail(where, `<${k.tag}> at the top level`);
    if (k.tag === "h2") seenH2 = true;
    if (k.tag === "h3" && !seenH2) fail(where, `h3 "${inner(k)}" before any h2`);
    if (k.tag === "section" && i !== doc.kids.length - 1) fail(where, "sources are not last");
    if (k.tag === "p" && !inner(k).trim()) fail(where, "empty paragraph");
    if (k.tag === "p" && /^\s*·/.test(inner(k)))
      fail(where, `bullet written as a paragraph: "${inner(k).slice(0, 40)}"`);
  });

  walk(doc, (n, parent) => {
    const allowed = ALLOWED[n.tag];
    if (!allowed) return fail(where, `<${n.tag}> is not part of the vocabulary`);
    for (const [k, v] of Object.entries(n.attrs)) {
      if (!allowed.includes(k)) fail(where, `<${n.tag} ${k}> is not allowed`);
      if (k === "class" && !(CLASSES[n.tag] ?? []).includes(v))
        fail(where, `<${n.tag} class="${v}"> is not a known class`);
    }

    if (n.tag === "h2" || n.tag === "h3") {
      const t = inner(n).trim();
      if (/(?<!\.\.)\.$/.test(t)) fail(where, `heading ends in a full stop: "${t}"`);
      if (n.kids.some((k) => typeof k !== "string")) fail(where, `markup inside heading "${t}"`);
      if (t.length > 90) fail(where, `heading is ${t.length} characters: "${t.slice(0, 40)}…"`);
    }

    if (n.tag === "li" && parent.tag !== "ol" && parent.tag !== "ul")
      fail(where, "<li> outside a list");
    if (n.tag === "li") {
      const head = typeof n.kids[0] === "string" ? n.kids[0] : "";
      if (/^[A-Z][^:<]{1,40}:\s/.test(head))
        fail(where, `list label not in bold: "${head.slice(0, 40)}"`);
      if ("style" in n.attrs && !/^--v:(0|1)(\.\d{1,3})?$/.test(n.attrs.style!))
        fail(where, `li style "${n.attrs.style}" (only --v on a chart bar)`);
    }

    if (n.tag === "a") {
      const href = n.attrs.href ?? "";
      const label = inner(n).replace(/\s*\(opens in a new tab\)\s*$/, "");
      if (/^https?:/.test(href)) {
        if (n.attrs.target !== "_blank" || n.attrs.rel !== "noopener noreferrer")
          fail(where, `external link without target/rel: ${href}`);
        if (!/\(opens in a new tab\)/.test(inner(n)))
          fail(where, `external link without "(opens in a new tab)": ${href}`);
        if (looksLikeAddress(label)) fail(where, `a web address as link text: ${label}`);
      } else if (!href.startsWith("/")) fail(where, `link to "${href}"`);
    }

    if (n.tag === "figure") {
      if (n.attrs.class === "chart") {
        const cap = firstEl(n);
        if (cap?.tag !== "figcaption" || cap.attrs.class !== "chart-title")
          fail(where, "chart without a chart-title first");
        const list = n.kids.find((k): k is Node => typeof k !== "string" && k.tag === "ol");
        if (!list) fail(where, "chart without its <ol> of bars");
        list?.kids.forEach((li) => {
          if (typeof li === "string") return;
          const cls = li.kids
            .filter((k): k is Node => typeof k !== "string")
            .map((k) => k.attrs.class);
          if (cls.join(",") !== "bar-label,bar-value,bar" || !li.attrs.style)
            fail(where, `chart row "${inner(li).slice(0, 30)}" is not label, value, bar`);
        });
      } else {
        const link = firstEl(n);
        const img = link && firstEl(link);
        if (link?.tag !== "a" || img?.tag !== "img") fail(where, "picture is not <figure><a><img>");
        else {
          const src = img.attrs.src ?? "";
          if (link.attrs.href !== src)
            fail(where, `picture links somewhere other than itself: ${src}`);
          if (!existsSync(join(root, "public", src))) fail(where, `missing file public${src}`);
          for (const k of ["width", "height", "alt"])
            if (!img.attrs[k]) fail(where, `picture ${src} has no ${k}`);
          if (img.attrs.loading !== "lazy") fail(where, `picture ${src} is not loading="lazy"`);
          if ((img.attrs.alt ?? "").length < 40)
            fail(where, `picture ${src} alt text is too short to carry what it shows`);
        }
      }
    }

    if (n.tag === "table") {
      const rows: Node[] = [];
      walk(n, (x) => x.tag === "tr" && rows.push(x));
      const cells = (tr: Node) => tr.kids.filter((k): k is Node => typeof k !== "string");
      if (n.attrs.class === "data-table") {
        if (!n.kids.some((k) => typeof k !== "string" && k.tag === "thead"))
          fail(where, "data table without a <thead>");
        rows.slice(1).forEach((tr) =>
          cells(tr)
            .slice(1)
            .forEach(
              (td) => !td.attrs["data-label"] && fail(where, "data cell without data-label"),
            ),
        );
      } else if (rows.some((tr) => cells(tr).length !== 3))
        fail(where, 'a table that is not score, band, what next needs class="data-table"');
    }

    if (n.tag === "section") {
      const h = firstEl(n);
      if (h?.tag !== "h2" || inner(h).trim() !== "Sources")
        fail(where, "sources do not open with <h2>Sources</h2>");
      n.kids.forEach((k) => {
        if (typeof k === "string" || ["h2", "h3", "ul", "p"].includes(k.tag)) return;
        fail(where, `<${k.tag}> inside sources (use ul)`);
      });
      walk(n, (li) => {
        if (li.tag !== "li") return;
        const lead = li.kids[0];
        if (typeof lead === "string" || lead?.tag !== "strong")
          fail(where, `source does not open with who and when: "${inner(li).slice(0, 40)}"`);
      });
    }
  });
}

if (notes.length)
  console.log(`· ${notes.length} note(s) for the author, not failures:\n  ${notes.join("\n  ")}`);
if (problems.length) {
  console.error(`✗ ${problems.length} resource problem(s):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`✓ ${resources.length} resources follow the house rules`);
