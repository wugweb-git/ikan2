import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as getProgramme, o as minutesOf, p as useProgramme, r as focusOf } from "./programs-DrKO9d_v.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, B as Moon, C as ShieldCheck, Dt as Clock3, Ft as Check, Kt as BookOpen, Mt as ChevronRight, P as Play, Q as LifeBuoy, R as NotebookPen, Ut as Brain, Z as Lightbulb, _ as Sparkles, at as History, d as TrendingUp, dt as Gauge, en as AlarmClock, h as Target, ht as Flag, j as Repeat, q as Lock, r as Wrench, t as Zap, tn as Activity, zt as CalendarDays } from "../_libs/lucide-react.mjs";
import { t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { h as useSnack, l as Snackbar, m as stateLayer, n as Button, p as accentStyle, r as IconButton, t as BottomSheet } from "./m3-Blvbxy5D.mjs";
import { a as SubHead, i as ImportantNote, n as Bento, o as useBeforeStart, r as Group, t as BeforeYouStart } from "./about-bd7iLj4d.mjs";
import { n as dedupe, r as programmeAbout } from "./about-DiNXfH8c.mjs";
import { t as AddToCalendar } from "./add-to-calendar-D-4t2UWP.mjs";
import { t as Route } from "./program._slug.index-DiEjoLn5.mjs";
import { t as useScrollY } from "./use-personal-context-Dw3fv5YZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/program._slug.index-CnXBAnWU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProgrammePage() {
	const { slug } = Route.useLoaderData();
	const programme = getProgramme(slug);
	const navigate = useNavigate();
	const { state, nextDay, reset } = useProgramme(slug);
	const [cancelling, setCancelling] = (0, import_react.useState)(false);
	const y = useScrollY();
	const collapsed = y > 150;
	const finished = nextDay > programme.days.at(-1).day;
	const today = finished ? void 0 : programme.days.find((d) => d.day === nextDay);
	const started = state.completed.length > 0;
	const src = programme.source;
	const snack = useSnack();
	const about = programmeAbout(slug, programme.days.length);
	const openToday = () => today && navigate({
		to: "/program/$slug/day/$day",
		params: {
			slug,
			day: String(today.day)
		}
	});
	const before = useBeforeStart(`programme.${slug}`, () => void openToday());
	(0, import_react.useEffect)(() => {
		try {
			const flag = sessionStorage.getItem("ikan.equip.finished");
			if (flag?.startsWith(`${slug}:`)) {
				sessionStorage.removeItem("ikan.equip.finished");
				snack.show(`Day ${flag.split(":")[1]} complete`);
			}
		} catch {}
	}, [slug]);
	const activities = today?.steps.filter((st) => st.view.ui !== "conclude").map((st) => st.block.title) ?? [];
	const uniqueActivities = activities.filter((t, i) => activities.indexOf(t) === i);
	const shown = uniqueActivities.slice(0, 4);
	const runs = state.runs ?? [];
	const level = src.meta.level.charAt(0).toUpperCase() + src.meta.level.slice(1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle(programme.accent),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("fixed inset-x-0 top-0 z-40 mx-auto flex h-16 max-w-app items-center gap-1 bg-background px-1 transition-[opacity,box-shadow]", collapsed ? "opacity-100 shadow-[0_1px_0_rgba(0,0,0,0.08)]" : "pointer-events-none opacity-0"),
				"aria-hidden": !collapsed,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
					label: "Back",
					onClick: () => navigate({ to: "/program" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "flex-1 truncate px-2 font-display text-[20px] font-semibold",
					children: programme.name
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative h-56 overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: programme.cover,
						alt: "",
						className: "absolute inset-0 h-full w-full object-cover motion-reduce:transform-none",
						style: { transform: `translateY(${Math.min(y, 224) * .3}px) scale(1.05)` }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-x-0 top-0 p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Back",
							onClick: () => navigate({ to: "/program" }),
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
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-7 w-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-[14px] font-medium text-[var(--accent-strong)]",
						children: "Equip program"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-[30px] font-semibold leading-9",
						children: programme.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex h-8 items-center gap-2 rounded-[8px] border border-foreground/20 px-3 text-[14px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4" }),
									" ",
									programme.days.length,
									" days"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex h-8 items-center gap-2 rounded-[8px] border border-foreground/20 px-3 text-[14px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "h-4 w-4" }), " 5–10 min a day"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex h-8 items-center gap-2 rounded-[8px] border border-foreground/20 px-3 text-[14px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "h-4 w-4" }),
									" ",
									level
								]
							})
						]
					}),
					runs.length || started ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [runs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/history/program/$slug",
							params: { slug },
							className: cn("inline-flex h-8 items-center gap-1.5 rounded-full bg-[var(--accent-container)] pl-3 pr-2 text-[14px] font-semibold text-[var(--on-accent-container)]", stateLayer),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4" }),
								" ",
								runs.length,
								" past",
								" ",
								runs.length === 1 ? "run" : "runs",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
							]
						}) : null, started ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/diaries/$slug",
							params: { slug },
							className: cn("inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-3 pr-2 text-[14px] font-semibold", stateLayer),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotebookPen, { className: "h-4 w-4" }),
								" Learning diary",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
							]
						}) : null]
					}) : null
				]
			}),
			started && today ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-[28px] bg-[var(--accent-container)] p-5 text-[var(--on-accent-container)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] font-semibold",
								children: "Up next"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[13px] font-medium",
								children: [
									"About ",
									minutesOf(today),
									" min"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-display text-[26px] font-semibold leading-8 tabular-nums",
							children: ["Day ", today.day]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-[18px] font-semibold leading-6",
							children: today.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddToCalendar, {
							className: "mt-3",
							label: "Daily reminder",
							filename: `ikan-${programme.slug}`,
							time: "20:00",
							event: {
								title: `${programme.name}: today’s session`,
								details: `About ${minutesOf(today)} minutes. Open iKAN to continue your program.`,
								start: /* @__PURE__ */ new Date(),
								minutes: Math.max(10, minutesOf(today)),
								daily: Math.max(1, programme.days.length - state.completed.length),
								url: `https://app.ikanhealth.in/program/${programme.slug}`,
								alertBefore: 0
							}
						}),
						shown.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "mt-4 space-y-1.5 text-[15px]",
							children: [shown.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-6 w-6 shrink-0 place-items-center rounded-full bg-background/60 text-[12px] font-semibold tabular-nums",
									children: i + 1
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: t
								})]
							}, i)), uniqueActivities.length > shown.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "pl-9 text-[14px] opacity-80",
								children: [
									"and ",
									uniqueActivities.length - shown.length,
									" more"
								]
							}) : null]
						}) : null
					]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 bg-foreground/[0.035] px-4 pb-8 pt-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-[20px] font-semibold leading-7",
						children: started ? "Your progress" : "What’s inside"
					}),
					started ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayGrid, {
						programme,
						completed: state.completed,
						next: nextDay
					}), programme.tools.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tools, {
						programme,
						reached: nextDay
					}) : null] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 overflow-hidden rounded-[20px] bg-background",
						children: src.units.map((u, i) => {
							const days = u.days.map((d) => d.day);
							const done = days.filter((d) => state.completed.includes(d)).length;
							const complete = started && done === days.length;
							const current = started && days.includes(nextDay);
							const range = days.length === 1 ? days[0] === 0 ? "Intro" : `Day ${days[0]}` : `Days ${days[0] === 0 ? 1 : days[0]}–${days.at(-1)}`;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: cn("flex min-h-[68px] items-center gap-3 px-4 py-2", i > 0 && "border-t border-foreground/[0.06]", current && "bg-[var(--accent-container)]/40"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-[14px] font-semibold", complete ? "bg-foreground text-background" : current ? "bg-[var(--accent-container)] text-[var(--on-accent-container)]" : "bg-secondary text-muted-foreground"),
										children: complete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											className: "h-4 w-4",
											strokeWidth: 3
										}) : i + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[15px] font-medium leading-5",
											children: u.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[13px] leading-5 text-muted-foreground",
											children: focusOf(programme, i)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "shrink-0 text-right text-[12px] tabular-nums text-muted-foreground",
										children: range
									})
								]
							}, i);
						})
					})
				]
			}),
			about && !started ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgrammeAboutSections, { about })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/support",
					className: cn("-mx-4 flex min-h-14 items-center gap-4 px-4 text-alert-strong", stateLayer),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "h-6 w-6" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1 text-[16px] font-medium",
							children: "Get support now"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5" })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky bottom-[88px] z-20 mt-6 bg-gradient-to-t from-background via-background to-transparent px-4 pb-3 pt-6",
				children: started && today ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "h-14 w-full text-[16px]",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-5 w-5" }),
					onClick: openToday,
					children: ["Continue with day ", today.day]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "h-14 w-full text-[16px]",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-5 w-5" }),
					onClick: before.request,
					children: runs.length ? "Start again" : "Start the program"
				})
			}),
			started && !finished ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 border-t border-foreground/10 pt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "text",
					className: "w-full text-[oklch(0.45_0.17_25)]",
					onClick: () => setCancelling(true),
					children: "Cancel program"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BottomSheet, {
				open: cancelling,
				onClose: () => setCancelling(false),
				title: `Cancel ${programme.name}?`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[15px] leading-6 text-muted-foreground",
					children: [
						"You’ve done ",
						Math.min(new Set(state.completed).size, programme.days.length),
						" of",
						" ",
						programme.days.length,
						" days. Cancelling clears this run’s progress and answers, and can’t be undone. Programs you’ve finished before stay in your history."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setCancelling(false),
						children: "Keep going"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "text",
						className: "text-[oklch(0.45_0.17_25)]",
						onClick: () => {
							reset();
							setCancelling(false);
							navigate({ to: "/program" });
						},
						children: "Cancel program"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BeforeYouStart, {
				open: before.open,
				onClose: before.close,
				onConfirm: before.confirm,
				items: [
					{
						icon: CalendarDays,
						text: `${programme.days.length} days, one short session a day`
					},
					{
						icon: Clock3,
						text: "Go at your own pace and come back any time"
					},
					{
						icon: ShieldCheck,
						text: "A self-help program, not medical treatment"
					},
					{
						icon: LifeBuoy,
						text: "Not for emergencies. Get support if you feel unsafe"
					}
				],
				cta: "Start the program"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Snackbar, { message: snack.message })
		]
	}) });
}
/** Calendar-style day picker: done days are filled, the next day is outlined. */
function DayGrid({ programme, completed, next }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-3 rounded-[20px] bg-background p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "px-1 text-[13px] tabular-nums text-muted-foreground",
			children: [
				completed.length,
				" of ",
				programme.days.length,
				" days done"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-2 grid grid-cols-7 gap-y-2",
			children: programme.days.map((d) => {
				const done = completed.includes(d.day);
				const open = d.day === next;
				const cell = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("mx-auto grid h-10 w-10 place-items-center rounded-full text-[14px] font-medium tabular-nums", done && "bg-foreground text-background", open && "border-2 border-[var(--accent)] font-semibold text-foreground", !done && !open && "text-muted-foreground/60"),
					children: d.day === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
						className: "h-4 w-4",
						"aria-hidden": "true"
					}) : d.day
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: done || open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/program/$slug/day/$day",
					params: {
						slug: programme.slug,
						day: String(d.day)
					},
					"aria-label": `${d.day === 0 ? "Intro" : `Day ${d.day}`}: ${d.title}${done ? ", done" : ", up next"}`,
					className: "block rounded-full focus-visible:outline-2",
					children: cell
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					role: "img",
					"aria-label": `Day ${d.day}: ${d.title}, locked`,
					className: "block",
					children: cell
				}) }, d.day);
			})
		})]
	});
}
function Tools({ programme, reached }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-[16px] font-semibold",
				children: "Tools"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[14px] text-muted-foreground",
				children: "Open these any time once you reach them."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "-mx-4 mt-1",
				children: programme.tools.map((t) => {
					const open = reached > t.day;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/program/$slug/tool/$step",
						params: {
							slug: programme.slug,
							step: `${t.day}.${t.n}`
						},
						className: cn("flex min-h-14 items-center gap-4 px-4", stateLayer),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-6 w-6" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 text-[16px]",
								children: t.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex min-h-14 items-center gap-4 px-4 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 text-[16px]",
								children: t.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[13px]",
								children: ["Day ", t.day]
							})
						]
					}) }, `${t.day}.${t.n}`);
				})
			})
		]
	});
}
var includedIcon = (t) => /lesson|minute/i.test(t) ? BookOpen : /cbt|technique|evidence/i.test(t) ? Brain : /track|progress|insight/i.test(t) ? TrendingUp : /plan|personal/i.test(t) ? Target : Lightbulb;
var whoIcons = [
	Moon,
	Brain,
	AlarmClock,
	Activity
];
function ProgrammeAboutSections({ about }) {
	const included = dedupe(about.included);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
			title: "About this program",
			className: "px-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[15px] leading-6 text-foreground/85",
				children: about.description || about.intro
			}), about.whoFor.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubHead, { children: "Is this for you?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bento, { items: about.whoFor.map((text, i) => ({
				icon: whoIcons[i % 4],
				text
			})) })] }) : null]
		}),
		about.outcomes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, {
			title: "What you’ll gain",
			className: "px-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bento, {
				items: about.outcomes.map((o, i) => ({
					icon: [
						Sparkles,
						ShieldCheck,
						Repeat,
						Zap
					][i % 4],
					label: o.title,
					text: o.text
				})),
				offset: 1
			})
		}) : null,
		included.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, {
			title: "What’s included",
			className: "px-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bento, {
				items: included.map((text) => ({
					icon: includedIcon(text),
					text
				})),
				offset: 2
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportantNote, {
			className: "mx-0",
			text: "A self-help program, not medical treatment, a diagnosis or an emergency service. If things feel severe or don’t ease, speak with a professional."
		})
	] });
}
//#endregion
export { ProgrammePage as component };
