import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as scoreAll, i as headlineOf, p as useAssessmentStore, t as assessments } from "./store-CsxAZBJN.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, Mt as ChevronRight } from "../_libs/lucide-react.mjs";
import { b as useHydrated, t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { f as TopAppBar, m as stateLayer, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { i as categoryIcon, t as BandChip } from "./ui-CSQedWKe.mjs";
import { t as DateText } from "./date-text-HAjSU3S3.mjs";
import { t as Trend } from "./trend-BrCQKB2-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history.assessments.index-Cr0iVfl5.js
var import_jsx_runtime = require_jsx_runtime();
var date = (iso) => new Date(iso).toLocaleDateString("en-IN", {
	day: "numeric",
	month: "short",
	year: "numeric"
});
function AssessmentHistoryPage() {
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const store = useAssessmentStore();
	const taken = hydrated ? assessments.filter((a) => store.resultsFor(a.slug).length).length : 0;
	const total = hydrated ? store.results.length : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle("mind"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, {
				leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
					label: "Back",
					onClick: () => navigate({ to: "/history" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
				}),
				title: "Assessment history"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-4 grid grid-cols-2 divide-x divide-background rounded-[24px] bg-secondary py-4 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-[22px] font-bold tabular-nums",
					children: hydrated ? `${taken}/${assessments.length}` : "—"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12px] text-muted-foreground",
					children: "Assessments taken"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-[22px] font-bold tabular-nums",
					children: hydrated ? total : "—"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12px] text-muted-foreground",
					children: "Results in total"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 space-y-3 px-4",
				children: assessments.map((a) => {
					const Icon = categoryIcon[a.category];
					const results = hydrated ? store.resultsFor(a.slug) : [];
					const scored = results.map((r) => ({
						r,
						head: headlineOf(a, scoreAll(a, r.answers))
					}));
					const latest = scored[0];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/history/assessments/$slug",
						params: { slug: a.slug },
						"aria-label": latest ? void 0 : `${a.title}, not taken yet`,
						className: cn("block overflow-hidden rounded-[24px] bg-secondary", stateLayer, hydrated && !latest && "opacity-55 grayscale"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-3 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[var(--accent-container)] text-[var(--on-accent-container)]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
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
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-[13px] text-muted-foreground",
												children: latest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													results.length,
													" ",
													results.length === 1 ? "result" : "results",
													" ·",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateText, { children: date(latest.r.completedAt) })
												] }) : "Not taken yet"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 shrink-0 text-muted-foreground" })
								]
							}),
							latest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-3 border-t border-background px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 text-[13px] text-muted-foreground",
									children: "Latest"
								}), latest.head?.band ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandChip, {
									label: latest.head.band.label,
									tone: latest.head.band.tone,
									severity: latest.head.band.severity
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[13px]",
									children: [a.scores.length, " scores"]
								})]
							}) : null,
							a.headline && scored.length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trend, {
								points: [...scored].reverse().slice(-8),
								className: "mx-4 mb-4 block rounded-[12px] bg-background px-3 py-2"
							}) : null
						]
					}) }, a.slug);
				})
			})
		]
	}) });
}
//#endregion
export { AssessmentHistoryPage as component };
