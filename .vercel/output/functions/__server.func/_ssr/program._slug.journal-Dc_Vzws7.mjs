import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as getProgramme, p as useProgramme } from "./programs-DrKO9d_v.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, Kt as BookOpen } from "../_libs/lucide-react.mjs";
import { f as TopAppBar, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { n as formatTime, r as nightMetrics, t as formatDuration } from "./metrics-Gs7QyLlC.mjs";
import { t as Route } from "./program._slug.journal-DTp7vGvg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/program._slug.journal-Dc_Vzws7.js
var import_jsx_runtime = require_jsx_runtime();
/** Each collection, labelled by the first Notion block that creates it, with that block's fields. */
function collectionsOf(p) {
	const seen = /* @__PURE__ */ new Map();
	for (const d of p.days) for (const s of d.steps) {
		const v = s.view;
		if (v.ui !== "entries" && v.ui !== "review") continue;
		const fields = v.ui === "entries" ? v.fields : [...v.addFields ?? [], ...v.fields];
		const prev = seen.get(v.collection);
		if (!prev) seen.set(v.collection, {
			title: s.block.title,
			fields
		});
		else for (const f of fields) if (!prev.fields.some((x) => x.key === f.key)) prev.fields.push(f);
	}
	return [...seen.entries()];
}
function JournalPage() {
	const { slug } = Route.useLoaderData();
	const programme = getProgramme(slug);
	const navigate = useNavigate();
	const { state, entries } = useProgramme(slug);
	const nights = Object.entries(state.diary).map(([day, e]) => ({
		day: Number(day),
		m: nightMetrics(e)
	})).filter((n) => n.m).sort((a, b) => a.day - b.day);
	const maxBed = Math.max(600, ...nights.map((n) => n.m.inBed));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-canvas",
		style: accentStyle(programme.accent),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto min-h-dvh w-full max-w-app bg-background pb-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, {
					leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: "Back",
						onClick: () => navigate({
							to: "/program/$slug",
							params: { slug }
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
					}),
					title: "Your entries",
					subtitle: programme.name
				}),
				nights.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "px-4 pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-[16px] font-semibold",
							children: "Sleep Diary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-[16px] bg-[var(--accent-container)] p-4 text-[var(--on-accent-container)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-40 items-end gap-1.5",
								role: "img",
								"aria-label": "Time asleep within time in bed for each diary day",
								children: nights.slice(-14).map(({ day, m }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex h-full flex-1 flex-col items-center justify-end gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative w-full overflow-hidden rounded-[6px] bg-[var(--accent)]/30",
										style: { height: `${m.inBed / maxBed * 100}%` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute inset-x-0 bottom-0 rounded-[6px] bg-[var(--accent)]",
											style: { height: `${m.asleep / m.inBed * 100}%` }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] tabular-nums",
										children: day
									})]
								}, day))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-[13px]",
								children: "Darker bar: time asleep. Lighter bar: time in bed. By day."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "-mx-4 mt-2",
							children: nights.slice().reverse().map(({ day, m }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex min-h-14 items-center justify-between px-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[16px]",
									children: ["Day ", day]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[14px] tabular-nums text-muted-foreground",
									children: [
										formatDuration(m.asleep),
										" asleep, ",
										m.efficiency,
										"%"
									]
								})]
							}, day))
						})
					]
				}) : null,
				Object.keys(state.tracker).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-[16px] font-semibold",
						children: "Tracking"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-4",
						children: entries("habits").map((h) => {
							const days = Object.keys(state.tracker).map(Number).sort((a, b) => a - b);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[16px]",
								children: String(Object.values(h.values)[0] ?? "")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-1.5",
								children: days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									title: `Day ${d}`,
									className: cn("grid h-8 w-8 place-items-center rounded-full text-[11px] tabular-nums", state.tracker[String(d)]?.[h.id] ? "bg-[var(--accent)] text-background" : "bg-secondary text-muted-foreground"),
									children: d
								}, d))
							})] }, h.id);
						})
					})]
				}) : null,
				!nights.length && !Object.keys(state.tracker).length && !collectionsOf(programme).some(([c]) => entries(c).length) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-4 mt-6 flex flex-col items-center rounded-[16px] border border-dashed border-foreground/25 px-6 py-10 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-12 w-12 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-[16px] font-medium",
							children: "Nothing here yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[14px] text-muted-foreground",
							children: "What you write during each day shows up here."
						})
					]
				}) : null,
				collectionsOf(programme).map(([collection, { title, fields }]) => {
					const list = entries(collection);
					if (!list.length) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-6 px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-[16px] font-semibold",
								children: title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[14px] tabular-nums text-muted-foreground",
								children: list.length
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-3",
							children: list.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-[16px] bg-secondary p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[12px] text-muted-foreground",
									children: ["Day ", e.day]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
									className: "mt-1 space-y-2",
									children: Object.entries(e.values).map(([k, v]) => {
										if (v === null || v === "" || v === void 0) return null;
										const f = fields.find((x) => x.key === k);
										const shown = f?.type === "time" && typeof v === "string" ? formatTime(v) : String(v);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [f?.label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-[12px] text-muted-foreground",
											children: f.label
										}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "whitespace-pre-line text-[15px] leading-6",
											children: shown
										})] }, k);
									})
								})]
							}, e.id))
						})]
					}, collection);
				})
			]
		})
	});
}
//#endregion
export { JournalPage as component };
