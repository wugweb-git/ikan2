import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, BookmarkCheck, CalendarDays, Check, Clock3, Search, X } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { Illustration } from "@/components/art";
import { accentStyle, IconButton, Snackbar, stateLayer, useSnack } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import {
  doneLabel,
  lengthLabel,
  mediumIcon,
  mediumLabel,
  mediumOf,
  progressLabel,
  resources,
  slugOf,
  useResourceStore,
  type Medium,
  type Resource,
} from "@/lib/resources";

/* The library is filtered by what a thing is, not by what it is about: there are three resource
 * types and that is the whole list. Saved sits on the end because it is a state, not a type, and
 * it is the only way back to a bookmark. Categories stay on the cards as a label and in search. */
const filters = ["All", "Read", "Listen", "Watch", "Saved"] as const;
type Filter = (typeof filters)[number];

const filterMedium: Partial<Record<Filter, Medium>> = {
  Read: "article",
  Listen: "audio",
  Watch: "video",
};

const nothingYet: Partial<Record<Filter, string>> = {
  Read: "Nothing to read yet",
  Listen: "Nothing to listen to yet",
  Watch: "Nothing to watch yet",
};

/* The filter lives in the URL: /resources?type=watch */
export const Route = createFileRoute("/resources/")({
  validateSearch: (s: Record<string, unknown>): { type?: string } => {
    const t = typeof s["type"] === "string" ? s["type"].toLowerCase() : "";
    return filters.some((f) => f !== "All" && f.toLowerCase() === t) ? { type: t } : {};
  },
  head: () =>
    pageMeta(
      "Resources",
      "Articles and guides to support your mental health journey.",
      "/resources",
    ),
  component: ResourcesPage,
});

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
  const { type } = Route.useSearch();
  const navigate = useNavigate();
  const filter: Filter = filters.find((f) => f.toLowerCase() === type) ?? "All";
  const setFilter = (f: Filter) =>
    navigate({
      to: "/resources",
      search: f === "All" ? {} : { type: f.toLowerCase() },
      replace: true,
      resetScroll: false,
    });
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const featured = resources.filter((r) => r.featured);
  const q = query.trim().toLowerCase();
  const shown = resources
    .filter(
      (r) =>
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        mediumOf(r).includes(q),
    )
    .filter((r) =>
      filter === "All"
        ? true
        : filter === "Saved"
          ? hydrated && store.isSaved(r.id)
          : mediumOf(r) === filterMedium[filter],
    );

  const toggle = (r: Resource) => {
    const was = store.isSaved(r.id);
    store.toggleSave(r.id);
    snack.show(was ? "Removed from saved" : "Saved for later");
  };

  return (
    <IkanShell>
      <div style={accentStyle("calm")}>
        <header className="safe-top px-4 pb-1">
          <h1 className="font-display text-[32px] font-semibold leading-10">Resources</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Articles and guides to support your mental health journey
          </p>
        </header>

        {q ? null : (
          <section className="mt-5" aria-label="Featured">
            <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
              {featured.map((r, i) => (
                <Link
                  key={r.id}
                  to="/resources/$slug"
                  params={{ slug: slugOf(r) }}
                  className={cn(
                    "relative block h-[232px] w-[86%] shrink-0 snap-center overflow-hidden rounded-[28px] text-left text-white",
                    stateLayer,
                  )}
                >
                  <Illustration art={r.art} className="absolute inset-0" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-white/20 px-2.5 text-[12px] font-semibold backdrop-blur">
                      {(() => {
                        const Icon = mediumIcon[mediumOf(r)];
                        return <Icon className="h-3.5 w-3.5" />;
                      })()}
                      {i === 0 ? "Featured story" : r.category}
                    </span>
                    <h2 className="mt-2 line-clamp-3 font-display text-[20px] font-semibold leading-6">
                      {r.title}
                    </h2>
                    <span className="mt-2 flex items-center gap-3 text-[13px] opacity-85">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" /> {dateLabel(r.date)}
                      </span>
                      {/* what it is, then how long it takes: two facts, two icons */}
                      <span className="inline-flex items-center gap-1.5">
                        {(() => {
                          const Icon = mediumIcon[mediumOf(r)];
                          return <Icon className="h-3.5 w-3.5" />;
                        })()}
                        {mediumLabel(r)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" /> {lengthLabel(r)}
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Search lives with the filters rather than above them: it is one more way of narrowing
         * the same list, and a permanent bar was taking a whole row to say "Resources" twice. */}
        <div className="mt-5 flex items-center gap-2 px-4">
          {searching ? (
            <div className="flex h-9 flex-1 items-center gap-2 rounded-[8px] border border-foreground/20 pr-1 pl-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              {/* text, not search: the native search type draws its own clear button, and there
               * is already one at the end of the row */}
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the library"
                aria-label="Search the library"
                className="h-full min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => {
                  setQuery("");
                  setSearching(false);
                }}
                className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full", stateLayer)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                aria-label="Search the library"
                onClick={() => setSearching(true)}
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-[8px] border border-foreground/20",
                  stateLayer,
                )}
              >
                <Search className="h-4 w-4" />
              </button>
              <div
                className="no-scrollbar flex gap-2 overflow-x-auto"
                role="tablist"
                aria-label="Filter resources"
              >
                {filters.map((f) => {
                  const on = f === filter;
                  const count = f === "Saved" && hydrated ? store.saved.length : null;
                  const m = filterMedium[f];
                  const Icon = m ? mediumIcon[m] : null;
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
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                      {f}
                      {count ? <span className="text-[12px] opacity-70">{count}</span> : null}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <p className="mt-4 px-4 text-[13px] text-muted-foreground">
          {shown.length} {shown.length === 1 ? "resource" : "resources"}
        </p>

        {shown.length === 0 ? (
          <div className="mx-4 mt-3 overflow-hidden rounded-[24px] bg-secondary">
            <div className="h-28">
              <Illustration art="checkup" />
            </div>
            <div className="p-5 text-center">
              <p className="font-display text-[17px] font-semibold">
                {q
                  ? "Nothing matches that"
                  : filter === "Saved"
                    ? "Nothing saved yet"
                    : (nothingYet[filter] ?? "Nothing here yet")}
              </p>
              <p className="mt-1 text-[14px] text-muted-foreground">
                {q
                  ? "Try another word, like sleep or stress."
                  : filter === "Saved"
                    ? "Tap the bookmark on anything here to keep it."
                    : "It is on the way. The rest of the library is under All."}
              </p>
            </div>
          </div>
        ) : (
          <ul className="mt-2 px-4">
            {shown.map((r) => {
              const saved = hydrated && store.isSaved(r.id);
              /* One signal per card. Part way through, it says how much is left; finished, it
               * is a check. Never both: they said different things about the same resource. */
              const read = hydrated && Boolean(store.opened[r.id]);
              const progress = hydrated ? progressLabel(r, store.playedOf(r.id)) : null;
              return (
                <li key={r.id} className="border-b border-foreground/10 last:border-0">
                  <div className="flex items-center gap-3 py-3">
                    <Link
                      to="/resources/$slug"
                      params={{ slug: slugOf(r) }}
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
                          {/* opened already. A check, not the word: "Read" now names a type in
                           * the filter row above, and the eyebrow would say it twice over. */}
                          {progress ? (
                            <span className="ml-1.5 font-normal text-muted-foreground">
                              {progress}
                            </span>
                          ) : read ? (
                            <span className="ml-1.5 inline-flex items-center align-middle text-muted-foreground">
                              <Check className="h-3.5 w-3.5" aria-hidden="true" />
                              <span className="sr-only">{doneLabel(r)}</span>
                            </span>
                          ) : null}
                        </span>
                        <h3 className="mt-0.5 line-clamp-2 text-[15px] font-semibold leading-5">
                          {r.title}
                        </h3>
                        {/* What it is and how long it takes. The date is on the featured card and
                         * on the article itself; a third item here wrapped onto two lines. */}
                        <span className="mt-1 flex items-center gap-3 text-[12px] whitespace-nowrap text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            {(() => {
                              const Icon = mediumIcon[mediumOf(r)];
                              return <Icon className="h-3.5 w-3.5" />;
                            })()}
                            {mediumLabel(r)}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" /> {lengthLabel(r)}
                          </span>
                        </span>
                      </span>
                    </Link>
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
