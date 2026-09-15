import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as newId, t as createLocalStore } from "./local-store-Ceu_KPZq.mjs";
import { f as scoreAll, i as headlineOf, p as useAssessmentStore, r as getAssessment, s as percentOfRange, t as assessments, u as recommendationsFor } from "./store-CsxAZBJN.mjs";
import { a as getProgramme, p as useProgramme, s as programmes } from "./programs-DrKO9d_v.mjs";
import { i as dayKey, s as moodScale, t as addDays, u as useJournal } from "./journal-Cd2_QpOm.mjs";
import { E as useSettings, S as useAuth, T as useProfile, h as profileInitials, l as displayName } from "./auth-xMCnsA0H.mjs";
import { t as MadeBy } from "./made-by-Cpp5pcoF.mjs";
import { t as ProfilePhoto } from "./profile-photo-C6SkD_-8.mjs";
import { t as useBackToClose } from "./use-back-close-DdJ3iPJc.mjs";
import { g as Link, l as useRouterState, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as LayoutGrid, E as Settings, It as ChartNoAxesColumn, K as LogOut, Kt as BookOpen, Mt as ChevronRight, Ot as ClipboardList, Q as LifeBuoy, R as NotebookPen, Vt as CalendarCheck, W as Mail, _ as Sparkles, at as History, kt as CircleQuestionMark, nt as Info, qt as Bell, rt as House, st as HeartPulse, zt as CalendarDays } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ikan-shell-BVeIbGxw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var consultants = [
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
		formats: [
			"Online",
			"Offline",
			"Call",
			"Chat"
		],
		specializes: [
			"Anxiety Disorders",
			"Trauma",
			"CBT"
		],
		concerns: [
			"I feel anxious all the time",
			"I can't stop worrying",
			"Past trauma is affecting my present",
			"I'm constantly stressed"
		],
		therapyFor: [
			"Anxiety Disorders",
			"Depressive Disorders",
			"Trauma",
			"PTSD",
			"Stress Management",
			"Cognitive Behavioral Therapy"
		],
		approaches: [
			"Cognitive Behavioral Therapy (CBT)",
			"Trauma-Informed Care",
			"Mindfulness-Based Therapy"
		],
		qualifications: [
			"M.Phil in Clinical Psychology, NIMHANS",
			"M.Sc in Psychology, Delhi University",
			"Certified CBT Practitioner",
			"Trauma-Informed Care Specialist"
		],
		about: "Dr. Johnson has over 15 years of experience helping individuals overcome anxiety, depression, and trauma. She specializes in cognitive behavioral therapy and trauma-informed care, creating a safe and supportive environment for healing.",
		sessions: [
			{
				mode: "Video",
				price: 1500
			},
			{
				mode: "Call",
				price: 1200
			},
			{
				mode: "Chat",
				price: 800
			},
			{
				mode: "Offline",
				price: 2e3
			}
		],
		next: {
			inDays: 0,
			hour: 16
		},
		hue: 262,
		review: {
			text: "Dr. Johnson helped me overcome my anxiety. Her CBT techniques really work. Highly recommended!",
			date: "2025-10-10",
			helpful: 23,
			rating: 5,
			name: "Anonymous",
			verified: true
		},
		faq: {
			q: "What is your approach to therapy?",
			a: "I primarily use Cognitive Behavioral Therapy (CBT) combined with trauma-informed care principles. I believe in creating a collaborative, supportive environment where you feel safe to explore your thoughts and feelings."
		}
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
		languages: [
			"English",
			"Hindi",
			"Marathi"
		],
		formats: [
			"Online",
			"Chat",
			"Call"
		],
		specializes: [
			"LGBTQIA+ Concerns",
			"Identity",
			"Young Adults"
		],
		concerns: [
			"I'm struggling with my identity",
			"Coming out is difficult",
			"I need a safe, affirming space",
			"LGBTQ+ specific challenges"
		],
		therapyFor: [
			"LGBTQIA+ Concerns",
			"Identity Issues",
			"Anxiety Disorders",
			"Self-Esteem",
			"Young Adults"
		],
		approaches: [
			"Affirmative Therapy",
			"Person-Centered Therapy",
			"ACT"
		],
		qualifications: [
			"M.Phil in Clinical Psychology",
			"RCI Registered Psychologist",
			"LGBTQ+ Affirmative Therapy Certification",
			"ACT Practitioner"
		],
		about: "Dr. Sharma provides LGBTQIA+ affirmative therapy, helping individuals with identity exploration, coming out processes, and dealing with discrimination. She creates a safe, affirming space for all clients and is passionate about queer mental health.",
		sessions: [
			{
				mode: "Video",
				price: 1300
			},
			{
				mode: "Call",
				price: 1100
			},
			{
				mode: "Chat",
				price: 900
			}
		],
		next: {
			inDays: 0,
			hour: 18
		},
		hue: 330
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
		specializes: [
			"Stress Management",
			"Work Burnout",
			"Mindfulness"
		],
		concerns: [
			"I'm burned out at work",
			"I can't manage my stress",
			"Work-life balance is difficult",
			"I need better coping strategies"
		],
		therapyFor: [
			"Stress Management",
			"Work-Related Concerns",
			"Communication Skills",
			"Relationship Skills",
			"Mindfulness"
		],
		approaches: [
			"Mindfulness-Based Stress Reduction",
			"Solution-Focused Therapy",
			"Positive Psychology"
		],
		qualifications: [
			"M.Phil in Clinical Social Work",
			"Licensed Clinical Social Worker (LCSW)",
			"Certified Mindfulness Teacher",
			"Corporate Wellness Consultant"
		],
		about: "Dr. Chen focuses on helping professionals manage stress and prevent burnout through evidence-based interventions and mindfulness practices. He has extensive experience in workplace mental health and corporate wellness programs.",
		sessions: [
			{
				mode: "Video",
				price: 1200
			},
			{
				mode: "Call",
				price: 1e3
			},
			{
				mode: "Chat",
				price: 700
			}
		],
		next: {
			inDays: 1,
			hour: 10
		},
		hue: 168
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
		languages: [
			"English",
			"Spanish",
			"Hindi"
		],
		formats: [
			"Online",
			"Offline",
			"Video"
		],
		specializes: [
			"Couples Therapy",
			"Family Counseling",
			"Communication"
		],
		concerns: [
			"My relationship is struggling",
			"We can't communicate effectively",
			"Family conflicts are overwhelming",
			"Parenting challenges are stressful"
		],
		therapyFor: [
			"Relationship Skills",
			"Communication Skills",
			"Parenting Concerns",
			"Life Transitions",
			"Couples Therapy"
		],
		approaches: [
			"Emotionally Focused Therapy (EFT)",
			"Gottman Method",
			"Attachment-Based Therapy"
		],
		qualifications: [
			"Ph.D. in Marriage and Family Therapy",
			"Licensed Marriage and Family Therapist (LMFT)",
			"Certified EFT Therapist",
			"Gottman Level 3 Trained"
		],
		about: "Dr. Rodriguez specializes in helping couples and families improve their relationships and communication. She uses evidence-based approaches like EFT and Gottman Method to address attachment issues and relationship challenges.",
		sessions: [
			{
				mode: "Video",
				price: 2e3
			},
			{
				mode: "Call",
				price: 1500
			},
			{
				mode: "Offline",
				price: 2500
			}
		],
		next: {
			inDays: 5,
			hour: 14
		},
		hue: 24
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
		specializes: [
			"Bipolar Disorder",
			"Medication Management",
			"Mood Disorders"
		],
		concerns: [
			"I need medication evaluation",
			"My mood swings are severe",
			"I have a complex diagnosis",
			"Current medication isn't working"
		],
		therapyFor: [
			"Bipolar Disorder",
			"Schizophrenia",
			"Depressive Disorders",
			"Anxiety Disorders",
			"Medication Management"
		],
		approaches: [
			"Medication Management",
			"Psychopharmacology",
			"Integrated Care"
		],
		qualifications: [
			"MD, Psychiatry, AIIMS Delhi",
			"Board Certified Psychiatrist",
			"Fellowship in Mood Disorders",
			"20+ research publications"
		],
		about: "Dr. Thompson is a board-certified psychiatrist with expertise in medication management for complex mental health conditions. He takes a collaborative approach to treatment planning, working closely with patients to find the right medication and dosage.",
		sessions: [{
			mode: "Video",
			price: 2500
		}, {
			mode: "Offline",
			price: 3e3
		}],
		next: {
			inDays: 6,
			hour: 11
		},
		hue: 212
	}
];
var getConsultant = (id) => consultants.find((c) => c.id === id);
var fromPrice = (c) => Math.min(...c.sessions.map((s) => s.price));
var initials = (name) => name.replace(/^Dr\.\s*/, "").split(" ").map((p) => p[0]).join("").slice(0, 2);
var rupees = (n) => `₹${n.toLocaleString("en-IN")}`;
/** Which consultants fit an assessment category, for the "based on your latest assessment" note. */
var matchesFor = {
	anxiety: ["Anxiety Disorders"],
	depression: ["Depressive Disorders", "Mood Disorders"],
	stress: ["Stress Management", "Work Burnout"],
	burnout: [
		"Work Burnout",
		"Work-Related Concerns",
		"Stress Management"
	],
	balance: ["Work-Related Concerns", "Stress Management"],
	sleep: ["Stress Management", "Anxiety Disorders"],
	general: ["Anxiety Disorders", "Stress Management"]
};
var fits = (c, areas) => areas.some((a) => c.therapyFor.includes(a) || c.specializes.includes(a));
var slotHours = [
	9,
	10,
	11,
	14,
	15,
	16,
	17,
	18
];
var hourLabel = (h) => `${(h + 11) % 12 + 1}:00 ${h < 12 ? "AM" : "PM"}`;
var nextLabel = (c) => {
	const d = addDays(/* @__PURE__ */ new Date(), c.next.inDays);
	return `${c.next.inDays === 0 ? "Today" : c.next.inDays === 1 ? "Tomorrow" : d.toLocaleDateString("en-IN", {
		weekday: "short",
		day: "numeric",
		month: "short"
	})}, ${hourLabel(c.next.hour)}`;
};
var store$1 = createLocalStore("ikan.consult.v1", { bookings: [] });
function useBookings() {
	const { bookings } = store$1.use();
	return {
		bookings: [...bookings].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
		book: (b) => {
			const booking = {
				...b,
				id: newId("b"),
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				status: "requested"
			};
			store$1.update((s) => ({ bookings: [...s.bookings, booking] }));
			return booking;
		},
		cancel: (id) => store$1.update((s) => ({ bookings: s.bookings.map((x) => x.id === id ? {
			...x,
			status: "cancelled"
		} : x) }))
	};
}
var resources = [
	{
		id: "de31d473-fda7-47e4-82d6-a549b02eec44",
		title: "What is the Perceived Stress Scale (PSS-10)? Understand The Stress Screening Test",
		category: "General",
		date: "2026-09-10",
		minutes: 5,
		art: "stress",
		featured: true,
		assessment: "feeling-worried-and-stressed"
	},
	{
		id: "98d536d4-938b-4fbf-bc2c-f37e6d0b9409",
		title: "What is the Burnout Assessment Tool (BAT-23)? An easy guide to the 23-Question Burnout Test",
		category: "General",
		date: "2026-09-10",
		minutes: 5,
		art: "burnout",
		assessment: "feeling-drained-and-burned-out"
	},
	{
		id: "1b783468-f860-433b-8009-7e7943321ac1",
		title: "What is The Workplace Stress Scale? Explained.",
		category: "General",
		date: "2026-09-10",
		minutes: 5,
		art: "work",
		assessment: "struggling-to-balance-life"
	},
	{
		id: "resource-1766237270444",
		title: "What is Generalized Anxiety Disorder (GAD)-7? A Simple Guide to the Anxiety Screening Test",
		category: "General",
		date: "2026-09-10",
		minutes: 5,
		art: "anxiety",
		assessment: "feeling-overwhelmed-and-anxious"
	},
	{
		id: "a9697070-1dff-4bcc-a67d-2fbb26cc6e25",
		title: "What is Patient Health Questionnaire (PHQ)-9? A Quick Depression Screening Test",
		category: "General",
		date: "2026-09-10",
		minutes: 5,
		art: "mood",
		assessment: "feeling-depressed-and-hopeless"
	},
	{
		id: "c775a1e1-a938-4aac-8519-e5ad9f8dda1f",
		title: "What is the Sleep Condition Indicator (SCI)? Wake Up to Better Sleep.",
		category: "Sleep",
		date: "2026-09-10",
		minutes: 5,
		art: "sleep",
		assessment: "struggling-with-quality-sleep"
	},
	{
		id: "a5bef353-f6e5-4a22-9ae7-2d4e4a7ebd41",
		title: "The Late Night Tax: How Bad Sleep Impacts Your Long Term Health.",
		category: "Sleep",
		date: "2026-04-01",
		minutes: 5,
		art: "sleep"
	},
	{
		id: "resource-1766236115968",
		title: "The Power of Measurement-Based Care",
		category: "Stress",
		date: "2026-03-19",
		minutes: 5,
		art: "measure",
		featured: true
	},
	{
		id: "11457137-5bba-4f45-9d0d-51d7e2a4c9c6",
		title: "Physical Health is measured. Why should mental health be any different?",
		category: "General",
		date: "2026-03-11",
		minutes: 5,
		art: "checkup",
		featured: true
	},
	{
		id: "4a4ac2b7-17be-4e9e-9d8e-7d244af5aa73",
		title: "Prioritizing Mental Wellness: The Importance of Routine Mental Health Check-Ups.",
		category: "General",
		date: "2026-03-11",
		minutes: 5,
		art: "checkup"
	}
];
var getResource = (id) => resources.find((r) => r.id === id);
/** Readable URL name for an article, from its title: /resources/<slug>. */
var slugOf = (r) => r.title.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").split("-").slice(0, 9).join("-");
/** An article by its slug; old links by id still resolve. */
var getResourceBySlug = (slug) => resources.find((r) => slugOf(r) === slug) ?? getResource(slug);
var store = createLocalStore("ikan.resources.v1", {
	saved: [],
	opened: {}
});
function useResourceStore() {
	const state = store.use();
	return {
		...state,
		isSaved: (id) => state.saved.includes(id),
		toggleSave: (id) => store.update((s) => ({
			...s,
			saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id]
		})),
		markOpened: (id) => store.update((s) => ({
			...s,
			opened: {
				...s.opened,
				[id]: (/* @__PURE__ */ new Date()).toISOString()
			}
		}))
	};
}
/** false during SSR and the hydration render, true after — for screens that read localStorage. */
var useHydrated = () => (0, import_react.useSyncExternalStore)(() => () => {}, () => true, () => false);
var scoreBands = [
	{
		label: "Low",
		min: 0,
		max: 24,
		tone: "error"
	},
	{
		label: "Needs attention",
		min: 25,
		max: 44,
		tone: "warning"
	},
	{
		label: "Fair",
		min: 45,
		max: 64,
		tone: "warning"
	},
	{
		label: "Good",
		min: 65,
		max: 79,
		tone: "success"
	},
	{
		label: "Excellent",
		min: 80,
		max: 100,
		tone: "success"
	}
];
var wellnessBand = (score) => scoreBands.find((b) => score >= b.min && score <= b.max) ?? scoreBands[0];
var snapshots = createLocalStore("ikan.wellness.v1", { days: {} });
var useWellnessSnapshots = () => snapshots.use().days;
var saveSnapshot = (score) => {
	const key = dayKey(/* @__PURE__ */ new Date());
	if (snapshots.read().days[key] !== score) snapshots.update((s) => ({ days: {
		...s.days,
		[key]: score
	} }));
};
var shortDate = (iso) => new Date(iso).toLocaleDateString("en-IN", {
	day: "numeric",
	month: "long"
});
function useEverything() {
	const { results, drafts: assessmentDrafts } = useAssessmentStore();
	const journal = useJournal();
	const sleep = useProgramme("sleep-tight").state;
	const unburn = useProgramme("unburn").state;
	const stress = useProgramme("stress-buster").state;
	const { bookings } = useBookings();
	const reading = useResourceStore();
	const programmeStates = {
		"sleep-tight": sleep,
		unburn,
		"stress-buster": stress
	};
	const since = addDays(/* @__PURE__ */ new Date(), -29);
	const sinceKey = dayKey(since);
	const events = [];
	for (const r of results) {
		const a = getAssessment(r.slug);
		if (!a) continue;
		const head = headlineOf(a, scoreAll(a, r.answers));
		events.push({
			id: r.id,
			type: "assessment",
			at: r.completedAt,
			title: `${a.name} assessment`,
			detail: head?.band ? `${head.band.label} · ${a.title}` : `${a.scores.length} scores · ${a.title}`,
			...head?.band ? { tone: head.band.tone } : {},
			link: {
				to: "/assessments/$slug/result/$id",
				params: {
					slug: a.slug,
					id: r.id
				}
			}
		});
	}
	for (const e of journal.entries) {
		const m = moodScale[e.mood - 1];
		events.push({
			id: e.id,
			type: "mood",
			at: e.createdAt,
			title: `Felt ${m.label.toLowerCase()}`,
			detail: e.note ? `“${e.note}”` : `Mood ${e.mood}/5${e.tags.length ? ` · ${e.tags.length} tags` : ""}`,
			emoji: m.emoji,
			link: { to: "/journal" }
		});
	}
	for (const p of programmes) {
		const current = programmeStates[p.slug];
		for (const [ri, s] of [current, ...current.runs ?? []].entries()) for (const [day, at] of Object.entries(s.completedAt ?? {})) events.push({
			id: `${p.slug}-${ri}-${day}`,
			type: "program",
			at,
			title: `${p.name} · Day ${day}`,
			detail: `Day complete · ${Math.min(p.days.length, new Set(s.completed).size)} of ${p.days.length} done`,
			link: {
				to: "/program/$slug",
				params: { slug: p.slug }
			}
		});
	}
	for (const b of bookings) {
		const c = getConsultant(b.consultantId);
		if (!c) continue;
		const when = new Date(b.startsAt);
		events.push({
			id: b.id,
			type: "consult",
			at: b.createdAt,
			title: b.status === "cancelled" ? `Cancelled with ${c.name}` : `Session requested with ${c.name}`,
			detail: `${b.mode} · ${when.toLocaleDateString("en-IN", {
				weekday: "short",
				day: "numeric",
				month: "short"
			})}, ${when.toLocaleTimeString("en-IN", {
				hour: "numeric",
				minute: "2-digit"
			})}`,
			link: {
				to: "/consult/$id",
				params: { id: c.id }
			}
		});
	}
	for (const [id, at] of Object.entries(reading.opened)) {
		const r = getResource(id);
		if (!r) continue;
		events.push({
			id: `read-${id}`,
			type: "resource",
			at,
			title: "Read an article",
			detail: r.title,
			link: { to: "/resources" }
		});
	}
	events.sort((x, y) => y.at.localeCompare(x.at));
	const latest = assessments.map((a) => {
		const r = results.filter((x) => x.slug === a.slug).sort((x, y) => y.completedAt.localeCompare(x.completedAt))[0];
		if (!r) return null;
		const scores = scoreAll(a, r.answers).filter((s) => s.value !== null);
		if (!scores.length) return null;
		const vals = (a.headline ? scores.filter((s) => s.score.id === a.headline) : scores).map((s) => {
			const p = percentOfRange(s.profile, s.value);
			return (s.profile.direction === "better" ? p : 1 - p) * 100;
		});
		return vals.reduce((n, v) => n + v, 0) / vals.length;
	}).filter((v) => v !== null);
	const recentMood = journal.entries.filter((e) => e.date >= sinceKey);
	const moodDays = new Set(recentMood.map((e) => e.date));
	const moodAvg = recentMood.length ? recentMood.reduce((n, e) => n + e.mood, 0) / recentMood.length : null;
	const lastResult = [...results].sort((x, y) => y.completedAt.localeCompare(x.completedAt))[0];
	const doneOf = (slug, total) => Math.min(total, new Set(programmeStates[slug].completed).size);
	const started = programmes.filter((p) => programmeStates[p.slug].completed.length > 0);
	const progPct = started.map((p) => doneOf(p.slug, p.days.length) / p.days.length * 100);
	const parts = [
		{
			key: "assessments",
			label: "Assessments",
			weight: 40,
			value: latest.length ? latest.reduce((n, v) => n + v, 0) / latest.length : null,
			detail: latest.length ? `${latest.length} complete${lastResult ? ` · last ${shortDate(lastResult.completedAt)}` : ""}` : "Take an assessment to add this"
		},
		{
			key: "checkins",
			label: "Check-ins",
			weight: 30,
			value: moodAvg === null ? null : .6 * ((moodAvg - 1) / 4 * 100) + .4 * Math.min(100, moodDays.size / 30 * 100),
			detail: moodAvg === null ? "Log a mood check-in to add this" : `${moodDays.size} of the last 30 days · avg mood ${moodAvg.toFixed(1)}/5`
		},
		{
			key: "programs",
			label: "Programme activity",
			weight: 15,
			value: progPct.length ? progPct.reduce((n, v) => n + v, 0) / progPct.length : null,
			detail: started.length ? started.map((p) => `${p.name}, ${doneOf(p.slug, p.days.length)} of ${p.days.length} days`).join(" · ") : "Start a program to add this"
		},
		{
			key: "health",
			label: "Health Connect",
			weight: 15,
			value: null,
			detail: "Sleep and steps · not connected"
		}
	];
	const present = parts.filter((p) => p.value !== null);
	const totalWeight = present.reduce((n, p) => n + p.weight, 0);
	const score = present.length ? Math.round(present.reduce((n, p) => n + p.value * p.weight, 0) / totalWeight) : null;
	const drafts = Object.entries(assessmentDrafts).map(([slug, d]) => ({
		assessment: getAssessment(slug),
		answered: Object.keys(d.answers).length,
		updatedAt: d.updatedAt
	})).filter((d) => d.assessment && d.answered > 0);
	const archive = events.filter((e) => e.type === "assessment" || e.type === "mood");
	for (const p of programmes) for (const [ri, s] of (programmeStates[p.slug].runs ?? []).entries()) {
		const stamps = Object.values(s.completedAt ?? {}).sort();
		const at = s.archivedAt || stamps.at(-1);
		if (!at) continue;
		archive.push({
			id: `${p.slug}-completed-${ri}`,
			type: "program",
			at,
			title: `${p.name} completed`,
			detail: `All ${p.days.length} days done${stamps[0] ? ` · started ${new Date(stamps[0]).toLocaleDateString("en-IN", {
				day: "numeric",
				month: "short"
			})}` : ""}`,
			link: {
				to: "/program/$slug/result",
				params: { slug: p.slug }
			}
		});
	}
	archive.sort((a, b) => b.at.localeCompare(a.at));
	return {
		archive,
		drafts,
		events,
		parts,
		score,
		totalWeight,
		journal,
		bookings,
		reading,
		programmeStates,
		results
	};
}
var readStore = createLocalStore("ikan.notifications.v1", { read: [] });
var HOUR = 36e5;
function useNotifications() {
	const data = useEverything();
	const { settings } = useSettings();
	const snapshots = useWellnessSnapshots();
	const { read } = readStore.use();
	const now = /* @__PURE__ */ new Date();
	const notices = [];
	for (const d of data.drafts) {
		if (!d.assessment || !d.updatedAt) continue;
		if (now.getTime() - new Date(d.updatedAt).getTime() < 48 * HOUR) continue;
		notices.push({
			id: `draft-${d.assessment.slug}-${d.updatedAt}`,
			tier: "needs",
			title: `Finish your ${d.assessment.name.toLowerCase()} assessment`,
			body: `You stopped partway. Pick up where you left off, it only counts once it’s complete.`,
			at: d.updatedAt,
			icon: "assessment",
			link: {
				to: "/assessment-flow",
				search: { id: d.assessment.slug }
			}
		});
	}
	const [rh, rm] = settings.moodReminderTime.split(":").map(Number);
	const reminderAt = new Date(now);
	reminderAt.setHours(rh || 21, rm || 0, 0, 0);
	const loggedToday = data.journal.entries.some((e) => e.date === dayKey(now));
	if (settings.moodReminders && now >= reminderAt && !loggedToday) notices.push({
		id: `mood-${dayKey(now)}`,
		tier: "needs",
		title: "How was today?",
		body: "A quick check-in takes under a minute.",
		at: reminderAt.toISOString(),
		icon: "mood",
		link: { to: "/journal" }
	});
	const latestBySlug = /* @__PURE__ */ new Map();
	for (const r of data.results) {
		const prev = latestBySlug.get(r.slug);
		if (!prev || r.completedAt > prev.completedAt) latestBySlug.set(r.slug, r);
	}
	if (settings.assessmentReminders) for (const r of latestBySlug.values()) {
		const due = new Date(r.completedAt).getTime() + 336 * HOUR;
		const a = getAssessment(r.slug);
		if (!a || now.getTime() < due) continue;
		notices.push({
			id: `retake-${r.id}`,
			tier: "needs",
			title: `Time to retake ${a.name.toLowerCase()}`,
			body: "It’s been two weeks. Retaking shows how things have changed.",
			at: new Date(due).toISOString(),
			icon: "assessment",
			link: {
				to: "/assessments/$slug",
				params: { slug: a.slug }
			}
		});
	}
	if (settings.healthConnect) notices.push({
		id: "health-connect-unsynced",
		tier: "needs",
		title: "Health Connect hasn’t synced",
		body: "Your score is running without sleep and steps until it does.",
		at: now.toISOString(),
		icon: "health",
		link: { to: "/settings" }
	});
	for (const b of data.bookings) {
		if (b.status !== "requested") continue;
		const start = new Date(b.startsAt);
		const until = start.getTime() - now.getTime();
		if (until < 0 || until > 24 * HOUR) continue;
		const c = getConsultant(b.consultantId);
		if (!c) continue;
		notices.push({
			id: `session-${b.id}`,
			tier: "needs",
			title: `Session with ${c.name} ${dayKey(start) === dayKey(now) ? "today" : "tomorrow"}`,
			body: `${b.mode} at ${hourLabel(start.getHours())}.`,
			at: b.createdAt,
			icon: "consult",
			link: {
				to: "/consult/$id",
				params: { id: c.id }
			}
		});
	}
	const weekAgoKey = dayKey(/* @__PURE__ */ new Date(now.getTime() - 168 * HOUR));
	const weekAgo = Object.entries(snapshots).filter(([k]) => k <= weekAgoKey).sort(([x], [y]) => y.localeCompare(x))[0]?.[1];
	if (data.score !== null && weekAgo !== void 0 && data.score !== weekAgo) {
		const up = data.score > weekAgo;
		const bandNow = wellnessBand(data.score);
		const bandThen = wellnessBand(weekAgo);
		notices.push({
			id: `score-${dayKey(now)}-${data.score}`,
			tier: "changed",
			title: bandNow !== bandThen ? `Your iKAN Score moved to ${bandNow.label}` : `Your iKAN Score went ${up ? "up" : "down"} this week`,
			body: up ? "See what moved it." : "The factors show what changed and when.",
			at: now.toISOString(),
			icon: "score",
			link: { to: "/wellness" }
		});
	}
	const recommended = /* @__PURE__ */ new Set();
	for (const r of [...latestBySlug.values()].sort((x, y) => y.completedAt.localeCompare(x.completedAt))) {
		const a = getAssessment(r.slug);
		if (!a) continue;
		const recs = recommendationsFor(a, scoreAll(a, r.answers));
		const p = recs[0] ? getProgramme(recs[0]) : void 0;
		if (!p || recommended.has(p.slug)) continue;
		recommended.add(p.slug);
		notices.push({
			id: `rec-${r.id}`,
			tier: "changed",
			title: `New for you: ${p.name}`,
			body: `Recommended from your ${a.name.toLowerCase()} result.`,
			at: r.completedAt,
			icon: "program",
			link: {
				to: "/program/$slug",
				params: { slug: p.slug }
			}
		});
	}
	notices.sort((x, y) => y.at.localeCompare(x.at));
	const needs = notices.filter((n) => n.tier === "needs");
	const changed = notices.filter((n) => n.tier === "changed");
	const unread = notices.filter((n) => !read.includes(n.id));
	return {
		needs,
		changed,
		happened: data.events.slice(0, 30),
		unreadIds: new Set(unread.map((n) => n.id)),
		unreadCount: unread.length,
		markAllRead: () => readStore.update((s) => ({ read: [.../* @__PURE__ */ new Set([...s.read, ...notices.map((n) => n.id)])].slice(-300) }))
	};
}
var navItems = [
	{
		to: "/",
		label: "Home",
		icon: House
	},
	{
		to: "/program",
		label: "Programs",
		icon: Sparkles
	},
	{
		to: "/assessments",
		label: "Assess",
		icon: ChartNoAxesColumn
	},
	{
		to: "/journal",
		label: "Journal",
		icon: BookOpen
	}
];
/** Routes that live behind More rather than on a tab. */
var moreRoutes = /^\/(wellness|history|diaries|resources|consult|profile|notifications|settings|support)/;
function IkanShell({ children }) {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const [moreOpen, setMoreOpen] = (0, import_react.useState)(false);
	const hydrated = useHydrated();
	const { unreadCount } = useNotifications();
	(0, import_react.useEffect)(() => setMoreOpen(false), [pathname]);
	const { settings } = useSettings();
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("reduce-motion", hydrated && settings.reduceMotion);
	}, [hydrated, settings.reduceMotion]);
	const moreActive = moreOpen || moreRoutes.test(pathname);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-canvas text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto min-h-dvh w-full max-w-app bg-background pb-[calc(7rem+env(safe-area-inset-bottom))] lg:shadow-app",
				children
			}),
			moreOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreSheet, { onClose: () => setMoreOpen(false) }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center print:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					"aria-label": "Main navigation",
					className: "pointer-events-auto mb-[max(12px,env(safe-area-inset-bottom))] w-full max-w-app px-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-5 rounded-[24px] border border-border/80 bg-background/92 p-2 shadow-dock backdrop-blur-xl",
						children: [navItems.map((item, index) => {
							const active = !moreOpen && (index === 0 ? pathname === "/" : pathname.startsWith(item.to) || item.to === "/assessments" && pathname.startsWith("/result"));
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: active ? "nav-item text-foreground" : "nav-item text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: active ? "nav-icon bg-foreground text-background" : "nav-icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { "aria-hidden": "true" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
							}, item.label);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-expanded": moreOpen,
							"aria-haspopup": "dialog",
							onClick: () => setMoreOpen((o) => !o),
							className: moreActive ? "nav-item text-foreground" : "nav-item text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("relative", moreActive ? "nav-icon bg-foreground text-background" : "nav-icon"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { "aria-hidden": "true" }), hydrated && unreadCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#B3261E] px-1 text-[10px] font-bold text-white",
									children: unreadCount
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "More" })]
						})]
					})
				})
			})
		]
	});
}
function MoreSheet({ onClose }) {
	const hydrated = useHydrated();
	const { user, signOut } = useAuth();
	const { profile } = useProfile();
	const navigate = useNavigate();
	const data = useEverything();
	const { unreadCount } = useNotifications();
	useBackToClose(true, onClose);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", onKey);
		const overflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = overflow;
		};
	}, [onClose]);
	const n = (v, one, many) => `${v} ${v === 1 ? one : many}`;
	const finishedRuns = data.archive.filter((e) => e.type === "program").length;
	const groups = [
		{
			title: "Your history",
			rows: [
				{
					to: "/history",
					label: "All history",
					sub: "Assessments, programs and journal in one place",
					icon: History
				},
				{
					to: "/history/assessments",
					label: "Assessments",
					sub: hydrated ? n(data.results.length, "result", "results") : "Every result, by assessment",
					icon: ClipboardList
				},
				{
					to: "/history/program",
					label: "Programs",
					sub: hydrated ? `${n(finishedRuns, "program", "programs")} finished` : "Finished programs",
					icon: Sparkles
				},
				{
					to: "/history/journal",
					label: "Journal",
					sub: hydrated ? `${n(data.journal.entries.length, "check-in", "check-ins")} on a calendar` : "Your check-ins on a calendar",
					icon: CalendarDays
				},
				{
					to: "/diaries",
					label: "Learning diaries",
					sub: "One for each program",
					icon: NotebookPen
				}
			]
		},
		{
			title: "Explore",
			rows: [
				{
					to: "/wellness",
					label: "iKAN Score",
					sub: hydrated && data.score !== null ? `${data.score} of 100` : "Your wellness index",
					icon: HeartPulse
				},
				{
					to: "/resources",
					label: "Resources",
					sub: `${resources.length} articles and guides`,
					icon: BookOpen
				},
				{
					to: "/consult",
					label: "Consultation",
					sub: `${consultants.length} consultants`,
					icon: CalendarCheck
				}
			]
		},
		{
			title: "App",
			rows: [{
				to: "/notifications",
				label: "Notifications",
				sub: hydrated && unreadCount ? `${unreadCount} unread` : "All caught up",
				icon: Bell
			}, {
				to: "/settings",
				label: "Settings",
				sub: "Reminders, permissions, privacy",
				icon: Settings
			}]
		},
		{
			title: "About iKAN",
			rows: [
				{
					to: "/about",
					label: "About",
					sub: "Who we are",
					icon: Info
				},
				{
					to: "/faq",
					label: "FAQ",
					sub: "Common questions",
					icon: CircleQuestionMark
				},
				{
					to: "/contact",
					label: "Contact",
					sub: "Write to us",
					icon: Mail
				}
			]
		}
	];
	const legal = [
		{
			slug: "terms",
			label: "Terms"
		},
		{
			slug: "privacy-policy",
			label: "Privacy"
		},
		{
			slug: "cancellation-policy",
			label: "Cancellation"
		},
		{
			slug: "return-policy",
			label: "Refunds"
		}
	];
	const name = hydrated ? profile.name || displayName(user) : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-40 flex items-end justify-center",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "More",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close",
			onClick: onClose,
			className: "animate-fade absolute inset-0 bg-foreground/40"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "animate-sheet relative max-h-[calc(100dvh-24px)] w-full max-w-app overflow-y-auto overscroll-contain rounded-t-[28px] bg-background pb-[calc(7rem+env(safe-area-inset-bottom))] pt-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-1 w-8 rounded-full bg-foreground/30" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 px-4 pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/profile",
						className: "flex min-w-0 flex-1 items-center gap-3 rounded-[20px] p-1.5 pr-3 transition-colors hover:bg-secondary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-foreground font-display text-[16px] font-semibold text-background",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePhoto, {
								src: hydrated ? profile.avatar : void 0,
								children: hydrated ? profileInitials(profile) : ""
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate font-display text-[17px] font-semibold leading-6",
								children: name || "Your profile"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-[13px] text-muted-foreground",
								children: user?.email ?? "View and edit your details"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/support",
						className: "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#F9DEDC] px-3 text-[13px] font-semibold text-[#8C1D18]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "h-4 w-4" }), " Get help"]
					})]
				}),
				groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "px-5 text-[13px] font-semibold text-muted-foreground",
						children: g.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mx-3 mt-1.5 overflow-hidden rounded-[20px] bg-secondary",
						children: g.rows.map((r) => {
							const Icon = r.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "border-b border-background last:border-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: r.to,
									className: "flex min-h-14 items-center gap-3 px-3 py-2 transition-colors hover:bg-background/60",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-background",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-[18px] w-[18px]" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-[15px] font-medium",
												children: r.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block truncate text-[12px] text-muted-foreground",
												children: r.sub
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
									]
								})
							}, r.to);
						})
					})]
				}, g.title)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					"aria-label": "Legal",
					className: "mt-5 flex flex-wrap gap-x-4 gap-y-2 px-5 text-[13px]",
					children: legal.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/legal/$slug",
						params: { slug: l.slug },
						className: "text-muted-foreground underline-offset-4 hover:underline",
						children: l.label
					}, l.slug))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex items-center justify-between gap-3 px-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "min-w-0 truncate text-[12px] text-muted-foreground",
						children: user?.email ? `Signed in as ${user.email}` : ""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: async () => {
							onClose();
							await signOut();
							navigate({
								to: "/login",
								replace: true
							});
						},
						className: "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-[#B3261E] hover:bg-[#F9DEDC]/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Sign out"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mx-5 mt-4 rounded-[16px] bg-secondary px-4 py-3 text-[12px] leading-5 text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: "Disclaimer:"
						}),
						" We at iKan deeply care about your mental health but we do not provide emergency support. If you or someone you know needs immediate assistance, please reach out to the National Helpline:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "tel:18005990019",
							className: "font-semibold text-foreground underline underline-offset-2",
							children: "1800-599-0019"
						}),
						" ",
						"or the iCALL Suicide Prevention Helpline:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "tel:+919152987821",
							className: "font-semibold text-foreground underline underline-offset-2",
							children: "9152987821"
						}),
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MadeBy, { className: "mt-4" })
			]
		})]
	});
}
//#endregion
export { useWellnessSnapshots as C, useResourceStore as S, slugOf as _, getConsultant as a, useHydrated as b, hourLabel as c, nextLabel as d, resources as f, slotHours as g, scoreBands as h, fromPrice as i, initials as l, saveSnapshot as m, consultants as n, getResource as o, rupees as p, fits as r, getResourceBySlug as s, IkanShell as t, matchesFor as u, useBookings as v, wellnessBand as w, useNotifications as x, useEverything as y };
