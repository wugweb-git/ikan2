import { addDays } from "@/lib/journal";
import { createLocalStore, newId } from "@/lib/local-store";

/* The five consultants from the live iKan consultants API (14 Sep 2026): names, photos,
 * credentials, ratings, experience, cities, languages, session modes and prices, concerns, therapy
 * areas, approaches, qualifications, about text, review and FAQ. "From" is the lowest session
 * price, which matches the site's "Starting at". Next-available slots are relative to today,
 * since the site's are fixed demo dates. Bookings stay in ikan2 (not sent to the live backend). */

export type SessionMode = "Offline" | "Call" | "Chat" | "Video";
export type Role = "Therapist" | "Psychiatrist" | "Counselor" | "Family Therapist";

export type Consultant = {
  id: string;
  name: string;
  credentials: string;
  role: Role;
  rating: number;
  reviews: number;
  years: number;
  city: string;
  languages: string[];
  formats: string[];
  specializes: string[];
  concerns: string[];
  therapyFor: string[];
  about: string;
  photo: string;
  approaches: string[];
  qualifications: string[];
  sessions: { mode: SessionMode; price: number }[];
  /** days from today and hour of the next open slot */
  next: { inDays: number; hour: number };
  hue: number;
  review?: {
    text: string;
    date: string;
    helpful: number;
    rating: number;
    name: string;
    verified: boolean;
  };
  faq?: { q: string; a: string };
};

export const consultants: Consultant[] = [
  {
    id: "00000000-0000-0000-0000-000000000300",
    name: "Dr. Sarah Johnson",
    credentials: "M.Phil (Clinical Psychology), M.Sc",
    role: "Therapist",
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 142,
    years: 15,
    city: "Mumbai, India",
    languages: ["English", "Hindi"],
    formats: ["Online", "Offline", "Call", "Chat"],
    specializes: ["Anxiety Disorders", "Trauma", "CBT"],
    concerns: [
      "I feel anxious all the time",
      "I can't stop worrying",
      "Past trauma is affecting my present",
      "I'm constantly stressed",
    ],
    therapyFor: [
      "Anxiety Disorders",
      "Depressive Disorders",
      "Trauma",
      "PTSD",
      "Stress Management",
      "Cognitive Behavioral Therapy",
    ],
    approaches: [
      "Cognitive Behavioral Therapy (CBT)",
      "Trauma-Informed Care",
      "Mindfulness-Based Therapy",
    ],
    qualifications: [
      "M.Phil in Clinical Psychology, NIMHANS",
      "M.Sc in Psychology, Delhi University",
      "Certified CBT Practitioner",
      "Trauma-Informed Care Specialist",
    ],
    about:
      "Dr. Johnson has over 15 years of experience helping individuals overcome anxiety, depression, and trauma. She specializes in cognitive behavioral therapy and trauma-informed care, creating a safe and supportive environment for healing.",
    sessions: [
      {
        mode: "Video",
        price: 1500,
      },
      {
        mode: "Call",
        price: 1200,
      },
      {
        mode: "Chat",
        price: 800,
      },
      {
        mode: "Offline",
        price: 2000,
      },
    ],
    next: {
      inDays: 0,
      hour: 16,
    },
    hue: 262,
    review: {
      text: "Dr. Johnson helped me overcome my anxiety. Her CBT techniques really work. Highly recommended!",
      date: "2025-10-10",
      helpful: 23,
      rating: 5,
      name: "Anonymous",
      verified: true,
    },
    faq: {
      q: "What is your approach to therapy?",
      a: "I primarily use Cognitive Behavioral Therapy (CBT) combined with trauma-informed care principles. I believe in creating a collaborative, supportive environment where you feel safe to explore your thoughts and feelings.",
    },
  },
  {
    id: "00000000-0000-0000-0000-000000000304",
    name: "Dr. Priya Sharma",
    credentials: "M.Phil, RCI Registered",
    role: "Therapist",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 67,
    years: 8,
    city: "Pune, India",
    languages: ["English", "Hindi", "Marathi"],
    formats: ["Online", "Chat", "Call"],
    specializes: ["LGBTQIA+ Concerns", "Identity", "Young Adults"],
    concerns: [
      "I'm struggling with my identity",
      "Coming out is difficult",
      "I need a safe, affirming space",
      "LGBTQ+ specific challenges",
    ],
    therapyFor: [
      "LGBTQIA+ Concerns",
      "Identity Issues",
      "Anxiety Disorders",
      "Self-Esteem",
      "Young Adults",
    ],
    approaches: ["Affirmative Therapy", "Person-Centered Therapy", "ACT"],
    qualifications: [
      "M.Phil in Clinical Psychology",
      "RCI Registered Psychologist",
      "LGBTQ+ Affirmative Therapy Certification",
      "ACT Practitioner",
    ],
    about:
      "Dr. Sharma provides LGBTQIA+ affirmative therapy, helping individuals with identity exploration, coming out processes, and dealing with discrimination. She creates a safe, affirming space for all clients and is passionate about queer mental health.",
    sessions: [
      {
        mode: "Video",
        price: 1300,
      },
      {
        mode: "Call",
        price: 1100,
      },
      {
        mode: "Chat",
        price: 900,
      },
    ],
    next: {
      inDays: 0,
      hour: 18,
    },
    hue: 330,
  },
  {
    id: "00000000-0000-0000-0000-000000000301",
    name: "Dr. Michael Chen",
    credentials: "M.Phil, LCSW",
    role: "Counselor",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 89,
    years: 10,
    city: "Bangalore, India",
    languages: ["English", "Mandarin"],
    formats: ["Online", "Call"],
    specializes: ["Stress Management", "Work Burnout", "Mindfulness"],
    concerns: [
      "I'm burned out at work",
      "I can't manage my stress",
      "Work-life balance is difficult",
      "I need better coping strategies",
    ],
    therapyFor: [
      "Stress Management",
      "Work-Related Concerns",
      "Communication Skills",
      "Relationship Skills",
      "Mindfulness",
    ],
    approaches: [
      "Mindfulness-Based Stress Reduction",
      "Solution-Focused Therapy",
      "Positive Psychology",
    ],
    qualifications: [
      "M.Phil in Clinical Social Work",
      "Licensed Clinical Social Worker (LCSW)",
      "Certified Mindfulness Teacher",
      "Corporate Wellness Consultant",
    ],
    about:
      "Dr. Chen focuses on helping professionals manage stress and prevent burnout through evidence-based interventions and mindfulness practices. He has extensive experience in workplace mental health and corporate wellness programs.",
    sessions: [
      {
        mode: "Video",
        price: 1200,
      },
      {
        mode: "Call",
        price: 1000,
      },
      {
        mode: "Chat",
        price: 700,
      },
    ],
    next: {
      inDays: 1,
      hour: 10,
    },
    hue: 168,
  },
  {
    id: "00000000-0000-0000-0000-000000000302",
    name: "Dr. Emily Rodriguez",
    credentials: "Ph.D., LMFT",
    role: "Family Therapist",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 156,
    years: 12,
    city: "Delhi NCR, India",
    languages: ["English", "Spanish", "Hindi"],
    formats: ["Online", "Offline", "Video"],
    specializes: ["Couples Therapy", "Family Counseling", "Communication"],
    concerns: [
      "My relationship is struggling",
      "We can't communicate effectively",
      "Family conflicts are overwhelming",
      "Parenting challenges are stressful",
    ],
    therapyFor: [
      "Relationship Skills",
      "Communication Skills",
      "Parenting Concerns",
      "Life Transitions",
      "Couples Therapy",
    ],
    approaches: ["Emotionally Focused Therapy (EFT)", "Gottman Method", "Attachment-Based Therapy"],
    qualifications: [
      "Ph.D. in Marriage and Family Therapy",
      "Licensed Marriage and Family Therapist (LMFT)",
      "Certified EFT Therapist",
      "Gottman Level 3 Trained",
    ],
    about:
      "Dr. Rodriguez specializes in helping couples and families improve their relationships and communication. She uses evidence-based approaches like EFT and Gottman Method to address attachment issues and relationship challenges.",
    sessions: [
      {
        mode: "Video",
        price: 2000,
      },
      {
        mode: "Call",
        price: 1500,
      },
      {
        mode: "Offline",
        price: 2500,
      },
    ],
    next: {
      inDays: 5,
      hour: 14,
    },
    hue: 24,
  },
  {
    id: "00000000-0000-0000-0000-000000000303",
    name: "Dr. James Thompson",
    credentials: "MD, Psychiatrist",
    role: "Psychiatrist",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 203,
    years: 18,
    city: "Chennai, India",
    languages: ["English"],
    formats: ["Online", "Offline"],
    specializes: ["Bipolar Disorder", "Medication Management", "Mood Disorders"],
    concerns: [
      "I need medication evaluation",
      "My mood swings are severe",
      "I have a complex diagnosis",
      "Current medication isn't working",
    ],
    therapyFor: [
      "Bipolar Disorder",
      "Schizophrenia",
      "Depressive Disorders",
      "Anxiety Disorders",
      "Medication Management",
    ],
    approaches: ["Medication Management", "Psychopharmacology", "Integrated Care"],
    qualifications: [
      "MD, Psychiatry, AIIMS Delhi",
      "Board Certified Psychiatrist",
      "Fellowship in Mood Disorders",
      "20+ research publications",
    ],
    about:
      "Dr. Thompson is a board-certified psychiatrist with expertise in medication management for complex mental health conditions. He takes a collaborative approach to treatment planning, working closely with patients to find the right medication and dosage.",
    sessions: [
      {
        mode: "Video",
        price: 2500,
      },
      {
        mode: "Offline",
        price: 3000,
      },
    ],
    next: {
      inDays: 6,
      hour: 11,
    },
    hue: 212,
  },
];

export const getConsultant = (id: string) => consultants.find((c) => c.id === id);
export const fromPrice = (c: Consultant) => Math.min(...c.sessions.map((s) => s.price));
export const initials = (name: string) =>
  name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Which consultants fit an assessment category, for the "based on your latest assessment" note. */
export const matchesFor: Record<string, string[]> = {
  anxiety: ["Anxiety Disorders"],
  depression: ["Depressive Disorders", "Mood Disorders"],
  stress: ["Stress Management", "Work Burnout"],
  burnout: ["Work Burnout", "Work-Related Concerns", "Stress Management"],
  balance: ["Work-Related Concerns", "Stress Management"],
  sleep: ["Stress Management", "Anxiety Disorders"],
  general: ["Anxiety Disorders", "Stress Management"],
};

export const fits = (c: Consultant, areas: string[]) =>
  areas.some((a) => c.therapyFor.includes(a) || c.specializes.includes(a));

export const slotHours = [9, 10, 11, 14, 15, 16, 17, 18];

export const hourLabel = (h: number) => `${((h + 11) % 12) + 1}:00 ${h < 12 ? "AM" : "PM"}`;

export const nextLabel = (c: Consultant) => {
  const d = addDays(new Date(), c.next.inDays);
  const day =
    c.next.inDays === 0
      ? "Today"
      : c.next.inDays === 1
        ? "Tomorrow"
        : d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  return `${day}, ${hourLabel(c.next.hour)}`;
};

export type Booking = {
  id: string;
  consultantId: string;
  mode: SessionMode;
  price: number;
  /** ISO start */
  startsAt: string;
  createdAt: string;
  status: "requested" | "cancelled";
};

const store = createLocalStore<{ bookings: Booking[] }>("ikan.consult.v1", { bookings: [] });

export function useBookings() {
  const { bookings } = store.use();
  return {
    bookings: [...bookings].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    book: (b: Omit<Booking, "id" | "createdAt" | "status">) => {
      const booking: Booking = {
        ...b,
        id: newId("b"),
        createdAt: new Date().toISOString(),
        status: "requested",
      };
      store.update((s) => ({ bookings: [...s.bookings, booking] }));
      return booking;
    },
    cancel: (id: string) =>
      store.update((s) => ({
        bookings: s.bookings.map((x) => (x.id === id ? { ...x, status: "cancelled" as const } : x)),
      })),
  };
}
