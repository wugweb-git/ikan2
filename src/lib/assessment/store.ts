import { createLocalStore, newId } from "@/lib/local-store";
import type { Answers } from "./scoring";

export type StoredResult = {
  id: string;
  slug: string;
  completedAt: string;
  /** active seconds from first answer to finish */
  seconds: number;
  /** option weights before reversal, keyed by question id; scores are recomputed from these */
  answers: Answers;
};

export type Draft = { answers: Answers; index: number; seconds: number; updatedAt?: string };

type State = { results: StoredResult[]; drafts: Record<string, Draft> };

const store = createLocalStore<State>("ikan.assessments.v1", { results: [], drafts: {} });

/** Direct read, for effects that run before the hook's post-hydration render. */
export const readAssessmentState = () => store.read();

/** Add results that aren't here yet (matched by id); used by the import from the old iKan app. */
export const mergeResults = (incoming: StoredResult[]) =>
  store.update((s) => {
    const have = new Set(s.results.map((r) => r.id));
    const fresh = incoming.filter((r) => !have.has(r.id));
    return fresh.length ? { ...s, results: [...s.results, ...fresh] } : s;
  });

/** Result ids are UUIDs, as in the old iKan records. */
const resultId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : newId("r");

export function useAssessmentStore() {
  const state = store.use();
  return {
    results: state.results,
    drafts: state.drafts,
    /** newest first */
    resultsFor: (slug: string) =>
      state.results
        .filter((r) => r.slug === slug)
        .sort((a, b) => b.completedAt.localeCompare(a.completedAt)),
    draftFor: (slug: string) => state.drafts[slug],
    saveDraft: (slug: string, draft: Draft) =>
      store.update((s) => ({
        ...s,
        drafts: { ...s.drafts, [slug]: { ...draft, updatedAt: new Date().toISOString() } },
      })),
    clearDraft: (slug: string) =>
      store.update((s) => {
        const { [slug]: _gone, ...drafts } = s.drafts;
        return { ...s, drafts };
      }),
    saveResult: (slug: string, answers: Answers, seconds: number) => {
      const result: StoredResult = {
        id: resultId(),
        slug,
        completedAt: new Date().toISOString(),
        seconds,
        answers,
      };
      store.update((s) => {
        const { [slug]: _gone, ...drafts } = s.drafts;
        return { results: [...s.results, result], drafts };
      });
      return result;
    },
  };
}
