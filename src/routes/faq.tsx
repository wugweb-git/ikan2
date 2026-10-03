import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { InfoShell } from "@/components/info-shell";
import { pageMeta } from "@/components/equip/program-header";
import { cn } from "@/lib/utils";
import { faqPage as f } from "@/lib/content";
import { Disclosure, DisclosureGroup } from "@/components/kit/disclosure";
import { SearchField } from "@/components/kit/search-field";

export const Route = createFileRoute("/faq")({
  head: () => pageMeta(f.heroTitle, f.heroSubtitle, "/faq"),
  component: FaqPage,
});

function FaqPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const q = query.trim().toLowerCase();
  const groups = f.categories
    .filter((c) => category === "all" || c.id === category)
    .map((c) => ({
      ...c,
      items: c.items.filter(
        (i) => !q || i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q),
      ),
    }))
    .filter((c) => c.items.length);

  return (
    <InfoShell wide>
      <header className="px-5">
        <h1 className="type-headline-lg">{f.heroTitle}</h1>
        <p className="mt-2 text-[16px] leading-6 text-muted-foreground">{f.heroSubtitle}</p>
      </header>

      <SearchField
        value={query}
        onChange={setQuery}
        label={f.searchPlaceholder}
        className="mx-5 mt-5"
      />

      <div
        className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5"
        role="tablist"
        aria-label="Topics"
      >
        {[{ id: "all", title: "All" }, ...f.categories].map((c) => {
          const on = c.id === category;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setCategory(c.id)}
              className={cn(
                "inline-flex h-9 shrink-0 items-center rounded-[8px] border px-3.5 text-[14px] font-medium",
                on ? "border-transparent bg-foreground text-background" : "border-foreground/20",
              )}
            >
              {c.title}
            </button>
          );
        })}
      </div>

      {groups.length === 0 ? (
        <p className="mx-5 mt-8 text-center text-[15px] text-muted-foreground">{f.noResultsText}</p>
      ) : (
        groups.map((g) => (
          <section key={g.id} className="mt-7 px-5">
            <h2 className="font-display text-[18px] font-semibold">{g.title}</h2>
            <DisclosureGroup className="mt-3">
              {g.items.map((i) => (
                <Disclosure
                  key={i.question}
                  tone="plain"
                  radius={0}
                  title={i.question}
                  open={Boolean(q)}
                >
                  <p className="text-[15px] leading-6 text-muted-foreground">{i.answer}</p>
                </Disclosure>
              ))}
            </DisclosureGroup>
          </section>
        ))
      )}

      <section className="mx-5 mt-10 rounded-[24px] bg-secondary p-5">
        <p className="font-display text-[19px] font-semibold">{f.ctaTitle}</p>
        <p className="mt-1 text-[15px] leading-6 text-muted-foreground">{f.ctaDescription}</p>
        <Link
          to="/contact"
          className="mt-4 inline-flex h-11 items-center rounded-full bg-foreground px-5 text-[15px] font-semibold text-background"
        >
          {f.ctaButtonText}
        </Link>
      </section>
      <div className="h-6" />
    </InfoShell>
  );
}
