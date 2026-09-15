import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as energyScale, c as streaks, i as dayKey, l as stressScale, n as checkinSteps, r as contextTags, s as moodScale, t as addDays, u as useJournal } from "./journal-Cd2_QpOm.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ft as Check, at as History } from "../_libs/lucide-react.mjs";
import { t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { d as TextField, h as useSnack, l as Snackbar, m as stateLayer, n as Button, p as accentStyle } from "./m3-Blvbxy5D.mjs";
import { t as EntryCard } from "./entry-card-Bi6p6uFh.mjs";
import { t as Route } from "./journal-D6JsC5I0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/journal-BTzeL5MS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var useHydrated = () => (0, import_react.useSyncExternalStore)(() => () => {}, () => true, () => false);
var DAYS = 14;
function JournalPage() {
	const hydrated = useHydrated();
	const { mood: preset } = Route.useSearch();
	const journal = useJournal();
	const snack = useSnack();
	const today = /* @__PURE__ */ new Date();
	const todayKey = dayKey(today);
	const days = Array.from({ length: DAYS }, (_, i) => addDays(today, i - 13));
	const dates = new Set(journal.entries.map((e) => e.date));
	const { current, best } = streaks(dates, today);
	const avgOn = (key) => {
		const list = journal.on(key);
		return list.length ? list.reduce((n, e) => n + e.mood, 0) / list.length : null;
	};
	const daily = days.map((d) => avgOn(dayKey(d)));
	const logged = daily.filter((v) => v !== null);
	const average = logged.length ? logged.reduce((n, v) => n + v, 0) / logged.length : null;
	const entries = hydrated ? journal.on(todayKey) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle("mood"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative px-4 pb-1 pt-[max(1.25rem,env(safe-area-inset-top))]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/history/journal",
						"aria-label": "Journal history",
						className: cn(stateLayer, "absolute right-2 top-[max(0.75rem,env(safe-area-inset-top))] grid h-12 w-12 place-items-center rounded-full"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-[28px] font-semibold leading-9",
						children: "Journal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[14px] text-muted-foreground",
						children: "Track how you feel, one day at a time"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 grid grid-cols-2 gap-2 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					emoji: current > 0 ? "🔥" : "💤",
					label: "Current streak",
					value: hydrated ? current : 0
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					emoji: "🏆",
					label: "Best streak",
					value: hydrated ? best : 0
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-4 mt-2 rounded-[20px] bg-foreground/[0.035] px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-[16px] font-semibold",
						children: "14-day mood"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[14px] tabular-nums text-muted-foreground",
						children: hydrated && average !== null ? `Avg ${average.toFixed(1)}/5` : "No entries yet"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, { values: hydrated ? daily : [] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-[18px] font-semibold",
						children: "Today"
					}),
					hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckIn, {
						preset,
						countToday: journal.on(todayKey).length,
						onSave: (d) => journal.add(d)
					}) : null,
					entries.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-3",
						children: entries.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryCard, {
							entry: e,
							onDelete: () => {
								journal.remove(e.id);
								snack.show("Entry deleted");
							}
						}) }, e.id))
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Snackbar, { message: snack.message })
		]
	}) });
}
function Stat({ emoji, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 rounded-[20px] bg-foreground/[0.05] px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[24px] leading-none",
			"aria-hidden": "true",
			children: emoji
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-[12px] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "block font-display text-[20px] font-semibold tabular-nums",
			children: [
				value,
				" ",
				value === 1 ? "day" : "days"
			]
		})] })]
	});
}
function Sparkline({ values }) {
	const w = 320;
	const h = 56;
	const pad = 8;
	const pts = values.map((v, i) => v === null ? null : {
		x: pad + i * 304 / 13,
		y: pad + (5 - v) / 4 * 40
	});
	const segments = [];
	let run = [];
	pts.forEach((p) => {
		if (p) run.push(p);
		else if (run.length) {
			segments.push(run);
			run = [];
		}
	});
	if (run.length) segments.push(run);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${w} ${h}`,
		className: "mt-2 block h-auto w-full",
		role: "img",
		"aria-label": "Mood over the last 14 days, 1 to 5",
		children: [
			[
				1,
				3,
				5
			].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: pad,
				x2: 312,
				y1: pad + (5 - v) / 4 * 40,
				y2: pad + (5 - v) / 4 * 40,
				stroke: "currentColor",
				strokeOpacity: "0.08"
			}, v)),
			segments.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
				points: s.map((p) => `${p.x},${p.y}`).join(" "),
				fill: "none",
				stroke: "var(--accent)",
				strokeWidth: "2.5",
				strokeLinejoin: "round",
				strokeLinecap: "round"
			}, i)),
			pts.map((p, i) => p ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: p.x,
				cy: p.y,
				r: "4",
				fill: "var(--accent-strong)",
				stroke: "white",
				strokeWidth: "2"
			}, i) : null)
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-1 flex justify-between text-[11px] text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: addDays(/* @__PURE__ */ new Date(), -13).toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Today" })]
	})] });
}
var emptyDraft = (mood) => mood ? {
	mood,
	tags: []
} : { tags: [] };
function CheckIn({ preset, countToday, onSave }) {
	const [step, setStep] = (0, import_react.useState)(preset ? 1 : 0);
	const [draft, setDraft] = (0, import_react.useState)(emptyDraft(preset));
	const [saved, setSaved] = (0, import_react.useState)(false);
	const timer = (0, import_react.useRef)(void 0);
	(0, import_react.useEffect)(() => () => window.clearTimeout(timer.current), []);
	if (saved) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-fade mt-4 rounded-[28px] bg-[var(--accent-container)] p-6 text-center text-[var(--on-accent-container)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--accent-strong)] text-background",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "h-7 w-7",
					strokeWidth: 3
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-display text-[20px] font-semibold",
				children: "Check-in saved"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-[14px]",
				children: [
					countToday,
					" ",
					countToday === 1 ? "entry" : "entries",
					" logged today"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outlined",
				className: "mt-5 border-[var(--on-accent-container)]/30",
				onClick: () => {
					setDraft(emptyDraft());
					setStep(0);
					setSaved(false);
				},
				children: "Log another"
			})
		]
	});
	const current = checkinSteps[step];
	const last = step === checkinSteps.length - 1;
	const hasValue = current.key === "tags" ? draft.tags.length > 0 : current.key === "note" ? Boolean(draft.note?.trim()) : draft[current.key] !== void 0;
	const next = () => {
		window.clearTimeout(timer.current);
		if (!last) return setStep(step + 1);
		const entry = {
			mood: draft.mood,
			tags: draft.tags
		};
		if (draft.energy !== void 0) entry.energy = draft.energy;
		if (draft.stress !== void 0) entry.stress = draft.stress;
		if (draft.note?.trim()) entry.note = draft.note.trim();
		onSave(entry);
		setSaved(true);
	};
	const pick = (key, value) => {
		setDraft((d) => ({
			...d,
			[key]: value
		}));
		window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => setStep((s) => Math.min(s + 1, checkinSteps.length - 1)), 280);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 rounded-[24px] bg-secondary p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1.5",
				"aria-label": `Step ${step + 1} of ${checkinSteps.length}`,
				children: checkinSteps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 flex-1 rounded-full transition-colors", i <= step ? "bg-[var(--accent)]" : "bg-foreground/10") }, s.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-fade",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-display text-[20px] font-semibold leading-7",
						children: current.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[14px] text-muted-foreground",
						children: current.subtitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [
							current.key === "mood" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmojiScale, {
								scale: moodScale,
								value: draft.mood,
								onPick: (v) => pick("mood", v),
								label: current.title
							}) : null,
							current.key === "energy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmojiScale, {
								scale: energyScale,
								value: draft.energy,
								onPick: (v) => pick("energy", v),
								label: current.title
							}) : null,
							current.key === "stress" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmojiScale, {
								scale: stressScale,
								value: draft.stress,
								onPick: (v) => pick("stress", v),
								label: current.title
							}) : null,
							current.key === "note" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
								label: "",
								ariaLabel: current.title,
								value: draft.note ?? "",
								onChange: (note) => setDraft((d) => ({
									...d,
									note
								})),
								multiline: true,
								maxLength: 500,
								placeholder: "Write a line or two"
							}) : null,
							current.key === "tags" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: contextTags.map((t) => {
									const on = draft.tags.includes(t.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-pressed": on,
										onClick: () => setDraft((d) => ({
											...d,
											tags: on ? d.tags.filter((x) => x !== t.id) : [...d.tags, t.id]
										})),
										className: cn("inline-flex h-9 items-center gap-1.5 rounded-[8px] border px-3 text-[14px] font-medium transition-colors", stateLayer, on ? "border-transparent bg-[var(--accent-container)] text-[var(--on-accent-container)]" : "border-foreground/25"),
										children: [on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											"aria-hidden": "true",
											children: t.emoji
										}), t.label]
									}, t.id);
								})
							}) : null
						]
					})
				]
			}, current.key),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center gap-2",
				children: [
					step > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "text",
						onClick: () => setStep(step - 1),
						children: "Back"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex-1" }),
					last ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: next,
						children: "Save check-in"
					}) : current.required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: next,
						disabled: !hasValue,
						children: "Next"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: hasValue ? "filled" : "tonal",
						onClick: next,
						children: hasValue ? "Next" : "Skip"
					})
				]
			})
		]
	});
}
function EmojiScale({ scale, value, onPick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "radiogroup",
		"aria-label": label,
		className: "grid grid-cols-5 gap-2",
		children: scale.map((p) => {
			const on = value === p.value;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				role: "radio",
				"aria-checked": on,
				onClick: () => onPick(p.value),
				className: cn("flex flex-col items-center gap-1.5 rounded-[16px] py-3 transition-[background-color,transform] active:scale-95", stateLayer, on ? "bg-[var(--accent-container)] text-[var(--on-accent-container)] ring-2 ring-[var(--accent)]" : "bg-background"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("text-[30px] leading-none transition-transform", on && "scale-110"),
					"aria-hidden": "true",
					children: p.emoji
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[12px] font-medium",
					children: p.label
				})]
			}, p.value);
		})
	});
}
//#endregion
export { JournalPage as component };
