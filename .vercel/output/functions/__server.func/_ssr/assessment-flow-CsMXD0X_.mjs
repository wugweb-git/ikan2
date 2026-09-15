import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { l as readAssessmentState, o as optionLabel, p as useAssessmentStore, r as getAssessment, t as assessments } from "./store-CsxAZBJN.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, n as X } from "../_libs/lucide-react.mjs";
import { c as SelectRow, i as LinearProgress, n as Button, p as accentStyle, r as IconButton, t as BottomSheet } from "./m3-Blvbxy5D.mjs";
import { t as Route } from "./assessment-flow-nPnlrXtr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assessment-flow-CsMXD0X_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AssessmentFlowPage() {
	const { id } = Route.useSearch();
	const a = getAssessment(id ?? "") ?? assessments[0];
	const navigate = useNavigate();
	const store = useAssessmentStore();
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [index, setIndex] = (0, import_react.useState)(0);
	const [leaving, setLeaving] = (0, import_react.useState)(false);
	const [resumed, setResumed] = (0, import_react.useState)(false);
	const seconds = (0, import_react.useRef)(0);
	const loaded = (0, import_react.useRef)(false);
	const advance = (0, import_react.useRef)(void 0);
	(0, import_react.useEffect)(() => {
		if (loaded.current) return;
		loaded.current = true;
		const draft = readAssessmentState().drafts[a.slug];
		if (draft && Object.keys(draft.answers).length > 0) {
			setAnswers(draft.answers);
			setIndex(Math.min(draft.index, a.questions.length - 1));
			seconds.current = draft.seconds;
			setResumed(true);
		}
	}, [a.slug, a.questions.length]);
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => {
			if (document.visibilityState === "visible") seconds.current += 1;
		}, 1e3);
		return () => window.clearInterval(t);
	}, []);
	(0, import_react.useEffect)(() => () => window.clearTimeout(advance.current), []);
	const total = a.questions.length;
	const question = a.questions[index];
	const scale = a.scales[question.scale];
	const selected = answers[question.id];
	const answeredCount = Object.keys(answers).length;
	const isLast = index === total - 1;
	const part = a.category === "general" ? a.scores.findIndex((s) => question.scores.includes(s.id)) : -1;
	const partLabel = a.category === "general" ? part >= 0 ? `${a.scores[part].label}` : "One more question" : null;
	const finish = (final) => {
		const result = store.saveResult(a.slug, final, seconds.current);
		navigate({
			to: "/assessments/$slug/result/$id",
			params: {
				slug: a.slug,
				id: result.id
			},
			replace: true
		});
	};
	const choose = (value) => {
		const next = {
			...answers,
			[question.id]: value
		};
		setAnswers(next);
		setResumed(false);
		store.saveDraft(a.slug, {
			answers: next,
			index: isLast ? index : index + 1,
			seconds: seconds.current
		});
		window.clearTimeout(advance.current);
		if (!isLast) advance.current = window.setTimeout(() => setIndex((i) => Math.min(i + 1, total - 1)), 260);
	};
	const firstUnanswered = a.questions.findIndex((qq) => answers[qq.id] === void 0);
	const exit = () => navigate({
		to: "/assessments/$slug",
		params: { slug: a.slug }
	});
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (leaving || e.metaKey || e.ctrlKey || e.altKey) return;
			const target = e.target;
			if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
			if (e.key === "Enter" && target?.closest("button, a")) return;
			const n = Number(e.key);
			const options = a.scales[question.scale].options;
			if (Number.isInteger(n) && n >= 1 && n <= options.length) {
				e.preventDefault();
				choose(options[n - 1].value);
			} else if (e.key === "ArrowLeft" && index > 0) {
				window.clearTimeout(advance.current);
				setIndex((i) => Math.max(0, i - 1));
			} else if ((e.key === "ArrowRight" || e.key === "Enter") && answers[question.id] !== void 0) {
				e.preventDefault();
				if (!isLast) setIndex((i) => Math.min(i + 1, total - 1));
				else if (firstUnanswered === -1) finish(answers);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-canvas",
		style: accentStyle("mind"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-dvh w-full max-w-app flex-col bg-background shadow-app",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 bg-background",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-16 items-center gap-1 px-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: "Close",
								onClick: () => answeredCount > 0 ? setLeaving(true) : exit(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "min-w-0 flex-1 truncate px-2 font-display text-[18px] font-semibold",
								children: a.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "px-4 text-[14px] tabular-nums text-muted-foreground",
								"aria-live": "polite",
								children: [
									index + 1,
									" of ",
									total
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinearProgress, { value: answeredCount / total * 100 })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "flex-1 px-4 pb-36 pt-6",
					children: [resumed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-5 rounded-[12px] bg-[var(--accent-container)] px-4 py-3 text-[14px] text-[var(--on-accent-container)]",
						children: "Picking up where you left off."
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-fade",
						children: [
							partLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[14px] font-medium text-[var(--accent-strong)]",
								children: partLabel
							}) : null,
							scale.prompt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[15px] leading-6 text-muted-foreground",
								children: scale.prompt
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-2 font-display text-[24px] font-semibold leading-8",
								children: question.text
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								role: "radiogroup",
								"aria-label": question.text,
								className: "mt-6 overflow-hidden rounded-[20px] border border-foreground/10",
								children: scale.options.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: i > 0 ? "border-t border-foreground/10" : void 0,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectRow, {
										selected: selected === o.value,
										onClick: () => choose(o.value),
										children: optionLabel(o.text)
									})
								}, o.text))
							})
						]
					}, question.id)]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "fixed inset-x-0 bottom-0 z-30 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full max-w-app items-center gap-3 border-t border-foreground/10 bg-background px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outlined",
							className: "w-12 px-0",
							disabled: index === 0,
							onClick: () => {
								window.clearTimeout(advance.current);
								setIndex((i) => Math.max(0, i - 1));
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
								className: "h-5 w-5",
								"aria-label": "Previous question"
							})
						}), isLast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "flex-1",
							disabled: selected === void 0,
							onClick: () => firstUnanswered === -1 ? finish(answers) : setIndex(firstUnanswered),
							children: firstUnanswered === -1 ? "See my result" : `Answer question ${firstUnanswered + 1}`
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "flex-1",
							disabled: selected === void 0,
							onClick: () => {
								window.clearTimeout(advance.current);
								setIndex((i) => Math.min(i + 1, total - 1));
							},
							children: "Next"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BottomSheet, {
					open: leaving,
					onClose: () => setLeaving(false),
					title: "Leave this assessment?",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[15px] leading-6 text-muted-foreground",
						children: [
							"Your ",
							answeredCount,
							" ",
							answeredCount === 1 ? "answer is" : "answers are",
							" saved. You can finish this assessment later."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setLeaving(false),
							children: "Keep going"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "text",
							onClick: exit,
							children: "Leave for now"
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { AssessmentFlowPage as component };
