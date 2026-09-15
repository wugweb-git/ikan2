import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as riskEndorsed, f as scoreAll, i as headlineOf, p as useAssessmentStore, r as getAssessment, u as recommendationsFor } from "./store-CsxAZBJN.mjs";
import { a as getProgramme } from "./programs-DrKO9d_v.mjs";
import { C as useImportStatus, D as useSyncStatus } from "./auth-xMCnsA0H.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Q as LifeBuoy, at as History, d as TrendingUp, f as TrendingDown, n as X } from "../_libs/lucide-react.mjs";
import { b as useHydrated, t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { f as TopAppBar, m as stateLayer, n as Button, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { c as toneStyle, l as valueText, n as RangeBar, o as severityContent, r as bandStyle, t as BandChip } from "./ui-CSQedWKe.mjs";
import { n as Route, t as ResultLoading } from "./assessments._slug.result._id-BGJ93hSH.mjs";
import { t as DateText } from "./date-text-HAjSU3S3.mjs";
import { n as PrintHeader, r as ShareButton, t as BrandTitle } from "./result-share-Dh_gwfrl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assessments._slug.result._id-DZAC7RfG.js
var import_jsx_runtime = require_jsx_runtime();
var dateTime = (iso) => {
	const d = new Date(iso);
	return `${d.toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	})}, ${d.toLocaleTimeString("en-IN", {
		hour: "numeric",
		minute: "2-digit"
	})}`;
};
var duration = (secs) => {
	if (!Number.isFinite(secs) || secs <= 0) return null;
	if (secs < 60) return `${Math.round(secs)} sec`;
	const m = Math.floor(secs / 60);
	const s = Math.round(secs % 60);
	return s === 0 ? `${m} min` : `${m} min ${s} sec`;
};
/** Shown while the result is being read, including while past results are still arriving. */
function ResultPage() {
	const { slug, id } = Route.useLoaderData();
	const a = getAssessment(slug);
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const store = useAssessmentStore();
	const importing = useImportStatus().state === "running";
	const syncing = useSyncStatus().state === "syncing";
	const history = store.resultsFor(slug);
	const result = history.find((x) => x.id === id);
	const bar = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, {
		leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
			label: "Close",
			onClick: () => navigate({ to: "/assessments" }),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-6 w-6" })
		}),
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandTitle, {}),
		trailing: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareButton, {
			subject: `${a.title}: my iKAN result`,
			body: shareText(a, result)
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/history/assessments/$slug",
			params: { slug: a.slug },
			"aria-label": "All results",
			className: cn("grid h-12 w-12 place-items-center rounded-full", stateLayer),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-6 w-6" })
		})] })
	});
	if (!hydrated || !result && (importing || syncing)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultLoading, {});
	if (!result) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle("mind"),
		children: [bar, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-6 pt-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-[22px] font-semibold",
					children: "Result not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-[15px] text-muted-foreground",
					children: [
						"This result isn’t on this device. See all your ",
						a.title.toLowerCase(),
						" results, or take it again."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outlined",
						onClick: () => navigate({
							to: "/history/assessments/$slug",
							params: { slug }
						}),
						children: "All results"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => navigate({
							to: "/assessment-flow",
							search: { id: slug }
						}),
						children: "Take assessment"
					})]
				})
			]
		})]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle("mind"),
		children: [
			bar,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintHeader, { title: `${a.title} result` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultBody, {
				a,
				result,
				previous: history.find((x) => x.completedAt < result.completedAt)
			})
		]
	}) });
}
/** Plain-text summary for email: assessment, date, each score with its level. */
function shareText(a, result) {
	const scores = scoreAll(a, result.answers);
	return [
		`${a.title} (${a.instrument})`,
		new Date(result.completedAt).toDateString(),
		...scores.map((s) => `${s.score.label}: ${s.band?.label ?? "not scored"}, ${valueText(s)}`),
		headlineOf(a, scores)?.band?.interpretation ?? "",
		"This is a screening, not a diagnosis."
	].filter(Boolean).join("\n");
}
function ResultBody({ a, result, previous }) {
	const navigate = useNavigate();
	const scores = scoreAll(a, result.answers);
	const head = headlineOf(a, scores);
	const rest = scores.filter((s) => s !== head);
	const complete = scores.every((s) => s.value !== null);
	const risk = riskEndorsed(a, result.answers);
	const severe = scores.some((s) => s.band?.tone === "error");
	const programmes = recommendationsFor(a, scores).map(getProgramme).filter((p) => p !== void 0);
	const prevHead = previous ? headlineOf(a, scoreAll(a, previous.answers)) : null;
	const time = duration(result.seconds);
	if (!complete) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-6 pt-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-[22px] font-semibold",
				children: "This result couldn’t be scored"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[15px] text-muted-foreground",
				children: "Some answers are missing. Take the assessment again to get a result."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				onClick: () => navigate({
					to: "/assessment-flow",
					search: { id: a.slug }
				}),
				children: "Retake assessment"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-fade pb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "px-4 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateText, { children: dateTime(result.completedAt) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-[26px] font-semibold leading-8",
						children: a.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 flex flex-wrap gap-x-3 text-[14px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [a.questions.length, " questions"] }),
							a.scores.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [a.scores.length, " scores"] }) : null,
							time ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: time }) : null
						]
					})
				]
			}),
			head?.band ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadlineCard, { r: head }) : null,
			risk ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-4 mt-4 rounded-[24px] p-5",
				style: {
					...toneStyle("error"),
					background: "var(--tone-container)"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "h-6 w-6 text-[var(--tone)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-[18px] font-semibold text-[var(--tone)]",
						children: "You don’t have to carry this alone"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[15px] leading-6",
						children: "You said you’ve had thoughts of being better off dead or of hurting yourself. Talking to someone today can help. These lines are free, confidential and open all day."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/support",
						className: cn("mt-4 inline-flex h-12 items-center rounded-full bg-foreground px-6 text-[15px] font-semibold text-background", stateLayer),
						children: "Get support now"
					})
				]
			}) : null,
			rest.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[16px] font-semibold",
					children: head ? a.category === "burnout" ? "By area" : "Also screened" : "Your scores"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 overflow-hidden rounded-[20px] bg-secondary",
					children: rest.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: cn("px-4 py-4", i > 0 && "border-t border-background"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRow, { r: s })
					}, s.score.id))
				})]
			}) : null,
			prevHead?.band && head?.band && previous ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Change, {
				now: head,
				before: prevHead,
				on: previous.completedAt
			}) : null,
			programmes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[16px] font-semibold",
					children: "Recommended for you"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-3",
					children: programmes.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/program/$slug",
						params: { slug: p.slug },
						style: accentStyle(p.accent),
						className: cn("flex overflow-hidden rounded-[20px] bg-secondary", stateLayer),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.cover,
							alt: "",
							className: "w-[88px] shrink-0 object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1 p-4",
							children: [
								i === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[12px] font-semibold text-[var(--accent-strong)]",
									children: "Best match"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-display text-[17px] font-semibold",
									children: p.name
								}),
								p.source.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 line-clamp-2 text-[13px] leading-5 text-muted-foreground",
									children: p.source.description
								}) : null
							]
						})]
					}) }, p.slug))
				})]
			}) : null,
			severe && !risk ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-4 mt-6 flex items-start gap-3 rounded-[20px] border border-foreground/10 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "mt-0.5 h-5 w-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[15px] leading-6",
					children: "Talking to a professional can help with what this result shows."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/support",
					className: "mt-1 inline-block text-[15px] font-semibold underline underline-offset-4",
					children: "See support options"
				})] })]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[16px] font-semibold",
					children: "What this measured"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-[15px] leading-6 text-muted-foreground",
					children: [
						a.instrument,
						". ",
						a.scores.map((s) => `${s.label} (${s.instrument})`).join(", "),
						"."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex gap-3 px-4 print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outlined",
					className: "flex-1",
					onClick: () => navigate({
						to: "/assessment-flow",
						search: { id: a.slug }
					}),
					children: "Retake"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "flex-1",
					onClick: () => navigate({ to: "/" }),
					children: "Back to home"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-6 max-w-xs px-4 text-center text-[12px] leading-5 text-muted-foreground",
				children: "This is a screening, not a diagnosis. iKAN supports, but never replaces, care from a qualified professional."
			})
		]
	});
}
/** The old iKan severity wording under a band, e.g. "Moderately severe · Significant symptoms…". */
function SeverityLine({ severity }) {
	const c = severityContent[severity];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-2 inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-[13px] font-medium text-[var(--tone)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "h-2 w-2 shrink-0 rounded-full",
				style: { background: "var(--tone-bar)" },
				"aria-hidden": "true"
			}),
			c.label,
			" · ",
			c.description
		]
	});
}
function HeadlineCard({ r }) {
	const band = r.band;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-4 mt-5 rounded-[28px] p-5",
		style: {
			...bandStyle(band),
			background: "var(--tone-container)"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[14px] font-medium text-[var(--tone)]",
				children: [
					r.score.label,
					", ",
					r.score.instrument
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-display text-[34px] font-bold leading-10 text-[var(--tone)]",
				children: band.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityLine, { severity: band.severity }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-[15px] tabular-nums",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold",
					children: valueText(r)
				}), r.profile.direction === "better" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: ", higher is better"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeBar, {
					result: r,
					large: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex justify-between text-[12px] text-muted-foreground tabular-nums",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.profile.min }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.profile.max })]
				})]
			}),
			band.interpretation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-[16px] leading-6",
				children: band.interpretation
			}) : null
		]
	});
}
function ScoreRow({ r }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[16px] font-medium leading-6",
					children: r.score.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[13px] text-muted-foreground tabular-nums",
					children: [
						r.score.instrument,
						", ",
						valueText(r),
						r.profile.direction === "better" ? ", higher is better" : ""
					]
				})]
			}), r.band ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandChip, {
				label: r.band.label,
				tone: r.band.tone,
				severity: r.band.severity,
				className: "max-w-[48%] text-right"
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeBar, { result: r })
		}),
		r.band?.interpretation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-[14px] leading-5 text-muted-foreground",
			children: r.band.interpretation
		}) : null
	] });
}
function Change({ now, before, on }) {
	const diff = (now.value ?? 0) - (before.value ?? 0);
	const better = now.profile.direction === "better" ? diff > 0 : diff < 0;
	const same = Math.abs(diff) < 1e-9;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-4 mt-6 flex items-center gap-3 rounded-[20px] border border-foreground/10 p-4",
		children: [same ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(diff > 0 ? TrendingUp : TrendingDown, { className: "h-5 w-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-[15px] leading-6",
			children: [
				same ? "Same score as" : better ? "Better than" : now.profile.direction === "better" ? "Lower than" : "Higher than",
				" ",
				"your last result on",
				" ",
				new Date(on).toLocaleDateString("en-IN", {
					day: "numeric",
					month: "short"
				}),
				":",
				" ",
				before.band.label,
				", ",
				valueText(before),
				"."
			]
		})]
	});
}
//#endregion
export { ResultPage as component };
