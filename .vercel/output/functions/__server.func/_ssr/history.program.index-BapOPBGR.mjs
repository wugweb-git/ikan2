import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { p as useProgramme, s as programmes } from "./programs-DrKO9d_v.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, Dt as Clock3, Mt as ChevronRight, Vt as CalendarCheck, _ as Sparkles, m as ThumbsUp, u as Trophy } from "../_libs/lucide-react.mjs";
import { b as useHydrated, t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { f as TopAppBar, m as stateLayer, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { t as DateText } from "./date-text-HAjSU3S3.mjs";
import { s as shortDate, t as completedRuns } from "./journey-Muau11lk.mjs";
import { t as formatSeconds } from "./use-active-time-01xzO_vL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history.program.index-BapOPBGR.js
var import_jsx_runtime = require_jsx_runtime();
function ProgramHistoryPage() {
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const states = {
		"sleep-tight": useProgramme("sleep-tight").state,
		unburn: useProgramme("unburn").state,
		"stress-buster": useProgramme("stress-buster").state
	};
	const rows = programmes.map((p) => {
		const runs = hydrated ? completedRuns(p, states[p.slug]) : [];
		return {
			p,
			runs,
			last: runs[0],
			days: runs.reduce((n, r) => n + r.daysDone, 0),
			seconds: runs.reduce((n, r) => n + r.seconds, 0),
			topics: new Set(runs.flatMap((r) => r.topics)).size
		};
	}).sort((a, b) => Number(Boolean(b.last)) - Number(Boolean(a.last)) || (b.last?.finishedAt ?? "").localeCompare(a.last?.finishedAt ?? ""));
	const done = rows.filter((r) => r.runs.length);
	const helpful = done.flatMap((r) => r.runs.map((x) => x.helpful)).filter((x) => x !== null);
	const totals = [
		{
			icon: Trophy,
			value: hydrated ? `${done.length}/${programmes.length}` : "—",
			label: "Programs completed"
		},
		{
			icon: CalendarCheck,
			value: hydrated ? String(done.reduce((n, r) => n + r.days, 0)) : "—",
			label: "Days done"
		},
		{
			icon: Clock3,
			value: hydrated ? (() => {
				const s = done.reduce((n, r) => n + r.seconds, 0);
				return s ? formatSeconds(s) : "—";
			})() : "—",
			label: "Time spent"
		},
		{
			icon: ThumbsUp,
			value: helpful.length ? `${(helpful.reduce((n, x) => n + x, 0) / helpful.length).toFixed(1)}/5` : "—",
			label: "Helpfulness"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IkanShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, {
			leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
				label: "Back",
				onClick: () => navigate({ to: "/history" }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
			}),
			title: "Program history"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-4 grid grid-cols-2 gap-2",
			children: totals.map((t) => {
				const Icon = t.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[20px] bg-secondary p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-[22px] font-bold leading-7 tabular-nums",
							children: t.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12px] text-muted-foreground",
							children: t.label
						})
					]
				}, t.label);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 px-4 font-display text-[18px] font-semibold",
			children: "Your programs"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-3 px-4",
			children: rows.map(({ p, runs, last, days, seconds, topics }) => {
				const finished = runs.length > 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					style: accentStyle(p.accent),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/history/program/$slug",
						params: { slug: p.slug },
						"aria-label": `${p.name}${finished ? "" : ", not completed yet"}`,
						className: cn("flex gap-3 rounded-[24px] border border-foreground/10 p-3", stateLayer, !finished && hydrated && "opacity-55"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.cover,
							alt: "",
							className: cn("h-24 w-20 shrink-0 rounded-[16px] object-cover", !finished && "grayscale")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex min-w-0 flex-1 flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-[18px] font-semibold leading-6",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" })]
							}), finished ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-[var(--accent-container)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--on-accent-container)]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-3.5 w-3.5" }),
										" Completed",
										" ",
										runs.length > 1 ? `${runs.length} times` : "once"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1.5 text-[12px] text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DateText, { children: ["Last finished ", last?.finishedAt ? shortDate(last.finishedAt) : ""] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-2 text-[12px] text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-3.5 w-3.5" }),
												" ",
												days,
												" days"
											]
										}),
										seconds ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "h-3.5 w-3.5" }),
												" ",
												formatSeconds(seconds)
											]
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }),
												" ",
												topics,
												" topics"
											]
										})
									]
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 text-[13px] text-muted-foreground",
								children: "Not completed yet"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-auto pt-2 text-[12px] text-muted-foreground",
								children: [p.source.meta.days, ". Each finished run stacks up here."]
							})] })]
						})]
					})
				}, p.slug);
			})
		})
	] });
}
//#endregion
export { ProgramHistoryPage as component };
