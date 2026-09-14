import { createLocalStore } from "@/lib/local-store";

/* The ten articles on ikanhealth.in/resource (as listed on 13 Sep 2026). Titles, categories,
 * dates and read times are copied from the site; the articles themselves open on the site.
 * Two fixes: "An easy guide o the" → "to the", and the GAD-7 guide, filed under Sleep on the
 * site, is filed under General here. */

export type ResourceCategory = "General" | "Stress" | "Sleep";
export type Art =
  "stress" | "burnout" | "work" | "anxiety" | "mood" | "sleep" | "measure" | "checkup";

export type Resource = {
  id: string;
  title: string;
  category: ResourceCategory;
  date: string;
  minutes: number;
  art: Art;
  featured?: boolean;
  /** the iKAN assessment this article explains */
  assessment?: string;
};

export const resources: Resource[] = [
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

export const getResource = (id: string) => resources.find((r) => r.id === id);

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
