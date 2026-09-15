import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as getProgramme, i as getDay, p as useProgramme, t as diaryRows } from "./programs-DrKO9d_v.mjs";
import { s as moodScale } from "./journal-Cd2_QpOm.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Q as LifeBuoy, n as X, q as Lock } from "../_libs/lucide-react.mjs";
import { d as TextField, f as TopAppBar, i as LinearProgress, m as stateLayer, n as Button, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { n as useActiveTime, t as formatSeconds } from "./use-active-time-01xzO_vL.mjs";
import { t as Route } from "./program._slug.day._day-DQmeE923.mjs";
import { t as StepView } from "./steps-BuYaUDkk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/program._slug.day._day-B0jaGqeQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DayPage() {
	const { slug, day } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {
		slug,
		dayNumber: day
	}, `${slug}:${day}`);
}
function Player({ slug, dayNumber }) {
	const programme = getProgramme(slug);
	const day = getDay(programme, dayNumber);
	const navigate = useNavigate();
	const { state, nextDay, complete, addTime, saveFeedback } = useProgramme(slug);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [asking, setAsking] = (0, import_react.useState)(false);
	const step = day.steps[index];
	useActiveTime(asking ? "feedback" : step?.id ?? "none", (stepId, seconds) => addTime(day.day, stepId, seconds));
	const done = state.completed.includes(day.day);
	const toProgramme = () => navigate({
		to: "/program/$slug",
		params: { slug }
	});
	if (!done && day.day > nextDay) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: accentStyle(programme.accent),
		className: "mx-auto grid min-h-dvh max-w-app place-items-center bg-background px-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-7 w-7" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-6 font-display text-[24px] font-semibold",
				children: [
					"Day ",
					day.day,
					" opens after day ",
					nextDay
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-6",
				onClick: () => navigate({
					to: "/program/$slug/day/$day",
					params: {
						slug,
						day: String(nextDay)
					}
				}),
				children: ["Go to day ", nextDay]
			})
		] })
	});
	if (!step) return null;
	const finish = () => {
		complete(day.day);
		if (programme.days.every((d) => d.day === day.day || state.completed.includes(d.day))) {
			navigate({
				to: "/program/$slug/result",
				params: { slug },
				search: { done: true }
			});
			return;
		}
		try {
			sessionStorage.setItem("ikan.equip.finished", `${slug}:${day.day}`);
		} catch {}
		toProgramme();
	};
	const go = (i) => {
		setIndex(i);
		window.scrollTo({ top: 0 });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-canvas",
		style: accentStyle(programme.accent),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto min-h-dvh w-full max-w-app bg-background",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-0 z-30 bg-background",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, {
					className: "static",
					leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: "Close",
						onClick: toProgramme,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-6 w-6" })
					}),
					title: `Day ${day.day}`,
					subtitle: day.title,
					trailing: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/support",
						"aria-label": "Get support now",
						className: "grid h-12 w-12 place-items-center rounded-full text-alert-strong",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "h-6 w-6" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 px-4 pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinearProgress, { value: (index + 1) / day.steps.length * 100 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[12px] tabular-nums text-muted-foreground",
						"aria-live": "polite",
						children: [
							index + 1,
							" of ",
							day.steps.length
						]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "px-4 pb-36 pt-4",
				children: asking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionCheck, {
					seconds: state.time?.[String(day.day)]?.total ?? 0,
					onDone: (fb) => {
						if (fb) saveFeedback(day.day, fb);
						finish();
					}
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "animate-fade",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepView, {
						step,
						diaryRows: diaryRows(programme),
						ctx: {
							slug,
							day: day.day,
							isLast: index === day.steps.length - 1,
							onBack: index > 0 ? () => go(index - 1) : void 0,
							onNext: () => {
								if (index + 1 < day.steps.length) return go(index + 1);
								if (!state.feedback?.[String(day.day)]) {
									setAsking(true);
									window.scrollTo({ top: 0 });
									return;
								}
								finish();
							}
						}
					})
				}, step.id)
			})]
		})
	});
}
var helpfulScale = [
	"Not at all",
	"A little",
	"Somewhat",
	"Very",
	"Extremely"
];
/** End of a day: how helpful the session was and how the person feels now. Both optional. */
function SessionCheck({ seconds, onDone }) {
	const [helpful, setHelpful] = (0, import_react.useState)();
	const [feel, setFeel] = (0, import_react.useState)();
	const [note, setNote] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-fade",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[14px] font-semibold text-[var(--accent-strong)]",
				children: "Before you go"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-[26px] font-semibold leading-8",
				children: "How was today?"
			}),
			seconds >= 30 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-[14px] text-muted-foreground",
				children: [
					"You spent ",
					formatSeconds(seconds),
					" on today’s session."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[16px] font-semibold",
					children: "How helpful was this session?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-5 gap-2",
					role: "radiogroup",
					children: helpfulScale.map((label, i) => {
						const v = i + 1;
						const on = helpful === v;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "radio",
							"aria-checked": on,
							onClick: () => setHelpful(v),
							className: cn("flex h-[72px] flex-col items-center justify-center gap-1 rounded-[16px] text-center", stateLayer, on ? "bg-foreground text-background" : "bg-secondary"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-[20px] font-semibold leading-6",
								children: v
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-1 text-[10px] leading-3",
								children: label
							})]
						}, label);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[16px] font-semibold",
					children: "How do you feel now?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-5 gap-2",
					role: "radiogroup",
					children: moodScale.map((m) => {
						const on = feel === m.value;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "radio",
							"aria-checked": on,
							"aria-label": m.label,
							onClick: () => setFeel(m.value),
							className: cn("flex h-[72px] flex-col items-center justify-center gap-1 rounded-[16px]", stateLayer, on ? "bg-[var(--accent-container)] ring-2 ring-[var(--accent)]" : "bg-secondary"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[26px] leading-none",
								"aria-hidden": "true",
								children: m.emoji
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px]",
								children: m.label
							})]
						}, m.value);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "Anything you’d like to add? (optional)",
					value: note,
					onChange: setNote,
					multiline: true,
					maxLength: 500
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => onDone({
						...helpful ? { helpful } : {},
						...feel ? { feel } : {},
						...note.trim() ? { note: note.trim() } : {}
					}),
					disabled: !helpful && !feel && !note.trim(),
					children: "Finish day"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "text",
					onClick: () => onDone(null),
					children: "Skip"
				})]
			})
		]
	});
}
//#endregion
export { DayPage as component };
