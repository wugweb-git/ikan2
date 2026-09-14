import articlesJson from "./articles.json";
import pagesJson from "./pages.json";

/* Copied once from ikanhealth.in so app.ikanhealth.in never has to send people there.
 * - articles.json: the ten published articles from the live library API (13 Sep 2026), Word
 *   markup stripped to plain HTML. Word-for-word; checked by comparing the text before and after.
 * - pages.json: About, FAQ, Contact and the four legal pages, from the site's built-in page
 *   content (src/utils/cms-defaults.ts), which is what the live site renders. "How it works" and
 *   "Who is it for" are copied from the live About page. */

export type Article = { author: string; description: string; html: string };
export const articles = articlesJson as Record<string, Article>;

type Titled = { title: string; tagline: string; description: string };

export type AboutPage = {
  hero: { title: string; subtitle: string };
  story: {
    label: string;
    heading: string;
    paragraphs: string[];
    image?: string;
    imageAlt?: string;
  };
  mission: { label: string; title: string; description: string };
  vision: { label: string; title: string; description: string };
  valuesHeading: string;
  values: { iconName: string; title: string; description: string }[];
  howItWorks: { heading: string; steps: Titled[] };
  whoFor: { heading: string; groups: Titled[] };
  teamHeading: string;
  teamDescription: string;
  founders: { name: string; role: string; bio: string }[];
  team: { name: string; role: string }[];
};

export type FaqPage = {
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  noResultsText: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  categories: { id: string; title: string; items: { question: string; answer: string }[] }[];
};

export type ContactPage = {
  heroTitle: string;
  heroSubtitle: string;
  supportEmail: string;
  crisisPhone: string;
  crisisLabel: string;
  contactMethods: {
    icon: string;
    title: string;
    description: string;
    value: string;
    action: string;
  }[];
  formTitle: string;
  formSubtitle: string;
  crisisCard: { title: string; description: string; buttons: { label: string; action: string }[] };
  faqCard: { title: string; description: string; buttonText: string };
};

export type LegalPage = { title: string; subtitle: string; html: string };
export type LegalSlug = "terms" | "privacy-policy" | "cancellation-policy" | "return-policy";

const pages = pagesJson as unknown as {
  about: AboutPage;
  faq: FaqPage;
  contact: ContactPage;
  legal: Record<LegalSlug, LegalPage>;
};

export const aboutPage = pages.about;
export const faqPage = pages.faq;
export const contactPage = pages.contact;
export const legalPages = pages.legal;
export const legalOrder: LegalSlug[] = [
  "terms",
  "privacy-policy",
  "cancellation-policy",
  "return-policy",
];

/** "Born from <personal> experience": angle brackets mark the highlighted words on the site. */
export const unmark = (s: string) => s.replace(/[<>]/g, "");
