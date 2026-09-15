import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as Illustration } from "./art-CKGIg2zx.mjs";
import { d as riskEndorsed, f as scoreAll, i as headlineOf, r as getAssessment, u as recommendationsFor } from "./store-CsxAZBJN.mjs";
import { a as getProgramme, l as res_anxiety_default, o as minutesOf, s as programmes, u as res_burnout_default } from "./programs-DrKO9d_v.mjs";
import { i as dayKey, s as moodScale, t as addDays } from "./journal-Cd2_QpOm.mjs";
import { E as useSettings, T as useProfile, a as cityName, h as profileInitials, i as aboutYouComplete, u as firstName } from "./auth-xMCnsA0H.mjs";
import { t as ProfilePhoto } from "./profile-photo-C6SkD_-8.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ct as CloudSun, It as ChartNoAxesColumn, Mt as ChevronRight, N as Plus, Ot as ClipboardList, P as Play, Q as LifeBuoy, Qt as ArrowUpRight, U as MapPin, Vt as CalendarCheck, _ as Sparkles, a as Watch, l as UserRoundPen, mt as Flame, n as X, ot as Heart, qt as Bell, tn as Activity, v as Smile, zt as CalendarDays } from "../_libs/lucide-react.mjs";
import { C as useWellnessSnapshots, _ as slugOf, b as useHydrated, f as resources, m as saveSnapshot, n as consultants, t as IkanShell, w as wellnessBand, x as useNotifications, y as useEverything } from "./ikan-shell-BVeIbGxw.mjs";
import { m as stateLayer, p as accentStyle } from "./m3-Blvbxy5D.mjs";
import { s as toneColors, t as BandChip } from "./ui-CSQedWKe.mjs";
import { t as DateText } from "./date-text-HAjSU3S3.mjs";
import { i as reassessReason, n as reassessCopy, r as reassessDismissed, t as dismissReassess } from "./reassess-8kd9MKRp.mjs";
import { t as useScrollY } from "./use-personal-context-Dw3fv5YZ.mjs";
import { a as refreshWeather, d as useDevice, m as weatherWord, t as checkMoodReminder } from "./device-DwMF_060.mjs";
import { i as useHealthConnect, n as autoSyncHealthConnect, r as recentAverage, t as PLAY_STORE_URL } from "./health-connect-C1qEs0Ca.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D50--NJR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var res_sleep_default = "/assets/res-sleep-B-OHXK65.jpg";
var partOf = (h) => h >= 5 && h < 8 ? "dawn" : h >= 8 && h < 12 ? "morning" : h >= 12 && h < 17 ? "afternoon" : h >= 17 && h < 20 ? "evening" : "night";
var sky = {
	dawn: {
		from: "#FFE4C9",
		via: "#FFD0A0",
		to: "#FFC085",
		ink: "#3A2210",
		muted: "#6E4A2E",
		greet: "Good morning"
	},
	morning: {
		from: "#E8F4FD",
		via: "#D4ECFB",
		to: "#B8DFF7",
		ink: "#12263A",
		muted: "#44607A",
		greet: "Good morning"
	},
	afternoon: {
		from: "#FFF8E1",
		via: "#FFE9B0",
		to: "#FFD97A",
		ink: "#3A2A05",
		muted: "#6E5820",
		greet: "Good afternoon"
	},
	evening: {
		from: "#E8D5F5",
		via: "#D4B8EA",
		to: "#C09FDE",
		ink: "#2A1740",
		muted: "#58446F",
		greet: "Good evening"
	},
	night: {
		from: "#2A2A3E",
		via: "#1E1E30",
		to: "#151525",
		ink: "#E8E8F0",
		muted: "#A0A0C0",
		greet: "Winding down"
	}
};
function useNow() {
	const [now, setNow] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setNow(/* @__PURE__ */ new Date());
		const t = window.setInterval(() => setNow(/* @__PURE__ */ new Date()), 6e4);
		return () => window.clearInterval(t);
	}, []);
	return now;
}
var covers = {
	"98d536d4-938b-4fbf-bc2c-f37e6d0b9409": res_burnout_default,
	"c775a1e1-a938-4aac-8519-e5ad9f8dda1f": res_sleep_default,
	"resource-1766237270444": res_anxiety_default
};
function Home() {
	const hydrated = useHydrated();
	const now = useNow();
	const scrollY = useScrollY();
	const { profile } = useProfile();
	const data = useEverything();
	const { unreadCount } = useNotifications();
	const score = hydrated ? data.score : null;
	(0, import_react.useEffect)(() => {
		if (score !== null) saveSnapshot(score);
	}, [score]);
	const device = useDevice();
	const { settings } = useSettings();
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		refreshWeather();
		autoSyncHealthConnect();
		if (Notification?.permission === "granted") import("./push-BWq7heyH.mjs").then((m) => m.enablePush({
			moodReminder: settings.moodReminders,
			time: settings.moodReminderTime
		}));
		checkMoodReminder({
			enabled: settings.moodReminders,
			time: settings.moodReminderTime,
			loggedToday: data.journal.entries.some((e) => e.date === dayKey(/* @__PURE__ */ new Date()))
		});
	}, [hydrated]);
	const city = hydrated ? cityName(profile.city) || device.location?.city || "" : "";
	const part = now ? partOf(now.getHours()) : "morning";
	const name = hydrated ? firstName(profile) : "";
	const greeting = `${sky[part].greet}${name && name !== "there" ? `, ${name}` : ""}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IkanShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("sticky-bar", scrollY > 150 && "sticky-bar-on"),
			"aria-hidden": scrollY <= 150,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "avatar avatar-sm overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePhoto, {
						src: hydrated ? profile.avatar : void 0,
						children: hydrated ? profileInitials(profile) : ""
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate font-display text-sm font-semibold",
					children: greeting
				}),
				score !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/wellness",
					className: "ml-auto text-xs font-semibold text-muted-foreground",
					children: ["iKAN Score ", score]
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkyHeader, {
			now,
			part,
			greeting,
			city,
			weather: hydrated && device.weather ? device.weather : void 0,
			unread: hydrated ? unreadCount : 0,
			initials: hydrated ? profileInitials(profile) : "",
			photo: hydrated ? profile.avatar : void 0,
			data,
			hydrated
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 -mt-6 space-y-8 rounded-t-[28px] bg-background pb-4 pt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayCard, {
					data,
					hydrated
				}),
				hydrated && !aboutYouComplete(profile) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutYouPrompt, {}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReassessPrompt, {
					data,
					hydrated
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCard, {
					score,
					data,
					hydrated
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentProgram, {
					data,
					hydrated
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickUp, {
					data,
					hydrated
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Recommended, {
					data,
					hydrated
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Offerings, {
					data,
					hydrated
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoodCheckin, {
					data,
					hydrated
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportCard, { city }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YourPrograms, {
					data,
					hydrated
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthCard, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThisWeek, {
					data,
					hydrated
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentResults, {
					data,
					hydrated
				})
			]
		})
	] });
}
function SkyHeader({ now, part, greeting, city, weather, unread, initials, photo, data, hydrated }) {
	const s = sky[part];
	const hour = now ? now.getHours() + now.getMinutes() / 60 : 9;
	const isDay = hour >= 6 && hour < 18;
	const t = isDay ? (hour - 6) / 12 : (hour + 24 - 18) % 24 / 12;
	const angle = Math.PI * (1 - t);
	const cx = 160 + 130 * Math.cos(angle);
	const cy = 118 - 92 * Math.sin(angle);
	const night = part === "night";
	const loggedToday = hydrated && now ? data.journal.entries.some((e) => e.date === dayKey(now)) : false;
	const weekCount = hydrated ? data.events.filter((e) => new Date(e.at) >= addDays(/* @__PURE__ */ new Date(), -6)).length : 0;
	const subline = !hydrated ? "" : data.events.length === 0 ? "Let’s find a good place to start." : loggedToday ? `${weekCount} ${weekCount === 1 ? "thing" : "things"} done this week.` : "You haven’t checked in today yet.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "relative overflow-hidden px-5 pb-14 pt-6 transition-colors duration-1000",
		style: {
			background: `linear-gradient(160deg, ${s.from}, ${s.via} 50%, ${s.to})`,
			color: s.ink
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 320 140",
			preserveAspectRatio: "xMidYMax slice",
			className: "pointer-events-none absolute inset-x-0 bottom-0 h-[150px] w-full",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M30 118 A130 92 0 0 1 290 118",
					fill: "none",
					stroke: s.ink,
					strokeOpacity: "0.16",
					strokeDasharray: "2 5"
				}),
				night ? [
					[40, 30],
					[80, 58],
					[120, 22],
					[210, 40],
					[262, 24],
					[290, 66],
					[180, 70]
				].map(([x, y], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: x,
					cy: y,
					r: i % 3 ? 1.2 : 1.8,
					fill: "#FBBF24",
					opacity: "0.85"
				}, i)) : null,
				now ? isDay ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					className: "motion-safe:transition-transform",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx,
						cy,
						r: "24",
						fill: part === "evening" ? "#FF8C42" : "#FFB347",
						opacity: "0.22"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx,
						cy,
						r: "13",
						fill: part === "evening" ? "#FF8C42" : part === "dawn" ? "#FFB347" : "#FFC83D"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx,
					cy,
					r: "13",
					fill: "#E8E4D4"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: cx + 5,
					cy: cy - 4,
					r: "11",
					fill: s.via
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M0 140 L0 124 C 70 112, 140 132, 210 120 S 300 112, 320 118 L320 140 Z",
					fill: s.ink,
					fillOpacity: "0.06"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex items-start gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex min-h-5 flex-wrap items-center gap-x-3 text-[13px] font-medium",
							style: { color: s.muted },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: now ? now.toLocaleDateString("en-IN", {
									weekday: "long",
									day: "numeric",
									month: "long"
								}) : "" }),
								city ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
											className: "h-3.5 w-3.5",
											"aria-hidden": "true"
										}),
										" ",
										city
									]
								}) : null,
								weather ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 tabular-nums",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudSun, {
											className: "h-3.5 w-3.5",
											"aria-hidden": "true"
										}),
										" ",
										weather.temp,
										"°",
										" ",
										weatherWord(weather.code)
									]
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-display text-[30px] font-semibold leading-9 tracking-[-0.01em]",
							children: greeting
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 min-h-5 text-[14px]",
							style: { color: s.muted },
							children: subline
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/notifications",
					"aria-label": unread ? `Notifications, ${unread} unread` : "Notifications",
					className: "relative grid h-11 w-11 shrink-0 place-items-center rounded-full transition-transform active:scale-95",
					style: { background: night ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.65)" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" }), unread ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#B3261E] px-1 text-[10px] font-bold text-white",
						children: unread
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/profile",
					"aria-label": "Profile",
					className: "grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full font-display text-[14px] font-semibold transition-transform active:scale-95",
					style: {
						background: night ? "rgba(255,255,255,.18)" : "#FFFFFF",
						color: night ? s.ink : "#151515"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePhoto, {
						src: photo,
						children: initials
					})
				})
			]
		})]
	});
}
function AboutYouPrompt() {
	const key = "ikan.about-you.dismissed";
	const [hidden, setHidden] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		try {
			setHidden(Boolean(window.localStorage.getItem(key)));
		} catch {
			setHidden(false);
		}
	}, []);
	if (hidden) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-4 flex items-center gap-3 rounded-[24px] border border-foreground/10 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRoundPen, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/welcome",
				search: { step: "about" },
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[15px] font-semibold",
					children: "Finish your profile"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[13px] leading-5 text-muted-foreground",
					children: "Date of birth, city and a few details, so suggestions fit you."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Not now",
				onClick: () => {
					try {
						window.localStorage.setItem(key, (/* @__PURE__ */ new Date()).toISOString());
					} catch {}
					setHidden(true);
				},
				className: "grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
			})
		]
	});
}
function HealthCard() {
	const hydrated = useHydrated();
	const h = useHealthConnect();
	if (!hydrated) return null;
	const steps = recentAverage(h.days, "steps");
	const sleep = recentAverage(h.days, "sleep_minutes");
	const rhr = recentAverage(h.days, "resting_heart_rate");
	const tiles = [
		steps ? {
			v: Math.round(steps).toLocaleString("en-IN"),
			l: "steps a day"
		} : null,
		sleep ? {
			v: `${Math.floor(sleep / 60)}h ${Math.round(sleep % 60)}m`,
			l: "sleep a night"
		} : null,
		rhr ? {
			v: `${Math.round(rhr)}`,
			l: "resting bpm"
		} : null
	].filter((t) => Boolean(t));
	if (tiles.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-4 rounded-[24px] bg-secondary p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Watch, { className: "h-5 w-5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "flex-1 font-display text-[16px] font-semibold",
					children: "Your last 7 days"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/settings",
					className: "text-[13px] font-semibold text-muted-foreground",
					children: "Health Connect"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 grid grid-cols-3 gap-2",
			children: tiles.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[16px] bg-background p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-[18px] font-semibold tabular-nums",
					children: t.v
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12px] text-muted-foreground",
					children: t.l
				})]
			}, t.l))
		})]
	});
	const cls = cn("mx-4 flex items-center gap-3 rounded-[24px] border border-dashed border-foreground/20 p-4", stateLayer);
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#FBEFD2] text-[#7A5A12]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Watch, { className: "h-5 w-5" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-[15px] font-semibold",
				children: "Add sleep and steps"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-[13px] text-muted-foreground",
				children: h.native ? "Connect Health Connect to see them next to your score" : "Connect Health Connect in the iKAN Android app"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
	] });
	return h.native ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/settings",
		className: cls,
		children: inner
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: PLAY_STORE_URL,
		target: "_blank",
		rel: "noopener noreferrer",
		className: cls,
		children: inner
	});
}
function TodayCard({ data, hydrated }) {
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-4 h-[176px] rounded-[28px] bg-secondary" });
	const latest = [...data.results].sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
	const latestA = latest ? getAssessment(latest.slug) : void 0;
	const risk = latest && latestA ? riskEndorsed(latestA, latest.answers) : false;
	const today = dayKey(/* @__PURE__ */ new Date());
	const loggedToday = data.journal.entries.some((e) => e.date === today);
	const draft = data.drafts[0];
	const active = programmes.map((p) => {
		const s = data.programmeStates[p.slug];
		let next = 0;
		while (s.completed.includes(next)) next += 1;
		const doneToday = Object.values(s.completedAt ?? {}).some((at) => dayKey(new Date(at)) === today);
		return {
			p,
			s,
			next,
			day: p.days.find((d) => d.day === next),
			doneToday
		};
	}).filter((x) => x.s.completed.length > 0 && x.day).sort((a, b) => b.s.completed.length - a.s.completed.length)[0];
	if (risk) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/support",
		className: cn("mx-4 flex items-center gap-4 rounded-[28px] bg-[#F9DEDC] p-5 text-[#5A1410]", stateLayer),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "h-8 w-8 shrink-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-display text-[19px] font-semibold leading-6",
					children: "You don’t have to carry this alone"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-[14px] leading-5",
					children: "Free, confidential helplines are open right now."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5" })
		]
	});
	if (draft?.assessment) {
		const a = draft.assessment;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NextStep, {
			label: "Pick up where you left off",
			title: `Finish your ${a.name.toLowerCase()} assessment`,
			meta: `${draft.answered} of ${a.questions.length} answered`,
			progress: draft.answered / a.questions.length * 100,
			art: "checkup",
			cta: "Continue",
			link: {
				to: "/assessment-flow",
				search: { id: a.slug }
			}
		});
	}
	if (!loggedToday) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-4 rounded-[28px] bg-foreground p-5 text-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13px] opacity-70",
				children: "Today’s check-in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-display text-[22px] font-semibold leading-7",
				children: "How are you feeling?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-5 gap-2",
				children: moodScale.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/journal",
					search: { mood: m.value },
					"aria-label": `Log mood: ${m.label}`,
					className: "group flex flex-col items-center gap-1.5 rounded-[18px] bg-white/10 py-3 transition-[transform,background-color] hover:bg-white/20 active:scale-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[28px] leading-none transition-transform group-hover:scale-110 motion-reduce:transform-none",
						"aria-hidden": "true",
						children: m.emoji
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-medium opacity-80",
						children: m.label
					})]
				}, m.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[12px] opacity-60",
				children: "Tap one to start. It takes about 30 seconds."
			})
		]
	});
	if (active && !active.doneToday) {
		const done = Math.min(new Set(active.s.completed).size, active.p.days.length);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NextStep, {
			label: active.p.name,
			title: `Day ${active.next}: ${active.day.title}`,
			meta: `${done} of ${active.p.days.length} days done`,
			progress: done / active.p.days.length * 100,
			image: active.p.cover,
			cta: "Start today’s session",
			link: {
				to: "/program/$slug/day/$day",
				params: {
					slug: active.p.slug,
					day: String(active.next)
				}
			}
		});
	}
	if (data.results.length === 0) {
		const g = getAssessment("unsure-or-general-concern");
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NextStep, {
			label: "A good first step",
			title: "See where you stand today",
			meta: `${g.questions.length} short questions, about ${g.minutes} min`,
			art: "measure",
			cta: "Take a short check",
			link: {
				to: "/assessments/$slug",
				params: { slug: g.slug }
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-4 flex items-center gap-4 rounded-[28px] bg-[#DFF0E8] p-5 text-[#173D2F]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[34px] leading-none",
			"aria-hidden": "true",
			children: "🌿"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-display text-[19px] font-semibold",
				children: "You’re done for today"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 block text-[14px]",
				children: "Check-in logged. See you tomorrow."
			})]
		})]
	});
}
function NextStep({ label, title, meta, progress, image, art, cta, link }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		...link,
		className: cn("mx-4 block overflow-hidden rounded-[28px] bg-foreground text-background", stateLayer),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-28 overflow-hidden",
			children: [
				image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: image,
					alt: "",
					className: "h-full w-full object-cover opacity-80"
				}) : art ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-foreground to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute left-5 top-4 rounded-full bg-black/45 px-2.5 py-1 text-[12px] font-semibold text-white backdrop-blur",
					children: label
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 pb-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-[21px] font-semibold leading-7",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[13px] opacity-70",
					children: meta
				}),
				progress !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 h-1.5 overflow-hidden rounded-full bg-white/15",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-white",
						style: { width: `${progress}%` }
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-background px-5 text-[15px] font-semibold text-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" }),
						" ",
						cta
					]
				})
			]
		})]
	});
}
function Section({ title, note, action, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-[18px] font-semibold",
				children: title
			}), action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: action.to,
				className: "shrink-0 text-[14px] font-semibold text-muted-foreground hover:text-foreground",
				children: action.label
			}) : null]
		}), note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-[13px] text-muted-foreground",
			children: note
		}) : null]
	}), children] });
}
function ScoreCard({ score, data, hydrated }) {
	const snapshots = useWellnessSnapshots();
	const weekAgo = Object.entries(snapshots).filter(([k]) => k <= dayKey(addDays(/* @__PURE__ */ new Date(), -7))).sort(([a], [b]) => b.localeCompare(a))[0]?.[1];
	const band = score !== null ? wellnessBand(score) : null;
	const change = score !== null && weekAgo !== void 0 ? score - weekAgo : null;
	const r = 30;
	const c = 2 * Math.PI * r;
	const sources = data.parts.filter((p) => p.value !== null).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/wellness",
		className: cn("mx-4 flex items-center gap-4 rounded-[24px] border border-foreground/10 p-4", stateLayer),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "relative h-[76px] w-[76px] shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 76 76",
					className: "h-full w-full -rotate-90",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "38",
						cy: "38",
						r,
						fill: "none",
						stroke: "currentColor",
						strokeOpacity: "0.08",
						strokeWidth: "8"
					}), score !== null && band ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "38",
						cy: "38",
						r,
						fill: "none",
						stroke: toneColors[band.tone].bar,
						strokeWidth: "8",
						strokeLinecap: "round",
						strokeDasharray: c,
						strokeDashoffset: c * (1 - score / 100),
						className: "transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute inset-0 grid place-items-center font-display text-[22px] font-bold tabular-nums",
					children: score ?? "—"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-[13px] text-muted-foreground",
						children: "iKAN Score"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-display text-[19px] font-semibold leading-6",
						children: band ? band.label : hydrated ? "Starts with your first check-in" : ""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block text-[13px] text-muted-foreground",
						children: score === null ? "Mood, assessments and programs all count" : change === null ? `From ${sources} of 4 sources` : change === 0 ? "Same as last week" : `${change > 0 ? "Up" : "Down"} ${Math.abs(change)} since last week`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
		]
	});
}
function Recommended({ data, hydrated }) {
	if (!hydrated) return null;
	const latest = [...data.results].sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
	const a = latest ? getAssessment(latest.slug) : void 0;
	if (!latest || !a) return null;
	const scores = scoreAll(a, latest.answers);
	const head = headlineOf(a, scores);
	const recs = recommendationsFor(a, scores).map(getProgramme).filter((p) => p !== void 0).slice(0, 2);
	const serious = scores.some((s) => s.band?.tone === "error");
	if (!recs.length && !serious) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		title: "Recommended for you",
		note: `Based on your ${a.name.toLowerCase()} result${head?.band ? `: ${head.band.label}` : ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "no-scrollbar flex snap-x gap-3 overflow-x-auto px-4 pb-1",
			children: [serious ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/consult",
				className: "flex w-[230px] shrink-0 snap-start flex-col justify-between rounded-[24px] bg-[#E3ECF8] p-4 text-[#1C3553]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-7 w-7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-display text-[17px] font-semibold leading-6",
						children: "Talk to a professional"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-[13px] leading-5 opacity-80",
						children: "Therapists and counselors you can book this week."
					})]
				})]
			}) : null, recs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/program/$slug",
				params: { slug: p.slug },
				className: "relative block h-[180px] w-[264px] shrink-0 snap-start overflow-hidden rounded-[24px] text-white",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.cover,
						alt: "",
						className: "absolute inset-0 h-full w-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "absolute inset-x-0 bottom-0 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[12px] font-semibold opacity-80",
								children: p.source.meta.days
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-display text-[20px] font-semibold",
								children: p.name
							}),
							p.source.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 line-clamp-2 text-[12px] leading-4 opacity-85",
								children: p.source.description
							}) : null
						]
					})
				]
			}, p.slug))]
		})
	});
}
function YourPrograms({ data, hydrated }) {
	const started = hydrated ? programmes.filter((p) => data.programmeStates[p.slug].completed.length > 0) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		title: started.length ? "Your programs" : "Programs",
		action: {
			label: "See all",
			to: "/program"
		},
		children: started.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2 px-4",
			children: started.map((p) => {
				const s = data.programmeStates[p.slug];
				const done = Math.min(new Set(s.completed).size, p.days.length);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/program/$slug",
					params: { slug: p.slug },
					style: accentStyle(p.accent),
					className: cn("flex items-center gap-3 rounded-[20px] bg-secondary p-2.5 pr-4", stateLayer),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.cover,
						alt: "",
						className: "h-14 w-14 shrink-0 rounded-[14px] object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate font-display text-[16px] font-semibold",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[12px] tabular-nums text-muted-foreground",
								children: [
									done,
									" of ",
									p.days.length,
									" days"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-2 block h-1.5 overflow-hidden rounded-full bg-[var(--accent-container)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block h-full rounded-full bg-[var(--accent)]",
								style: { width: `${done / p.days.length * 100}%` }
							})
						})]
					})]
				}) }, p.slug);
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "no-scrollbar flex snap-x gap-3 overflow-x-auto px-4 pb-1",
			children: programmes.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/program/$slug",
				params: { slug: p.slug },
				className: "w-[152px] shrink-0 snap-start",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.cover,
						alt: "",
						className: "h-[112px] w-full rounded-[20px] object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-2 block font-display text-[15px] font-semibold",
						children: p.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-[12px] text-muted-foreground",
						children: p.source.meta.days
					})
				]
			}, p.slug))
		})
	});
}
function ThisWeek({ data, hydrated }) {
	const days = Array.from({ length: 7 }, (_, i) => addDays(/* @__PURE__ */ new Date(), i - 6));
	const byDay = days.map((d) => {
		const list = hydrated ? data.journal.entries.filter((e) => e.date === dayKey(d)) : [];
		return list.length ? Math.round(list.reduce((n, e) => n + e.mood, 0) / list.length) : null;
	});
	let run = 0;
	if (hydrated) {
		const set = new Set(data.journal.entries.map((e) => e.date));
		let cursor = set.has(dayKey(/* @__PURE__ */ new Date())) ? /* @__PURE__ */ new Date() : addDays(/* @__PURE__ */ new Date(), -1);
		while (set.has(dayKey(cursor))) {
			run += 1;
			cursor = addDays(cursor, -1);
		}
	}
	const logged = byDay.filter((v) => v !== null).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		title: "This week",
		action: {
			label: "Journal",
			to: "/journal"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/journal",
			className: cn("mx-4 block rounded-[24px] border border-foreground/10 p-4", stateLayer),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-7 gap-1",
				children: days.map((d, i) => {
					const m = byDay[i] ?? null;
					const isToday = i === 6;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex flex-col items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("text-[11px]", isToday ? "font-bold" : "text-muted-foreground"),
							children: d.toLocaleDateString("en-IN", { weekday: "narrow" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("grid h-10 w-10 place-items-center rounded-full text-[20px]", m === null ? "border border-dashed border-foreground/20" : "bg-[#F9E2E9]", isToday && m === null && "border-foreground/50"),
							children: m !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-label": moodScale[m - 1].label,
								children: moodScale[m - 1].emoji
							}) : null
						})]
					}, i);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 flex items-center gap-2 text-[13px] text-muted-foreground",
				children: [run > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 text-[#C4552E]" }) : null, run > 0 ? `${run}-day run, ${logged} of 7 days logged` : logged ? `${logged} of 7 days logged` : "Your week fills in as you check in."]
			})]
		})
	});
}
function Library() {
	const picks = [...resources.filter((r) => covers[r.id]), ...resources.filter((r) => !covers[r.id] && r.featured)].slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		title: "From the library",
		action: {
			label: "See all",
			to: "/resources"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "no-scrollbar flex snap-x gap-3 overflow-x-auto px-4 pb-1",
			children: picks.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/resources/$slug",
				params: { slug: slugOf(r) },
				className: "w-[200px] shrink-0 snap-start",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block h-[124px] overflow-hidden rounded-[20px]",
						children: covers[r.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: covers[r.id],
							alt: "",
							className: "h-full w-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art: r.art })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-2 block text-[12px] font-semibold text-muted-foreground",
						children: [
							r.category,
							", ",
							r.minutes,
							" min read"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 line-clamp-2 text-[14px] font-semibold leading-5",
						children: r.title
					})
				]
			}, r.id))
		})
	});
}
function RecentResults({ data, hydrated }) {
	if (!hydrated || !data.results.length) return null;
	const recent = [...data.results].sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		title: "Recent results",
		action: {
			label: "History",
			to: "/history/assessments"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mx-4 overflow-hidden rounded-[24px] bg-secondary",
			children: recent.map((r) => {
				const a = getAssessment(r.slug);
				if (!a) return null;
				const head = headlineOf(a, scoreAll(a, r.answers));
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "border-b border-background last:border-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/assessments/$slug/result/$id",
						params: {
							slug: a.slug,
							id: r.id
						},
						className: cn("flex min-h-16 items-center gap-3 px-4 py-3", stateLayer),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-5 w-5 shrink-0 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-[15px] font-medium",
									children: a.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateText, {
									className: "text-[12px] text-muted-foreground",
									children: new Date(r.completedAt).toLocaleDateString("en-IN", {
										day: "numeric",
										month: "short"
									})
								})]
							}),
							head?.band ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandChip, {
								label: head.band.label,
								tone: head.band.tone,
								severity: head.band.severity
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] text-muted-foreground",
								children: "5 scores"
							})
						]
					})
				}, r.id);
			})
		})
	});
}
function ReassessPrompt({ data, hydrated }) {
	const [hidden, setHidden] = (0, import_react.useState)(false);
	if (!hydrated || hidden || reassessDismissed()) return null;
	const reason = reassessReason(data.results, data.journal.entries, data.programmeStates);
	if (!reason) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-4 flex items-center gap-3 rounded-[24px] bg-[oklch(0.96_0.05_85)] p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-background text-[oklch(0.47_0.1_75)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-display text-[15px] font-semibold",
					children: "Ready for a re-check?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 block text-[13px] leading-5 text-muted-foreground",
					children: reassessCopy[reason]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mt-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/assessments",
						className: "inline-flex h-9 items-center rounded-full bg-foreground px-4 text-[13px] font-semibold text-background",
						children: "Choose an assessment"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							dismissReassess();
							setHidden(true);
						},
						className: "h-9 rounded-full px-3 text-[13px] font-medium text-muted-foreground",
						children: "Not now"
					})]
				})
			]
		})]
	});
}
/** The programme you're in the middle of: the most recently active one that isn't finished. */
function ongoing(data) {
	return programmes.map((p) => {
		const s = data.programmeStates[p.slug];
		let next = 0;
		while (s.completed.includes(next)) next += 1;
		const last = Object.values(s.completedAt ?? {}).sort().at(-1) ?? "";
		return {
			p,
			s,
			next,
			day: p.days.find((d) => d.day === next),
			last
		};
	}).filter((x) => x.s.completed.length > 0 && x.day).sort((a, b) => b.last.localeCompare(a.last))[0];
}
function CurrentProgram({ data, hydrated }) {
	const cur = hydrated ? ongoing(data) : void 0;
	if (!cur) return null;
	const done = Math.min(new Set(cur.s.completed).size, cur.p.days.length);
	const pct = Math.round(done / cur.p.days.length * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-[13px] font-semibold text-muted-foreground",
			children: "Your program"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hero-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: cur.p.cover,
					alt: "",
					className: "hero-media"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hero-veil" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hero-chip",
										children: "Current program"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-2 font-display text-[26px] font-bold tracking-[-0.02em]",
										children: cur.p.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-[13px] opacity-75",
										children: [
											"Day ",
											cur.next,
											" of ",
											cur.p.days.length - 1,
											" · ",
											cur.day.title
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hero-ring",
								style: { background: `conic-gradient(var(--background) 0 ${pct}%, oklch(1 0 0 / 0.14) ${pct}%)` },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [pct, "%"] })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hero-track mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${pct}%` } })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-[14px] opacity-85",
							children: [
								"Ready for your next session? Takes about ",
								Math.max(5, minutesOf(cur.day)),
								" minutes."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/program/$slug/day/$day",
								params: {
									slug: cur.p.slug,
									day: String(cur.next)
								},
								className: "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-background text-[14px] font-semibold text-foreground transition-transform active:scale-[.97]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" }), " Start session"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/program/$slug",
								params: { slug: cur.p.slug },
								className: "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/25 px-4 text-[14px] font-semibold hover:bg-white/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-4 w-4" }), " Progress"]
							})]
						})
					]
				})
			]
		})]
	});
}
/** Things left open: today's programme session, unfinished assessments, today's check-in. */
function PickUp({ data, hydrated }) {
	if (!hydrated) return null;
	const today = dayKey(/* @__PURE__ */ new Date());
	const cur = ongoing(data);
	const drafts = data.drafts.slice(0, 2);
	const needsMood = !data.journal.entries.some((e) => e.date === today);
	if (!cur && !drafts.length && !needsMood) return null;
	const rowClass = cn("grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4", stateLayer);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		title: "Your activity",
		note: "Pick up where you left off",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 divide-y divide-background overflow-hidden rounded-[24px] bg-secondary",
			children: [
				cur ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/program/$slug/day/$day",
					params: {
						slug: cur.p.slug,
						day: String(cur.next)
					},
					className: rowClass,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityRow, {
						title: `${cur.p.name} · Day ${cur.next} session`,
						meta: cur.day.title,
						progress: Math.round(Math.min(new Set(cur.s.completed).size, cur.p.days.length) / cur.p.days.length * 100)
					})
				}) : null,
				drafts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/assessment-flow",
					search: { id: d.assessment.slug },
					className: rowClass,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityRow, {
						title: `${d.assessment.name} assessment`,
						meta: `${d.answered} of ${d.assessment.questions.length} answered`,
						progress: Math.round(d.answered / d.assessment.questions.length * 100)
					})
				}, d.assessment.slug)),
				needsMood ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/journal",
					className: rowClass,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityRow, {
						title: "Mood check-in",
						meta: "How are you feeling today?",
						progress: 0
					})
				}) : null
			]
		})
	});
}
function ActivityRow({ title, meta, progress }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "activity-dial",
			style: { ["--p"]: `${progress}%` },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: progress ? `${progress}%` : "New" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate font-display text-[15px] font-semibold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 block truncate text-[13px] text-muted-foreground",
				children: meta
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-9 w-9 place-items-center rounded-full bg-foreground text-background",
			children: progress > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })
		})
	] });
}
function Offerings({ data, hydrated }) {
	const active = hydrated ? programmes.filter((p) => {
		const s = data.programmeStates[p.slug];
		return s.completed.length > 0 && new Set(s.completed).size < p.days.length;
	}).length : 0;
	const tiles = [
		{
			label: "Programs",
			meta: active ? `${active} active` : `${programmes.length} programs`,
			icon: Sparkles,
			to: "/program",
			tone: "score-calm"
		},
		{
			label: "Assessments",
			meta: "7 available",
			icon: ChartNoAxesColumn,
			to: "/assessments",
			tone: "score-mind"
		},
		{
			label: "Mood journal",
			meta: "Daily check-in",
			icon: Smile,
			to: "/journal",
			tone: "score-rest"
		},
		{
			label: "Consult",
			meta: `${consultants.length} consultants`,
			icon: Heart,
			to: "/consult",
			tone: "score-alert"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		title: "Everything in iKAN",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 px-4",
			children: tiles.map((o) => {
				const Icon = o.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: o.to,
					className: cn("surface flex flex-col gap-3 p-4", stateLayer),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("score-tile", o.tone),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-[15px] font-semibold",
							children: o.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block text-[13px] text-muted-foreground",
							children: o.meta
						})]
					})]
				}, o.label);
			})
		})
	});
}
/** The mood check-in card. Hidden while Today's card is already asking the same question. */
function MoodCheckin({ data, hydrated }) {
	if (!hydrated) return null;
	const today = dayKey(/* @__PURE__ */ new Date());
	const logged = data.journal.entries.filter((e) => e.date === today);
	const latest = [...data.results].sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
	const latestA = latest ? getAssessment(latest.slug) : void 0;
	if (!(latest && latestA ? riskEndorsed(latestA, latest.answers) : false) && !data.drafts[0] && logged.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "surface mx-4 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] font-semibold text-muted-foreground",
					children: "Today’s check-in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-[17px] font-semibold",
					children: "How are you feeling?"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-secondary px-2.5 py-1 text-[12px] text-muted-foreground",
					children: logged.length ? `${logged.length} today` : "40 sec"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[13px] text-muted-foreground",
				children: "Mood, energy and stress in a few quick taps."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-5 gap-2",
				children: moodScale.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/journal",
					search: { mood: m.value },
					"aria-label": m.label,
					className: "flex flex-col items-center gap-1 rounded-2xl bg-secondary py-2 transition-transform active:scale-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-2xl leading-none",
						"aria-hidden": "true",
						children: m.emoji
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-medium text-muted-foreground",
						children: m.label
					})]
				}, m.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/journal",
				className: "mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-[14px] font-semibold text-background transition-transform active:scale-[.98]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }),
					" ",
					logged.length ? "Add another check-in" : "Log today’s mood"
				]
			})
		]
	});
}
function SupportCard({ city }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-4 rounded-[22px] border border-[#B3261E]/20 bg-[#FCEEEE] p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-10 w-10 place-items-center rounded-xl bg-background text-[#8C1D18]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12px] font-semibold text-[#8C1D18]",
						children: "Support"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-[16px] font-semibold",
						children: "Let’s talk about it"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-[13px] text-muted-foreground",
						children: [
							consultants.length,
							" consultants",
							city ? ` for you in ${city}` : "",
							", with video, call and chat sessions."
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/consult",
			className: "mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#8C1D18] text-[14px] font-semibold text-white transition-transform active:scale-[.98]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4" }), " Book a consultation"]
		})]
	});
}
//#endregion
export { Home as component };
