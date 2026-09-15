import { n as newId, t as createLocalStore } from "./local-store-Ceu_KPZq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/journal-Cd2_QpOm.js
var moodScale = [
	{
		value: 1,
		emoji: "😫",
		label: "Awful"
	},
	{
		value: 2,
		emoji: "😕",
		label: "Bad"
	},
	{
		value: 3,
		emoji: "😐",
		label: "Meh"
	},
	{
		value: 4,
		emoji: "🙂",
		label: "Good"
	},
	{
		value: 5,
		emoji: "😄",
		label: "Great"
	}
];
var energyScale = [
	{
		value: 1,
		emoji: "🪫",
		label: "Exhausted"
	},
	{
		value: 2,
		emoji: "😴",
		label: "Tired"
	},
	{
		value: 3,
		emoji: "⚡",
		label: "Moderate"
	},
	{
		value: 4,
		emoji: "💪",
		label: "Energetic"
	},
	{
		value: 5,
		emoji: "🔥",
		label: "Charged!"
	}
];
var stressScale = [
	{
		value: 1,
		emoji: "😌",
		label: "Chill"
	},
	{
		value: 2,
		emoji: "🤔",
		label: "Mild"
	},
	{
		value: 3,
		emoji: "😤",
		label: "Medium"
	},
	{
		value: 4,
		emoji: "😰",
		label: "High"
	},
	{
		value: 5,
		emoji: "🤯",
		label: "Yikes!"
	}
];
var contextTags = [
	{
		id: "work",
		emoji: "💼",
		label: "Work"
	},
	{
		id: "sleep",
		emoji: "😴",
		label: "Sleep"
	},
	{
		id: "health",
		emoji: "🏃",
		label: "Health"
	},
	{
		id: "relationships",
		emoji: "❤️",
		label: "Relationships"
	},
	{
		id: "studies",
		emoji: "📚",
		label: "Studies"
	},
	{
		id: "finances",
		emoji: "💰",
		label: "Finances"
	},
	{
		id: "fun",
		emoji: "🎉",
		label: "Fun"
	},
	{
		id: "other",
		emoji: "✨",
		label: "Other"
	}
];
var checkinSteps = [
	{
		key: "mood",
		title: "How are you feeling?",
		subtitle: "Tap the emoji that matches your vibe",
		required: true
	},
	{
		key: "energy",
		title: "What's your energy like?",
		subtitle: "From drained to fully charged",
		required: false
	},
	{
		key: "stress",
		title: "Stress level?",
		subtitle: "Be honest — there's no wrong answer",
		required: false
	},
	{
		key: "note",
		title: "Anything on your mind?",
		subtitle: "A quick note to capture this moment",
		required: false
	},
	{
		key: "tags",
		title: "What shaped your day?",
		subtitle: "Pick whatever applies — or skip to save",
		required: false
	}
];
var store = createLocalStore("ikan.journal.v1", { entries: [] });
/** Add entries that aren't here yet (matched by id); used by the import from the old iKan app. */
var mergeJournalEntries = (incoming) => store.update((s) => {
	const have = new Set(s.entries.map((e) => e.id));
	const fresh = incoming.filter((e) => !have.has(e.id));
	return fresh.length ? { entries: [...s.entries, ...fresh] } : s;
});
var dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
var addDays = (d, n) => {
	const x = new Date(d);
	x.setDate(x.getDate() + n);
	return x;
};
function streaks(dates, today = /* @__PURE__ */ new Date()) {
	let current = 0;
	let cursor = dates.has(dayKey(today)) ? today : addDays(today, -1);
	while (dates.has(dayKey(cursor))) {
		current += 1;
		cursor = addDays(cursor, -1);
	}
	let best = 0;
	let run = 0;
	let prev = null;
	for (const key of [...dates].sort()) {
		run = prev !== null && key === dayKey(addDays(fromKey(prev), 1)) ? run + 1 : 1;
		best = Math.max(best, run);
		prev = key;
	}
	return {
		current,
		best: Math.max(best, current)
	};
}
var fromKey = (key) => {
	const [y, m, d] = key.split("-").map(Number);
	return new Date(y, m - 1, d);
};
function useJournal() {
	const { entries } = store.use();
	return {
		entries,
		on: (date) => entries.filter((e) => e.date === date).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
		add: (draft) => {
			const now = /* @__PURE__ */ new Date();
			const entry = {
				id: newId("j"),
				date: dayKey(now),
				createdAt: now.toISOString(),
				...draft
			};
			store.update((s) => ({ entries: [...s.entries, entry] }));
			return entry;
		},
		remove: (id) => store.update((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
		restore: (entry) => store.update((s) => ({ entries: [...s.entries, entry] }))
	};
}
//#endregion
export { energyScale as a, streaks as c, dayKey as i, stressScale as l, checkinSteps as n, mergeJournalEntries as o, contextTags as r, moodScale as s, addDays as t, useJournal as u };
