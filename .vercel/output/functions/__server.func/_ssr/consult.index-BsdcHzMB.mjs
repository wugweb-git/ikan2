import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Avatar } from "./art-CKGIg2zx.mjs";
import { p as useAssessmentStore, r as getAssessment } from "./store-CsxAZBJN.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Bt as CalendarClock, Dt as Clock3, Mt as ChevronRight, U as MapPin, Zt as BadgeCheck, _ as Sparkles, g as Star } from "../_libs/lucide-react.mjs";
import { a as getConsultant, b as useHydrated, d as nextLabel, i as fromPrice, l as initials, n as consultants, p as rupees, r as fits, t as IkanShell, u as matchesFor, v as useBookings } from "./ikan-shell-BVeIbGxw.mjs";
import { m as stateLayer, p as accentStyle } from "./m3-Blvbxy5D.mjs";
import { i as when, n as param, r as roles, t as Route } from "./consult.index-oWWxyc82.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/consult.index-BsdcHzMB.js
var import_jsx_runtime = require_jsx_runtime();
function ConsultPage() {
	const hydrated = useHydrated();
	const { results } = useAssessmentStore();
	const { bookings } = useBookings();
	const search = Route.useSearch();
	const navigate = useNavigate();
	const role = roles.find((r) => param(r) === search.role) ?? "All";
	const time = when.find((w) => param(w) === search.when) ?? "Any time";
	const setFilters = (next) => navigate({
		to: "/consult",
		search: next,
		replace: true,
		resetScroll: false
	});
	const setRole = (r) => setFilters({
		...r === "All" ? {} : { role: param(r) },
		...search.when ? { when: search.when } : {}
	});
	const setTime = (w) => setFilters({
		...search.role ? { role: search.role } : {},
		...w === "Any time" ? {} : { when: param(w) }
	});
	const latest = hydrated ? [...results].sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0] : void 0;
	const latestAssessment = latest ? getAssessment(latest.slug) : void 0;
	const areas = latestAssessment ? matchesFor[latestAssessment.category] ?? [] : [];
	const upcoming = hydrated ? bookings.find((b) => b.status === "requested" && new Date(b.startsAt) > /* @__PURE__ */ new Date()) : void 0;
	const upcomingWith = upcoming ? getConsultant(upcoming.consultantId) : void 0;
	const list = consultants.filter((c) => role === "All" || c.role === role).filter((c) => time === "Any time" ? true : time === "Today" ? c.next.inDays === 0 : time === "Tomorrow" ? c.next.inDays <= 1 : c.next.inDays <= 6).sort((a, b) => Number(fits(b, areas)) - Number(fits(a, areas)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle("night"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "px-4 pb-1 pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-[32px] font-semibold leading-10",
					children: "Find your consultant"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[15px] text-muted-foreground",
					children: "Connect with experienced mental health professionals who understand your needs."
				})]
			}),
			upcoming && upcomingWith ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/consult/$id",
				params: { id: upcomingWith.id },
				className: cn("mx-4 mt-5 flex items-center gap-3 rounded-[24px] bg-foreground p-4 text-background", stateLayer),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						text: initials(upcomingWith.name),
						hue: upcomingWith.hue,
						size: 48,
						photo: upcomingWith.photo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[12px] opacity-75",
								children: "Upcoming session"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate font-display text-[16px] font-semibold",
								children: upcomingWith.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-0.5 flex items-center gap-1.5 text-[13px] opacity-85",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-4 w-4" }),
									new Date(upcoming.startsAt).toLocaleString("en-IN", {
										weekday: "short",
										day: "numeric",
										month: "short",
										hour: "numeric",
										minute: "2-digit"
									}),
									", ",
									upcoming.mode
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 opacity-70" })
				]
			}) : null,
			latestAssessment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-4 flex gap-3 rounded-[20px] bg-[var(--accent-container)] p-4 text-[var(--on-accent-container)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mt-0.5 h-5 w-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[14px] leading-5",
					children: [
						"Based on your latest ",
						latestAssessment.name.toLowerCase(),
						" assessment, consultants who work with ",
						areas.join(" or ").toLowerCase(),
						" are shown first."
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/assessments",
				className: cn("mx-4 mt-4 flex items-center gap-3 rounded-[20px] bg-secondary p-4", stateLayer),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 shrink-0 text-[var(--accent-strong)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 text-[14px] leading-5",
						children: "Take an assessment and we’ll show the consultants who fit first."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chips, {
					label: "Role",
					options: roles,
					value: role,
					onChange: setRole
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chips, {
					label: "Availability",
					options: when,
					value: time,
					onChange: setTime
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 px-4 text-[13px] text-muted-foreground",
				children: [
					list.length,
					" ",
					list.length === 1 ? "consultant" : "consultants",
					" found"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-3 px-4",
				children: list.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConsultantCard, {
					c,
					recommended: fits(c, areas)
				}) }, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mx-auto mt-6 max-w-xs px-4 text-center text-[12px] leading-5 text-muted-foreground",
				children: [
					"In a crisis, don’t wait for a booking.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/support",
						className: "font-semibold text-foreground underline underline-offset-4",
						children: "Get support now"
					})
				]
			})
		]
	}) });
}
function Chips({ label, options, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "no-scrollbar flex gap-2 overflow-x-auto px-4",
		role: "radiogroup",
		"aria-label": label,
		children: options.map((o) => {
			const on = o === value;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "radio",
				"aria-checked": on,
				onClick: () => onChange(o),
				className: cn("inline-flex h-9 shrink-0 items-center rounded-[8px] border px-3.5 text-[14px] font-medium transition-colors", stateLayer, on ? "border-transparent bg-[var(--accent-container)] text-[var(--on-accent-container)]" : "border-foreground/20"),
				children: o
			}, o);
		})
	});
}
function ConsultantCard({ c, recommended }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/consult/$id",
		params: { id: c.id },
		className: cn("block rounded-[24px] border border-foreground/10 bg-background p-4", stateLayer),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					text: initials(c.name),
					hue: c.hue,
					size: 64,
					photo: c.photo
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						recommended ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mb-1 inline-flex h-6 items-center gap-1 rounded-full bg-[var(--accent-container)] px-2 text-[12px] font-semibold text-[var(--on-accent-container)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-3.5 w-3.5" }), " Recommended"]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-[17px] font-semibold leading-6",
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[13px] text-muted-foreground",
							children: c.credentials
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 font-semibold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-[#E3A008] text-[#E3A008]" }),
										" ",
										c.rating,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-normal text-muted-foreground",
											children: [
												"(",
												c.reviews,
												")"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: c.role
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [c.years, "+ yrs"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 flex items-center gap-1 text-[13px] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }),
								" ",
								c.city
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-1.5",
				children: c.specializes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-[8px] bg-secondary px-2.5 py-1 text-[12px]",
					children: s
				}, s))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-3 border-t border-foreground/10 pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[12px] text-muted-foreground",
							children: "From"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-[17px] font-semibold",
							children: rupees(fromPrice(c))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 text-[13px] text-[var(--accent-strong)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "h-4 w-4" }),
							" ",
							nextLabel(c)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex h-10 items-center rounded-full bg-foreground px-4 text-[14px] font-semibold text-background",
						children: "Book"
					})
				]
			})
		]
	});
}
//#endregion
export { ConsultPage as component };
