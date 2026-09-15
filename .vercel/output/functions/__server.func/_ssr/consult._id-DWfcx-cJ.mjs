import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as Avatar } from "./art-CKGIg2zx.mjs";
import { t as addDays } from "./journal-Cd2_QpOm.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, F as Phone, Ft as Check, H as MessageCircle, Ht as Briefcase, M as Quote, Pt as ChevronDown, U as MapPin, V as Monitor, Vt as CalendarCheck, _ as Sparkles, et as Languages, g as Star, m as ThumbsUp, o as Video, ut as GraduationCap } from "../_libs/lucide-react.mjs";
import { a as getConsultant, b as useHydrated, c as hourLabel, d as nextLabel, g as slotHours, l as initials, p as rupees, t as IkanShell, v as useBookings } from "./ikan-shell-BVeIbGxw.mjs";
import { f as TopAppBar, m as stateLayer, n as Button, p as accentStyle, r as IconButton, t as BottomSheet } from "./m3-Blvbxy5D.mjs";
import { t as Route } from "./consult._id-BbUwRqZ0.mjs";
import { t as AddToCalendar } from "./add-to-calendar-D-4t2UWP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/consult._id-DWfcx-cJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var formatIcon = {
	Online: Monitor,
	Offline: MapPin,
	Call: Phone,
	Chat: MessageCircle,
	Video
};
function ConsultantPage() {
	const { id } = Route.useLoaderData();
	const c = getConsultant(id);
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle("night"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, {
				className: "bg-[var(--accent-container)]",
				leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
					label: "Back",
					onClick: () => navigate({ to: "/consult" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "bg-[var(--accent-container)] px-4 pb-6 text-[var(--on-accent-container)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						text: initials(c.name),
						hue: c.hue,
						size: 88,
						photo: c.photo
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-[24px] font-semibold leading-7",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[14px] opacity-80",
								children: c.credentials
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 inline-flex items-center gap-1 text-[14px] font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-[#E3A008] text-[#E3A008]" }),
									" ",
									c.rating,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-normal opacity-75",
										children: [
											"(",
											c.reviews,
											" reviews)"
										]
									})
								]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid grid-cols-3 gap-2 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							icon: Briefcase,
							value: `${c.years} yrs`,
							label: "Experience"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							icon: MapPin,
							value: c.city.replace(", India", ""),
							label: "City"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							icon: CalendarCheck,
							value: nextLabel(c).split(",")[0],
							label: "Next open"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "px-4 pt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] font-semibold text-muted-foreground",
						children: c.role
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: c.formats.map((f) => {
							const Icon = formatIcon[f] ?? Monitor;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-foreground/15 px-3 text-[13px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }),
									" ",
									f
								]
							}, f);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 flex items-center gap-2 text-[14px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "h-4 w-4 text-muted-foreground" }),
							" ",
							c.languages.join(", ")
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "px-4 font-display text-[16px] font-semibold",
					children: "Concerns I can help with"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "no-scrollbar mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-1",
					children: c.concerns.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "w-[220px] shrink-0 snap-start rounded-[20px] bg-secondary p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { className: "h-5 w-5 text-[var(--accent)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
							className: "mt-2 text-[15px] leading-6",
							children: q
						})]
					}, q))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[16px] font-semibold",
					children: "I offer therapy for"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: c.therapyFor.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-[8px] bg-[var(--accent-container)] px-3 py-1.5 text-[13px] text-[var(--on-accent-container)]",
						children: t
					}, t))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[16px] font-semibold",
					children: "About"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[15px] leading-6 text-muted-foreground",
					children: c.about
				})]
			}),
			c.approaches.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[16px] font-semibold",
					children: "Approaches"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: c.approaches.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 rounded-[14px] bg-secondary px-4 py-3 text-[15px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 shrink-0 text-[var(--accent-strong)]" }),
							" ",
							a
						]
					}, a))
				})]
			}) : null,
			c.qualifications.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[16px] font-semibold",
					children: "Qualifications"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: c.qualifications.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-3 text-[15px] leading-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" }),
							" ",
							q
						]
					}, q))
				})]
			}) : null,
			c.review ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-[16px] font-semibold",
					children: [
						"Reviews (",
						c.reviews,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "mt-3 rounded-[20px] border border-foreground/10 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-[13px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex",
									"aria-label": `${c.review.rating} out of 5`,
									children: [
										0,
										1,
										2,
										3,
										4
									].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: i < c.review.rating ? "h-3.5 w-3.5 fill-[#E3A008] text-[#E3A008]" : "h-3.5 w-3.5 text-foreground/20" }, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: c.review.name
								}),
								c.review.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Verified"
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
							className: "mt-2 text-[15px] leading-6",
							children: c.review.text
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "mt-2 flex items-center gap-1.5 text-[12px] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-3.5 w-3.5" }),
								" Helpful (",
								c.review.helpful,
								")"
							]
						})
					]
				})]
			}) : null,
			c.faq ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[16px] font-semibold",
					children: "Frequently asked"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "group mt-3 rounded-[20px] bg-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
						className: "flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 text-[15px] font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1",
							children: c.faq.q
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-5 w-5 transition-transform group-open:rotate-180" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-4 pb-4 text-[15px] leading-6 text-muted-foreground",
						children: c.faq.a
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Booking, { c })
		]
	}) });
}
function Fact({ icon: Icon, value, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[16px] bg-background/70 px-2 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mx-auto h-5 w-5" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 truncate text-[14px] font-semibold",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] opacity-70",
				children: label
			})
		]
	});
}
function Booking({ c }) {
	const hydrated = useHydrated();
	const { bookings, book, cancel } = useBookings();
	const [mode, setMode] = (0, import_react.useState)(c.sessions[0].mode);
	const [dayOffset, setDayOffset] = (0, import_react.useState)(c.next.inDays);
	const [hour, setHour] = (0, import_react.useState)(null);
	const [confirming, setConfirming] = (0, import_react.useState)(false);
	const [booked, setBooked] = (0, import_react.useState)(null);
	const [done, setDone] = (0, import_react.useState)(false);
	const price = c.sessions.find((s) => s.mode === mode).price;
	const today = /* @__PURE__ */ new Date();
	const days = Array.from({ length: 7 }, (_, i) => c.next.inDays + i);
	const day = addDays(today, dayOffset);
	const openHours = slotHours.filter((h) => {
		if (dayOffset === c.next.inDays && h < c.next.hour) return false;
		if (dayOffset === 0 && h <= today.getHours()) return false;
		return true;
	});
	const mine = hydrated ? bookings.filter((b) => b.consultantId === c.id && b.status === "requested") : [];
	const startsAt = () => {
		const d = new Date(day);
		d.setHours(hour ?? 0, 0, 0, 0);
		return d;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "book",
		className: "mx-4 mt-8 rounded-[28px] border border-foreground/10 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-[20px] font-semibold",
				children: "Book appointment"
			}),
			mine.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: mine.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 rounded-[16px] bg-[var(--accent-container)] p-3 text-[var(--on-accent-container)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-5 w-5 shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1 text-[14px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-semibold",
									children: "Requested"
								}),
								new Date(b.startsAt).toLocaleString("en-IN", {
									weekday: "short",
									day: "numeric",
									month: "short",
									hour: "numeric",
									minute: "2-digit"
								}),
								", ",
								b.mode
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => cancel(b.id),
							className: cn("h-9 rounded-full px-3 text-[13px] font-semibold", stateLayer),
							children: "Cancel"
						})
					]
				}, b.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-[13px] font-semibold text-muted-foreground",
				children: "Session type"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("mt-2 grid gap-2", c.sessions.length === 4 ? "grid-cols-2" : "grid-cols-3"),
				role: "radiogroup",
				"aria-label": "Session type",
				children: c.sessions.map((s) => {
					const on = s.mode === mode;
					const Icon = formatIcon[s.mode] ?? Monitor;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "radio",
						"aria-checked": on,
						onClick: () => setMode(s.mode),
						className: cn("flex flex-col items-center gap-1 rounded-[16px] border py-3 transition-colors", stateLayer, on ? "border-transparent bg-foreground text-background" : "border-foreground/15"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[13px] font-medium",
								children: s.mode
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[13px] font-semibold",
								children: rupees(s.price)
							})
						]
					}, s.mode);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-[13px] font-semibold text-muted-foreground",
				children: "Date"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4",
				role: "radiogroup",
				"aria-label": "Date",
				children: days.map((offset) => {
					const d = addDays(today, offset);
					const on = offset === dayOffset;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "radio",
						"aria-checked": on,
						onClick: () => {
							setDayOffset(offset);
							setHour(null);
						},
						className: cn("flex h-[72px] w-14 shrink-0 flex-col items-center justify-center rounded-[16px] transition-colors", stateLayer, on ? "bg-[var(--accent-strong)] text-background" : "bg-secondary"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[12px] opacity-80",
							children: offset === 0 ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-[18px] font-semibold",
							children: d.getDate()
						})]
					}, offset);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-[13px] font-semibold text-muted-foreground",
				children: "Time"
			}),
			openHours.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid grid-cols-3 gap-2",
				role: "radiogroup",
				"aria-label": "Time",
				children: openHours.map((h) => {
					const on = h === hour;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "radio",
						"aria-checked": on,
						onClick: () => setHour(h),
						className: cn("h-11 rounded-[12px] border text-[14px] font-medium tabular-nums transition-colors", stateLayer, on ? "border-transparent bg-[var(--accent-container)] text-[var(--on-accent-container)]" : "border-foreground/15"),
						children: hourLabel(h)
					}, h);
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 rounded-[12px] bg-secondary px-4 py-3 text-[14px] text-muted-foreground",
				children: "No times left on this day. Pick another date."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex items-center justify-between border-t border-foreground/10 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[12px] text-muted-foreground",
					children: "Session fee"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-[22px] font-semibold",
					children: rupees(price)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: hour === null,
					onClick: () => setConfirming(true),
					children: "Request appointment"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomSheet, {
				open: confirming,
				onClose: () => {
					setConfirming(false);
					setDone(false);
				},
				title: done ? "Request sent" : "Confirm your request",
				children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								className: "h-8 w-8",
								strokeWidth: 3
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-[15px] leading-6 text-muted-foreground",
							children: [
								"Your request with ",
								c.name,
								" is saved in My history. Booking and payment aren’t connected in this preview yet."
							]
						}),
						booked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddToCalendar, {
							className: "mt-5 w-full",
							label: "Add to calendar",
							filename: "ikan-consultation",
							event: {
								title: `iKAN consultation with ${c.name}`,
								details: `${booked.mode} session. Requested in iKAN; you’ll get a confirmation before it’s final.`,
								start: new Date(booked.startsAt),
								minutes: 50,
								url: "https://app.ikanhealth.in/history",
								alertBefore: 30
							}
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/history",
								className: "inline-flex h-12 items-center justify-center rounded-full bg-foreground text-[15px] font-semibold text-background",
								children: "See my history"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "text",
								onClick: () => {
									setConfirming(false);
									setDone(false);
								},
								children: "Done"
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-[20px] bg-secondary p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						text: initials(c.name),
						hue: c.hue,
						size: 48,
						photo: c.photo
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[14px] text-muted-foreground",
								children: [
									day.toLocaleDateString("en-IN", {
										weekday: "long",
										day: "numeric",
										month: "long"
									}),
									", ",
									hour !== null ? hourLabel(hour) : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[14px] text-muted-foreground",
								children: [
									mode,
									" session, ",
									rupees(price)
								]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							const at = startsAt().toISOString();
							book({
								consultantId: c.id,
								mode,
								price,
								startsAt: at
							});
							setBooked({
								mode,
								startsAt: at
							});
							setHour(null);
							setDone(true);
						},
						children: "Send request"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "text",
						onClick: () => setConfirming(false),
						children: "Go back"
					})]
				})] })
			})
		]
	});
}
//#endregion
export { ConsultantPage as component };
