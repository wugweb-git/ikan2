import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as getProgramme, p as useProgramme } from "./programs-DrKO9d_v.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, Et as Clock, Ft as Check, Kt as BookOpen, gt as FileText } from "../_libs/lucide-react.mjs";
import { b as useHydrated, t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { f as TopAppBar, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { t as DateText } from "./date-text-HAjSU3S3.mjs";
import { i as latestRun, n as dayResponses, r as journeyOf, s as shortDate } from "./journey-Muau11lk.mjs";
import { t as Route } from "./diaries._slug-DiefvHc5.mjs";
import { t as DayCard } from "./day-card-CFupSacm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/diaries._slug-DIS5_9Av.js
var import_jsx_runtime = require_jsx_runtime();
function DiaryPage() {
	const { slug } = Route.useLoaderData();
	const p = getProgramme(slug);
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const { run } = Route.useSearch();
	const state = latestRun(p, useProgramme(slug).state, run);
	const j = journeyOf(p, state);
	const doneDays = hydrated ? p.days.filter((d) => state.completed.includes(d.day)) : [];
	const duration = j.startedAt && j.finishedAt ? Math.max(1, Math.ceil((new Date(j.finishedAt).getTime() - new Date(j.startedAt).getTime()) / 864e5)) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle(p.accent),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, {
				leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
					label: "Back",
					onClick: () => navigate({ to: "/diaries" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
				}),
				title: "Learning diary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative mx-4 overflow-hidden rounded-[24px] bg-foreground p-5 text-background",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: p.cover,
					alt: "",
					className: "absolute inset-0 h-full w-full object-cover opacity-20"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-[13px] opacity-75",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4" }), " Learning diary"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-display text-[26px] font-semibold leading-8",
							children: p.name
						}),
						hydrated && j.startedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[13px] opacity-70",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DateText, { children: [shortDate(j.startedAt), j.finishedAt ? ` to ${shortDate(j.finishedAt)}` : ", in progress"] })
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2 text-[13px] font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex h-8 items-center gap-1.5 rounded-full bg-white/15 px-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }),
										" ",
										hydrated ? j.daysDone : 0,
										"/",
										j.totalDays,
										" days"
									]
								}),
								hydrated && j.responses ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex h-8 items-center gap-1.5 rounded-full bg-white/15 px-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }),
										" ",
										j.responses,
										" responses"
									]
								}) : null,
								hydrated && duration ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex h-8 items-center gap-1.5 rounded-full bg-white/15 px-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
										" ",
										duration,
										" ",
										duration === 1 ? "day" : "days"
									]
								}) : null
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "px-4 pb-6 pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[18px] font-semibold",
					children: "Program days"
				}), doneDays.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-3",
					children: doneDays.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayCard, {
						title: d.title,
						day: d.day,
						at: state.completedAt?.[String(d.day)],
						responses: dayResponses(p, state, d.day),
						seconds: state.time?.[String(d.day)]?.total,
						feedback: state.feedback?.[String(d.day)]
					}) }, d.day))
				}) : hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 rounded-[20px] border border-foreground/10 p-10 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "mx-auto h-8 w-8 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[15px] text-muted-foreground",
						children: "No program activity yet."
					})]
				}) : null]
			})
		]
	}) });
}
//#endregion
export { DiaryPage as component };
