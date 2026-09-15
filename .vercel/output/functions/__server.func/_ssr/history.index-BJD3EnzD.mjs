import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as Illustration } from "./art-CKGIg2zx.mjs";
import { c as streaks, i as dayKey, t as addDays } from "./journal-Cd2_QpOm.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, Kt as BookOpen, Mt as ChevronRight, Ot as ClipboardList, R as NotebookPen, Vt as CalendarCheck, _ as Sparkles, mt as Flame, v as Smile } from "../_libs/lucide-react.mjs";
import { b as useHydrated, t as IkanShell, w as wellnessBand, y as useEverything } from "./ikan-shell-BVeIbGxw.mjs";
import { f as TopAppBar, m as stateLayer, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { s as toneColors } from "./ui-CSQedWKe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history.index-BJD3EnzD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var typeMeta = {
	assessment: {
		label: "Assessments",
		icon: ClipboardList,
		color: "#3B418C",
		soft: "#E6E7F6"
	},
	mood: {
		label: "Journal",
		icon: Smile,
		color: "#8C3652",
		soft: "#F9E2E9"
	},
	program: {
		label: "Programs",
		icon: Sparkles,
		color: "#2B634D",
		soft: "#DFF0E8"
	},
	consult: {
		label: "Consultations",
		icon: CalendarCheck,
		color: "#2F5580",
		soft: "#E3ECF8"
	},
	resource: {
		label: "Reading",
		icon: BookOpen,
		color: "#7A5A12",
		soft: "#FBEFD2"
	}
};
var filters = ["all", ...[
	"assessment",
	"program",
	"mood"
]];
function HistoryPage() {
	const hydrated = useHydrated();
	const navigate = useNavigate();
	const data = useEverything();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const events = hydrated ? data.archive : [];
	const count = (t) => events.filter((e) => e.type === t).length;
	const weekAgo = addDays(/* @__PURE__ */ new Date(), -6);
	const week = events.filter((e) => new Date(e.at) >= new Date(dayKey(weekAgo)));
	const weekMood = hydrated ? data.journal.entries.filter((e) => e.date >= dayKey(weekAgo)) : [];
	const weekAvg = weekMood.length ? weekMood.reduce((n, e) => n + e.mood, 0) / weekMood.length : null;
	const streak = hydrated ? streaks(new Set(data.journal.entries.map((e) => e.date))) : {
		current: 0,
		best: 0
	};
	const shown = filter === "all" ? events : events.filter((e) => e.type === filter);
	const groups = [];
	for (const e of shown) {
		const label = dayTitle(e.at);
		const g = groups.at(-1);
		if (g && g.label === label) g.items.push(e);
		else groups.push({
			label,
			items: [e]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle("mind"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, { leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
				label: "Back",
				onClick: () => navigate({ to: "/" }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "px-4 pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-[32px] font-semibold leading-10",
					children: "My history"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[15px] text-muted-foreground",
					children: "Your assessments, programs and journal, in one place"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-4 mt-5 overflow-hidden rounded-[28px] bg-foreground text-background",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] opacity-70",
								children: "This week"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-display text-[22px] font-semibold leading-7",
								children: week.length === 0 ? "A fresh week" : `${week.length} ${week.length === 1 ? "thing" : "things"} done`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[14px] leading-5 opacity-80",
								children: weekAvg !== null ? `Average mood ${weekAvg.toFixed(1)}/5 across ${weekMood.length} check-ins.` : "Log a check-in to see your weekly mood."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/wellness",
						className: "grid h-[76px] w-[76px] shrink-0 place-items-center rounded-full border-[6px] text-center",
						style: { borderColor: data.score !== null && hydrated ? toneColors[wellnessBand(data.score).tone].bar : "rgba(255,255,255,.2)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-[22px] font-bold leading-none",
							children: hydrated && data.score !== null ? data.score : "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] opacity-70",
							children: "wellness"
						})] })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-10 items-end gap-1 px-5 pb-4",
					"aria-hidden": "true",
					children: Array.from({ length: 7 }, (_, i) => {
						const key = dayKey(addDays(/* @__PURE__ */ new Date(), i - 6));
						const n = events.filter((e) => dayKey(new Date(e.at)) === key).length;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1 rounded-full bg-background",
							style: {
								height: Math.min(24, 3 + n * 6),
								opacity: n ? .9 : .2
							}
						}, key);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 grid grid-cols-2 gap-2 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: ClipboardList,
						value: count("assessment"),
						label: "Assessments",
						meta: typeMeta.assessment
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Smile,
						value: count("mood"),
						label: "Journal check-ins",
						meta: typeMeta.mood
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Sparkles,
						value: count("program"),
						label: "Programs completed",
						meta: typeMeta.program
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Flame,
						value: streak.current,
						label: "Day streak",
						meta: {
							color: "#B3441E",
							soft: "#FDE7D8"
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mt-4 grid grid-cols-2 gap-2 px-4",
				"aria-label": "History sections",
				children: [
					{
						to: "/history/assessments",
						label: "Assessments",
						sub: "All 7",
						icon: ClipboardList
					},
					{
						to: "/history/program",
						label: "Programs",
						sub: "All 3",
						icon: Sparkles
					},
					{
						to: "/history/journal",
						label: "Journals",
						sub: "By month",
						icon: Smile
					},
					{
						to: "/diaries",
						label: "Learning diaries",
						sub: "All 4",
						icon: NotebookPen
					}
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: t.to,
					className: cn("flex items-center gap-3 rounded-[20px] border border-foreground/10 p-3", stateLayer),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, { className: "h-5 w-5 shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[14px] font-semibold",
								children: t.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[12px] text-muted-foreground",
								children: t.sub
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 shrink-0 text-muted-foreground" })
					]
				}, t.to))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-scrollbar mt-6 flex gap-2 overflow-x-auto px-4",
				role: "tablist",
				"aria-label": "Filter history",
				children: filters.map((f) => {
					const on = f === filter;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": on,
						onClick: () => setFilter(f),
						className: cn("inline-flex h-9 shrink-0 items-center rounded-[8px] border px-3.5 text-[14px] font-medium transition-colors", stateLayer, on ? "border-transparent bg-[var(--accent-container)] text-[var(--on-accent-container)]" : "border-foreground/20"),
						children: f === "all" ? "All" : typeMeta[f].label
					}, f);
				})
			}),
			hydrated && shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-4 overflow-hidden rounded-[24px] bg-secondary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-32",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art: "mood" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-[17px] font-semibold",
							children: "Nothing here yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[14px] text-muted-foreground",
							children: "Finished assessments, completed programs and journal check-ins appear here."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/journal",
							className: "mt-4 inline-flex h-11 items-center rounded-full bg-foreground px-5 text-[14px] font-semibold text-background",
							children: "Log today’s mood"
						})
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 px-4",
				children: groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[13px] font-semibold text-muted-foreground",
						children: g.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "relative mt-2 space-y-1 before:absolute before:bottom-4 before:left-[22px] before:top-4 before:w-px before:bg-foreground/10",
						children: g.items.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventRow, { e }) }, e.id))
					})]
				}, g.label))
			})
		]
	}) });
}
function Stat({ icon: Icon, value, label, meta }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[20px] p-3",
		style: {
			background: meta.soft,
			color: meta.color
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-[24px] font-bold leading-7 tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[12px] font-medium",
				children: label
			})
		]
	});
}
function EventRow({ e }) {
	const meta = typeMeta[e.type];
	const Icon = meta.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		...e.link,
		className: cn("relative flex items-center gap-3 rounded-[16px] py-2 pr-2", stateLayer),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full text-[20px]",
				style: {
					background: meta.soft,
					color: meta.color
				},
				children: e.emoji ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					children: e.emoji
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-[15px] font-semibold",
						children: e.title
					}), e.tone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "h-2 w-2 shrink-0 rounded-full",
						style: { background: toneColors[e.tone].bar }
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "line-clamp-1 text-[13px] text-muted-foreground",
					children: e.detail
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[12px] tabular-nums text-muted-foreground",
				children: new Date(e.at).toLocaleTimeString("en-IN", {
					hour: "numeric",
					minute: "2-digit"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
		]
	});
}
function dayTitle(iso) {
	const key = dayKey(new Date(iso));
	if (key === dayKey(/* @__PURE__ */ new Date())) return "Today";
	if (key === dayKey(addDays(/* @__PURE__ */ new Date(), -1))) return "Yesterday";
	return new Date(iso).toLocaleDateString("en-IN", {
		weekday: "long",
		day: "numeric",
		month: "long"
	});
}
//#endregion
export { HistoryPage as component };
