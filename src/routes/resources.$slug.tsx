import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  ChevronRight,
  Clock3,
  ListChecks,
  UserRound,
} from "lucide-react";
import { StackedAssessmentCard } from "@/components/assessment/ui";
import { IkanShell } from "@/components/ikan-shell";
import { Illustration } from "@/components/art";
import { accentStyle, IconButton, stateLayer } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { getAssessment } from "@/lib/assessment/instruments";
import { articles } from "@/lib/content";
import {
  getResource,
  getResourceBySlug,
  resources,
  slugOf,
  useResourceStore,
} from "@/lib/resources";

export const Route = createFileRoute("/resources/$slug")({
  loader: ({ params }) => {
    const r = getResourceBySlug(params.slug);
    if (!r || !articles[r.id]) throw notFound();
    return { id: r.id };
  },
  head: ({ loaderData }) => {
    const r = loaderData ? getResource(loaderData.id) : undefined;
    const a = loaderData ? articles[loaderData.id] : undefined;
    return r
      ? pageMeta(r.title, a?.description || r.title, `/resources/${slugOf(r)}`)
      : { meta: [{ title: "Article — iKAN" }] };
  },
  component: ArticlePage,
});

const dateLabel = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function ArticlePage() {
  const { id } = Route.useLoaderData();
  const r = getResource(id)!;
  const article = articles[id]!;
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const store = useResourceStore();
  const saved = hydrated && store.isSaved(id);
  const assessment = r.assessment ? getAssessment(r.assessment) : undefined;
  const more = resources
    .filter((x) => x.id !== id && (x.category === r.category || x.art === r.art))
    .slice(0, 3);

  useEffect(() => {
    store.markOpened(id);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <IkanShell>
      <article style={accentStyle("calm")}>
        <header className="relative">
          <div className="h-60 overflow-hidden">
            <Illustration art={r.art} />
          </div>
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2">
            <IconButton
              label="Back"
              onClick={() => navigate({ to: "/resources" })}
              className="bg-background/85 backdrop-blur"
            >
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
            <IconButton
              label={saved ? "Remove from saved" : "Save for later"}
              onClick={() => store.toggleSave(id)}
              className="bg-background/85 backdrop-blur"
            >
              {saved ? (
                <BookmarkCheck className="h-5 w-5 text-[var(--accent-strong)]" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </IconButton>
          </div>
        </header>

        <div className="relative -mt-8 rounded-t-[28px] bg-background px-5 pt-6">
          <p className="text-[13px] font-semibold text-[var(--accent-strong)]">{r.category}</p>
          <h1 className="type-headline-md mt-1 text-balance">{r.title}</h1>
          {article.description ? (
            /* the standfirst: display face, full contrast, so it reads as part of the title
             * group rather than as the first paragraph of the article */
            <p className="type-title-lg mt-3 text-muted-foreground text-balance">
              {article.description}
            </p>
          ) : null}
          <p className="type-label-lg mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-foreground/10 pb-5 text-muted-foreground">
            {article.author ? (
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-4 w-4" /> {article.author}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> {dateLabel(r.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" /> {r.minutes} min read
            </span>
          </p>

          <div className="prose-ikan mt-6" dangerouslySetInnerHTML={{ __html: article.html }} />

          {assessment ? (
            <StackedAssessmentCard
              assessment={assessment}
              label={
                r.assessmentRole === "next"
                  ? "The fuller test this article points to"
                  : "The test this article explains"
              }
            />
          ) : null}

          {/* The article ends here: what follows is a tinted footer, so people can tell the
           * reading from the suggestions after it. */}
          {more.length ? (
            <section className="-mx-5 mt-12 rounded-t-[28px] border-t border-foreground/10 bg-secondary/50 px-5 pb-8 pt-7">
              <h2 className="type-title-lg font-semibold">Keep reading</h2>
              <ul className="mt-4 divide-y divide-foreground/10">
                {more.map((m) => (
                  <li key={m.id}>
                    <Link
                      to="/resources/$slug"
                      params={{ slug: slugOf(m) }}
                      className={cn(
                        "-mx-2 flex items-center gap-4 rounded-[16px] px-2 py-4",
                        stateLayer,
                      )}
                    >
                      <span className="h-20 w-20 shrink-0 overflow-hidden rounded-[16px] bg-background">
                        <Illustration art={m.art} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-3 text-[16px] font-semibold leading-[22px]">
                          {m.title}
                        </span>
                        <span className="mt-2 flex items-center gap-2 text-[12px] text-muted-foreground">
                          <span className="rounded-full bg-background px-2 py-0.5 font-medium">
                            {m.category}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5" /> {m.minutes} min read
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </article>
    </IkanShell>
  );
}
