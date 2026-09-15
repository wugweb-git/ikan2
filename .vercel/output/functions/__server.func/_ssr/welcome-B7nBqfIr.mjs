import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as Illustration } from "./art-CKGIg2zx.mjs";
import { r as getAssessment } from "./store-CsxAZBJN.mjs";
import { S as useAuth, T as useProfile, h as profileInitials, l as displayName, w as useOnboarding } from "./auth-xMCnsA0H.mjs";
import { t as ProfilePhoto } from "./profile-photo-C6SkD_-8.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, Dt as Clock3, Ft as Check, U as MapPin, X as ListChecks, ft as Footprints, qt as Bell } from "../_libs/lucide-react.mjs";
import { c as SelectRow, d as TextField, i as LinearProgress, n as Button, p as accentStyle, r as IconButton, s as SelectField } from "./m3-Blvbxy5D.mjs";
import { i as categoryIcon } from "./ui-CSQedWKe.mjs";
import { _ as validate, a as genders, g as required, h as pin, n as birthday, o as maritalStatuses, r as city, s as maxLength } from "./validate-DQrl-c4D.mjs";
import { c as requestMotion, d as useDevice, l as requestNotifications, p as useNotificationAccess, s as requestLocation } from "./device-DwMF_060.mjs";
import { t as Route } from "./welcome-BJFVXA6J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/welcome-B7nBqfIr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CLIENT_ID = "374641147902-g2qtsl49j1u0e417o4gi8sicvgd0j66q.apps.googleusercontent.com";
var SCOPES = [
	"https://www.googleapis.com/auth/user.birthday.read",
	"https://www.googleapis.com/auth/user.gender.read",
	"https://www.googleapis.com/auth/user.phonenumbers.read",
	"https://www.googleapis.com/auth/user.addresses.read"
];
var loading = null;
function loadGsi() {
	const existing = window.google;
	if (existing?.accounts?.oauth2) return Promise.resolve(existing);
	loading ??= new Promise((resolve, reject) => {
		const s = document.createElement("script");
		s.src = "https://accounts.google.com/gsi/client";
		s.async = true;
		s.onload = () => resolve(window.google);
		s.onerror = () => {
			loading = null;
			reject(/* @__PURE__ */ new Error("Couldn’t reach Google. Check your connection and try again."));
		};
		document.head.appendChild(s);
	});
	return loading;
}
function requestToken(gsi, hint) {
	return new Promise((resolve, reject) => {
		gsi.accounts.oauth2.initTokenClient({
			client_id: CLIENT_ID,
			scope: SCOPES.join(" "),
			...hint ? { hint } : {},
			callback: (r) => r.access_token ? resolve(r.access_token) : reject(/* @__PURE__ */ new Error("Google didn’t share your details.")),
			error_callback: (e) => reject(/* @__PURE__ */ new Error(e.type === "popup_closed" ? "Google window closed. Nothing was filled in." : "Google didn’t open. Allow pop-ups for iKAN and try again."))
		}).requestAccessToken({ prompt: "consent" });
	});
}
var pad = (n) => String(n).padStart(2, "0");
var genderFrom = (value) => value === "male" ? "Man" : value === "female" ? "Woman" : value ? "Prefer to self-describe" : void 0;
var pick = (list) => list?.find((x) => x.metadata?.primary) ?? list?.[0];
/** Load Google's script ahead of the tap, so the popup opens straight from the tap
* (browsers block pop-ups that open after a delay). */
var preloadGoogle = () => {
	if (typeof window !== "undefined") loadGsi().catch(() => {});
};
async function fillFromGoogle(hint) {
	const ready = window.google;
	const tokenPromise = ready?.accounts?.oauth2 ? requestToken(ready, hint) : loadGsi().then((g) => requestToken(g, hint));
	const gsi = ready?.accounts?.oauth2 ? ready : await loadGsi();
	const token = await tokenPromise;
	try {
		const res = await fetch("https://people.googleapis.com/v1/people/me?personFields=birthdays,genders,phoneNumbers,addresses,photos", { headers: { Authorization: `Bearer ${token}` } });
		if (!res.ok) throw new Error("Google didn’t share your details. Try again.");
		const p = await res.json();
		const out = {};
		const b = p.birthdays?.find((x) => x.date?.year)?.date;
		if (b?.year && b.month && b.day) out.birthday = `${b.year}-${pad(b.month)}-${pad(b.day)}`;
		const gender = genderFrom(pick(p.genders)?.value);
		if (gender) out.gender = gender;
		const phone = pick(p.phoneNumbers);
		const raw = phone?.canonicalForm ?? phone?.value;
		if (raw) {
			const digits = raw.replace(/[^\d+]/g, "");
			out.phone = digits.startsWith("+91") ? `+91 ${digits.slice(3)}` : digits;
		}
		const address = pick(p.addresses);
		if (address?.city) out.city = address.city;
		if (address?.postalCode && /^[1-9]\d{5}$/.test(address.postalCode)) out.zip = address.postalCode;
		const photo = p.photos?.find((x) => !x.default && x.url);
		if (photo?.url) out.avatar = photo.url.replace(/=s\d+(-c)?$/, "=s256-c");
		return out;
	} finally {
		gsi.accounts.oauth2.revoke(token);
	}
}
var reasons = [
	{
		id: "stress",
		label: "I feel stressed or worried",
		slug: "feeling-worried-and-stressed",
		art: "stress"
	},
	{
		id: "anxiety",
		label: "I feel anxious or overwhelmed",
		slug: "feeling-overwhelmed-and-anxious",
		art: "anxiety"
	},
	{
		id: "low",
		label: "I’ve been feeling low",
		slug: "feeling-depressed-and-hopeless",
		art: "mood"
	},
	{
		id: "sleep",
		label: "I’m not sleeping well",
		slug: "struggling-with-quality-sleep",
		art: "sleep"
	},
	{
		id: "work",
		label: "Work is taking over my life",
		slug: "struggling-to-balance-life",
		art: "work"
	},
	{
		id: "burnout",
		label: "I feel drained or burned out",
		slug: "feeling-drained-and-burned-out",
		art: "burnout"
	},
	{
		id: "unsure",
		label: "I’m not sure, I want to check in",
		slug: "unsure-or-general-concern",
		art: "checkup"
	}
];
var STEPS = 4;
function WelcomePage() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { step: only } = Route.useSearch();
	const { finish, done } = useOnboarding();
	const [step, setStep] = (0, import_react.useState)(0);
	const [choice, setChoice] = (0, import_react.useState)(null);
	const reason = reasons.find((r) => r.id === choice);
	const assessment = reason ? getAssessment(reason.slug) : void 0;
	const leave = (to = "/") => {
		if (!done) finish(choice ?? "");
		navigate({
			to,
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-canvas",
		style: accentStyle("calm"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-dvh w-full max-w-app flex-col bg-background pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] shadow-app",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-16 items-center gap-1 px-1",
				children: [
					step > 0 && !only ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: "Back",
						onClick: () => setStep(step - 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-12" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 px-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinearProgress, { value: only ? 100 : (step + 1) / STEPS * 100 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => only ? navigate({
							to: "/",
							replace: true
						}) : step < 3 ? setStep(step + 1) : leave(),
						className: "h-12 px-4 text-[15px] font-semibold text-muted-foreground",
						children: "Skip"
					})
				]
			}), step === 0 || only ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutYou, {
				name: displayName(user).split(" ")[0] ?? "",
				label: only ? "Your details" : `Step 1 of ${STEPS}`,
				cta: only ? "Save" : "Continue",
				onDone: () => only ? navigate({
					to: "/",
					replace: true
				}) : setStep(1)
			}) : step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex flex-1 flex-col px-4 pb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[14px] font-medium text-[var(--accent-strong)]",
						children: ["Step 2 of ", STEPS]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-[28px] font-semibold leading-9",
						children: "What brings you here?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[15px] leading-6 text-muted-foreground",
						children: "Pick the one that fits best. You can explore everything later."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "radiogroup",
						"aria-label": "What brings you here",
						className: "mt-6 overflow-hidden rounded-[20px] border border-foreground/10",
						children: reasons.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: i > 0 ? "border-t border-foreground/10" : void 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectRow, {
								selected: choice === r.id,
								onClick: () => setChoice(r.id),
								children: r.label
							})
						}, r.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							disabled: !choice,
							onClick: () => setStep(2),
							children: "Continue"
						}), !choice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-center text-[13px] text-muted-foreground",
							children: "Choose one to continue, or skip."
						}) : null]
					})
				]
			}) : step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Permissions, { onDone: () => assessment ? setStep(3) : leave() }) : assessment && reason ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex flex-1 flex-col px-4 pb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[14px] font-medium text-[var(--accent-strong)]",
						children: ["Step 4 of ", STEPS]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-[28px] font-semibold leading-9",
						children: "Start with a short check"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[15px] leading-6 text-muted-foreground",
						children: "It shows where you are today and which program fits. It’s a screening, not a diagnosis."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 overflow-hidden rounded-[28px] bg-secondary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art: reason.art })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2 text-[14px] font-medium text-[var(--accent-strong)]",
									children: [(() => {
										const Icon = categoryIcon[assessment.category];
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" });
									})(), assessment.name]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-display text-[22px] font-semibold leading-7",
									children: assessment.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 flex gap-4 text-[14px] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-4 w-4" }),
											" ",
											assessment.questions.length,
											" questions"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "h-4 w-4" }),
											" ",
											assessment.minutes,
											" min"
										]
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto space-y-2 pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							onClick: () => {
								finish(reason.id);
								navigate({
									to: "/assessment-flow",
									search: { id: assessment.slug },
									replace: true
								});
							},
							children: "Start assessment"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "text",
							className: "w-full",
							onClick: () => leave(),
							children: "Go to home first"
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex flex-1 flex-col items-center justify-center px-6 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => leave(),
					children: "Go to home"
				})
			})]
		})
	});
}
function AboutYou({ name, label, cta, onDone }) {
	const { profile, save } = useProfile();
	const { user } = useAuth();
	const [google, setGoogle] = (0, import_react.useState)({
		busy: false,
		note: null
	});
	const [draft, setDraft] = (0, import_react.useState)({
		birthday: "",
		gender: "",
		maritalStatus: "",
		city: "",
		zip: "",
		bio: ""
	});
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	const [tried, setTried] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => preloadGoogle(), []);
	(0, import_react.useEffect)(() => {
		if (loaded) return;
		const gender = {
			male: "Man",
			female: "Woman"
		}[profile.gender.trim().toLowerCase()] ?? profile.gender;
		const pinInCity = profile.city.match(/[,\s]+([1-9]\d{5})\s*$/);
		setDraft({
			birthday: profile.birthday,
			gender: genders.includes(gender) ? gender : "",
			maritalStatus: profile.maritalStatus,
			city: pinInCity ? profile.city.slice(0, pinInCity.index).trim() : profile.city,
			zip: profile.zip || pinInCity?.[1] || "",
			bio: profile.bio
		});
		setLoaded(true);
	}, [profile, loaded]);
	const { errors, ok } = validate(draft, {
		birthday,
		gender: required("Choose one, or ‘Prefer not to say’."),
		maritalStatus: required("Choose one, or ‘Prefer not to say’."),
		city,
		zip: pin,
		bio: maxLength(500, "this")
	});
	const set = (k) => (val) => setDraft((d) => ({
		...d,
		[k]: val
	}));
	const err = (k) => tried ? errors[k] : void 0;
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const fromGoogle = async () => {
		setGoogle({
			busy: true,
			note: null
		});
		try {
			const g = await fillFromGoogle(user?.email ?? void 0);
			const filled = [
				"birthday",
				"gender",
				"city",
				"zip"
			].filter((k) => g[k]);
			setDraft((d) => ({
				...d,
				...g.birthday && !birthday(g.birthday) ? { birthday: g.birthday } : {},
				...g.gender ? { gender: g.gender } : {},
				...g.city ? { city: g.city } : {},
				...g.zip ? { zip: g.zip } : {}
			}));
			const extra = {};
			if (g.phone && !profile.phone) extra.phone = g.phone;
			if (g.avatar && !profile.avatar) extra.avatar = g.avatar;
			if (Object.keys(extra).length) save(extra);
			setGoogle({
				busy: false,
				note: filled.length || extra.phone ? "Filled in what Google has. Check it, then continue." : "Your Google account doesn’t have these details. Fill them in below."
			});
		} catch (e) {
			setGoogle({
				busy: false,
				note: e.message
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-1 flex-col px-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[14px] font-medium text-[var(--accent-strong)]",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--accent-strong)] font-display text-[20px] font-semibold text-background",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePhoto, {
						src: profile.avatar,
						children: profileInitials(profile)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-[26px] font-semibold leading-8",
					children: name ? `Hi ${name}, tell us about you` : "Tell us about you"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[15px] leading-6 text-muted-foreground",
				children: "This helps us suggest the right programs and local support. Only you and consultants you book can see it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => void fromGoogle(),
				disabled: google.busy,
				className: "mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-foreground/15 text-[15px] font-semibold disabled:opacity-50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleG, {}),
					" ",
					google.busy ? "Asking Google…" : "Fill from Google"
				]
			}),
			google.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "mt-2 text-center text-[13px] text-muted-foreground",
				children: google.note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				noValidate: true,
				className: "mt-5 space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					setTried(true);
					if (!ok) return;
					save({
						...draft,
						city: draft.city.trim(),
						bio: draft.bio.trim()
					});
					onDone();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "Date of birth",
						type: "date",
						max: today,
						min: "1915-01-01",
						value: draft.birthday,
						onChange: set("birthday"),
						error: err("birthday")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
							label: "Gender",
							options: genders,
							value: draft.gender,
							onChange: set("gender"),
							error: err("gender")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
							label: "Marital status",
							options: maritalStatuses,
							value: draft.maritalStatus,
							onChange: set("maritalStatus"),
							error: err("maritalStatus")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[1fr_7.5rem] gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
							label: "City",
							autoComplete: "address-level2",
							maxLength: 60,
							value: draft.city,
							onChange: set("city"),
							error: err("city")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
							label: "PIN code",
							inputMode: "numeric",
							autoComplete: "postal-code",
							maxLength: 6,
							value: draft.zip,
							onChange: (val) => set("zip")(val.replace(/\D/g, "").slice(0, 6)),
							error: err("zip")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "About you (optional)",
						multiline: true,
						maxLength: 500,
						placeholder: "Anything you’d like us or a consultant to know",
						value: draft.bio,
						onChange: set("bio"),
						error: err("bio")
					}),
					tried && !ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "rounded-[14px] bg-[#F9DEDC] px-4 py-3 text-[14px] text-[#8C1D18]",
						children: "Check the highlighted fields."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							children: cta
						})
					})
				]
			})
		]
	});
}
function Permissions({ onDone }) {
	const notifications = useNotificationAccess();
	const device = useDevice();
	const [locationState, setLocationState] = (0, import_react.useState)(device.location ? "granted" : "prompt");
	const [message, setMessage] = (0, import_react.useState)(null);
	const rows = [
		{
			id: "notifications",
			icon: Bell,
			title: "Reminders",
			body: "A nudge for your daily check-in and program days. You choose the time in Settings.",
			state: notifications,
			allow: async () => {
				if (await requestNotifications() === "denied") setMessage("Notifications are blocked. Turn them on for iKAN in your phone’s settings.");
			}
		},
		{
			id: "location",
			icon: MapPin,
			title: "City and weather",
			body: "Shows your city and today’s weather, and helplines near you. We never track where you go.",
			state: locationState,
			allow: async () => {
				setLocationState("busy");
				try {
					await requestLocation();
					setLocationState("granted");
				} catch (e) {
					setLocationState("denied");
					setMessage(e.message);
				}
			}
		},
		{
			id: "motion",
			icon: Footprints,
			title: "Activity",
			body: "Counts movement on this phone to add activity to your iKAN Score.",
			state: device.motion ?? "prompt",
			allow: async () => {
				if (await requestMotion() === "unsupported") setMessage("This phone doesn’t share motion with web apps.");
			}
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-1 flex-col px-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[14px] font-medium text-[var(--accent-strong)]",
				children: ["Step 3 of ", STEPS]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-[28px] font-semibold leading-9",
				children: "Make iKAN yours"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[15px] leading-6 text-muted-foreground",
				children: "Allow what’s useful to you. Each one is optional and you can change it any time in Settings."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-3",
				children: rows.map((r) => {
					const Icon = r.icon;
					const granted = r.state === "granted";
					const blocked = r.state === "denied" || r.state === "unsupported";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-3 rounded-[20px] bg-secondary p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-background",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[15px] font-semibold",
									children: r.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block text-[13px] leading-5 text-muted-foreground",
									children: r.body
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: granted || blocked || r.state === "busy",
								onClick: () => void r.allow(),
								className: cn("inline-flex h-9 shrink-0 items-center gap-1 self-center rounded-full px-4 text-[13px] font-semibold", granted ? "bg-[var(--accent-container)] text-[var(--on-accent-container)]" : blocked ? "text-muted-foreground" : "bg-foreground text-background"),
								children: granted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " On"] }) : r.state === "busy" ? "…" : r.state === "unsupported" ? "N/A" : blocked ? "Blocked" : "Allow"
							})
						]
					}, r.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[13px] leading-5 text-muted-foreground",
				children: "Health Connect and Google Fit sync come with the installed Android app."
			}),
			message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "mt-3 rounded-[14px] bg-[#F9DEDC] px-4 py-3 text-[14px] text-[#8C1D18]",
				children: message
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-auto pt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					onClick: onDone,
					children: "Continue"
				})
			})
		]
	});
}
function GoogleG() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 48 48",
		className: "h-5 w-5",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#FFC107",
				d: "M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#FF3D00",
				d: "m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#4CAF50",
				d: "M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#1976D2",
				d: "M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
			})
		]
	});
}
//#endregion
export { WelcomePage as component };
