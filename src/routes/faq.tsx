import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { InfoShell } from "@/components/info-shell";
import { pageMeta } from "@/components/equip/program-header";
import { cn } from "@/lib/utils";
import { faqPage as f } from "@/lib/content";

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
    <InfoShell>
      <header className="px-5">
        <h1 className="font-display text-[32px] font-semibold leading-10">{f.heroTitle}</h1>
        <p className="mt-2 text-[16px] leading-6 text-muted-foreground">{f.heroSubtitle}</p>
      </header>

      <label className="mx-5 mt-5 flex h-12 items-center gap-3 rounded-full border border-foreground/15 px-4 focus-within:border-foreground/40">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={f.searchPlaceholder}
          aria-label={f.searchPlaceholder}
          className="h-full flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
        />
      </label>

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
            <div className="mt-3 overflow-hidden rounded-[20px] border border-foreground/10">
              {g.items.map((i, n) => (
                <details
                  key={i.question}
                  className={cn("group", n > 0 && "border-t border-foreground/10")}
                  open={Boolean(q)}
                >
                  <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 py-3 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                    <span className="flex-1">{i.question}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="px-4 pb-4 text-[15px] leading-6 text-muted-foreground">
                    {i.answer}
                  </p>
                </details>
              ))}
            </div>
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
