import { BookOpen, Headphones, Play, type LucideIcon } from "lucide-react";
import { createLocalStore } from "@/lib/local-store";

/* The ten articles on ikanhealth.in/resource (as listed on 13 Sep 2026). Titles, categories,
 * dates and read times are copied from the site; the articles themselves open on the site.
 * Two fixes: "An easy guide o the" → "to the", and the GAD-7 guide, filed under Sleep on the
 * site, is filed under General here.
 *
 * Plus the five brief-scale posts written for the app (23 Sep 2026) and the India numbers piece
 * (3 Oct 2026, from the Notion draft). These live only here: they are not on ikanhealth.in yet. */

export type ResourceCategory = "General" | "Stress" | "Sleep";
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
  | "lowmood";

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
    minutes: 4,
    source: {
      name: "NHS Every Mind Matters",
      url: "https://www.nhs.uk/every-mind-matters/",
      cost: "Free",
      language: "English",
    },
    art: "stress",
    medium: "video",
    src: "https://www.youtube.com/watch?v=z7ATOc4ShOc",
    poster: "/resources/poster-five-minutes-stress.jpg",
    featured: true,
  },
  {
    id: "resource-breathing-five-minutes",
    title: "A Five-Minute Guided Breathing Exercise for Anxious Moments",
    category: "Stress",
    date: "2026-10-03",
    minutes: 5,
    source: {
      name: "Mindful Awareness Research Centre (MARC), UCLA",
      url: "https://www.freemindfulness.org/download",
      language: "English",
      licence: "CC BY-NC-SA 3.0",
      note: "Shared via The Free Mindfulness Project. No background music.",
    },
    art: "anxiety",
    medium: "audio",
    /* UCLA MARC, via the Free Mindfulness Project, CC BY-NC-SA 3.0. Pulled out of Google
     * Drive and into the repo so it is not one quota or one deleted file away from going
     * silent, and so the service worker can cache it for offline. 3.8 MB, 5:31. */
    src: "/resources/breathing-five-minutes.mp3",
  },
  {
    id: "resource-stress-performance",
    title: "Stress, Performance, and Why the Usual Advice Misses",
    category: "Stress",
    date: "2026-10-03",
    minutes: 60,
    source: {
      name: "Ten Percent Happier with Dan Harris",
      url: "https://open.spotify.com/show/65J4WUch2vqFxoGmrKuxof",
      language: "English",
      note: "Guest: Dr. Modupe Akinola, Columbia Business School.",
    },
    art: "work",
    medium: "audio",
    src: "https://open.spotify.com/episode/5IvwJBttwqfAgJspvpyB43",
    poster: "/resources/poster-stress-performance.jpg",
  },
  {
    id: "resource-stress-takes-over",
    title: "What Happens When Stress Takes Over?",
    category: "Stress",
    date: "2026-10-03",
    minutes: 10,
    source: {
      name: "National Institute of Mental Health",
      cost: "Free",
      language: "English",
      note: "Guided Visualization: Dealing with Stress.",
    },
    art: "burnout",
    medium: "video",
    src: "https://www.youtube.com/watch?v=Dq9odPtHbcg",
    poster: "/resources/poster-stress-takes-over.jpg",
  },
  {
    id: "resource-great-practices",
    title: "Practical Ways to Manage Stress and Anxiety",
    category: "Stress",
    date: "2026-10-03",
    minutes: 3,
    source: {
      name: "National Institute of Mental Health",
      cost: "Free",
      language: "English",
      note: "GREAT: Helpful Practices to Manage Stress and Anxiety.",
    },
    art: "resilience",
    medium: "video",
    src: "https://www.youtube.com/watch?v=RIyge4jzeFg",
    poster: "/resources/poster-great-practices.jpg",
  },
  {
    id: "resource-can-we-talk",
    title: "Can We Talk About Mental Health?",
    category: "General",
    date: "2026-10-03",
    minutes: 2,
    source: {
      name: "SAMHSA",
      url: "https://www.samhsa.gov/mental-health/children-and-families/coping-resources/multimedia",
      cost: "Free for public use",
      language: "English, with Spanish versions available",
      note: "U.S. Department of Health & Human Services.",
    },
    art: "mood",
  },
  {
    id: "resource-not-always-visible",
    title: "Mental Health Isn't Always Visible",
    category: "General",
    date: "2026-10-03",
    minutes: 2,
    source: {
      name: "SAMHSA",
      url: "https://www.samhsa.gov/mental-health/serious-mental-illness/treatment-works/multimedia",
      cost: "Free for public use",
      language: "English, with Spanish versions available",
      note: "U.S. Department of Health & Human Services.",
    },
    art: "checkup",
  },
  {
    id: "resource-india-numbers",
    title: "India's Mental Health Crisis: The Numbers We Can No Longer Ignore.",
    category: "General",
    date: "2026-10-03",
    minutes: 5,
    art: "measure",
    featured: true,
  },
  {
    id: "resource-who-5",
    title: "What is the WHO-5 Well-Being Index? A Simple Guide to Measuring Mental Wellness",
    category: "General",
    date: "2026-09-23",
    minutes: 4,
    art: "wellbeing",
    featured: true,
  },
  {
    id: "resource-ngse",
    title:
      "What is the New General Self-Efficacy (NGSE) Scale? A Simple Guide to Measuring Self-Belief",
    category: "General",
    date: "2026-09-23",
    minutes: 4,
    art: "confidence",
  },
  {
    id: "resource-brs",
    title: "What is the Brief Resilience Scale (BRS)? A Simple Guide to the Resilience Test",
    category: "Stress",
    date: "2026-09-23",
    minutes: 4,
    art: "resilience",
  },
  {
    id: "resource-gad-2",
    title:
      "What is Generalized Anxiety Disorder (GAD)-2? A Simple Guide to the Ultra-Brief Anxiety Screener",
    category: "General",
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
    category: "General",
    date: "2026-09-23",
    minutes: 3,
    art: "lowmood",
    assessment: "feeling-depressed-and-hopeless",
    assessmentRole: "next",
  },
  {
    id: "de31d473-fda7-47e4-82d6-a549b02eec44",
    title: "What is the Perceived Stress Scale (PSS-10)? Understand The Stress Screening Test",
    category: "General",
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
    category: "General",
    date: "2026-09-10",
    minutes: 5,
    art: "burnout",
    assessment: "feeling-drained-and-burned-out",
  },
  {
    id: "1b783468-f860-433b-8009-7e7943321ac1",
    title: "What is The Workplace Stress Scale? Explained.",
    category: "General",
    date: "2026-09-10",
    minutes: 5,
    art: "work",
    assessment: "struggling-to-balance-life",
  },
  {
    id: "resource-1766237270444",
    title:
      "What is Generalized Anxiety Disorder (GAD)-7? A Simple Guide to the Anxiety Screening Test",
    category: "General",
    date: "2026-09-10",
    minutes: 5,
    art: "anxiety",
    assessment: "feeling-overwhelmed-and-anxious",
  },
  {
    id: "a9697070-1dff-4bcc-a67d-2fbb26cc6e25",
    title: "What is Patient Health Questionnaire (PHQ)-9? A Quick Depression Screening Test",
    category: "General",
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
    art: "sleep",
  },
  {
    id: "resource-1766236115968",
    title: "The Power of Measurement-Based Care",
    category: "Stress",
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
    art: "checkup",
  },
];

export const mediumOf = (r: Resource): Medium => r.medium ?? "article";

const verb: Record<Medium, string> = { article: "read", video: "watch", audio: "listen" };
const done: Record<Medium, string> = { article: "Read", video: "Watched", audio: "Listened" };
const plural: Record<Medium, string> = { article: "articles", video: "videos", audio: "audio" };

/** "5 min read", "12 min watch", "18 min listen" */
export const lengthLabel = (r: Resource) => `${r.minutes} min ${verb[mediumOf(r)]}`;

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

type State = { saved: string[]; opened: Record<string, string> };
const store = createLocalStore<State>("ikan.resources.v1", { saved: [], opened: {} });

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
  };
}
