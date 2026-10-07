import { BookOpen, Headphones, Play, type LucideIcon } from "lucide-react";
import { createLocalStore } from "@/lib/local-store";

/* The ten articles on ikanhealth.in/resource (as listed on 13 Sep 2026). Titles, categories,
 * dates and read times are copied from the site; the articles themselves open on the site.
 * Two fixes: "An easy guide o the" → "to the", and the GAD-7 guide, filed under Sleep on the
 * site, is filed under General here.
 *
 * Plus the five brief-scale posts written for the app (23 Sep 2026) and the India numbers piece
 * (3 Oct 2026, from the Notion draft). These live only here: they are not on ikanhealth.in yet. */

/* The category list the old site keeps in its KV store, kept whole rather than trimmed to what
 * today's resources happen to need. Several hold nothing yet; that is the point, the content
 * that wants them has not been written. Order is the old store's sort_order, so an admin built
 * later has nothing to reconcile. The library filters by type, so a category is a label on a
 * card and a word in search. */
export const resourceCategories = [
  "General",
  "Anxiety",
  "Depression",
  "Stress",
  "Burnout",
  "Sleep",
  "Insomnia",
  "Balance",
  "Focus",
  "Resilience",
  "Motivation",
  "Habits",
  "Mindfulness",
  "Energy",
  "Relationships",
  "Confidence",
  "Wellness",
  "Work-Life",
] as const;
export type ResourceCategory = (typeof resourceCategories)[number];

export type Art =
  | "stress"
  | "burnout"
  | "work"
  | "anxiety"
  | "mood"
  | "sleep"
  | "measure"
  | "checkup"
  | "wellbeing"
  | "confidence"
  | "resilience"
  | "worry"
  | "lowmood"
  | "kindness"
  | "routine"
  | "report"
  | "night"
  | "pause"
  | "breathe"
  | "pressure"
  | "overload"
  | "toolkit"
  | "unwind"
  | "gap";

/* What a resource is to be done with. Everything in the library is an article today; video and
 * audio are modelled here so adding one is a data change, not a rebuild. A resource with no
 * `medium` is an article, so the entries below need no field. */
export type Medium = "article" | "video" | "audio";

export type Resource = {
  id: string;
  title: string;
  category: ResourceCategory;
  date: string;
  /** how long it takes: to read, to watch or to listen to */
  minutes: number;
  art: Art;
  medium?: Medium;
  /** video and audio only: a direct file to play (mp4, webm, mp3, m4a). The app plays it with
   * the browser's own <video>/<audio>, so nothing loads from a third party and no cookie is set
   * before someone presses play. Host it anywhere that serves the file with CORS - the project's
   * own Supabase Storage is the obvious place. An article's body, if it has one, becomes the
   * transcript or the show notes below the player. */
  src?: string;
  /** the real artwork for a video or audio piece, behind the play button. Fetched once from the
   * provider and committed, never requested at render: the whole point of the placeholder is
   * that nothing reaches YouTube or Spotify until somebody presses play. */
  poster?: string;
  /** false when the owner has disabled embedding, so the card opens the service instead of
   * showing its "Video unavailable" box. Checked against the provider's oEmbed, which answers
   * 401 for a video that may not be embedded. */
  embeddable?: boolean;
  /* Where a shared piece came from. Kept as fields rather than a line of italics at the bottom
   * of the prose, because it is metadata: who made it, what it costs, what language it is in,
   * what licence it carries, and a link back to the publisher's own page for it. */
  source?: {
    name: string;
    /** the publisher's page for this piece, where they gave one */
    url?: string;
    cost?: string;
    language?: string;
    licence?: string;
    note?: string;
  };
  featured?: boolean;
  /** the iKAN assessment this article explains */
  assessment?: string;
  /** how the article relates to that assessment: it explains it, or it points at it as the
   * fuller test to take next (the GAD-2 and PHQ-2 posts) */
  assessmentRole?: "explains" | "next";
};

export const resources: Resource[] = [
  {
    id: "resource-five-minutes-stress",
    title: "Five Minutes That Can Change How You Handle Stress",
    category: "Stress",
    date: "2026-10-03",
    /* 4:19. */
    minutes: 4,
    source: {
      name: "NHS Every Mind Matters",
      url: "https://www.nhs.uk/every-mind-matters/",
      cost: "Free",
      language: "English",
    },
    art: "pause",
    medium: "video",
    src: "https://www.youtube.com/watch?v=z7ATOc4ShOc",
    poster: "/resources/poster-five-minutes-stress.jpg",
    featured: true,
  },
  {
    id: "resource-breathing-five-minutes",
    title: "A Five-Minute Guided Breathing Exercise for Anxious Moments",
    category: "Mindfulness",
    date: "2026-10-03",
    minutes: 5,
    source: {
      name: "Mindful Awareness Research Centre (MARC), UCLA",
      url: "https://www.freemindfulness.org/download",
      language: "English",
      licence: "CC BY-NC-SA 3.0",
      note: "Read by Diana Winston. Shared via The Free Mindfulness Project. No background music.",
    },
    art: "breathe",
    medium: "audio",
    /* UCLA MARC, via the Free Mindfulness Project, CC BY-NC-SA 3.0. Pulled out of Google
     * Drive and into the repo so it is not one quota or one deleted file away from going
     * silent, and so the service worker can cache it for offline. 3.8 MB, 5:31. */
    src: "/resources/breathing-five-minutes.mp3",
    poster: "/resources/poster-breathing-five-minutes.jpg",
  },
  {
    id: "resource-stress-performance",
    title: "Stress, Performance, and Why the Usual Advice Misses",
    category: "Work-Life",
    date: "2026-10-03",
    /* 1:46:13, read off the Spotify embed. The brief said "approximately one hour". */
    minutes: 106,
    source: {
      name: "Ten Percent Happier with Dan Harris",
      url: "https://open.spotify.com/show/65J4WUch2vqFxoGmrKuxof",
      language: "English",
      note: "Guest: Dr. Modupe Akinola, Columbia Business School.",
    },
    art: "pressure",
    medium: "audio",
    src: "https://open.spotify.com/episode/5IvwJBttwqfAgJspvpyB43",
    poster: "/resources/poster-stress-performance.jpg",
  },
  {
    id: "resource-stress-takes-over",
    title: "What Happens When Stress Takes Over?",
    category: "Stress",
    date: "2026-10-03",
    /* 10:27. */
    minutes: 10,
    source: {
      name: "National Institute of Mental Health",
      /* NIMH's own page for this video; checked, and it embeds the same video id. */
      url: "https://www.nimh.nih.gov/news/media/2021/guided-visualization-dealing-with-stress",
      cost: "Free",
      language: "English",
      note: "Guided Visualization: Dealing with Stress.",
    },
    art: "overload",
    medium: "video",
    src: "https://www.youtube.com/watch?v=Dq9odPtHbcg",
    poster: "/resources/poster-stress-takes-over.jpg",
  },
  {
    id: "resource-great-practices",
    title: "Practical Ways to Manage Stress and Anxiety",
    category: "Stress",
    date: "2026-10-03",
    /* 0:25. */
    minutes: 1,
    source: {
      name: "National Institute of Mental Health",
      /* This one has no page of its own on nimh.nih.gov - it lives on NIMH's YouTube channel -
       * so the link goes to their media library rather than to a URL that does not exist. */
      url: "https://www.nimh.nih.gov/news/media",
      cost: "Free",
      language: "English",
      note: "GREAT: Helpful Practices to Manage Stress and Anxiety.",
    },
    art: "toolkit",
    medium: "video",
    src: "https://www.youtube.com/watch?v=RIyge4jzeFg",
    poster: "/resources/poster-great-practices.jpg",
  },
  {
    /* id unchanged on purpose: it keys this piece's body in articles.json and anyone's saved
     * and opened state. Only the source, the media and the title have been replaced. */
    id: "resource-can-we-talk",
    title: "How to cope with anxiety \u2013 a relaxation technique",
    source: {
      name: "NHS",
      url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/mental-wellbeing-audio-guides/",
      cost: "Free",
      language: "English",
      note: "The second of the NHS mental wellbeing audio guides.",
    },
    category: "Stress",
    date: "2026-10-03",
    /* 6:34. */
    minutes: 7,
    art: "unwind",
    medium: "video",
    src: "https://www.youtube.com/watch?v=3cXGt2d1RyQ",
    poster: "/resources/poster-cope-with-anxiety.jpg",
    /* The NHS has turned embedding off for this one: YouTube's oEmbed answers 401 and the
     * iframe renders "Playback on other websites has been disabled by the video owner". */
    embeddable: false,
  },
  {
    id: "resource-not-always-visible",
    title: "Being Kind to Yourself",
    source: {
      name: "World Health Organization",
      url: "https://tdr.who.int/home/our-work/global-engagement/9789240003927",
      cost: "Free",
      language: "English",
      note: "From \u201cDoing What Matters in Times of Stress\u201d.",
    },
    category: "Stress",
    date: "2026-10-03",
    /* 7:45, from the file. */
    minutes: 8,
    art: "kindness",
    medium: "audio",
    /* Pulled out of terrance.who.int and into the repo, like the other audio, so it is not one
     * moved file away from going silent and the service worker can cache it. 7.1 MB. */
    src: "/resources/being-kind-to-yourself.mp3",
  },
  {
    id: "resource-india-numbers",
    title: "India's Mental Health Crisis: The Numbers We Can No Longer Ignore.",
    category: "General",
    date: "2026-10-03",
    minutes: 5,
    art: "report",
    featured: true,
  },
  {
    id: "resource-india-open-data",
    title: "Mental Health in India",
    category: "General",
    date: "2026-10-07",
    minutes: 5,
    art: "gap",
  },
  {
    id: "resource-who-5",
    title: "What is the WHO-5 Well-Being Index? A Simple Guide to Measuring Mental Wellness",
    category: "Wellness",
    date: "2026-09-23",
    minutes: 4,
    art: "wellbeing",
    featured: true,
  },
  {
    id: "resource-ngse",
    title:
      "What is the New General Self-Efficacy (NGSE) Scale? A Simple Guide to Measuring Self-Belief",
    category: "Confidence",
    date: "2026-09-23",
    minutes: 4,
    art: "confidence",
  },
  {
    id: "resource-brs",
    title: "What is the Brief Resilience Scale (BRS)? A Simple Guide to the Resilience Test",
    category: "Resilience",
    date: "2026-09-23",
    minutes: 4,
    art: "resilience",
  },
  {
    id: "resource-gad-2",
    title:
      "What is Generalized Anxiety Disorder (GAD)-2? A Simple Guide to the Ultra-Brief Anxiety Screener",
    category: "Anxiety",
    date: "2026-09-23",
    minutes: 3,
    art: "worry",
    assessment: "feeling-overwhelmed-and-anxious",
    assessmentRole: "next",
  },
  {
    id: "resource-phq-2",
    title:
      "What is the Patient Health Questionnaire (PHQ)-2? A Simple Guide to the Ultra-Brief Depression Screener",
    category: "Depression",
    date: "2026-09-23",
    minutes: 3,
    art: "lowmood",
    assessment: "feeling-depressed-and-hopeless",
    assessmentRole: "next",
  },
  {
    id: "de31d473-fda7-47e4-82d6-a549b02eec44",
    title: "What is the Perceived Stress Scale (PSS-10)? Understand The Stress Screening Test",
    category: "Stress",
    date: "2026-09-10",
    minutes: 5,
    art: "stress",
    featured: true,
    assessment: "feeling-worried-and-stressed",
  },
  {
    id: "98d536d4-938b-4fbf-bc2c-f37e6d0b9409",
    title:
      "What is the Burnout Assessment Tool (BAT-23)? An easy guide to the 23-Question Burnout Test",
    category: "Burnout",
    date: "2026-09-10",
    minutes: 5,
    art: "burnout",
    assessment: "feeling-drained-and-burned-out",
  },
  {
    id: "1b783468-f860-433b-8009-7e7943321ac1",
    title: "What is The Workplace Stress Scale? Explained.",
    category: "Work-Life",
    date: "2026-09-10",
    minutes: 5,
    art: "work",
    assessment: "struggling-to-balance-life",
  },
  {
    id: "resource-1766237270444",
    title:
      "What is Generalized Anxiety Disorder (GAD)-7? A Simple Guide to the Anxiety Screening Test",
    category: "Anxiety",
    date: "2026-09-10",
    minutes: 5,
    art: "anxiety",
    assessment: "feeling-overwhelmed-and-anxious",
  },
  {
    id: "a9697070-1dff-4bcc-a67d-2fbb26cc6e25",
    title: "What is Patient Health Questionnaire (PHQ)-9? A Quick Depression Screening Test",
    category: "Depression",
    date: "2026-09-10",
    minutes: 5,
    art: "mood",
    assessment: "feeling-depressed-and-hopeless",
  },
  {
    id: "c775a1e1-a938-4aac-8519-e5ad9f8dda1f",
    title: "What is the Sleep Condition Indicator (SCI)? Wake Up to Better Sleep.",
    category: "Sleep",
    date: "2026-09-10",
    minutes: 5,
    art: "sleep",
    assessment: "struggling-with-quality-sleep",
  },
  {
    id: "a5bef353-f6e5-4a22-9ae7-2d4e4a7ebd41",
    title: "The Late Night Tax: How Bad Sleep Impacts Your Long Term Health.",
    category: "Sleep",
    date: "2026-04-01",
    minutes: 5,
    art: "night",
  },
  {
    id: "resource-1766236115968",
    title: "The Power of Measurement-Based Care",
    category: "General",
    date: "2026-03-19",
    minutes: 5,
    art: "measure",
    featured: true,
  },
  {
    id: "11457137-5bba-4f45-9d0d-51d7e2a4c9c6",
    title: "Physical Health is measured. Why should mental health be any different?",
    category: "General",
    date: "2026-03-11",
    minutes: 5,
    art: "checkup",
    featured: true,
  },
  {
    id: "4a4ac2b7-17be-4e9e-9d8e-7d244af5aa73",
    title: "Prioritizing Mental Wellness: The Importance of Routine Mental Health Check-Ups.",
    category: "General",
    date: "2026-03-11",
    minutes: 5,
    art: "routine",
  },
];

export const mediumOf = (r: Resource): Medium => r.medium ?? "article";

const verb: Record<Medium, string> = { article: "Read", video: "Watch", audio: "Listen" };
const done: Record<Medium, string> = { article: "Read", video: "Watched", audio: "Listened" };
const plural: Record<Medium, string> = { article: "articles", video: "videos", audio: "audio" };

/** How long it takes. The medium is shown beside it with its own icon, not folded in here. */
export const lengthLabel = (r: Resource) => `${r.minutes} min`;

/** "Read", "Watch", "Listen" - what you do with it, next to its icon. */
export const mediumLabel = (r: Resource) => verb[mediumOf(r)];

/** One line about where someone got to, or nothing. Never shown next to the done check: a
 * resource is either finished or it is part way through, not both. */
export const progressLabel = (r: Resource, played: Played | undefined) => {
  if (!played?.of || played.done) return null;
  const left = Math.max(1, Math.round((played.of - played.at) / 60));
  return played.at < 20 ? "Started" : `${left} min left`;
};

/** The badge on something already opened: Read, Watched, Listened. */
export const doneLabel = (r: Resource) => done[mediumOf(r)];

export const mediumIcon: Record<Medium, LucideIcon> = {
  article: BookOpen,
  video: Play,
  audio: Headphones,
};

/** What the library row says it holds, which changes once it holds more than articles. */
export const libraryLabel = () => {
  const parts = (["article", "video", "audio"] as const)
    .map((m) => [m, resources.filter((r) => mediumOf(r) === m).length] as const)
    .filter(([, n]) => n > 0)
    .map(([m, n]) => `${n} ${plural[m]}`);
  return parts.length === 1 ? `${parts[0]} and guides` : parts.join(" \u00b7 ");
};

export const getResource = (id: string) => resources.find((r) => r.id === id);

/** Readable URL name for an article, from its title: /resources/<slug>. */
export const slugOf = (r: Resource) =>
  r.title
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    /* apostrophes go, rather than becoming a separator: "India's" would otherwise slug as
     * "india-s" and spend one of the nine words on the s. */
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .slice(0, 9)
    .join("-");

/** An article by its slug; old links by id still resolve. */
export const getResourceBySlug = (slug: string) =>
  resources.find((r) => slugOf(r) === slug) ?? getResource(slug);

/* How far through a piece someone is. Only files can report this: an embed plays inside
 * YouTube or Spotify and tells us nothing, so those have an opened date and no more. */
export type Played = { at: number; of: number; done?: boolean };
type State = {
  saved: string[];
  opened: Record<string, string>;
  played?: Record<string, Played>;
};
const store = createLocalStore<State>("ikan.resources.v1", { saved: [], opened: {}, played: {} });

export function useResourceStore() {
  const state = store.use();
  return {
    ...state,
    isSaved: (id: string) => state.saved.includes(id),
    toggleSave: (id: string) =>
      store.update((s) => ({
        ...s,
        saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id],
      })),
    markOpened: (id: string) =>
      store.update((s) => ({ ...s, opened: { ...s.opened, [id]: new Date().toISOString() } })),
    playedOf: (id: string) => state.played?.[id],
    /* Written as it plays, so coming back resumes where you stopped. The last few seconds count
     * as finished: nobody scrubs to the exact end, and "97% watched" forever is just wrong. */
    markPlayed: (id: string, at: number, of: number) =>
      store.update((s) => ({
        ...s,
        played: { ...s.played, [id]: { at, of, done: of > 0 && at >= of - 3 } },
      })),
  };
}
