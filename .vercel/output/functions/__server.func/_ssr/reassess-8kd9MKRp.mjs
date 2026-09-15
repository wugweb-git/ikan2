import { o as scopedKey } from "./storage-scope-BQ7XsBx5.mjs";
import { s as programmes } from "./programs-DrKO9d_v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reassess-8kd9MKRp.js
var DAY = 864e5;
function reassessReason(results, journal, states, now = Date.now()) {
	const last = [...results].sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
	if (!last) return null;
	const lastAt = new Date(last.completedAt).getTime();
	if ((now - lastAt) / DAY >= 14) return "time";
	const moods = [...journal].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	if (moods.length >= 5) {
		const last5 = moods.slice(0, 5);
		if (last5.every((e) => e.mood <= 2) || last5.every((e) => (e.stress ?? 0) >= 4)) return "mood";
		const baseline = moods.slice(1, 5).reduce((n, e) => n + e.mood, 0) / 4;
		if (moods[0].mood <= baseline - 2) return "mood";
	}
	for (const p of programmes) {
		const finished = states[p.slug]?.runs?.[0]?.archivedAt;
		if (!finished) continue;
		const at = new Date(finished).getTime();
		if ((now - at) / DAY < 3 && at > lastAt) return "program";
	}
	return null;
}
var reassessCopy = {
	time: "It’s been two weeks since your last assessment. See how things have changed.",
	mood: "Your recent check-ins have been harder. A quick re-check can help you see where you are.",
	program: "You’ve just finished a program. See how things have changed since you started."
};
/** For one assessment's retake button: whether a retake is due, and from when. */
function retakeTiming(latest, now = Date.now()) {
	if (!latest) return {
		due: true,
		from: null,
		days: 0
	};
	const at = new Date(latest.completedAt).getTime();
	const days = Math.floor((now - at) / DAY);
	return {
		due: days >= 14,
		from: new Date(at + 14 * DAY),
		days
	};
}
var DISMISS_KEY = () => scopedKey("ikan.reassess-dismissed");
var reassessDismissed = (now = Date.now()) => {
	try {
		const v = Number(window.localStorage.getItem(DISMISS_KEY()));
		return Boolean(v) && now - v < DAY;
	} catch {
		return false;
	}
};
var dismissReassess = () => {
	try {
		window.localStorage.setItem(DISMISS_KEY(), String(Date.now()));
	} catch {}
};
//#endregion
export { retakeTiming as a, reassessReason as i, reassessCopy as n, reassessDismissed as r, dismissReassess as t };
