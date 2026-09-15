import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { s as moodScale } from "./journal-Cd2_QpOm.mjs";
import { Dt as Clock3, Ft as Check, Pt as ChevronDown, gt as FileText } from "../_libs/lucide-react.mjs";
import { t as DateText } from "./date-text-HAjSU3S3.mjs";
import { s as shortDate } from "./journey-Muau11lk.mjs";
import { t as formatSeconds } from "./use-active-time-01xzO_vL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/day-card-CFupSacm.js
var import_jsx_runtime = require_jsx_runtime();
/** One finished programme day, collapsed to its title; opens to what was written or chosen. */
function DayCard({ title, day, at, responses, seconds, feedback }) {
	const feel = feedback?.feel ? moodScale[feedback.feel - 1] : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "group overflow-hidden rounded-[20px] border border-foreground/10 bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
			className: "flex min-h-16 cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-foreground text-background",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
						className: "h-[18px] w-[18px]",
						strokeWidth: 2.5
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block text-[15px] font-semibold",
						children: [
							"Day ",
							day,
							" · ",
							title
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-0.5 flex flex-wrap items-center gap-x-2 text-[12px] text-muted-foreground",
						children: [
							at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateText, { children: shortDate(at) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Completed" }),
							seconds ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {
									className: "h-3.5 w-3.5 opacity-70",
									"aria-hidden": "true"
								}), formatSeconds(seconds)]
							}) : null,
							responses.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								responses.length,
								" ",
								responses.length === 1 ? "response" : "responses"
							] }) : null,
							feel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-label": `Felt ${feel.label}`,
								children: feel.emoji
							}) : null
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 border-t border-foreground/10 px-4 py-3",
			children: [feedback ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[14px] border border-foreground/10 px-3.5 py-2.5 text-[14px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12px] font-semibold text-muted-foreground",
						children: "How the session went"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1",
						children: [
							feedback.helpful ? `Helpful: ${feedback.helpful} of 5` : null,
							feedback.helpful && feel ? " · " : null,
							feel ? `Felt ${feel.label.toLowerCase()} after` : null
						]
					}),
					feedback.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 leading-6",
						children: [
							"“",
							feedback.note,
							"”"
						]
					}) : null
				]
			}) : null, responses.length ? responses.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[14px] bg-secondary px-3.5 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-2 text-[12px] font-semibold text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 shrink-0" }),
						" ",
						r.title
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-1 space-y-1",
					children: r.lines.map((l, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-[15px] leading-6",
						children: l
					}, n))
				})]
			}, i)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[14px] text-muted-foreground",
				children: "Lessons only, nothing to write this day."
			})]
		})]
	});
}
//#endregion
export { DayCard as t };
