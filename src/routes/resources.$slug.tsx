import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  ChevronRight,
  Clock3,
  ListChecks,
  UserRound,
} from "lucide-react";
import { StackedAssessmentCard } from "@/components/assessment/ui";
import { IkanShell } from "@/components/ikan-shell";
import { Illustration } from "@/components/art";
import { MediaPlayer } from "@/components/media-player";
import { SourceCard } from "@/components/source-card";
import { getProgramme } from "@/lib/equip/programs";
import { dayKey, useJournal } from "@/lib/journal";
import { MoodCheckinCard, SupportCard } from "@/routes/index";
import { ProgrammeCard } from "@/routes/program.index";
import { ResourceRow } from "@/routes/resources.index";
import { accentStyle, IconButton, stateLayer } from "@/components/equip/m3";
import { jsonLd, pageMeta } from "@/components/equip/program-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { getAssessment } from "@/lib/assessment/instruments";
import { articles } from "@/lib/content";
import {
  getResource,
  getResourceBySlug,
  lengthLabel,
  mediumIcon,
  mediumLabel,
  mediumOf,
  resources,
  slugOf,
  useResourceStore,
} from "@/lib/resources";

export const Route = createFileRoute("/resources/$slug")({
  loader: ({ params }) => {
    const r = getResourceBySlug(params.slug);
    /* an article needs its text; a video or audio post only needs something to play, and its
     * text, if it has any, is the transcript under the player */
    if (!r || !(articles[r.id] || r.src)) throw notFound();
    return { id: r.id };
  },
  head: ({ loaderData }) => {
    const r = loaderData ? getResource(loaderData.id) : undefined;
    const a = loaderData ? articles[loaderData.id] : undefined;
    if (!r) return { meta: [{ title: "Article — iKAN" }] };
    const url = `https://app.ikanhealth.in/resources/${slugOf(r)}`;
    const description = a?.description || r.title;
    return {
      ...pageMeta(r.title, description, `/resources/${slugOf(r)}`),
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": { article: "Article", video: "VideoObject", audio: "AudioObject" }[mediumOf(r)],
          headline: r.title,
          name: r.title,
          description,
          datePublished: r.date,
          dateModified: r.date,
          uploadDate: r.date,
          ...(r.src ? { contentUrl: r.src, duration: `PT${r.minutes}M` } : {}),
          articleSection: r.category,
          inLanguage: "en-IN",
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          author: { "@type": "Organization", name: "iKAN" },
          publisher: {
            "@type": "Organization",
            name: "iKAN",
            logo: {
              "@type": "ImageObject",
              url: "https://app.ikanhealth.in/pwa-512x512.png",
            },
          },
        }),
      ],
    };
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
  const article = articles[id];
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const store = useResourceStore();
  const saved = hydrated && store.isSaved(id);
  const played = hydrated ? store.playedOf(id) : undefined;
  const assessment = r.assessment ? getAssessment(r.assessment) : undefined;
  const programme = r.programme ? getProgramme(r.programme) : undefined;
  const journal = useJournal();
  const loggedToday = journal.entries.filter((e) => e.date === dayKey(new Date())).length;
  /* Sources close the article, after the External section, so the body is split where they start. */
  const cut = article ? article.html.indexOf('<section class="sources">') : -1;
  const body = article ? (cut < 0 ? article.html : article.html.slice(0, cut)) : "";
  const sources = article && cut >= 0 ? article.html.slice(cut) : "";
  const more = resources
    .filter((x) => x.id !== id && (x.category === r.category || x.art === r.art))
    .slice(0, 3);

  useEffect(() => {
    store.markOpened(id);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  /* An article counts as read when its last line comes into view, not when it is opened: the
   * list says "Read" with a check, and that should mean read. Video and audio report their own
   * progress from the player. */
  const end = useRef<HTMLDivElement>(null);
  const isArticle = mediumOf(r) === "article";
  useEffect(() => {
    const el = end.current;
    if (!isArticle || !el || typeof IntersectionObserver === "undefined") return;
    /* The end has to stay in view for a moment: on a tall screen a very short piece shows its
     * end on first paint, and that alone is not reading it. */
    let timer: ReturnType<typeof setTimeout> | undefined;
    const seen = new IntersectionObserver((entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      clearTimeout(timer);
      if (visible)
        timer = setTimeout(() => {
          store.markRead(id);
          seen.disconnect();
        }, 1500);
    });
    seen.observe(el);
    return () => {
      clearTimeout(timer);
      seen.disconnect();
    };
  }, [id, isArticle]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <IkanShell wide>
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
                <Bookmark className="h-5 w-5 fill-current text-[var(--accent-strong)]" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </IconButton>
          </div>
        </header>

        <div className="relative -mt-8 rounded-t-[28px] bg-background px-5 pt-6">
          <p className="type-body-sm font-semibold text-[var(--accent-strong)]">{r.category}</p>
          <h1 className="type-headline-md mt-1 text-balance">{r.title}</h1>
          {article?.description ? (
            /* the standfirst: display face, full contrast, so it reads as part of the title
             * group rather than as the first paragraph of the article */
            <p className="type-title-lg mt-3 font-medium text-muted-foreground text-balance">
              {article.description}
            </p>
          ) : null}
          <p className="type-label-lg mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-foreground/10 pb-5 text-muted-foreground">
            {article?.author ? (
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-4 w-4" /> {article.author}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> {dateLabel(r.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              {(() => {
                const Icon = mediumIcon[mediumOf(r)];
                return <Icon className="h-4 w-4" />;
              })()}
              {mediumLabel(r)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" /> {lengthLabel(r)}
            </span>
          </p>

          {r.src ? (
            <MediaPlayer
              src={r.src}
              kind={mediumOf(r) === "audio" ? "audio" : "video"}
              {...(r.embeddable === false ? { embeddable: false } : {})}
              {...(r.poster ? { poster: r.poster } : {})}
              title={r.title}
              className="mt-6"
              {...(played?.at ? { startAt: played.at } : {})}
              onProgress={(at, of) => store.markPlayed(id, at, of)}
            />
          ) : null}

          {/* A media piece's body is a written article about the thing, not a transcript and
           * not the publisher's show notes, so it carries no heading of its own. */}
          {body ? (
            <div
              className={cn("prose-ikan", r.src ? "mt-7" : "mt-6")}
              dangerouslySetInnerHTML={{ __html: body }}
            />
          ) : null}
          <div ref={end} aria-hidden="true" />

          {r.source ? <SourceCard source={r.source} /> : null}

          {/* External: where the article can send someone inside iKAN, each through the card that
           * place already uses. Which ones a piece shows is set on the resource, never guessed. */}
          {assessment || programme || r.journal || r.consult ? (
            <section aria-label="External">
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
              {programme ? (
                <div className="mt-10">
                  <p className="type-body-sm font-semibold text-[var(--accent-strong)]">
                    A programme that works on this
                  </p>
                  <div className="mt-3">
                    <ProgrammeCard programme={programme} />
                  </div>
                </div>
              ) : null}
              {r.journal ? (
                <div className="mt-10">
                  <p className="type-body-sm font-semibold text-[var(--accent-strong)]">
                    Keep track of how you feel
                  </p>
                  <MoodCheckinCard loggedToday={loggedToday} className="mt-3" />
                </div>
              ) : null}
              {r.consult ? (
                <div className="mt-10">
                  <p className="type-body-sm font-semibold text-[var(--accent-strong)]">
                    Talk it through with someone
                  </p>
                  <SupportCard city="" className="mt-3" />
                </div>
              ) : null}
            </section>
          ) : null}

          {sources ? (
            <div className="prose-ikan" dangerouslySetInnerHTML={{ __html: sources }} />
          ) : null}

          {/* The article ends here: what follows is a tinted footer, so people can tell the
           * reading from the suggestions after it. */}
          {more.length ? (
            <section className="-mx-5 mt-12 rounded-t-[28px] border-t border-foreground/10 bg-secondary/50 px-5 pb-8 pt-7">
              <h2 className="type-title-lg">Keep reading</h2>
              <ul className="mt-2">
                {more.map((m) => (
                  <ResourceRow
                    key={m.id}
                    r={m}
                    hydrated={hydrated}
                    onToggleSave={(x) => store.toggleSave(x.id)}
                  />
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </article>
    </IkanShell>
  );
}
