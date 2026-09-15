import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as Illustration } from "./art-CKGIg2zx.mjs";
import { c as profiles, n as formatValue, o as optionLabel, p as useAssessmentStore, r as getAssessment } from "./store-CsxAZBJN.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, At as CircleCheck, C as ShieldCheck, Dt as Clock3, Lt as CalendarRange, Mt as ChevronRight, Q as LifeBuoy, Ut as Brain, X as ListChecks, Z as Lightbulb, _t as FileChartColumnIncreasing, at as History, d as TrendingUp, dt as Gauge, h as Target, tn as Activity, v as Smile, xt as Compass, z as MousePointerClick } from "../_libs/lucide-react.mjs";
import { b as useHydrated, t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { m as stateLayer, n as Button, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { t as Route } from "./assessments._slug.index-BdaU1TTI.mjs";
import { i as categoryIcon } from "./ui-CSQedWKe.mjs";
import { a as SubHead, i as ImportantNote, n as Bento, o as useBeforeStart, r as Group, t as BeforeYouStart } from "./about-bd7iLj4d.mjs";
import { n as dedupe, t as assessmentAbout } from "./about-DiNXfH8c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assessments._slug.index-rj11jYnd.js
var import_jsx_runtime = require_jsx_runtime();
/** Each assessment's banner art, in the same illustration style as the library. */
var bannerArt = {
	depression: "mood",
	anxiety: "anxiety",
	stress: "stress",
	sleep: "sleep",
	balance: "work",
	burnout: "burnout",
	general: "checkup"
};
var measureIcons = [
	Target,
	Activity,
	Gauge,
	Brain
];
var afterIcons = [
	FileChartColumnIncreasing,
	Lightbulb,
	TrendingUp,
	Compass
];
var stepIcon = (t) => /minute/i.test(t) ? Clock3 : /week|month|recent|period|past/i.test(t) ? CalendarRange : /right or wrong|correct/i.test(t) ? Smile : /choose|option|select/i.test(t) ? MousePointerClick : CircleCheck;
function AssessmentDetailPage() {
	const { slug } = Route.useLoaderData();
	const a = getAssessment(slug);
	const navigate = useNavigate();
	const store = useAssessmentStore();
	const draft = store.draftFor(slug);
	const past = store.resultsFor(slug);
	const Icon = categoryIcon[a.category];
	const scaleKeys = [...new Set(a.questions.map((q) => q.scale))];
	const answered = draft ? Object.keys(draft.answers).length : 0;
	const about = assessmentAbout(slug, a.minutes);
	const begin = () => navigate({
		to: "/assessment-flow",
		search: { id: slug }
	});
	const before = useBeforeStart(`assessment.${slug}`, begin);
	const steps = dedupe(about?.how?.bullets ?? []);
	const hydrated = useHydrated();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle("mind"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative h-56 overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art: bannerArt[a.category] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-background" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-x-0 top-0 p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Back",
							onClick: () => navigate({ to: "/assessments" }),
							className: "bg-background/80 backdrop-blur",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative -mt-10 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-14 w-14 place-items-center rounded-[18px] border-4 border-background bg-[var(--accent-container)] text-[var(--on-accent-container)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-7 w-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-[14px] font-medium text-[var(--accent-strong)]",
						children: a.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-[28px] font-semibold leading-9",
						children: a.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex h-8 items-center gap-2 rounded-[8px] border border-foreground/20 px-3 text-[14px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-4 w-4" }),
									" ",
									a.questions.length,
									" questions"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex h-8 items-center gap-2 rounded-[8px] border border-foreground/20 px-3 text-[14px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "h-4 w-4" }),
									" About ",
									a.minutes,
									" min"
								]
							}),
							hydrated && past.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/history/assessments/$slug",
								params: { slug },
								className: cn("inline-flex h-8 items-center gap-1.5 rounded-full bg-[var(--accent-container)] pl-3 pr-2 text-[14px] font-semibold text-[var(--on-accent-container)]", stateLayer),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4" }),
									" ",
									past.length,
									" past",
									" ",
									past.length === 1 ? "result" : "results",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
								]
							}) : null
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
				title: "About this assessment",
				children: [
					about?.what?.paragraphs.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-[15px] leading-6 text-foreground/85", i > 0 && "mt-2"),
						children: t
					}, i)),
					about?.looksAt.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubHead, { children: "What it measures" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bento, { items: about.looksAt.map((text, i) => ({
						icon: measureIcons[i % 4],
						text
					})) })] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubHead, { children: "How it’s scored" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "overflow-hidden rounded-[16px] bg-secondary",
						children: a.scores.map((sc, i) => {
							const pr = profiles[sc.profile];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: cn("flex items-center gap-3 px-4 py-3", i > 0 && "border-t border-background"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[15px] font-medium leading-6",
										children: sc.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block text-[13px] text-muted-foreground",
										children: [
											sc.instrument,
											", ",
											formatValue(pr, pr.min),
											" to ",
											pr.max,
											pr.direction === "better" ? ", higher is better" : ""
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[13px] text-muted-foreground",
									children: [pr.bands.length, " levels"]
								})]
							}, sc.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[13px] text-muted-foreground",
						children: a.instrument
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
				title: "How it works",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bento, {
					items: steps.map((text) => ({
						icon: stepIcon(text),
						text
					})),
					offset: 1
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "group mt-4 rounded-[16px] border border-foreground/10 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
						className: "flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold [&::-webkit-details-marker]:hidden",
						children: ["See the answer options", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 transition-transform group-open:rotate-90" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-3",
						children: scaleKeys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: a.scales[k].options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-[8px] bg-secondary px-3 py-1.5 text-[13px]",
								children: optionLabel(o.text)
							}, o.text))
						}, k))
					})]
				})]
			}),
			about?.youllSee ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
				title: "After you finish",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bento, {
					items: about.youllSee.bullets.map((text, i) => ({
						icon: afterIcons[i % 4],
						text
					})),
					offset: 2
				}), about.youllSee.paragraphs.filter((t) => !/:$/.test(t)).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-[15px] font-medium",
					children: t
				}, t))]
			}) : null,
			about ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportantNote, { text: about.importantShort }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky bottom-[88px] z-20 mt-6 bg-gradient-to-t from-background via-background to-transparent px-4 pb-3 pt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					onClick: draft ? begin : before.request,
					children: draft ? `Continue, ${answered} of ${a.questions.length} answered` : past.length ? "Take it again" : "Start assessment"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BeforeYouStart, {
				open: before.open,
				onClose: before.close,
				onConfirm: before.confirm,
				items: [
					{
						icon: ListChecks,
						text: `${a.questions.length} questions, about ${a.minutes} min`
					},
					{
						icon: Clock3,
						text: steps[0] ?? "Answer based on how you’ve felt recently"
					},
					{
						icon: ShieldCheck,
						text: "A self-help check, not a diagnosis"
					},
					{
						icon: LifeBuoy,
						text: "Not for emergencies. Get support if you feel unsafe"
					}
				],
				cta: "Start assessment"
			})
		]
	}) });
}
//#endregion
export { AssessmentDetailPage as component };
