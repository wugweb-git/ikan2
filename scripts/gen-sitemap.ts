/* Writes public/sitemap.xml from the app's own route data, at build time.
 *
 * Why a build step rather than a server route: the list only changes when the code changes, so
 * generating it once per deploy costs nothing at runtime and cannot fail in production. It runs
 * from the "build" script, so it can never drift from what is deployed.
 *
 * Only pages a signed-OUT visitor can actually load are listed, which today means the routes in
 * the PUBLIC allowlist in src/components/auth-ui.tsx. Everything else - home, resources,
 * assessments, programmes, journal - redirects to the sign-in screen, so listing those URLs
 * would hand Googlebot 22 identical sign-in pages and earn soft-404s rather than traffic.
 *
 * If resources is ever made public, move its entries back below and regenerate. The articles
 * are already written, linked and marked up with Article JSON-LD, so that is the only step left.
 */

import { writeFileSync } from "node:fs";

const ORIGIN = "https://app.ikanhealth.in";

type Entry = { path: string; changefreq: string; priority: string; lastmod?: string };

const staticPages: Entry[] = [
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/faq", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/support", changefreq: "monthly", priority: "0.6" },
  { path: "/login", changefreq: "yearly", priority: "0.5" },
  { path: "/signup", changefreq: "yearly", priority: "0.5" },
  { path: "/delete-account", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/privacy-policy", changefreq: "yearly", priority: "0.4" },
  { path: "/legal/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/cancellation-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/return-policy", changefreq: "yearly", priority: "0.3" },
];

const entries = staticPages;

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
