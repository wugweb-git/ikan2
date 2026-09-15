import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as riskEndorsed, f as scoreAll, i as headlineOf, p as useAssessmentStore, r as getAssessment } from "./store-CsxAZBJN.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, Pt as ChevronDown, Q as LifeBuoy, d as TrendingUp, f as TrendingDown } from "../_libs/lucide-react.mjs";
import { b as useHydrated, t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { f as TopAppBar, m as stateLayer, n as Button, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { c as toneStyle, i as categoryIcon, l as valueText, n as RangeBar, o as severityContent, r as bandStyle, t as BandChip } from "./ui-CSQedWKe.mjs";
import { t as DateText } from "./date-text-HAjSU3S3.mjs";
import { t as Route } from "./history.assessments._slug-pS5fZ7zp.mjs";
import { t as Trend } from "./trend-BrCQKB2-.mjs";
import { a as retakeTiming } from "./reassess-8kd9MKRp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history.assessments._slug-DeRSisCb.js
var import_jsx_runtime = require_jsx_runtime();
var date = (iso) => new Date(iso).toLocaleDateString("en-IN", {
	day: "numeric",
	month: "short",
	year: "numeric"
});
function AssessmentArchivePage() {
	const { slug } = Route.useLoaderData();
	const a = getAssessment(slug);
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const store = useAssessmentStore();
	const Icon = categoryIcon[a.category];
	const scored = (hydrated ? store.resultsFor(slug) : []).map((r) => {
		const scores = scoreAll(a, r.answers);
		return {
			r,
			scores,
			head: headlineOf(a, scores)
		};
	});
	const latest = scored[0];
	const retake = retakeTiming(latest?.r);
	const previous = scored[1];
	const first = scored.at(-1);
	const severe = latest?.scores.some((s) => s.band?.tone === "error") ?? false;
	const risk = latest ? riskEndorsed(a, latest.r.answers) : false;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle("mind"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, {
				leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
					label: "Back",
					onClick: () => navigate({ to: "/history/assessments" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
				}),
				title: a.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-3 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-[var(--accent-container)] text-[var(--on-accent-container)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-[24px] font-semibold leading-7",
						children: a.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] text-muted-foreground",
						children: a.instrument
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-4 mt-5 grid grid-cols-3 divide-x divide-background rounded-[24px] bg-secondary py-4 text-center",
				children: [
					{
						v: hydrated ? String(scored.length) : "—",
						l: "Times taken"
					},
					{
						v: first ? date(first.r.completedAt) : "—",
						l: "First"
					},
					{
						v: latest ? date(latest.r.completedAt) : "—",
						l: "Latest"
					}
				].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-[17px] font-bold leading-6 tabular-nums",
						children: x.v
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12px] text-muted-foreground",
						children: x.l
					})]
				}, x.l))
			}),
			hydrated && !latest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-5 rounded-[24px] border border-dashed border-foreground/20 p-8 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[15px] text-muted-foreground",
					children: "No results yet. Your results stack up here each time you take it."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4",
					onClick: () => navigate({
						to: "/assessment-flow",
						search: { id: slug }
					}),
					children: "Take assessment"
				})]
			}) : null,
			latest?.head?.band ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-4 mt-4 rounded-[28px] p-5",
				style: {
					...bandStyle(latest.head.band),
					background: "var(--tone-container)"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[13px] font-medium text-[var(--tone)]",
						children: ["Latest · ", latest.head.score.label]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-[30px] font-bold leading-9 text-[var(--tone)]",
						children: latest.head.band.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[13px] font-medium text-[var(--tone)]",
						children: [
							severityContent[latest.head.band.severity].label,
							" ·",
							" ",
							severityContent[latest.head.band.severity].description
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[15px] tabular-nums",
						children: valueText(latest.head)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeBar, {
							result: latest.head,
							large: true
						})
					}),
					previous?.head?.band ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Change, {
						now: latest.head,
						before: previous.head
					}) : null
				]
			}) : null,
			a.headline && scored.length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-4 mt-4 rounded-[24px] bg-secondary p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[16px] font-semibold",
					children: "Over time"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trend, {
					points: [...scored].reverse(),
					className: "mt-2 rounded-[12px] bg-background px-3 py-2"
				})]
			}) : null,
			scored.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[18px] font-semibold",
					children: "All results"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: scored.map(({ r, scores, head }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "group overflow-hidden rounded-[20px] border border-foreground/10",
						open: i === 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
							className: "flex min-h-16 cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateText, {
										className: "text-[15px] font-semibold",
										children: date(r.completedAt)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block text-[12px] text-muted-foreground",
										children: [i === 0 ? "Latest" : `${scored.length - i} of ${scored.length}`, head ? ` · ${valueText(head)}` : ` · ${scores.length} scores`]
									})]
								}),
								head?.band ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandChip, {
									label: head.band.label,
									tone: head.band.tone,
									severity: head.band.severity
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 border-t border-foreground/10 px-4 py-3",
							children: [scores.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "min-w-0 flex-1 text-[14px] font-medium",
									children: [s.score.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[12px] font-normal text-muted-foreground tabular-nums",
										children: valueText(s)
									})]
								}), s.band ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandChip, {
									label: s.band.label,
									tone: s.band.tone,
									severity: s.band.severity
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeBar, { result: s })
							})] }, s.score.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/assessments/$slug/result/$id",
								params: {
									slug,
									id: r.id
								},
								className: "inline-block text-[14px] font-semibold text-[var(--accent-strong)] underline underline-offset-4",
								children: "Open full result"
							})]
						})]
					}) }, r.id))
				})]
			}) : null,
			latest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 px-4",
				children: [
					risk || severe ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/support",
						className: cn("mb-4 flex items-start gap-3 rounded-[20px] p-4", stateLayer),
						style: {
							...toneStyle("error"),
							background: "var(--tone-container)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "mt-0.5 h-5 w-5 shrink-0 text-[var(--tone)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[15px] leading-6",
							children: [risk ? "You don’t have to carry this alone. Free, confidential support lines are open all day." : "Talking to a professional can help with what your latest result shows.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block font-semibold underline underline-offset-4",
								children: "See support options"
							})]
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: retake.due ? "filled" : "outlined",
						className: "w-full",
						onClick: () => navigate({
							to: "/assessment-flow",
							search: { id: slug }
						}),
						children: "Retake assessment"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-center text-[13px] text-muted-foreground",
						children: retake.due ? `It’s been ${retake.days} days since your last result. A good time to see how things have changed.` : `Best retaken every 14 days. Next suggested from ${retake.from.toLocaleDateString("en-IN", {
							day: "numeric",
							month: "short"
						})}.`
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-6 max-w-xs px-4 text-center text-[12px] leading-5 text-muted-foreground",
				children: "This is a screening, not a diagnosis. iKAN supports, but never replaces, care from a qualified professional."
			})
		]
	}) });
}
function Change({ now, before }) {
	const diff = (now.value ?? 0) - (before.value ?? 0);
	const same = Math.abs(diff) < 1e-9;
	const better = now.profile.direction === "better" ? diff > 0 : diff < 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-4 flex items-center gap-2 text-[14px]",
		children: [
			same ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(diff > 0 ? TrendingUp : TrendingDown, { className: "h-4 w-4 shrink-0" }),
			same ? "Same as" : better ? "Better than" : "Worse than",
			" last time: ",
			before.band.label,
			",",
			" ",
			valueText(before)
		]
	});
}
//#endregion
export { AssessmentArchivePage as component };
