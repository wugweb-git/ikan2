import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, BookmarkCheck, BookOpen, Search } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { Illustration } from "@/components/art";
import { accentStyle, IconButton, Snackbar, stateLayer, useSnack } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { resources, useResourceStore, type Resource } from "@/lib/resources";

export const Route = createFileRoute("/resources/")({
  head: () => pageMeta("Resources", "Articles and guides to support your mental health journey."),
  component: ResourcesPage,
});

const filters = ["All", "Saved", "General", "Stress", "Sleep"] as const;
type Filter = (typeof filters)[number];

const dateLabel = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function ResourcesPage() {
  const hydrated = useHydrated();
  const store = useResourceStore();
  const snack = useSnack();
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const open = (r: Resource) => navigate({ to: "/resources/$id", params: { id: r.id } });

  const featured = resources.filter((r) => r.featured);
  const q = query.trim().toLowerCase();
  const shown = resources
    .filter((r) => !q || r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q))
    .filter((r) =>
      filter === "All"
        ? true
        : filter === "Saved"
          ? hydrated && store.isSaved(r.id)
          : r.category === filter,
    );

  const toggle = (r: Resource) => {
    const was = store.isSaved(r.id);
    store.toggleSave(r.id);
    snack.show(was ? "Removed from saved" : "Saved for later");
  };

  return (
    <IkanShell>
      <div style={accentStyle("calm")}>
        <header className="px-4 pb-1 pt-8">
          <h1 className="font-display text-[32px] font-semibold leading-10">Resources</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Articles and guides to support your mental health journey
          </p>
        </header>

        <label className="mx-4 mt-4 flex h-12 items-center gap-3 rounded-full border border-foreground/15 bg-background px-4 focus-within:border-foreground/40">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles and guides"
            aria-label="Search articles and guides"
            className="h-full flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
          />
        </label>

        {q ? null : (
          <section className="mt-5" aria-label="Featured">
            <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
              {featured.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => open(r)}
                  className={cn(
                    "relative h-[232px] w-[86%] shrink-0 snap-center overflow-hidden rounded-[28px] text-left text-white",
                    stateLayer,
                  )}
                >
                  <Illustration art={r.art} className="absolute inset-0" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-5">
                    <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-white/20 px-2.5 text-[12px] font-semibold backdrop-blur">
                      <BookOpen className="h-3.5 w-3.5" />
                      {i === 0 ? "Featured story" : r.category}
                    </span>
                    <span className="mt-2 line-clamp-3 block font-display text-[20px] font-semibold leading-6">
                      {r.title}
                    </span>
                    <span className="mt-2 block text-[13px] opacity-85">
                      {dateLabel(r.date)}, {r.minutes} min read
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        <div
          className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-4"
          role="tablist"
          aria-label="Filter articles"
        >
          {filters.map((f) => {
            const on = f === filter;
            const count = f === "Saved" && hydrated ? store.saved.length : null;
            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(f)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[8px] border px-3.5 text-[14px] font-medium transition-colors",
                  stateLayer,
                  on
                    ? "border-transparent bg-[var(--accent-container)] text-[var(--on-accent-container)]"
                    : "border-foreground/20",
                )}
              >
                {f === "Saved" ? <Bookmark className="h-4 w-4" /> : null}
                {f}
                {count ? <span className="text-[12px] opacity-70">{count}</span> : null}
              </button>
            );
          })}
        </div>

        <p className="mt-4 px-4 text-[13px] text-muted-foreground">
          {shown.length} {shown.length === 1 ? "article" : "articles"}
        </p>

        {shown.length === 0 ? (
          <div className="mx-4 mt-3 overflow-hidden rounded-[24px] bg-secondary">
            <div className="h-28">
              <Illustration art="checkup" />
            </div>
            <div className="p-5 text-center">
              <p className="font-display text-[17px] font-semibold">
                {q ? "No articles match" : "Nothing saved yet"}
              </p>
              <p className="mt-1 text-[14px] text-muted-foreground">
                {q
                  ? "Try another word, like sleep or stress."
                  : "Tap the bookmark on any article to keep it here."}
              </p>
            </div>
          </div>
        ) : (
          <ul className="mt-2 px-4">
            {shown.map((r) => {
              const saved = hydrated && store.isSaved(r.id);
              const read = hydrated && Boolean(store.opened[r.id]);
              return (
                <li key={r.id} className="border-b border-foreground/10 last:border-0">
                  <div className="flex items-center gap-3 py-3">
                    <button
                      type="button"
                      onClick={() => open(r)}
                      className={cn(
                        "flex min-w-0 flex-1 items-center gap-3 rounded-[16px] text-left",
                        stateLayer,
                      )}
                    >
                      <span className="h-[84px] w-[84px] shrink-0 overflow-hidden rounded-[16px]">
                        <Illustration art={r.art} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12px] font-semibold text-[var(--accent-strong)]">
                          {r.category}
                          {read ? (
                            <span className="ml-2 font-normal text-muted-foreground">Read</span>
                          ) : null}
                        </span>
                        <span className="mt-0.5 line-clamp-2 block text-[15px] font-semibold leading-5">
                          {r.title}
                        </span>
                        <span className="mt-1 block text-[12px] text-muted-foreground">
                          {dateLabel(r.date)}, {r.minutes} min read
                        </span>
                      </span>
                    </button>
                    <IconButton
                      label={saved ? "Remove from saved" : "Save for later"}
                      onClick={() => toggle(r)}
                    >
                      {saved ? (
                        <BookmarkCheck className="h-5 w-5 text-[var(--accent-strong)]" />
                      ) : (
                        <Bookmark className="h-5 w-5 text-muted-foreground" />
                      )}
                    </IconButton>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <Snackbar message={snack.message} />
      </div>
    </IkanShell>
  );
}
