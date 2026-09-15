import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as getProgramme, p as useProgramme } from "./programs-DrKO9d_v.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, Kt as BookOpen, u as Trophy } from "../_libs/lucide-react.mjs";
import { b as useHydrated, t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { f as TopAppBar, m as stateLayer, n as Button, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { t as DateText } from "./date-text-HAjSU3S3.mjs";
import { n as dayResponses, s as shortDate, t as completedRuns } from "./journey-Muau11lk.mjs";
import { t as DayCard } from "./day-card-CFupSacm.mjs";
import { t as Route } from "./history.program._slug-HfBpAJ2A.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history.program._slug-7EdtY8On.js
var import_jsx_runtime = require_jsx_runtime();
function ProgramArchivePage() {
	const { slug } = Route.useLoaderData();
	const p = getProgramme(slug);
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const { state } = useProgramme(slug);
	const runs = hydrated ? completedRuns(p, state) : [];
	const topics = [...new Set(runs.flatMap((r) => r.topics))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle(p.accent),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, {
				leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
					label: "Back",
					onClick: () => navigate({ to: "/history/program" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
				}),
				title: p.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative mx-4 h-40 overflow-hidden rounded-[28px] text-white",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.cover,
						alt: "",
						className: "absolute inset-0 h-full w-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-5 bottom-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] opacity-80",
								children: "Program history"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-[28px] font-semibold leading-8",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] opacity-80",
								children: p.source.meta.days
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-4 mt-4 grid grid-cols-2 gap-3",
				children: [
					{
						v: runs.length,
						l: "Times completed"
					},
					{
						v: runs.reduce((n, r) => n + r.daysDone, 0),
						l: "Days done"
					},
					{
						v: runs.reduce((n, r) => n + r.activitiesDone, 0),
						l: "Activities"
					},
					{
						v: runs.reduce((n, r) => n + r.responses, 0),
						l: "Responses written"
					}
				].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[20px] bg-secondary p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-[24px] font-bold leading-7 tabular-nums",
						children: hydrated ? x.v : "—"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] text-muted-foreground",
						children: x.l
					})]
				}, x.l))
			}),
			topics.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[16px] font-semibold",
					children: "Topics you explored"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: topics.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-[10px] bg-[var(--accent-container)] px-3 py-1.5 text-[14px] text-[var(--on-accent-container)]",
						children: t
					}, t))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-[18px] font-semibold",
						children: "All runs"
					}),
					hydrated && !runs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 rounded-[20px] border border-dashed border-foreground/20 p-6 text-center text-[15px] text-muted-foreground",
						children: [
							"No finished runs yet. Each time you finish ",
							p.name,
							", it stacks up here."
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-6",
						children: runs.map((run, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 rounded-[20px] bg-secondary p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-white",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DateText, {
										className: "text-[15px] font-semibold",
										children: [run.startedAt ? shortDate(run.startedAt) : "", run.finishedAt ? ` to ${shortDate(run.finishedAt)}` : ""]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block text-[13px] text-muted-foreground",
										children: [
											run.totalDays,
											" days · ",
											run.activitiesDone,
											" activities · ",
											run.responses,
											" ",
											"responses"
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 grid grid-cols-2 gap-2 text-[13px] font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/program/$slug/result",
									params: { slug },
									search: { run: i },
									className: cn("flex h-11 items-center justify-center gap-1.5 rounded-full border border-foreground/15", stateLayer),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4" }), " View result"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/diaries/$slug",
									params: { slug },
									search: { run: i },
									className: cn("flex h-11 items-center justify-center gap-1.5 rounded-full border border-foreground/15", stateLayer),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4" }), " Learning diary"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-2",
								children: p.days.filter((d) => run.state.completed.includes(d.day)).reverse().map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayCard, {
									title: d.title,
									day: d.day,
									at: run.state.completedAt?.[String(d.day)],
									responses: dayResponses(p, run.state, d.day),
									seconds: run.state.time?.[String(d.day)]?.total,
									feedback: run.state.feedback?.[String(d.day)]
								}) }, d.day))
							})
						] }, run.finishedAt ?? i))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outlined",
					className: "w-full",
					onClick: () => navigate({
						to: "/program/$slug",
						params: { slug }
					}),
					children: ["Go to ", p.name]
				})
			})
		]
	}) });
}
//#endregion
export { ProgramArchivePage as component };
