/* Writes public/sitemap.xml from the app's own route data, at build time.
 *
 * Why a build step rather than a server route: the list only changes when the code changes, so
 * generating it once per deploy costs nothing at runtime and cannot fail in production. It runs
 * from the "build" script, so it can never drift from what is deployed.
 *
 * Only pages worth indexing are listed. Everything behind sign-in (journal, programme days,
 * history, settings) is left out: those URLs are private, several of them name a condition, and
 * a crawler cannot reach them anyway.
 */

import { writeFileSync } from "node:fs";
import { resources, slugOf } from "../src/lib/resources";
import { assessments } from "../src/lib/assessment/instruments";

const ORIGIN = "https://app.ikanhealth.in";

type Entry = { path: string; changefreq: string; priority: string; lastmod?: string };

const staticPages: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/assessments", changefreq: "weekly", priority: "0.9" },
  { path: "/program", changefreq: "weekly", priority: "0.9" },
  { path: "/resources", changefreq: "daily", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/support", changefreq: "monthly", priority: "0.5" },
  { path: "/delete-account", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/privacy-policy", changefreq: "yearly", priority: "0.4" },
  { path: "/legal/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/cancellation-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/return-policy", changefreq: "yearly", priority: "0.3" },
];

const articles: Entry[] = resources.map((r) => ({
  path: `/resources/${slugOf(r)}`,
  changefreq: "monthly",
  priority: "0.8",
  lastmod: r.date,
}));

/* The assessment landing pages describe a screening test, which is what people search for. The
 * RESULT pages are not here: a result URL is about one person. */
const assessmentPages: Entry[] = assessments.map((a) => ({
  path: `/assessments/${a.slug}`,
  changefreq: "monthly",
  priority: "0.7",
}));

const entries = [...staticPages, ...articles, ...assessmentPages];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url>\n    <loc>${ORIGIN}${e.path}</loc>\n${
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : ""
      }    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), xml);
console.log(`sitemap.xml: ${entries.length} urls`);
