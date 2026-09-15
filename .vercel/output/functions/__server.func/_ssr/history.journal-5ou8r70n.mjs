import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { c as streaks, i as dayKey, s as moodScale, u as useJournal } from "./journal-Cd2_QpOm.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, Mt as ChevronRight, Nt as ChevronLeft } from "../_libs/lucide-react.mjs";
import { b as useHydrated, t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { f as TopAppBar, m as stateLayer, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { t as EntryCard } from "./entry-card-Bi6p6uFh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history.journal-5ou8r70n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var weekdays = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun"
];
var monthLabel = (y, m) => new Date(y, m, 1).toLocaleDateString("en-IN", {
	month: "long",
	year: "numeric"
});
function JournalHistoryPage() {
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const journal = useJournal();
	const list = hydrated ? [...journal.entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : [];
	const avg = list.length ? list.reduce((n, e) => n + e.mood, 0) / list.length : null;
	const streak = streaks(new Set(list.map((e) => e.date)));
	const now = /* @__PURE__ */ new Date();
	const [cursor, setCursor] = (0, import_react.useState)({
		y: now.getFullYear(),
		m: now.getMonth()
	});
	const [selected, setSelected] = (0, import_react.useState)(dayKey(now));
	const shift = (n) => setCursor(({ y, m }) => {
		const d = new Date(y, m + n, 1);
		return {
			y: d.getFullYear(),
			m: d.getMonth()
		};
	});
	const lead = (new Date(cursor.y, cursor.m, 1).getDay() + 6) % 7;
	const daysIn = new Date(cursor.y, cursor.m + 1, 0).getDate();
	const cells = [...Array.from({ length: lead }, () => null), ...Array.from({ length: daysIn }, (_, i) => new Date(cursor.y, cursor.m, i + 1))];
	const moodOn = (key) => {
		const es = list.filter((e) => e.date === key);
		return es.length ? es.reduce((n, e) => n + e.mood, 0) / es.length : null;
	};
	const inMonth = list.filter((e) => e.date.startsWith(`${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}`));
	const dayEntries = list.filter((e) => e.date === selected);
	const isFuture = (d) => dayKey(d) > dayKey(now);
	const months = [];
	for (const e of list) {
		const key = e.date.slice(0, 7);
		const m = months.find((x) => x.key === key);
		if (m) {
			m.avg = (m.avg * m.count + e.mood) / (m.count + 1);
			m.count += 1;
		} else {
			const [y, mo] = key.split("-").map(Number);
			months.push({
				key,
				label: monthLabel(y, mo - 1),
				count: 1,
				avg: e.mood
			});
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle("mood"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, {
				leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
					label: "Back",
					onClick: () => navigate({ to: "/journal" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
				}),
				title: "Journal history"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-4 grid grid-cols-3 divide-x divide-background rounded-[24px] bg-secondary py-4 text-center",
				children: [
					{
						v: hydrated ? String(list.length) : "—",
						l: "Check-ins"
					},
					{
						v: avg !== null ? `${avg.toFixed(1)}/5` : "—",
						l: "Average mood"
					},
					{
						v: hydrated ? String(streak.best) : "—",
						l: "Best streak"
					}
				].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-[22px] font-bold tabular-nums",
					children: x.v
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12px] text-muted-foreground",
					children: x.l
				})] }, x.l))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-4 mt-4 rounded-[24px] border border-foreground/10 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Previous month",
							onClick: () => shift(-1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-[17px] font-semibold",
								children: monthLabel(cursor.y, cursor.m)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[12px] text-muted-foreground",
								children: hydrated ? `${inMonth.length} ${inMonth.length === 1 ? "check-in" : "check-ins"}` : ""
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Next month",
							onClick: () => shift(1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 grid grid-cols-7 gap-1 text-center",
					role: "grid",
					children: [weekdays.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "py-1 text-[11px] font-medium text-muted-foreground",
						children: w
					}, w)), cells.map((d, i) => {
						if (!d) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}, `x${i}`);
						const key = dayKey(d);
						const mood = hydrated ? moodOn(key) : null;
						const on = key === selected;
						const today = key === dayKey(now);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: isFuture(d),
							onClick: () => setSelected(key),
							"aria-pressed": on,
							"aria-label": d.toLocaleDateString("en-IN", {
								weekday: "long",
								day: "numeric",
								month: "long"
							}),
							className: cn("flex aspect-square flex-col items-center justify-center rounded-[12px] text-[12px] transition-colors disabled:opacity-30", stateLayer, on ? "bg-foreground text-background" : mood ? "bg-[var(--accent-container)]" : "", today && !on && "ring-1 ring-foreground/40"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "leading-none",
								children: d.getDate()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 h-4 text-[13px] leading-4",
								"aria-hidden": "true",
								children: mood ? moodScale[Math.round(mood) - 1]?.emoji : ""
							})]
						}, key);
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[18px] font-semibold",
					children: (/* @__PURE__ */ new Date(`${selected}T00:00:00`)).toLocaleDateString("en-IN", {
						weekday: "long",
						day: "numeric",
						month: "long"
					})
				}), dayEntries.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-3",
					children: dayEntries.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryCard, { entry: e }) }, e.id))
				}) : hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 rounded-[20px] border border-dashed border-foreground/20 p-5 text-center text-[15px] text-muted-foreground",
					children: "Nothing logged this day."
				}) : null]
			}),
			months.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[18px] font-semibold",
					children: "By month"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: months.map((m) => {
						const [y, mo] = m.key.split("-").map(Number);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setCursor({
								y,
								m: mo - 1
							}),
							className: cn("flex w-full items-center gap-3 rounded-[20px] bg-secondary p-4 text-left", stateLayer),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[28px] leading-none",
									"aria-hidden": "true",
									children: moodScale[Math.round(m.avg) - 1]?.emoji
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-display text-[16px] font-semibold",
										children: m.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block text-[13px] text-muted-foreground",
										children: [
											m.count,
											" ",
											m.count === 1 ? "check-in" : "check-ins",
											" · average",
											" ",
											m.avg.toFixed(1),
											"/5"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 shrink-0 text-muted-foreground" })
							]
						}) }, m.key);
					})
				})]
			}) : null
		]
	}) });
}
//#endregion
export { JournalHistoryPage as component };
