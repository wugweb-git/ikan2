//#region node_modules/.nitro/vite/services/ssr/assets/journey-Muau11lk.js
var answerKey = (b, day) => b.key ?? `${day}.${b.n}`;
var INTERACTIVE = (ui) => ui !== "lesson" && ui !== "conclude";
function journeyOf(p, s) {
	const done = new Set(s.completed);
	const doneDays = p.days.filter((d) => done.has(d.day));
	const stamps = Object.values(s.completedAt ?? {}).sort();
	let nextDay = 0;
	while (done.has(nextDay)) nextDay += 1;
	const totalActivities = p.days.reduce((n, d) => n + d.steps.filter((st) => INTERACTIVE(st.view.ui)).length, 0);
	const activitiesDone = doneDays.reduce((n, d) => n + d.steps.filter((st) => INTERACTIVE(st.view.ui)).length, 0);
	const responses = doneDays.reduce((n, d) => n + dayResponses(p, s, d.day).length, 0);
	const finished = p.days.every((d) => done.has(d.day));
	return {
		started: done.size > 0,
		finished,
		...stamps[0] ? { startedAt: stamps[0] } : {},
		...finished && stamps.at(-1) ? { finishedAt: stamps.at(-1) } : {},
		...stamps.at(-1) ? { lastAt: stamps.at(-1) } : {},
		daysDone: doneDays.length,
		totalDays: p.days.length,
		activitiesDone,
		totalActivities,
		responses,
		topics: [...new Set(doneDays.map((d) => d.title).filter((t) => t && !/^(assessment|onboarding)$/i.test(t)))],
		nextDay,
		seconds: doneDays.reduce((n, d) => n + (s.time?.[String(d.day)]?.total ?? 0), 0),
		helpful: avg(doneDays.map((d) => s.feedback?.[String(d.day)]?.helpful)),
		feel: avg(doneDays.map((d) => s.feedback?.[String(d.day)]?.feel))
	};
}
var avg = (xs) => {
	const v = xs.filter((x) => typeof x === "number");
	return v.length ? v.reduce((n, x) => n + x, 0) / v.length : null;
};
var shortDate = (iso) => new Date(iso).toLocaleDateString("en-IN", {
	day: "numeric",
	month: "short"
});
var text = (v) => Array.isArray(v) ? v.join(", ") : typeof v === "boolean" ? v ? "Yes" : "No" : v === null || v === void 0 ? "" : String(v);
/** Everything written or chosen on one day, block by block, in the order the day runs. */
function dayResponses(p, s, dayNumber) {
	const day = p.days.find((d) => d.day === dayNumber);
	if (!day) return [];
	const out = [];
	const answers = s.answers;
	for (const step of day.steps) {
		const v = step.view;
		const k = answerKey(step.block, dayNumber);
		const lines = [];
		switch (v.ui) {
			case "choice": {
				const a = text(answers[k]);
				if (a) lines.push(a);
				const other = text(answers[`${k}#other`]);
				if (other) lines.push(other);
				break;
			}
			case "scale":
				if (typeof answers[k] === "number") lines.push(`${answers[k]} on a scale of ${v.min} to ${v.max}`);
				break;
			case "text":
				if (text(answers[k])) lines.push(text(answers[k]));
				break;
			case "conclude":
				if (text(answers[`${k}@${dayNumber}`])) lines.push(text(answers[`${k}@${dayNumber}`]));
				break;
			case "statements":
				for (const st of v.statements) {
					const a = text(answers[`${k}:${st}`]);
					if (a) lines.push(`${st}: ${a}`);
				}
				break;
			case "sort":
				for (const item of v.items) for (const line of item.lines) {
					const a = text(answers[`${k}:${item.situation}:${line}`]);
					if (a) lines.push(`${line}: ${a}`);
				}
				break;
			case "entries":
			case "review": {
				const fields = v.ui === "entries" ? v.fields : [...v.addFields ?? [], ...v.fields];
				for (const e of s.collections[v.collection] ?? []) {
					if (e.day !== dayNumber) continue;
					const parts = fields.map((f) => {
						const val = text(e.values[f.key]);
						return val ? f.label ? `${f.label}: ${val}` : val : "";
					}).filter(Boolean);
					if (parts.length) lines.push(parts.join(" · "));
				}
				break;
			}
			case "tracker": {
				const t = s.tracker[String(dayNumber)] ?? {};
				const ticked = Object.values(t).filter(Boolean).length;
				if (ticked) lines.push(`${ticked} ticked off`);
				break;
			}
			case "diary": if (s.diary[String(dayNumber)]) lines.push("Sleep diary filled in");
		}
		if (lines.length) out.push({
			title: step.block.title,
			lines
		});
	}
	return [...out, ...s.legacy?.[String(dayNumber)] ?? []];
}
/** The assessment that measures what each programme works on, for "see how things have changed". */
var relatedAssessment = {
	"sleep-tight": "struggling-with-quality-sleep",
	unburn: "feeling-drained-and-burned-out",
	"stress-buster": "feeling-worried-and-stressed"
};
/** Finished runs of a programme, newest first. A run still in progress is never part of history. */
function completedRuns(p, s) {
	const current = journeyOf(p, s);
	const archived = (s.runs ?? []).map((r) => ({
		...journeyOf(p, r),
		state: r
	}));
	return [...current.finished ? [{
		...current,
		state: s
	}] : [], ...archived];
}
/** The run a result or diary should show: a finished run by index (0 is the latest), else the one
* in progress, else the latest finished one. */
function latestRun(p, s, run) {
	if (run !== void 0 && s.runs?.[run]) return s.runs[run];
	return s.completed.length ? s : s.runs?.[0] ?? s;
}
/** Search param for a specific finished run: ?run=0 is the latest. */
var runParam = (v) => {
	const n = Number(v);
	return Number.isInteger(n) && n >= 0 ? n : void 0;
};
//#endregion
export { relatedAssessment as a, latestRun as i, dayResponses as n, runParam as o, journeyOf as r, shortDate as s, completedRuns as t };
