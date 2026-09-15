import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as Illustration } from "./art-CKGIg2zx.mjs";
import { s as programmes } from "./programs-DrKO9d_v.mjs";
import { T as useProfile, h as profileInitials, s as defaultProfile, y as storageKeys } from "./auth-xMCnsA0H.mjs";
import { t as ProfilePhoto } from "./profile-photo-C6SkD_-8.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Settings, Kt as BookOpen, Mt as ChevronRight, Ot as ClipboardList, R as NotebookPen, S as ShieldPlus, Vt as CalendarCheck, _ as Sparkles, at as History, bt as Download, qt as Bell, s as UserRound, st as HeartPulse, v as Smile } from "../_libs/lucide-react.mjs";
import { b as useHydrated, f as resources, n as consultants, t as IkanShell, x as useNotifications, y as useEverything } from "./ikan-shell-BVeIbGxw.mjs";
import { d as TextField, h as useSnack, l as Snackbar, m as stateLayer, n as Button, p as accentStyle, s as SelectField } from "./m3-Blvbxy5D.mjs";
import { _ as validate, a as genders, f as personName, h as pin, i as email, l as optional, n as birthday, o as maritalStatuses, p as phone10, r as city, s as maxLength } from "./validate-DQrl-c4D.mjs";
import { t as PhoneField } from "./phone-field-Br7a6ZV3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-DEaDv4xM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const hydrated = useHydrated();
	const { profile, save } = useProfile();
	const data = useEverything();
	const { unreadCount } = useNotifications();
	const snack = useSnack();
	const [draft, setDraft] = (0, import_react.useState)(defaultProfile);
	(0, import_react.useEffect)(() => {
		if (hydrated) setDraft(profile);
	}, [hydrated]);
	const p = hydrated ? profile : defaultProfile;
	const dirty = hydrated && JSON.stringify(draft) !== JSON.stringify(profile);
	const [showErrors, setShowErrors] = (0, import_react.useState)(false);
	const { errors, ok } = validate(draft, {
		name: personName,
		email,
		phone: optional(phone10),
		bio: maxLength(500, "this"),
		birthday: optional(birthday),
		city: optional(city),
		zip: optional(pin),
		emergencyName: optional(personName),
		emergencyPhone: optional(phone10),
		emergencyRelation: maxLength(40, "this")
	});
	const field = (key) => ({
		value: draft[key],
		onChange: (val) => setDraft((d) => ({
			...d,
			[key]: val
		})),
		error: showErrors ? errors[key] : void 0
	});
	const finished = programmes.filter((pr) => {
		const s = data.programmeStates[pr.slug];
		return hydrated && Boolean(s?.runs?.length);
	});
	programmes.filter((pr) => hydrated && ((data.programmeStates[pr.slug]?.completed.length ?? 0) > 0 || Boolean(data.programmeStates[pr.slug]?.runs?.length)));
	const firstResult = hydrated ? [...data.results].sort((a, b) => a.completedAt.localeCompare(b.completedAt))[0] : void 0;
	const jump = [
		{
			to: "/wellness",
			label: "iKAN Score",
			sub: hydrated && data.score !== null ? `${data.score} of 100` : "Not started",
			icon: HeartPulse,
			tint: "#DFF0E8"
		},
		{
			to: "/resources",
			label: "Resources",
			sub: `${resources.length} articles`,
			icon: BookOpen,
			tint: "#FBEFD2"
		},
		{
			to: "/consult",
			label: "Consultation",
			sub: `${consultants.length} available`,
			icon: CalendarCheck,
			tint: "#E3ECF8"
		},
		{
			to: "/notifications",
			label: "Notifications",
			sub: hydrated && unreadCount ? `${unreadCount} unread` : "All caught up",
			icon: Bell,
			tint: "#F9E2E9"
		}
	];
	const archive = [
		{
			to: "/history/assessments",
			label: "Assessment history",
			sub: hydrated && data.results.length ? `${data.results.length} taken · earliest ${new Date(firstResult.completedAt).toLocaleDateString("en-IN", {
				day: "numeric",
				month: "long"
			})}` : "None taken yet",
			icon: ClipboardList
		},
		{
			to: "/history/program",
			label: "Program history",
			sub: finished.length ? `Finished: ${finished.map((f) => f.name).join(", ")}` : "None finished yet",
			icon: Sparkles
		},
		{
			to: "/diaries",
			label: "Learning diaries",
			sub: finished.length ? `${finished.length} ${finished.length === 1 ? "diary" : "diaries"} from finished programs` : "Diaries move here when a program is finished",
			icon: NotebookPen
		},
		{
			to: "/history/journal",
			label: "Journal history",
			sub: hydrated ? `${data.journal.entries.length} mood check-ins` : "",
			icon: Smile
		},
		{
			to: "/history",
			label: "My history",
			sub: "Assessments, programs and journal",
			icon: History
		}
	];
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
		style: accentStyle("mood"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-32 overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art: "mood" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/settings",
						"aria-label": "Settings",
						className: cn(stateLayer, "absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-full bg-background/80 backdrop-blur"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "-mt-12 flex flex-col items-center px-4 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-24 w-24 place-items-center overflow-hidden rounded-full border-4 border-background bg-[var(--accent-strong)] font-display text-[32px] font-semibold text-background",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePhoto, {
									src: p.avatar,
									children: profileInitials(p)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 font-display text-[26px] font-semibold leading-8",
								children: p.name || "Your name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[14px] text-muted-foreground",
								children: p.email || `Member since ${new Date(p.memberSince).toLocaleDateString("en-IN", {
									month: "long",
									year: "numeric"
								})}`
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mx-4 mb-2 mt-6 text-[13px] font-semibold text-muted-foreground",
				children: "Jump to"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-4 grid grid-cols-2 gap-2",
				children: jump.map((j) => {
					const Icon = j.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: j.to,
						className: cn("flex items-center gap-3 rounded-[20px] p-3", stateLayer),
						style: { background: j.tint },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-background/80",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-[14px] font-semibold",
								children: j.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-[12px] opacity-75",
								children: j.sub
							})]
						})]
					}, j.to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-2 font-display text-[18px] font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-5 w-5" }), " Profile"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
							label: "Full name",
							autoComplete: "name",
							maxLength: 60,
							...field("name")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
							label: "Email",
							type: "email",
							inputMode: "email",
							autoComplete: "email",
							...field("email"),
							placeholder: "you@example.com"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneField, {
							variant: "m3",
							label: "Phone",
							...field("phone")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
							label: "About me",
							multiline: true,
							maxLength: 500,
							...field("bio"),
							placeholder: "Anything you’d like your consultant to know"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-[18px] font-semibold",
					children: "Personal details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
							label: "Date of birth",
							type: "date",
							max: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
							...field("birthday")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
								label: "Gender",
								options: genders,
								...field("gender")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
								label: "Marital status",
								options: maritalStatuses,
								...field("maritalStatus")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[1fr_7.5rem] gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
								label: "City",
								autoComplete: "address-level2",
								...field("city")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
								label: "PIN code",
								inputMode: "numeric",
								autoComplete: "postal-code",
								maxLength: 6,
								...field("zip"),
								onChange: (val) => setDraft((d) => ({
									...d,
									zip: val.replace(/\D/g, "").slice(0, 6)
								}))
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 font-display text-[18px] font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldPlus, { className: "h-5 w-5" }), " Emergency contact"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[14px] text-muted-foreground",
						children: "Who we call, and how, if you need urgent help."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
								label: "Name",
								maxLength: 60,
								...field("emergencyName")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneField, {
								variant: "m3",
								label: "Phone",
								autoComplete: "off",
								...field("emergencyPhone")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
								label: "Relationship",
								...field("emergencyRelation"),
								placeholder: "Parent, partner, friend"
							})
						]
					})
				]
			}),
			dirty ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky bottom-[88px] z-20 mt-6 flex gap-2 bg-gradient-to-t from-background via-background to-transparent px-4 pb-3 pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outlined",
					className: "flex-1",
					onClick: () => setDraft(profile),
					children: "Discard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "flex-1",
					onClick: () => {
						if (!ok) {
							setShowErrors(true);
							snack.show("Check the highlighted fields");
							return;
						}
						save({
							...draft,
							name: draft.name.trim(),
							email: draft.email.trim(),
							city: draft.city.trim()
						});
						setShowErrors(false);
						snack.show("Profile saved");
					},
					children: "Save changes"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mx-4 mb-2 mt-8 font-display text-[18px] font-semibold",
				children: "Archive"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mx-4 overflow-hidden rounded-[24px] border border-foreground/10",
				children: [archive.map((r) => {
					const Icon = r.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "border-b border-foreground/10 last:border-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: r.to,
							className: cn("flex min-h-16 items-center gap-3 px-4 py-3", stateLayer),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[15px] font-medium",
										children: r.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-[13px] text-muted-foreground",
										children: r.sub
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
							]
						})
					}, r.label);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: exportData,
					className: cn("flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left", stateLayer),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[15px] font-medium",
							children: "Export your data"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[13px] text-muted-foreground",
							children: "Everything above, as a file"
						})]
					})]
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/settings",
				className: cn("mx-4 mt-4 flex min-h-14 items-center gap-3 rounded-[20px] bg-secondary px-4", stateLayer),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-5 w-5" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 text-[15px] font-medium",
						children: "Settings"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Snackbar, { message: snack.message })
		]
	}) });
}
//#endregion
export { ProfilePage as component };
