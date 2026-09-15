import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { D as useSyncStatus, E as useSettings, S as useAuth, c as defaultSettings, f as legalLinks, o as clearCloudData, x as syncNow, y as storageKeys } from "./auth-xMCnsA0H.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, Bt as CalendarClock, Jt as BellRing, K as LogOut, Kt as BookOpen, Mt as ChevronRight, Ot as ClipboardList, Q as LifeBuoy, St as Cloud, T as Share2, Tt as CloudOff, U as MapPin, _ as Sparkles, a as Watch, b as SlidersHorizontal, bt as Download, d as TrendingUp, ft as Footprints, nn as Accessibility, p as Trash2, q as Lock, qt as Bell, s as UserRound, tt as KeyRound, y as Smartphone } from "../_libs/lucide-react.mjs";
import { b as useHydrated, t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { f as TopAppBar, h as useSnack, l as Snackbar, m as stateLayer, n as Button, p as accentStyle, r as IconButton, t as BottomSheet, u as Switch } from "./m3-Blvbxy5D.mjs";
import { t as AddToCalendar } from "./add-to-calendar-D-4t2UWP.mjs";
import { enablePush, pushSupported, sendTestPush } from "./push-BWq7heyH.mjs";
import { c as requestMotion, d as useDevice, f as useLocationAccess, i as notify, l as requestNotifications, m as weatherWord, n as installApp, p as useNotificationAccess, r as isInstalled, s as requestLocation, u as useCanInstall } from "./device-DwMF_060.mjs";
import { i as useHealthConnect, r as recentAverage, t as PLAY_STORE_URL } from "./health-connect-C1qEs0Ca.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-D6XnSPpp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const hydrated = useHydrated();
	const navigate = useNavigate();
	const { settings: stored, set } = useSettings();
	const { user, signOut, sendReset } = useAuth();
	const settings = hydrated ? stored : defaultSettings;
	const snack = useSnack();
	const [clearing, setClearing] = (0, import_react.useState)(false);
	const notifications = useNotificationAccess();
	(0, import_react.useEffect)(() => {
		if (!hydrated || notifications !== "granted" || !pushSupported()) return;
		enablePush({
			moodReminder: stored.moodReminders,
			time: stored.moodReminderTime
		});
	}, [
		hydrated,
		notifications,
		stored.moodReminders,
		stored.moodReminderTime
	]);
	const toggle = (key, label, sub, icon) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
		icon,
		label,
		sub,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			label,
			checked: Boolean(settings[key]),
			onChange: (v) => set(key, v)
		})
	});
	const exportData = () => {
		const out = { exportedAt: (/* @__PURE__ */ new Date()).toISOString() };
		for (const k of storageKeys()) try {
			const raw = localStorage.getItem(k);
			if (raw) out[k] = JSON.parse(raw);
		} catch {}
		const url = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: "application/json" }));
		const a = document.createElement("a");
		a.href = url;
		a.download = `ikan-data-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
		snack.show("Your data is downloading");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle("night"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, {
				leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
					label: "Back",
					onClick: () => navigate({ to: "/profile" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
				}),
				title: "Settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
				title: "Account",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-h-[72px] items-center gap-4 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[16px]",
								children: "Signed in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-[13px] leading-5 text-muted-foreground",
								children: user?.email ?? ""
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SyncRow, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionRow, {
						icon: KeyRound,
						label: "Change password",
						sub: "We’ll email you a link to set a new one",
						onClick: async () => {
							if (!user?.email) return;
							try {
								await sendReset(user.email);
								snack.show("Check your email for the link");
							} catch (e) {
								snack.show(e.message);
							}
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionRow, {
						icon: LogOut,
						label: "Sign out",
						sub: "Your data stays on this device for next time",
						onClick: async () => {
							await signOut();
							navigate({
								to: "/login",
								replace: true
							});
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PermissionsGroup, { onMessage: snack.show }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
				title: "Notifications",
				note: "Reminders arrive when notifications are allowed above. Install iKAN for the most reliable delivery.",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						icon: Bell,
						label: "Mood reminders",
						sub: "Daily reminder to log your mood",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							label: "Mood reminders",
							checked: settings.moodReminders,
							onChange: (v) => set("moodReminders", v)
						})
					}),
					settings.moodReminders ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-14 items-center gap-4 px-4 py-2 pl-[72px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1 text-[14px] text-muted-foreground",
							children: "Remind me at"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "time",
							value: settings.moodReminderTime,
							onChange: (e) => set("moodReminderTime", e.target.value),
							className: "h-10 rounded-[10px] bg-secondary px-3 text-[15px] font-semibold tabular-nums"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddToCalendar, {
						variant: "row",
						className: "pl-[72px]",
						label: "Add daily reminder to my calendar",
						filename: "ikan-mood-check-in",
						time: settings.moodReminderTime,
						event: {
							title: "iKAN mood check-in",
							details: "A 30-second check-in on how you feel today.",
							start: /* @__PURE__ */ new Date(),
							minutes: 5,
							daily: true,
							url: "https://app.ikanhealth.in/journal"
						}
					})] }) : null,
					toggle("assessmentReminders", "Assessment reminders", "Periodic prompts to retake assessments", ClipboardList),
					toggle("programUpdates", "Program updates", "Notifications about your active programs", Sparkles),
					toggle("weeklyProgress", "Weekly progress", "Summary of your weekly activity and insights", TrendingUp),
					toggle("newResources", "New resources", "Get notified when new articles are published", BookOpen)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, {
				title: "Health data",
				note: "iKAN reads sleep, steps, heart rate and exercise from Health Connect, only after you allow it, to show them beside your iKAN Score and programs. Shown only to you, never sold or shared.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthConnectRows, { onMessage: snack.show })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
				title: "Privacy",
				children: [
					toggle("shareWithConsultant", "Share results with my consultant", "Let consultants you book see your assessment results", Share2),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionRow, {
						icon: Download,
						label: "Export my data",
						sub: "Download a copy of everything stored on this device",
						onClick: exportData
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionRow, {
						icon: Trash2,
						label: "Clear all data",
						sub: "Remove results, check-ins, progress and bookings from this device",
						danger: true,
						onClick: () => setClearing(true)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, {
				title: "Accessibility",
				children: toggle("reduceMotion", "Reduce motion", "Fewer animations across the app", Accessibility)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
				title: "Help",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkRow, {
					icon: LifeBuoy,
					label: "Get support now",
					sub: "Free, confidential helplines, open 24×7",
					to: "/support"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkRow, {
					icon: CalendarClock,
					label: "Book a consultation",
					sub: "Talk to a therapist or counselor",
					to: "/consult"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, {
				title: "Legal",
				children: legalLinks.map((l) => {
					const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-10 w-10 place-items-center rounded-full bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[16px]",
								children: l.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[13px] text-muted-foreground",
								children: l.description
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
					] });
					const cls = cn("flex min-h-16 items-center gap-4 px-4 py-3", stateLayer);
					return l.id === "about" || l.id === "faq" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.id === "about" ? "/about" : "/faq",
						className: cls,
						children: inner
					}, l.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/legal/$slug",
						params: { slug: l.id },
						className: cls,
						children: inner
					}, l.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-center text-[12px] text-muted-foreground",
				children: "iKAN preview"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BottomSheet, {
				open: clearing,
				onClose: () => setClearing(false),
				title: "Clear all data?",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[15px] leading-6 text-muted-foreground",
					children: "This removes your assessment results, journal check-ins, program progress, bookings, saved articles, profile and settings from this device and from your account. It can’t be undone."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "bg-[#B3261E] text-white",
						onClick: async () => {
							await clearCloudData().catch(() => {});
							for (const k of storageKeys()) try {
								localStorage.removeItem(k);
							} catch {}
							window.location.assign("/");
						},
						children: "Clear everything"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "text",
						onClick: () => setClearing(false),
						children: "Keep my data"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Snackbar, { message: snack.message })
		]
	}) });
}
function HealthConnectRows({ onMessage }) {
	const hydrated = useHydrated();
	const h = useHealthConnect();
	(0, import_react.useEffect)(() => {
		if (h.error) onMessage(h.error);
	}, [h.error]);
	const steps = recentAverage(h.days, "steps");
	const sleep = recentAverage(h.days, "sleep_minutes");
	const summary = [steps ? `${Math.round(steps).toLocaleString("en-IN")} steps` : null, sleep ? `${Math.floor(sleep / 60)}h ${Math.round(sleep % 60)}m sleep` : null].filter(Boolean).join(" · ");
	const pill = (label, onClick, filled = true) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		disabled: h.busy,
		onClick,
		className: cn("inline-flex h-9 shrink-0 items-center rounded-full px-4 text-[13px] font-semibold disabled:opacity-50", filled ? "bg-foreground text-background" : "border border-foreground/15"),
		children: h.busy ? "…" : label
	});
	if (!hydrated) return null;
	if (!h.native) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
		icon: Watch,
		label: "Health Connect",
		sub: summary ? `From your phone, 7-day average: ${summary}` : "Sleep, steps and heart rate from your phone, in the iKAN Android app",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: PLAY_STORE_URL,
			target: "_blank",
			rel: "noopener noreferrer",
			className: "inline-flex h-9 shrink-0 items-center rounded-full border border-foreground/15 px-4 text-[13px] font-semibold",
			children: "Get app"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
		icon: Watch,
		label: "Health Connect",
		sub: h.availability === "unavailable" ? "Not available on this phone" : h.availability === "update_required" ? "Install or update Health Connect first" : h.connected ? summary ? `7-day average: ${summary}` : "Connected. Data appears once your phone or watch records it." : "Sleep, steps, heart rate and exercise from your phone and watch",
		children: h.availability === "update_required" ? pill("Install", () => void h.install()) : h.availability === "available" ? h.connected ? pill("Sync", () => void h.sync().then(() => onMessage("Health data synced")), false) : pill("Connect", () => void h.connect()) : null
	}), h.connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionRow, {
		icon: SlidersHorizontal,
		label: "Choose what iKAN can read",
		sub: "Opens Health Connect, where you can change or remove access",
		onClick: () => void h.manage()
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionRow, {
		icon: Trash2,
		label: "Delete synced health data",
		sub: "Removes the daily summaries iKAN saved to your account",
		danger: true,
		onClick: () => void h.removeData().then(() => onMessage("Health data deleted"))
	})] }) : null] });
}
function PermissionsGroup({ onMessage }) {
	const hydrated = useHydrated();
	const notifications = useNotificationAccess();
	const device = useDevice();
	const [locationAccess, setLocationAccess] = useLocationAccess();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const canInstall = useCanInstall();
	const installed = hydrated && isInstalled();
	const label = (a) => a === "granted" ? "On" : a === "denied" ? "Blocked" : a === "unsupported" ? "N/A" : "Allow";
	const Pill = ({ access, onClick }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		disabled: access !== "prompt" || busy,
		onClick,
		className: cn("inline-flex h-9 shrink-0 items-center rounded-full px-4 text-[13px] font-semibold", access === "prompt" ? "bg-foreground text-background" : access === "granted" ? "bg-[var(--accent-container)] text-[var(--on-accent-container)]" : "text-muted-foreground"),
		children: label(access)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
		title: "Permissions",
		note: "Blocked? Open your phone’s settings for this site or app and allow it there.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: Bell,
				label: "Notifications",
				sub: "Daily check-in and program reminders",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
					access: hydrated ? notifications : "prompt",
					onClick: async () => {
						const a = await requestNotifications();
						if (a === "granted") notify("Reminders are on", "We’ll nudge you at the time you choose.");
						else if (a === "denied") onMessage("Notifications are blocked for iKAN");
					}
				})
			}),
			hydrated && notifications === "granted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionRow, {
				icon: BellRing,
				label: "Send a test notification",
				sub: "Check that reminders reach this phone",
				onClick: async () => {
					if (await sendTestPush().catch(() => 0)) return onMessage("Test notification sent");
					onMessage(await notify("Hello from iKAN", "This is how reminders will look.") ? "Test notification sent" : "Couldn’t show a notification");
				}
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: MapPin,
				label: "Location",
				sub: hydrated && device.location ? `${device.location.city || "Location saved"}${device.weather ? ` · ${device.weather.temp}° ${weatherWord(device.weather.code)}` : ""}` : "City, weather and nearby helplines",
				children: hydrated && device.location ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					onClick: async () => {
						setBusy(true);
						try {
							await requestLocation();
							onMessage("Location updated");
						} catch (e) {
							onMessage(e.message);
						} finally {
							setBusy(false);
						}
					},
					className: "inline-flex h-9 shrink-0 items-center rounded-full border border-foreground/15 px-4 text-[13px] font-semibold",
					children: "Update"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
					access: locationAccess,
					onClick: async () => {
						setBusy(true);
						try {
							await requestLocation();
							setLocationAccess("granted");
						} catch (e) {
							setLocationAccess("denied");
							onMessage(e.message);
						} finally {
							setBusy(false);
						}
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: Footprints,
				label: "Activity",
				sub: "Movement on this phone, for your iKAN Score",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
					access: hydrated ? device.motion ?? "prompt" : "prompt",
					onClick: async () => {
						if (await requestMotion() === "unsupported") onMessage("This phone doesn’t share motion with web apps");
					}
				})
			}),
			installed ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: Smartphone,
				label: "Install iKAN",
				sub: canInstall ? "Add iKAN to your home screen. It opens full screen." : "In your browser menu, tap Add to Home screen",
				children: canInstall ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: async () => {
						if (await installApp()) onMessage("iKAN is on your home screen");
					},
					className: "inline-flex h-9 shrink-0 items-center rounded-full bg-foreground px-4 text-[13px] font-semibold text-background",
					children: "Install"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
			})
		]
	});
}
function Group({ title, note, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "px-4 text-[14px] font-semibold text-[var(--accent-strong)]",
				children: title
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 text-[12px] text-muted-foreground",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1",
				children
			})
		]
	});
}
function Row({ icon: Icon, label, sub, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[72px] items-center gap-4 px-4 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[16px]",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[13px] leading-5 text-muted-foreground",
					children: sub
				})]
			}),
			children
		]
	});
}
function ActionRow({ icon: Icon, label, sub, onClick, danger }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex min-h-[72px] w-full items-center gap-4 px-4 py-3 text-left", stateLayer),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", danger ? "bg-[#F9DEDC] text-[#8C1D18]" : "bg-[var(--accent-container)] text-[var(--on-accent-container)]"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("block text-[16px]", danger && "text-[#8C1D18]"),
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[13px] leading-5 text-muted-foreground",
					children: sub
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
		]
	});
}
function LinkRow({ icon: Icon, label, sub, to }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("flex min-h-[72px] items-center gap-4 px-4 py-3", stateLayer),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[16px]",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[13px] leading-5 text-muted-foreground",
					children: sub
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
		]
	});
}
function SyncRow() {
	const status = useSyncStatus();
	const hydrated = useHydrated();
	const when = status.at ? new Date(status.at).toLocaleTimeString("en-IN", {
		hour: "numeric",
		minute: "2-digit"
	}) : "";
	const text = !hydrated ? "" : status.state === "synced" ? `Saved to your account${when ? `, last at ${when}` : ""}` : status.state === "syncing" ? "Saving to your account…" : status.state === "error" ? "Couldn’t save to your account. Your data is safe on this device." : status.state === "unconfigured" ? "Saved on this device. Account saving isn’t connected yet." : "Saved on this device";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[72px] items-center gap-4 px-4 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)]",
				children: status.state === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudOff, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[16px]",
					children: "Your data"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[13px] leading-5 text-muted-foreground",
					children: text
				})]
			}),
			status.state === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: syncNow,
				className: "h-9 rounded-full border border-foreground/20 px-3 text-[13px] font-semibold",
				children: "Try again"
			}) : null
		]
	});
}
//#endregion
export { SettingsPage as component };
