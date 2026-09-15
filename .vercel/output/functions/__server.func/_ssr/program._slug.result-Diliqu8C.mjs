import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as Illustration } from "./art-CKGIg2zx.mjs";
import { r as getAssessment } from "./store-CsxAZBJN.mjs";
import { a as getProgramme, p as useProgramme, s as programmes } from "./programs-DrKO9d_v.mjs";
import { i as dayKey, s as moodScale } from "./journal-Cd2_QpOm.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { At as CircleCheck, B as Moon, Dt as Clock3, L as NotebookText, M as Quote, Mt as ChevronRight, R as NotebookPen, Ut as Brain, X as ListChecks, Xt as BedDouble, Y as ListTodo, _ as Sparkles, at as History, d as TrendingUp, f as TrendingDown, g as Star, h as Target, it as Hourglass, k as Scale, mt as Flame, n as X, ot as Heart, u as Trophy, vt as Eye, wt as CloudRain, zt as CalendarDays } from "../_libs/lucide-react.mjs";
import { _ as slugOf, b as useHydrated, f as resources, t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { f as TopAppBar, m as stateLayer, n as Button, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { n as Bento } from "./about-bd7iLj4d.mjs";
import { t as DateText } from "./date-text-HAjSU3S3.mjs";
import { n as PrintHeader, r as ShareButton, t as BrandTitle } from "./result-share-Dh_gwfrl.mjs";
import { a as relatedAssessment, i as latestRun, r as journeyOf } from "./journey-Muau11lk.mjs";
import { t as formatSeconds } from "./use-active-time-01xzO_vL.mjs";
import { r as nightMetrics, t as formatDuration } from "./metrics-Gs7QyLlC.mjs";
import { t as Route } from "./program._slug.result-BQI2EaYR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/program._slug.result-Diliqu8C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Development only: a complete sample run (never saved) so every section of the result shows. */
function demoRun(p, variant = 0) {
	const start = Date.now() - (p.days.length + variant * 60) * 864e5;
	const v = variant;
	const at = (day) => new Date(start + day * 864e5 + 72e6).toISOString();
	const answers = {};
	const collections = {};
	const diary = {};
	const tracker = {};
	const lines = [
		"I sleep better when my phone stays out of the bedroom.",
		"Writing worries down before bed makes them feel smaller.",
		"A short walk after lunch helps my afternoons."
	];
	for (const d of p.days) for (const st of d.steps) {
		const v = st.view;
		const k = st.block.key ?? `${d.day}.${st.block.n}`;
		if (v.ui === "choice" && v.multi) answers[k] = v.options.slice(0, 3).map((o) => o.label);
		if (v.ui === "conclude") answers[`${k}@${d.day}`] = lines[d.day % lines.length];
		if ((v.ui === "entries" || v.ui === "review") && (collections[v.collection]?.length ?? 0) < 6) collections[v.collection] = [...collections[v.collection] ?? [], {
			id: `${v.collection}-${d.day}`,
			day: d.day,
			createdAt: at(d.day),
			values: Object.fromEntries((v.ui === "entries" ? v.fields : [...v.addFields ?? [], ...v.fields]).map((f) => [f.key, f.type === "yesno" ? true : /status/i.test(f.label) ? "Done" : "Sample"]))
		}];
		if (v.ui === "diary") {
			const late = d.day / p.days.length;
			diary[String(d.day)] = {
				bed: "23:00",
				tried: "23:15",
				latency: Math.round(40 - late * 25),
				awake: Math.round(35 - late * 25),
				woke: "06:30",
				up: "06:45",
				quality: Math.min(5, 2 + Math.round(late * 3))
			};
		}
		if (v.ui === "tracker") tracker[String(d.day)] = {
			a: true,
			b: d.day % 3 !== 0
		};
	}
	if (collections["habits"] === void 0 && p.slug === "sleep-tight") collections["habits"] = [{
		id: "a",
		day: 18,
		createdAt: at(18),
		values: {}
	}, {
		id: "b",
		day: 18,
		createdAt: at(18),
		values: {}
	}];
	return {
		completed: p.days.map((d) => d.day),
		completedAt: Object.fromEntries(p.days.map((d) => [String(d.day), at(d.day)])),
		answers,
		collections,
		diary,
		tracker,
		time: Object.fromEntries(p.days.map((d) => [String(d.day), {
			total: 300 + v * 90 + d.day * 97 % 300,
			steps: {}
		}])),
		feedback: Object.fromEntries(p.days.map((d) => [String(d.day), {
			helpful: Math.max(1, Math.min(5, 3 - Math.min(v, 1) + Math.round(d.day / p.days.length * 2))),
			feel: Math.max(1, Math.min(5, 2 - Math.min(v, 1) + Math.round(d.day / p.days.length * 2))),
			at: at(d.day)
		}]))
	};
}
var answerKey = (b, day) => b.key ?? `${day}.${b.n}`;
var avg = (xs) => xs.length ? xs.reduce((n, x) => n + x, 0) / xs.length : null;
var DAY = 864e5;
function programmeSummary(p, s) {
	const done = new Set(s.completed);
	const doneDays = p.days.filter((d) => done.has(d.day));
	const stamps = Object.values(s.completedAt ?? {}).sort();
	const startedAt = stamps[0] ?? null;
	const finishedAt = p.days.every((d) => done.has(d.day)) ? stamps.at(-1) ?? null : null;
	const dates = [...new Set(stamps.map((t) => dayKey(new Date(t))))].sort();
	let longestStreak = 0;
	let run = 0;
	dates.forEach((d, i) => {
		const prev = dates[i - 1];
		run = prev && new Date(d).getTime() - new Date(prev).getTime() === DAY ? run + 1 : 1;
		longestStreak = Math.max(longestStreak, run);
	});
	const perDay = doneDays.map((d) => s.time?.[String(d.day)]?.total ?? 0).filter((x) => x > 0);
	const seconds = perDay.reduce((n, x) => n + x, 0);
	const fb = doneDays.map((d) => ({
		d,
		f: s.feedback?.[String(d.day)]
	})).filter((x) => x.f);
	const helpfulRatings = fb.map((x) => x.f.helpful).filter((x) => !!x);
	const feels = fb.filter((x) => x.f.feel);
	const third = Math.max(1, Math.floor(feels.length / 3));
	const choices = [];
	const collections = /* @__PURE__ */ new Map();
	const words = [];
	for (const d of doneDays) for (const st of d.steps) {
		const v = st.view;
		const k = answerKey(st.block, d.day);
		if (v.ui === "choice" && v.multi && d.day > 0) {
			const a = s.answers[k];
			const picked = (Array.isArray(a) ? a : typeof a === "string" && a ? [a] : []).filter((x) => !/^other$/i.test(x));
			const other = s.answers[`${k}#other`];
			if (typeof other === "string" && other.trim()) picked.push(other.trim());
			if (picked.length) choices.push({
				day: d.day,
				title: st.block.title,
				picked
			});
		}
		if ((v.ui === "entries" || v.ui === "review") && !collections.has(v.collection)) collections.set(v.collection, st.block.title);
		if (v.ui === "conclude") {
			const t = s.answers[`${k}@${d.day}`];
			if (typeof t === "string" && t.trim()) words.push({
				day: d.day,
				text: t.trim()
			});
		}
	}
	for (const d of doneDays) for (const b of s.legacy?.[String(d.day)] ?? []) {
		if (!/conclusion|reflection|takeaway|note/i.test(b.title)) continue;
		const text = b.lines.join(" ").trim();
		if (text.length > 3) words.push({
			day: d.day,
			text
		});
	}
	words.sort((a, b) => a.day - b.day);
	const starting = [];
	let statedSleepHours = null;
	const first = p.days.find((d) => d.day === 0);
	for (const st of first?.steps ?? []) {
		const v = st.view;
		const k = answerKey(st.block, 0);
		const a = s.answers[k];
		if (a === void 0 || a === "" || Array.isArray(a) && !a.length) continue;
		if (v.ui === "scale" && typeof a === "number") {
			if (/sleep/i.test(st.block.title)) statedSleepHours = a;
			starting.push({
				title: st.block.title,
				value: `${a}${/sleep|duration/i.test(st.block.title) ? " hours" : ""}`
			});
		} else if (v.ui === "choice" || v.ui === "text") starting.push({
			title: st.block.title,
			value: Array.isArray(a) ? a.join(", ") : String(a)
		});
	}
	const tallies = [];
	const seenField = /* @__PURE__ */ new Set();
	for (const d of p.days) for (const st of d.steps) {
		const v = st.view;
		if (v.ui !== "entries" && v.ui !== "review") continue;
		const fields = v.ui === "entries" ? v.fields : [...v.addFields ?? [], ...v.fields];
		for (const f of fields) {
			const id = `${v.collection}:${f.key}`;
			if (seenField.has(id) || !(f.options?.length || f.type === "yesno")) continue;
			seenField.add(id);
			const counts = /* @__PURE__ */ new Map();
			for (const e of s.collections[v.collection] ?? []) {
				const val = e.values[f.key];
				if (val === null || val === void 0 || val === "") continue;
				const label = typeof val === "boolean" ? val ? "Yes" : "No" : String(val);
				counts.set(label, (counts.get(label) ?? 0) + 1);
			}
			if (counts.size) tallies.push({
				log: collections.get(v.collection) ?? st.block.title,
				field: f.label || st.block.title,
				counts: [...counts.entries()].map(([option, count]) => ({
					option,
					count
				})).sort((a, b) => b.count - a.count)
			});
		}
	}
	const built = [...collections.entries()].map(([c, title]) => ({
		title,
		count: (s.collections[c] ?? []).length
	})).filter((b) => b.count > 0);
	const habitCount = (s.collections["habits"] ?? []).length;
	const trackedDays = Object.keys(s.tracker ?? {});
	const ticks = trackedDays.reduce((n, d) => n + Object.values(s.tracker[d] ?? {}).filter(Boolean).length, 0);
	const trackedIds = new Set(trackedDays.flatMap((d) => Object.keys(s.tracker[d] ?? {})));
	const habitTotal = Math.max(habitCount, trackedIds.size);
	const habits = habitTotal && trackedDays.length ? {
		count: habitTotal,
		rate: Math.min(100, Math.round(ticks / (habitTotal * trackedDays.length) * 100))
	} : null;
	const nights = Object.entries(s.diary ?? {}).map(([day, e]) => ({
		day: Number(day),
		m: nightMetrics(e),
		q: e.quality
	})).sort((a, b) => a.day - b.day);
	const withM = nights.filter((n) => n.m);
	const early = withM.slice(0, 7);
	const late = withM.slice(-7);
	const sleep = nights.length ? {
		nights: nights.length,
		asleep: avg(withM.map((n) => n.m.asleep)),
		efficiencyEarly: withM.length >= 4 ? avg(early.map((n) => n.m.efficiency)) : null,
		efficiencyLate: withM.length >= 8 ? avg(late.map((n) => n.m.efficiency)) : null,
		qualityEarly: avg(nights.slice(0, 7).map((n) => n.q).filter((q) => !!q)),
		qualityLate: nights.length >= 8 ? avg(nights.slice(-7).map((n) => n.q).filter((q) => !!q)) : null
	} : null;
	const units = p.source.units.map((u, i) => {
		const days = u.days.map((d) => d.day);
		return {
			title: u.title,
			focus: p.source.schedule[i]?.Focus ?? "",
			done: days.filter((d) => done.has(d)).length,
			total: days.length
		};
	}).filter((u) => u.total > 0);
	return {
		startedAt,
		finishedAt,
		spanDays: startedAt && stamps.at(-1) ? Math.max(1, Math.round((new Date(stamps.at(-1)).getTime() - new Date(startedAt).getTime()) / DAY) + 1) : 0,
		daysDone: doneDays.length,
		totalDays: p.days.length,
		daysActive: dates.length,
		longestStreak,
		seconds,
		secondsPerDay: perDay.length ? seconds / perDay.length : null,
		helpful: avg(helpfulRatings),
		helpfulDays: helpfulRatings.length,
		feelEarly: feels.length >= 2 ? avg(feels.slice(0, third).map((x) => x.f.feel)) : null,
		feelLate: feels.length >= 2 ? avg(feels.slice(-third).map((x) => x.f.feel)) : null,
		mostHelpful: fb.filter((x) => x.f.helpful && x.f.helpful >= 4).sort((a, b) => b.f.helpful - a.f.helpful).slice(0, 3).map((x) => ({
			day: x.d.day,
			title: x.d.title,
			rating: x.f.helpful
		})),
		choices,
		built,
		habits,
		sleep,
		words: words.slice(-3).reverse(),
		units,
		starting,
		tallies,
		statedSleepHours,
		timeline: {
			start: startedAt,
			end: stamps.at(-1) ?? null
		}
	};
}
/** Each programme's own story, from the logs and choices it records. Tiles with no data are left out. */
function programmeHighlights(p, s) {
	const fields = /* @__PURE__ */ new Map();
	for (const d of p.days) for (const st of d.steps) {
		const v = st.view;
		if (v.ui !== "entries" && v.ui !== "review") continue;
		const list = fields.get(v.collection) ?? [];
		for (const f of v.ui === "entries" ? v.fields : [...v.addFields ?? [], ...v.fields]) if (!list.some((x) => x.key === f.key)) list.push({
			key: f.key,
			label: f.label
		});
		fields.set(v.collection, list);
	}
	const entries = (c) => s.collections[c] ?? [];
	const count = (...cs) => cs.reduce((n, c) => n + entries(c).length, 0);
	const keyOf = (c, label) => fields.get(c)?.find((f) => label.test(f.label))?.key;
	const filled = (c, label) => {
		const k = keyOf(c, label);
		return k ? entries(c).filter((e) => `${e.values[k] ?? ""}`.trim()).length : 0;
	};
	const matching = (c, label, value) => {
		const k = keyOf(c, label);
		return k ? entries(c).filter((e) => {
			const v = e.values[k];
			return typeof v === "boolean" ? v && value.test("yes") : value.test(`${v ?? ""}`);
		}).length : 0;
	};
	const picked = (day, title) => {
		const st = p.days.find((x) => x.day === day)?.steps.find((x) => title.test(x.block.title));
		if (!st) return 0;
		const a = s.answers[st.block.key ?? `${day}.${st.block.n}`];
		return Array.isArray(a) ? a.length : a ? 1 : 0;
	};
	const tiles = [];
	const n = (x, one, many) => `${x} ${x === 1 ? one : many}`;
	const add = (n, icon, label, text) => {
		if (n > 0) tiles.push({
			icon,
			label,
			text
		});
	};
	if (p.slug === "unburn") {
		const signs = picked(1, /indicator/i);
		add(signs, "signs", n(signs, "sign", "signs"), "of burnout you noticed at the start");
		add(count("tf_log"), "log", n(count("tf_log"), "entry", "entries"), "in your thought and feeling log");
		const efforts = count("efforts");
		const aligned = matching("efforts", /align/i, /yes/i);
		add(efforts, "goal", n(efforts, "effort", "efforts"), aligned ? `weighed against your goals, ${aligned} aligned` : "weighed against their rewards");
		add(count("goals"), "check", n(count("goals"), "goal", "goals"), "with your own measures of success");
		add(count("worries"), "worry", n(count("worries"), "worry", "worries"), "written down and set aside");
		const tasks = count("tasks");
		const doneTasks = matching("tasks", /status/i, /done|complete|finish/i);
		add(tasks, "task", doneTasks ? `${doneTasks} of ${tasks}` : n(tasks, "task", "tasks"), doneTasks ? "tasks you took up and finished" : "tasks you took up");
		add(filled("perfectionism", /realistic goal/i), "scale", n(filled("perfectionism", /realistic goal/i), "situation", "situations"), "where you set a realistic goal instead of a perfect one");
		const good = count("good_things", "grateful");
		add(good, "heart", n(good, "good thing", "good things"), "and things you’re grateful for");
		return {
			title: "Your burnout reset",
			tiles
		};
	}
	if (p.slug === "stress-buster") {
		const signs = picked(2, /stress and you/i);
		add(signs, "signs", n(signs, "sign", "signs"), "of how stress shows up in you");
		add(count("recent_stressors"), "worry", n(count("recent_stressors"), "stressor", "stressors"), "you named at the start");
		const demands = count("demands");
		const resources = count("resources");
		if (demands || resources) tiles.push({
			icon: "scale",
			label: `${demands} vs ${resources}`,
			text: "demands against the resources you have"
		});
		const thoughts = count("thought_log");
		const challenged = filled("thought_log", /alternate/i);
		add(thoughts, "brain", challenged ? `${challenged} of ${thoughts}` : n(thoughts, "thought", "thoughts"), challenged ? "logged thoughts you challenged with an alternative" : "logged in your thought log");
		add(count("worries"), "log", n(count("worries"), "worry", "worries"), "emptied from your mind");
		const good = count("good_things", "grateful", "joy");
		add(good, "heart", n(good, "moment", "moments"), "of joy, good things and gratitude");
		return {
			title: "Your stress toolkit",
			tiles
		};
	}
	return null;
}
var longDate = (iso) => new Date(iso).toLocaleDateString("en-IN", {
	day: "numeric",
	month: "short",
	year: "numeric"
});
function ResultPage() {
	const { slug } = Route.useLoaderData();
	const { done, demo, run } = Route.useSearch();
	const p = getProgramme(slug);
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const real = latestRun(p, useProgramme(slug).state, run);
	const state = demo ? demoRun(p, run ?? 0) : real;
	const j = journeyOf(p, state);
	const sum = programmeSummary(p, state);
	const highlights = programmeHighlights(p, state);
	const [celebrate, setCelebrate] = (0, import_react.useState)(Boolean(done));
	const related = getAssessment(relatedAssessment[slug] ?? "");
	const article = resources.find((r) => r.assessment === related?.slug) ?? resources.find((r) => r.category === (slug === "sleep-tight" ? "Sleep" : "Stress"));
	(0, import_react.useEffect)(() => {
		if (!celebrate) return;
		const t = setTimeout(() => setCelebrate(false), 3e3);
		return () => clearTimeout(t);
	}, [celebrate]);
	const shareText = [
		`${p.name} (iKAN Equip program)`,
		sum.timeline.start ? `${new Date(sum.timeline.start).toDateString()}${sum.timeline.end ? ` to ${new Date(sum.timeline.end).toDateString()}` : ""}` : "",
		`${sum.daysDone} of ${sum.totalDays} days done, ${sum.daysActive} days active`,
		sum.seconds ? `Time spent: ${formatSeconds(sum.seconds)}` : "",
		sum.helpful !== null ? `Sessions rated ${sum.helpful.toFixed(1)} out of 5 for helpfulness` : "",
		sum.sleep?.efficiencyEarly != null && sum.sleep.efficiencyLate != null ? `Sleep efficiency: ${Math.round(sum.sleep.efficiencyEarly)}% to ${Math.round(sum.sleep.efficiencyLate)}%` : "",
		sum.units.length ? `What I learnt: ${sum.units.map((u) => u.title).join(", ")}` : ""
	].filter(Boolean).join("\n");
	const bar = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, {
		leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
			label: "Close",
			onClick: () => navigate({
				to: "/program/$slug",
				params: { slug }
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-6 w-6" })
		}),
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandTitle, {}),
		trailing: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareButton, {
			subject: `${p.name}: my iKAN program result`,
			body: shareText
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/history/program/$slug",
			params: { slug },
			"aria-label": "Program history",
			className: cn("grid h-12 w-12 place-items-center rounded-full", stateLayer),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-6 w-6" })
		})] })
	});
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: bar });
	if (!j.started) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle(p.accent),
		children: [bar, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-6 pt-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-[22px] font-semibold",
					children: "No result yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-[15px] text-muted-foreground",
					children: [
						"Finish all ",
						p.days.length,
						" days of ",
						p.name,
						" to see your result here."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "mt-6",
					onClick: () => navigate({
						to: "/program/$slug",
						params: { slug }
					}),
					children: ["Go to ", p.name]
				})
			]
		})]
	}) });
	const feel = (v) => v ? moodScale[Math.round(v) - 1] : void 0;
	const sleepChange = sum.sleep?.efficiencyEarly != null && sum.sleep.efficiencyLate != null ? sum.sleep.efficiencyLate - sum.sleep.efficiencyEarly : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle(p.accent),
		children: [
			celebrate && j.finished ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setCelebrate(false),
				className: "fixed inset-0 z-[95] grid place-items-center bg-background/90 backdrop-blur-sm",
				"aria-label": "Close celebration",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-auto grid h-28 w-28 place-items-center rounded-full bg-[var(--accent)] text-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-14 w-14" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-4 block font-display text-[32px] font-semibold",
							children: "Congratulations!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 block text-[17px]",
							children: [
								"You’ve completed ",
								p.name,
								"!"
							]
						})
					]
				})
			}) : null,
			bar,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintHeader, { title: `${p.name} result` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-fade pb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "px-4 pt-2",
						children: [
							sum.timeline.start ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DateText, { children: [longDate(sum.timeline.start), sum.timeline.end && sum.timeline.end !== sum.timeline.start ? ` to ${longDate(sum.timeline.end)}` : ""] })
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 font-display text-[28px] font-semibold leading-9",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 flex flex-wrap gap-x-3 text-[14px] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [sum.totalDays, " days"] }),
									sum.seconds ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatSeconds(sum.seconds), " spent"] }) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										sum.daysActive,
										" ",
										sum.daysActive === 1 ? "day" : "days",
										" active"
									] })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mx-4 mt-5 rounded-[28px] bg-[var(--accent-container)] p-5 text-[var(--on-accent-container)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[14px] font-medium",
								children: "Equip program result"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-display text-[34px] font-bold leading-10",
								children: j.finished ? "Completed" : `${Math.round(sum.daysDone / sum.totalDays * 100)}% done`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[15px] tabular-nums",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold",
									children: [
										sum.daysDone,
										" of ",
										sum.totalDays,
										" days"
									]
								}), sum.spanDays > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "opacity-80",
									children: [
										", over ",
										sum.spanDays,
										" days"
									]
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitBar, { units: sum.units }),
							sum.feelEarly !== null && sum.feelLate !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 flex items-center gap-2 text-[15px] leading-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[22px]",
										"aria-hidden": "true",
										children: feel(sum.feelEarly)?.emoji
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 opacity-60" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[22px]",
										"aria-hidden": "true",
										children: feel(sum.feelLate)?.emoji
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"After sessions you went from feeling ",
										feel(sum.feelEarly)?.label.toLowerCase(),
										" to",
										" ",
										feel(sum.feelLate)?.label.toLowerCase(),
										"."
									] })
								]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-6 px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-[16px] font-semibold",
							children: "Time and consistency"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bento, {
								colored: true,
								items: [
									...sum.seconds ? [{
										icon: Clock3,
										label: formatSeconds(sum.seconds),
										text: sum.secondsPerDay ? `spent, about ${formatSeconds(sum.secondsPerDay)} a day` : "spent"
									}] : [],
									{
										icon: CalendarDays,
										label: `${sum.daysActive} of ${sum.totalDays}`,
										text: "days active"
									},
									...sum.longestStreak > 1 ? [{
										icon: Flame,
										label: `${sum.longestStreak} days`,
										text: "longest streak"
									}] : [],
									...sum.spanDays ? [{
										icon: Hourglass,
										label: `${sum.spanDays} days`,
										text: "from first day to last"
									}] : []
								]
							})
						})]
					}),
					sum.helpful !== null || sum.mostHelpful.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rows, {
						title: "How your sessions went",
						rows: [sum.helpful !== null ? {
							label: "Helpfulness",
							value: `${sum.helpful.toFixed(1)} / 5`,
							note: `from ${sum.helpfulDays} ${sum.helpfulDays === 1 ? "session" : "sessions"} you rated`
						} : null, ...sum.mostHelpful.map((d) => ({
							label: `Day ${d.day}: ${d.title}`,
							value: `${d.rating} / 5`,
							note: "one of your most helpful days"
						}))]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-6 px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-[16px] font-semibold",
							children: "What you learnt"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 overflow-hidden rounded-[20px] bg-secondary",
							children: sum.units.map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: cn("px-4 py-3", i > 0 && "border-t border-background"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "min-w-0 flex-1 text-[15px] font-medium leading-6",
										children: u.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[13px] tabular-nums text-muted-foreground",
										children: [
											u.done,
											"/",
											u.total
										]
									})]
								}), u.focus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[13px] leading-5 text-muted-foreground",
									children: u.focus
								}) : null]
							}, u.title))
						})]
					}),
					sum.sleep ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-6 px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-[16px] font-semibold",
							children: "Your sleep"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bento, {
								colored: true,
								offset: 1,
								items: [
									{
										icon: Moon,
										label: `${sum.sleep.nights} nights`,
										text: "logged in your sleep diary"
									},
									...sum.sleep.asleep ? [{
										icon: BedDouble,
										label: formatDuration(sum.sleep.asleep),
										text: sum.statedSleepHours !== null ? `asleep a night on average (you said ${sum.statedSleepHours} h)` : "asleep a night on average"
									}] : [],
									...sum.sleep.efficiencyEarly != null && sum.sleep.efficiencyLate != null ? [{
										icon: (sleepChange ?? 0) >= 0 ? TrendingUp : TrendingDown,
										label: `${Math.round(sum.sleep.efficiencyEarly)}% → ${Math.round(sum.sleep.efficiencyLate)}%`,
										text: "of time in bed asleep, first week to last"
									}] : [],
									...sum.sleep.qualityEarly != null && sum.sleep.qualityLate != null ? [{
										icon: Star,
										label: `${sum.sleep.qualityEarly.toFixed(1)} → ${sum.sleep.qualityLate.toFixed(1)}`,
										text: "sleep quality out of 5, first week to last"
									}] : [],
									...sum.habits ? [{
										icon: ListChecks,
										label: `${sum.habits.rate}%`,
										text: `habit check-ins done, ${sum.habits.count} ${sum.habits.count === 1 ? "habit" : "habits"}`
									}] : []
								]
							})
						})]
					}) : null,
					highlights && highlights.tiles.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-6 px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-[16px] font-semibold",
							children: highlights.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bento, {
								colored: true,
								offset: 2,
								items: highlights.tiles.map((t) => ({
									icon: highlightIcons[t.icon],
									label: t.label,
									text: t.text
								}))
							})
						})]
					}) : null,
					sum.starting.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rows, {
						title: "Where you started",
						rows: sum.starting.map((x) => ({
							label: x.title,
							value: x.value,
							wide: true
						}))
					}) : null,
					sum.built.length || sum.tallies.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rows, {
						title: "From your logs",
						rows: [...sum.built.map((b) => ({
							label: b.title,
							value: `${b.count} ${b.count === 1 ? "entry" : "entries"}`
						})), ...sum.tallies.map((t) => ({
							label: t.field,
							value: t.counts.map((c) => `${c.option} ${c.count}`).join(" · "),
							note: t.log,
							wide: true
						}))]
					}) : null,
					sum.choices.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-6 px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-[16px] font-semibold",
							children: "What you noticed"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 space-y-4 rounded-[20px] bg-secondary p-4",
							children: sum.choices.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[13px] text-muted-foreground",
								children: [
									"Day ",
									c.day,
									" · ",
									c.title
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-1.5",
								children: c.picked.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-background px-3 py-1.5 text-[13px]",
									children: x
								}, x))
							})] }, `${c.day}-${c.title}`))
						})]
					}) : null,
					sum.words.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-6 px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-[16px] font-semibold",
							children: "In your words"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2",
							children: sum.words.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-[20px] bg-secondary p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { className: "h-4 w-4 text-[var(--accent-strong)]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-[15px] leading-6",
										children: w.text
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-[12px] text-muted-foreground",
										children: ["Day ", w.day]
									})
								]
							}, `${w.day}-${w.text}`))
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-8 px-4 print:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-[16px] font-semibold",
							children: "What’s next"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-3",
							children: [
								related ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/assessments/$slug",
									params: { slug: related.slug },
									className: cn("flex items-center gap-3 rounded-[20px] bg-secondary p-3 pr-4", stateLayer),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "h-16 w-16 shrink-0 overflow-hidden rounded-[14px]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art: "measure" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-[12px] font-semibold text-[var(--accent-strong)]",
													children: "Assessment"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-[15px] font-semibold leading-5",
													children: related.title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "block text-[13px] text-muted-foreground",
													children: [
														related.questions.length,
														" questions, about ",
														related.minutes,
														" min"
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
									]
								}) }) : null,
								article ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/resources/$slug",
									params: { slug: slugOf(article) },
									className: cn("flex items-center gap-3 rounded-[20px] bg-secondary p-3 pr-4", stateLayer),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "h-16 w-16 shrink-0 overflow-hidden rounded-[14px]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art: article.art })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "block text-[12px] font-semibold text-[var(--accent-strong)]",
												children: [
													"Read · ",
													article.minutes,
													" min"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "line-clamp-2 text-[15px] font-semibold leading-5",
												children: article.title
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
									]
								}) }) : null,
								programmes.filter((x) => x.slug !== slug).slice(0, 1).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/program/$slug",
									params: { slug: o.slug },
									style: accentStyle(o.accent),
									className: cn("flex items-center gap-3 rounded-[20px] bg-secondary p-3 pr-4", stateLayer),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: o.cover,
											alt: "",
											className: "h-16 w-16 shrink-0 rounded-[14px] object-cover"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-[12px] font-semibold text-[var(--accent-strong)]",
													children: "Program"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-[15px] font-semibold leading-5",
													children: o.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "line-clamp-1 text-[13px] text-muted-foreground",
													children: o.source.description
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
									]
								}) }, o.slug))
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex gap-3 px-4 print:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outlined",
							className: "flex-1",
							onClick: () => navigate({ to: "/program" }),
							children: "Explore programs"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "flex-1",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotebookPen, { className: "h-4 w-4" }),
							onClick: () => navigate({
								to: "/diaries/$slug",
								params: { slug },
								search: run !== void 0 ? { run } : {}
							}),
							children: "Learning diary"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-6 max-w-xs px-4 text-center text-[12px] leading-5 text-muted-foreground",
						children: "A self-help program, not medical treatment. iKAN supports, but never replaces, care from a qualified professional."
					})
				]
			})
		]
	}) });
}
var highlightIcons = {
	signs: Eye,
	log: NotebookText,
	goal: Target,
	check: CircleCheck,
	worry: CloudRain,
	task: ListTodo,
	sparkle: Sparkles,
	heart: Heart,
	scale: Scale,
	brain: Brain
};
/** A titled list of label and value rows, like the scores on an assessment result. */
function Rows({ title, rows }) {
	const shown = rows.filter((r) => r !== null);
	if (!shown.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-[16px] font-semibold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 overflow-hidden rounded-[20px] bg-secondary",
			children: shown.map((r, i) => {
				const Trend = r.trend ? r.trend > 0 ? TrendingUp : TrendingDown : null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cn("px-4 py-3", i > 0 && "border-t border-background", !r.wide && "flex items-start gap-3"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("text-[15px] leading-6", r.wide ? "text-muted-foreground" : "font-medium"),
								children: r.label
							}), r.note && !r.wide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] leading-5 text-muted-foreground",
								children: r.note
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: cn("inline-flex items-center gap-1.5 tabular-nums", r.wide ? "mt-0.5 text-[15px] font-medium leading-6" : "shrink-0 text-right text-[15px] font-semibold"),
							children: [Trend ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trend, { className: "h-4 w-4 text-[var(--accent-strong)]" }) : null, r.value]
						}),
						r.note && r.wide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[13px] leading-5 text-muted-foreground",
							children: r.note
						}) : null
					]
				}, `${r.label}-${i}`);
			})
		})]
	});
}
/** The programme as unit segments, filled where the days were done (like a result range bar). */
function UnitBar({ units }) {
	const total = units.reduce((n, u) => n + u.total, 0) || 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-5 flex h-3 w-full gap-[3px]",
		"aria-hidden": "true",
		children: units.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "h-full overflow-hidden rounded-full bg-background/60",
			style: { width: `${u.total / total * 100}%` },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block h-full rounded-full bg-[var(--accent-strong)]",
				style: { width: `${u.done / u.total * 100}%` }
			})
		}, u.title))
	});
}
//#endregion
export { ResultPage as component };
