import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as dayKey, s as moodScale, t as addDays } from "./journal-Cd2_QpOm.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, B as Moon, C as ShieldCheck, Ot as ClipboardList, Pt as ChevronDown, _ as Sparkles, a as Watch, ct as HardDrive, v as Smile } from "../_libs/lucide-react.mjs";
import { C as useWellnessSnapshots, b as useHydrated, h as scoreBands, m as saveSnapshot, t as IkanShell, w as wellnessBand, y as useEverything } from "./ikan-shell-BVeIbGxw.mjs";
import { f as TopAppBar, m as stateLayer, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { s as toneColors } from "./ui-CSQedWKe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wellness-CLNlBhIs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var partMeta = {
	assessments: {
		icon: ClipboardList,
		color: "#5D64B4",
		to: "/assessments",
		cta: "Take an assessment"
	},
	checkins: {
		icon: Smile,
		color: "#C2607C",
		to: "/journal",
		cta: "Log a check-in"
	},
	programs: {
		icon: Sparkles,
		color: "#4E8F75",
		to: "/program",
		cta: "Open programs"
	},
	health: {
		icon: Watch,
		color: "#B98A22",
		to: "/settings",
		cta: "Connect"
	}
};
var short = (d) => d.toLocaleDateString("en-IN", {
	day: "numeric",
	month: "short"
});
function ScorePage() {
	const hydrated = useHydrated();
	const navigate = useNavigate();
	const data = useEverything();
	const snapshots = useWellnessSnapshots();
	const [open, setOpen] = (0, import_react.useState)(null);
	const score = hydrated ? data.score : null;
	(0, import_react.useEffect)(() => {
		if (score !== null) saveSnapshot(score);
	}, [score]);
	const band = score !== null ? wellnessBand(score) : null;
	const nextBand = band ? scoreBands[scoreBands.indexOf(band) + 1] : void 0;
	const firstEvent = hydrated ? data.events.at(-1) : void 0;
	const days = Array.from({ length: 30 }, (_, i) => addDays(/* @__PURE__ */ new Date(), i - 29));
	const series = days.map((d) => snapshots[dayKey(d)] ?? null);
	const weekAgo = [...Object.entries(snapshots)].filter(([k]) => k <= dayKey(addDays(/* @__PURE__ */ new Date(), -7))).sort(([a], [b]) => b.localeCompare(a))[0]?.[1];
	const best = Object.values(snapshots).length ? Math.max(...Object.values(snapshots)) : null;
	const change = score !== null && weekAgo !== void 0 ? score - weekAgo : null;
	const present = data.parts.filter((p) => p.value !== null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle("calm"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, { leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
				label: "Back",
				onClick: () => navigate({ to: "/" }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-[32px] font-semibold leading-10",
					children: "iKAN Score"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[15px] text-muted-foreground",
					children: firstEvent ? `One number over everything you have logged since ${new Date(firstEvent.at).toLocaleDateString("en-IN", {
						day: "numeric",
						month: "long"
					})}` : "Your Collective Wellness Index"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative mx-4 mt-4 overflow-hidden rounded-[32px] bg-[#0F1A17] px-5 pb-6 pt-6 text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aurora, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex flex-col items-center text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, { score }), band ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-[24px] font-semibold",
						children: band.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 inline-flex h-7 items-center rounded-full px-3 text-[13px] font-semibold",
						style: { background: "rgba(255,255,255,.14)" },
						children: change === null ? "Your first reading" : change === 0 ? "No change since last week" : `${change > 0 ? "Up" : "Down"} ${Math.abs(change)} since last week`
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-[22px] font-semibold",
						children: "Your score starts here"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-[260px] text-[14px] leading-5 opacity-80",
						children: "Log a mood check-in, take an assessment or finish a program day."
					})] })]
				})]
			}),
			score !== null && band ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-4 mt-4 rounded-[24px] bg-secondary p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative pt-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "absolute top-0 -translate-x-1/2 text-[11px] font-bold tabular-nums",
							style: { left: `${score}%` },
							children: ["▼ ", score]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-3 gap-[3px]",
							children: scoreBands.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-full rounded-full",
								style: {
									width: `${b.max - b.min + 1}%`,
									background: toneColors[b.tone].bar,
									opacity: b === band ? 1 : .25
								}
							}, b.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative mt-1 h-4 text-[11px] tabular-nums text-muted-foreground",
							children: [
								0,
								25,
								45,
								65,
								80,
								100
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -translate-x-1/2",
								style: { left: `${t}%` },
								children: t
							}, t))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-[14px] leading-5",
					children: [
						band.label,
						" spans ",
						band.min,
						" to ",
						band.max,
						".",
						nextBand ? ` You are ${nextBand.min - score} ${nextBand.min - score === 1 ? "point" : "points"} from ${nextBand.label}.` : " That’s the top band."
					]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "How it moved" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-4 rounded-[24px] border border-foreground/10 p-4",
				children: [hydrated && series.filter((v) => v !== null).length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-24 items-end gap-[3px]",
					role: "img",
					"aria-label": "iKAN Score by day, last 30 days",
					children: series.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 rounded-t-[3px]",
						style: {
							height: v === null ? 3 : `${Math.max(6, v)}%`,
							background: v === null ? "rgba(0,0,0,.08)" : toneColors[wellnessBand(v).tone].bar
						}
					}, i))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex justify-between text-[11px] text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: short(days[0]) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: short(days[15]) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Today" })
					]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[14px] leading-5 text-muted-foreground",
					children: "Your score is saved each day you open iKAN. The chart appears from your second day."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-3 divide-x divide-foreground/10 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
							value: score,
							label: "Today"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
							value: weekAgo ?? null,
							label: "Last week"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
							value: best,
							label: "Your best"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "What moved it" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-4 overflow-hidden rounded-[24px] border border-foreground/10",
				children: [
					present.length === 0 && hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-4 text-[14px] text-muted-foreground",
						children: "Nothing has been logged yet."
					}) : null,
					present.map((p) => {
						const pts = Math.round((p.value - 50) * p.weight / data.totalWeight);
						const meta = partMeta[p.key];
						const on = open === p.key;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-foreground/10 last:border-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-expanded": on,
								onClick: () => setOpen(on ? null : p.key),
								className: cn("flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left", stateLayer),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-2.5 w-2.5 shrink-0 rounded-full",
										style: { background: meta.color }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-[15px] font-medium",
											children: p.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-[13px] text-muted-foreground",
											children: p.detail
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-[17px] font-semibold tabular-nums",
										style: { color: pts > 0 ? toneColors.success.fg : pts < 0 ? toneColors.error.fg : void 0 },
										children: pts > 0 ? `+${pts}` : pts < 0 ? `−${Math.abs(pts)}` : "0"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-4 w-4 text-muted-foreground transition-transform", on && "rotate-180") })
								]
							}), on ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-4 pb-4 pl-[38px] text-[13px] leading-5 text-muted-foreground",
								children: [
									"Scores ",
									Math.round(p.value),
									" of 100 and carries",
									" ",
									Math.round(p.weight / data.totalWeight * 100),
									"% of your score, so it moves the total by ",
									pts > 0 ? `+${pts}` : pts,
									" against a middle reading of 50.",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: meta.to,
										className: "font-semibold text-foreground underline underline-offset-4",
										children: meta.cta
									})
								]
							}) : null]
						}, p.key);
					}),
					hydrated ? data.drafts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/assessment-flow",
						search: { id: d.assessment.slug },
						className: cn("flex min-h-14 items-center gap-3 border-t border-foreground/10 px-4 py-3", stateLayer),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 shrink-0 rounded-full border-2 border-foreground/30" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-[15px] font-medium",
									children: [d.assessment.name, " unfinished · held"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-[13px] text-muted-foreground",
									children: [
										d.answered,
										" of ",
										d.assessment.questions.length,
										" answered, tap to finish"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-[17px] font-semibold",
								children: "0"
							})
						]
					}, d.assessment.slug)) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-4 mt-2 text-[12px] leading-5 text-muted-foreground",
				children: "Tap a factor to see why. A part-finished assessment contributes nothing until it is complete — it does not count against you."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Everything on one axis" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OneAxis, {
				data,
				hydrated,
				days
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Where it comes from" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mx-4 overflow-hidden rounded-[24px] bg-secondary",
				children: data.parts.map((p) => {
					const meta = partMeta[p.key];
					const Icon = meta.icon;
					const has = hydrated && p.value !== null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "border-b border-background last:border-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: meta.to,
							className: cn("flex min-h-16 items-center gap-3 px-4 py-3", stateLayer),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-10 w-10 shrink-0 place-items-center rounded-[12px] text-white",
									style: { background: meta.color },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[15px] font-medium",
										children: p.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-[13px] text-muted-foreground",
										children: hydrated ? p.detail : ""
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block font-display text-[17px] font-semibold tabular-nums",
										children: [p.weight, "%"]
									}), !has ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[11px] text-muted-foreground",
										children: "not counted"
									}) : null]
								})
							]
						})
					}, p.key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-4 mt-2 text-[12px] leading-5 text-muted-foreground",
				children: "Sources without data are left out and the others share their weight, so you aren’t marked down for what you haven’t started."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Reading it" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-4 text-[15px] leading-6 text-muted-foreground",
				children: "The score is a summary, not a diagnosis. If it drops and you don’t know why, the factors above show what changed and when."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-4 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex h-8 items-center gap-1.5 rounded-full bg-secondary px-3 text-[13px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), " Never shared"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex h-8 items-center gap-1.5 rounded-full bg-secondary px-3 text-[13px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "h-4 w-4" }), " Stored on this device"]
				})]
			})
		]
	}) });
}
function SectionTitle({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "mx-4 mb-3 mt-8 font-display text-[16px] font-semibold",
		children
	});
}
function Mini({ value, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-display text-[22px] font-semibold tabular-nums",
		children: value ?? "—"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[12px] text-muted-foreground",
		children: label
	})] });
}
function OneAxis({ data, hydrated, days }) {
	const keys = days.map(dayKey);
	const moodByDay = keys.map((k) => {
		const list = hydrated ? data.journal.entries.filter((e) => e.date === k) : [];
		return list.length ? list.reduce((n, e) => n + e.mood, 0) / list.length : null;
	});
	const programDays = keys.map((k) => hydrated ? data.events.filter((e) => e.type === "program" && dayKey(new Date(e.at)) === k).length : 0);
	const assessDays = keys.map((k) => hydrated ? data.events.filter((e) => e.type === "assessment" && dayKey(new Date(e.at)) === k) : []);
	const moodColor = (m) => [
		"#D2544F",
		"#E39A5A",
		"#D9C36A",
		"#8CC7AC",
		"#3E9B6C"
	][Math.round(m) - 1];
	const counts = {
		mood: moodByDay.filter((v) => v !== null).length,
		program: programDays.reduce((n, v) => n + v, 0),
		assess: assessDays.reduce((n, v) => n + v.length, 0)
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-4 rounded-[24px] border border-foreground/10 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lane, {
				icon: Smile,
				label: "Mood, daily",
				children: moodByDay.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-3 flex-1 rounded-[3px]",
					style: { background: m === null ? "rgba(0,0,0,.06)" : moodColor(m) },
					title: m === null ? void 0 : moodScale[Math.round(m) - 1].label
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lane, {
				icon: Moon,
				label: "Sleep, hours",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-3 flex-1 items-center justify-center rounded-[3px] border border-dashed border-foreground/20 text-[10px] text-muted-foreground",
					children: "Connect Health Connect to see sleep"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lane, {
				icon: Sparkles,
				label: "Program days done",
				children: programDays.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1 rounded-[3px]",
					style: {
						height: n ? 12 : 3,
						background: n ? "#4E8F75" : "rgba(0,0,0,.06)"
					}
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lane, {
				icon: ClipboardList,
				label: "Assessments",
				children: assessDays.map((list, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-3 flex-1 items-center justify-center",
					children: list.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "h-3 w-3 rotate-45 rounded-[2px]",
						style: { background: toneColors[list[0].tone ?? "warning"].bar }
					}) : null
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex justify-between pl-[112px] text-[11px] text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: short(days[0]) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: short(days[14]) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Today" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[13px] leading-5 text-muted-foreground",
				children: hydrated ? `In the last 30 days: ${counts.mood} days with a check-in, ${counts.program} program days and ${counts.assess} assessments.` : ""
			})
		]
	});
}
function Lane({ icon: Icon, label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 py-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex w-[104px] shrink-0 items-center gap-1.5 text-[12px] text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }),
				" ",
				label
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex flex-1 items-end gap-[2px]",
			children
		})]
	});
}
function ScoreRing({ score }) {
	const r = 80;
	const c = 2 * Math.PI * r;
	const pct = score === null ? 0 : score / 100;
	const band = score !== null ? wellnessBand(score) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-[200px] w-[200px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 200 200",
			className: "h-full w-full -rotate-90",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "ring",
					x1: "0",
					y1: "0",
					x2: "1",
					y2: "1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0",
							stopColor: "#9BE3C3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0.6",
							stopColor: "#5FB8D6"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "1",
							stopColor: "#B7A4F0"
						})
					]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "100",
					cy: "100",
					r,
					fill: "none",
					stroke: "rgba(255,255,255,0.12)",
					strokeWidth: "16"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "100",
					cy: "100",
					r,
					fill: "none",
					stroke: "url(#ring)",
					strokeWidth: "16",
					strokeLinecap: "round",
					strokeDasharray: c,
					strokeDashoffset: c * (1 - pct),
					className: "transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 grid place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-[60px] font-bold leading-none tabular-nums",
				children: score ?? "—"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[13px] opacity-70",
				children: band ? `${band.label} · of 100` : "of 100"
			})] })
		})]
	});
}
function Aurora() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 400 400",
		preserveAspectRatio: "xMidYMid slice",
		className: "absolute inset-0 h-full w-full",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
					id: "a1",
					cx: "0.2",
					cy: "0.1",
					r: "0.6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0",
						stopColor: "#3FB68B",
						stopOpacity: "0.55"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "1",
						stopColor: "#3FB68B",
						stopOpacity: "0"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
					id: "a2",
					cx: "0.9",
					cy: "0.3",
					r: "0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0",
						stopColor: "#7C6FE0",
						stopOpacity: "0.5"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "1",
						stopColor: "#7C6FE0",
						stopOpacity: "0"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
					id: "a3",
					cx: "0.5",
					cy: "1",
					r: "0.6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0",
						stopColor: "#2F8FB5",
						stopOpacity: "0.45"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "1",
						stopColor: "#2F8FB5",
						stopOpacity: "0"
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "400",
				height: "400",
				fill: "url(#a1)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "400",
				height: "400",
				fill: "url(#a2)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "400",
				height: "400",
				fill: "url(#a3)"
			})
		]
	});
}
//#endregion
export { ScorePage as component };
