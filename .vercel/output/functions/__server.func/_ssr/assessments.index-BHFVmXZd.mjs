import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as scoreAll, i as headlineOf, p as useAssessmentStore, t as assessments } from "./store-CsxAZBJN.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Mt as ChevronRight, at as History } from "../_libs/lucide-react.mjs";
import { t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { m as stateLayer, p as accentStyle } from "./m3-Blvbxy5D.mjs";
import { i as categoryIcon, t as BandChip } from "./ui-CSQedWKe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assessments.index-BHFVmXZd.js
var import_jsx_runtime = require_jsx_runtime();
function AssessmentListPage() {
	const taken = useAssessmentStore().results.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle("mind"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-start gap-2 px-4 pb-1 pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-[32px] font-semibold leading-10",
						children: "Assessments"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[15px] text-muted-foreground",
						children: "Answer a few questions and see where you stand today."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/history/assessments",
					"aria-label": "Your results",
					className: cn("relative grid h-12 w-12 shrink-0 place-items-center rounded-full", stateLayer),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-6 w-6" }), taken > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--accent-strong)] px-1 text-[10px] font-bold text-background",
						children: taken
					}) : null]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3 px-4 pt-5",
				children: assessments.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssessmentCard, { assessment: a }) }, a.slug))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-8 max-w-xs px-4 text-center text-[12px] leading-5 text-muted-foreground",
				children: "These are screenings, not a diagnosis. iKAN supports, but never replaces, care from a qualified professional."
			})
		]
	}) });
}
function AssessmentCard({ assessment: a }) {
	const { resultsFor, draftFor } = useAssessmentStore();
	const latest = resultsFor(a.slug)[0];
	const draft = draftFor(a.slug);
	const head = latest ? headlineOf(a, scoreAll(a, latest.answers)) : null;
	const Icon = categoryIcon[a.category];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/assessments/$slug",
		params: { slug: a.slug },
		className: cn("flex items-center gap-4 rounded-[24px] bg-secondary p-4", stateLayer),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-[var(--accent-container)] text-[var(--on-accent-container)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-[13px] font-medium text-[var(--accent-strong)]",
						children: a.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-display text-[17px] font-semibold leading-6",
						children: a.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [a.questions.length, " questions"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [a.minutes, " min"] }),
							draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium text-foreground",
								children: [
									Object.keys(draft.answers).length,
									" of ",
									a.questions.length,
									" answered"
								]
							}) : null
						]
					}),
					head?.band ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandChip, {
						className: "mt-2",
						label: head.band.label,
						tone: head.band.tone,
						severity: head.band.severity
					}) : null,
					latest && !head ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-2 block text-[13px] font-medium",
						children: "Result saved"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 shrink-0 text-muted-foreground" })
		]
	});
}
//#endregion
export { AssessmentListPage as component };
