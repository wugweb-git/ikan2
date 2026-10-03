import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { InfoShell } from "@/components/info-shell";
import { pageMeta } from "@/components/equip/program-header";
import { cn } from "@/lib/utils";
import { legalOrder, legalPages, type LegalSlug } from "@/lib/content";

export const Route = createFileRoute("/legal/$slug")({
  loader: ({ params }) => {
    if (!(params.slug in legalPages)) throw notFound();
    return { slug: params.slug as LegalSlug };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? legalPages[loaderData.slug] : undefined;
    return p ? pageMeta(p.title, p.subtitle || p.title) : { meta: [{ title: "Legal — iKAN" }] };
  },
  component: LegalPage,
});

function LegalPage() {
  const { slug } = Route.useLoaderData();
  const page = legalPages[slug];

  return (
    <InfoShell wide>
      <div
        className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-2"
        role="navigation"
        aria-label="Legal pages"
      >
        {legalOrder.map((s) => (
          <Link
            key={s}
            to="/legal/$slug"
            params={{ slug: s }}
            className={cn(
              "type-label-lg inline-flex h-9 shrink-0 items-center rounded-[8px] border px-3.5",
              s === slug
                ? "border-transparent bg-foreground text-background"
                : "border-foreground/20",
            )}
          >
            {legalPages[s].title}
          </Link>
        ))}
      </div>
      <header className="px-5 pt-4">
        <h1 className="font-display text-[30px] font-semibold leading-9">{page.title}</h1>
        {page.subtitle ? (
          <p className="mt-2 text-[16px] leading-6 text-muted-foreground">{page.subtitle}</p>
        ) : null}
      </header>
      <div className="prose-ikan mt-6 px-5" dangerouslySetInnerHTML={{ __html: page.html }} />
      <div className="h-8" />
    </InfoShell>
  );
}
