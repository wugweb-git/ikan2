import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as Illustration } from "./art-CKGIg2zx.mjs";
import { S as useAuth, _ as seedProfile, l as displayName, m as onboardingDone, p as markOnboardingDone } from "./auth-xMCnsA0H.mjs";
import { t as MadeBy } from "./made-by-Cpp5pcoF.mjs";
import { g as Link, l as useRouterState, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { vt as Eye, y as Smartphone, yt as EyeOff } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-ui-DXj6R5BN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var partOf = (h) => h >= 5 && h < 8 ? "dawn" : h < 12 && h >= 8 ? "morning" : h >= 12 && h < 17 ? "afternoon" : h >= 17 && h < 20 ? "evening" : "night";
var skies = {
	dawn: {
		from: "#FFE4C9",
		to: "#FFC085",
		ink: "#3A2210",
		muted: "#6E4A2E",
		hill: "#F2A96A"
	},
	morning: {
		from: "#E8F4FD",
		to: "#B8DFF7",
		ink: "#12263A",
		muted: "#44607A",
		hill: "#9CCBEA"
	},
	afternoon: {
		from: "#FFF8E1",
		to: "#FFD97A",
		ink: "#3A2A05",
		muted: "#6E5820",
		hill: "#F0C458"
	},
	evening: {
		from: "#E8D5F5",
		to: "#C09FDE",
		ink: "#2A1740",
		muted: "#58446F",
		hill: "#A884CC"
	},
	night: {
		from: "#2A2A3E",
		to: "#151525",
		ink: "#E8E8F0",
		muted: "#A0A0C0",
		hill: "#23233A"
	}
};
function IkanMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "10 10 62 62",
		className,
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M38.9575 62.428H42.6398V46.0228L54.5382 57.3991L57.0464 54.8939L45.652 43.0072H61.8906C62.576 42.4908 62.4807 41.3104 62.41 40.4775C62.3823 40.167 62.4346 39.8473 62.3393 39.543L61.8906 38.9866H45.652L57.0464 27.0999L54.5382 24.5947L42.6398 35.9712V19.572H38.9575V30.6226C38.2382 30.1615 37.9186 28.9566 37.562 28.1696C36.4463 25.7075 35.4535 23.15 34.5928 20.5895L30.9321 22.108L34.937 32.2979L27.0715 24.604C26.6226 25.2987 24.2743 26.7649 24.7078 27.6071L32.2599 35.3072L22.0429 30.9884L20.5675 34.4219L30.5847 38.9928H19.5347V43.0103H30.5847L20.5675 47.5812L22.0429 51.0147L32.2599 46.6959L24.7078 54.396C24.2713 55.2382 26.6226 56.7044 27.0715 57.3991L34.937 49.7052L30.9321 59.8951L34.5928 61.4136C35.4535 58.85 36.4463 56.2956 37.562 53.8335C37.9186 53.0465 38.2382 51.8385 38.9575 51.3805V62.431V62.428ZM10 41C10 23.8785 23.8809 10 41.0015 10C58.1222 10 72 23.8785 72 41C72 58.1215 58.1222 72 41.0015 72C23.8809 72 10.0031 58.1215 10.0031 41H10Z"
		})
	});
}
function Splash() {
	const [part, setPart] = (0, import_react.useState)("morning");
	(0, import_react.useEffect)(() => {
		setPart(partOf((/* @__PURE__ */ new Date()).getHours()));
	}, []);
	const s = skies[part];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "splash splash-phone-only relative flex min-h-dvh flex-col overflow-hidden transition-[background] duration-700",
		style: {
			background: `linear-gradient(180deg, ${s.from} 0%, ${s.to} 100%)`,
			color: s.ink
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 flex flex-1 flex-col items-center justify-center px-8 pt-[env(safe-area-inset-top)] text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative grid h-40 w-40 place-items-center",
						children: [[0, 1].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: "splash-ring absolute inset-0 rounded-full border",
							style: {
								borderColor: s.ink,
								animationDelay: `${1100 + i * 1600}ms`
							}
						}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "splash-disc grid h-24 w-24 place-items-center rounded-full shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)]",
							style: {
								background: part === "night" ? "#E8E8F0" : "#FFFFFF",
								color: "#151515"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanMark, { className: "splash-mark h-[72px] w-[72px]" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "splash-rise mt-5 font-display text-[20px] font-semibold tracking-[0.02em]",
						style: { animationDelay: "700ms" },
						children: "iKAN"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "splash-rise mt-3 max-w-[16ch] font-display text-[30px] font-semibold leading-9 tracking-[-0.01em] text-balance",
						style: { animationDelay: "950ms" },
						children: "Reimagining mental health care."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "splash-rise mt-3 max-w-[32ch] text-[15px] leading-6",
						style: {
							color: s.muted,
							animationDelay: "1200ms"
						},
						children: "Stay on top of your mental health with real-time monitoring and insights, expert therapists, and science-backed tools and programs."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						className: "splash-rise mt-8 block h-1 w-24 overflow-hidden rounded-full",
						style: {
							background: `${s.ink}1f`,
							animationDelay: "1400ms"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "splash-progress block h-full w-1/3 rounded-full",
							style: { background: s.ink }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						role: "status",
						children: "Opening iKAN"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				"aria-hidden": "true",
				viewBox: "0 0 390 120",
				preserveAspectRatio: "none",
				className: "splash-hills pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M0 70 C 70 40, 150 80, 220 58 S 340 40, 390 60 L390 120 L0 120 Z",
					fill: s.hill,
					fillOpacity: "0.45"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M0 92 C 90 74, 190 100, 280 84 S 370 80, 390 86 L390 120 L0 120 Z",
					fill: s.hill,
					fillOpacity: "0.7"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "splash-rise relative z-10 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-[12px]",
				style: {
					color: s.muted,
					animationDelay: "1500ms"
				},
				children: [
					"Made by",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://wugweb.com",
						target: "_blank",
						rel: "noopener noreferrer",
						className: "font-semibold underline-offset-4 hover:underline",
						style: { color: s.ink },
						children: "wugweb"
					})
				]
			})
		]
	});
}
var PUBLIC = /^\/(login|phone-login|signup|verify-email|forgot-password|reset-password|support|about|faq|contact|legal)(\/|$)/;
var AUTH_ONLY = /^\/(login|phone-login|signup|verify-email|forgot-password)(\/|$)/;
var NEW_ACCOUNT_MS = 864e5;
var isNewAccount = (user) => {
	const created = user.created_at ? Date.parse(user.created_at) : NaN;
	return Number.isFinite(created) && Date.now() - created < NEW_ACCOUNT_MS;
};
var INTRO_KEY = "ikan.splash-seen";
/** Phones and the installed Android app; computers and tablets skip the launch screen. */
var isPhone = () => window.matchMedia("(max-width: 767px) and (pointer: coarse)").matches || Boolean(window.Capacitor?.isNativePlatform?.());
var INTRO_MS = 2200;
function useLaunchIntro() {
	const [show, setShow] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let seen = false;
		try {
			seen = Boolean(window.sessionStorage.getItem(INTRO_KEY));
		} catch {}
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (seen || !isPhone()) return setShow(false);
		const t = window.setTimeout(() => {
			try {
				window.sessionStorage.setItem(INTRO_KEY, "1");
			} catch {}
			setShow(false);
		}, reduce ? 900 : INTRO_MS);
		return () => window.clearTimeout(t);
	}, []);
	return show;
}
/** Keeps the app behind sign-in. Crisis support and the auth screens stay open to everyone. */
function AuthGate({ children }) {
	const { status, user } = useAuth();
	const location = useRouterState({ select: (s) => s.location });
	const navigate = useNavigate();
	const path = location.pathname;
	const isPublic = PUBLIC.test(path);
	const intro = useLaunchIntro();
	(0, import_react.useEffect)(() => {
		if (status === "signedOut" && !isPublic) navigate({
			to: "/login",
			search: { redirect: location.href },
			replace: true
		});
		if (status === "signedIn" && user) {
			seedProfile({
				name: displayName(user),
				email: user.email ?? "",
				phone: user.user_metadata?.["phone"] ?? "",
				avatar: user.user_metadata?.["avatar_url"] || user.user_metadata?.["picture"] || user.identities?.find((i) => i.provider === "google")?.identity_data?.["picture"]
			});
			const needsWelcome = !onboardingDone() && isNewAccount(user);
			if (!needsWelcome) markOnboardingDone();
			if (AUTH_ONLY.test(path)) navigate({
				to: needsWelcome ? "/welcome" : "/",
				replace: true
			});
			else if (needsWelcome && !isPublic && path !== "/welcome" && path !== "/reset-password" && !path.startsWith("/support")) navigate({
				to: "/welcome",
				replace: true
			});
			else if (!needsWelcome && path === "/welcome" && !location.searchStr.includes("step=")) navigate({
				to: "/",
				replace: true
			});
		}
	}, [status, path]);
	if (intro) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	if (isPublic) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	if (status !== "signedIn") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function AuthLayout({ title, subtitle, art = "mood", children, footer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-canvas",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-dvh w-full max-w-app flex-col bg-background pb-[env(safe-area-inset-bottom)] shadow-app",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-28 shrink-0 overflow-hidden",
				children: [
					art === "welcome" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WelcomeArt, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-background to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/login",
						className: "absolute left-5 top-[max(1rem,env(safe-area-inset-top))] flex items-center gap-2 rounded-full bg-background/85 py-1 pl-1 pr-3 backdrop-blur",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/favicon.svg",
							alt: "",
							className: "h-7 w-7 rounded-[9px]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-[17px] font-semibold",
							children: "iKAN"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex flex-1 flex-col px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-[26px] font-semibold leading-8",
						children: title
					}),
					subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[14px] leading-5 text-muted-foreground",
						children: subtitle
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5",
						children
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto pb-3 pt-4",
						children: [footer, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MadeBy, { className: footer ? "mt-3" : "" })]
					})
				]
			})]
		})
	});
}
function Field({ label, type = "text", value, onChange, autoComplete, placeholder, error, hint, maxLength, onBlur }) {
	const [show, setShow] = (0, import_react.useState)(false);
	const isPassword = type === "password";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1 block text-[13px] font-medium text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cn("flex h-12 items-center rounded-[14px] border bg-secondary px-4 transition-colors focus-within:border-foreground/60 focus-within:bg-background", error ? "border-[#B3261E]" : "border-transparent"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: isPassword && show ? "text" : type,
					value,
					onChange: (e) => onChange(e.target.value),
					autoComplete,
					placeholder,
					maxLength,
					onBlur,
					inputMode: type === "email" ? "email" : void 0,
					autoCapitalize: type === "email" || type === "password" ? "none" : void 0,
					spellCheck: type === "email" || type === "password" ? false : void 0,
					"aria-invalid": Boolean(error),
					className: "h-full min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted-foreground/70"
				}), isPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setShow((s) => !s),
					"aria-label": show ? "Hide password" : "Show password",
					className: "-mr-2 grid h-10 w-10 place-items-center rounded-full text-muted-foreground",
					children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-5 w-5" })
				}) : null]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				role: "alert",
				className: "mt-1.5 block text-[13px] text-[#B3261E]",
				children: error
			}) : hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1.5 block text-[13px] text-muted-foreground",
				children: hint
			}) : null
		]
	});
}
function PrimaryButton({ children, busy, disabled, type = "submit", onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		onClick,
		disabled: disabled || busy,
		className: "relative flex h-12 w-full items-center justify-center rounded-full bg-foreground text-[16px] font-semibold text-background transition-opacity disabled:opacity-50",
		children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-5 w-5 animate-spin rounded-full border-2 border-background/40 border-t-background" }) : children
	});
}
function FormError({ message }) {
	if (!message) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		role: "alert",
		className: "rounded-[14px] bg-[#F9DEDC] px-4 py-3 text-[14px] leading-5 text-[#8C1D18]",
		children: message
	});
}
function SocialButtons({ onError: _onError }) {
	const { signInWith } = useAuth();
	const [busy, setBusy] = (0, import_react.useState)(null);
	const go = async (p) => {
		setBusy(p);
		try {
			await signInWith(p);
		} catch {} finally {
			setBusy(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "my-4 flex items-center gap-3 text-[13px] text-muted-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-foreground/10" }),
			" or",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-foreground/10" })
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-3 gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => go("google"),
				"aria-label": "Continue with Google",
				disabled: Boolean(busy),
				className: "flex h-12 w-full items-center justify-center gap-2 rounded-full border border-foreground/15 text-[14px] font-semibold disabled:opacity-50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleMark, {}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: busy === "google" ? "…" : "Google" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => go("linkedin_oidc"),
				"aria-label": "Continue with LinkedIn",
				disabled: Boolean(busy),
				className: "flex h-12 w-full items-center justify-center gap-2 rounded-full border border-foreground/15 text-[14px] font-semibold disabled:opacity-50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkedInMark, {}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: busy === "linkedin_oidc" ? "…" : "LinkedIn" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/phone-login",
				"aria-label": "Continue with phone",
				className: "flex h-12 w-full items-center justify-center gap-2 rounded-full border border-foreground/15 text-[14px] font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-5 w-5" }), " Phone"]
			})
		]
	})] });
}
var TermsNote = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
	className: "mt-3 text-center text-[12px] leading-5 text-muted-foreground",
	children: [
		"By continuing you agree to the",
		" ",
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/legal/$slug",
			params: { slug: "terms" },
			className: "underline underline-offset-2",
			children: "Terms of use"
		}),
		" ",
		"and",
		" ",
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/legal/$slug",
			params: { slug: "privacy-policy" },
			className: "underline underline-offset-2",
			children: "Privacy policy"
		}),
		"."
	]
});
function GoogleMark() {
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
				d: "M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#1976D2",
				d: "M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
			})
		]
	});
}
function LinkedInMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: "h-5 w-5",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "24",
			height: "24",
			rx: "4",
			fill: "#0A66C2"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "#fff",
			d: "M7.1 9.4H4.6V19h2.5V9.4zM5.9 5a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9zM19.4 13.6c0-2.6-1.4-4.3-3.6-4.3-1.3 0-2.2.7-2.6 1.4V9.4h-2.4V19h2.5v-5c0-1.3.6-2.2 1.7-2.2 1.1 0 1.6.8 1.6 2.2v5h2.5v-5.4z"
		})]
	});
}
/** "Keep me signed in" for the sign-in screens. */
function RememberMe({ checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex cursor-pointer items-center gap-3 text-[14px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "checkbox",
			checked,
			onChange: (e) => onChange(e.target.checked),
			className: "h-5 w-5 shrink-0 accent-foreground"
		}), "Keep me signed in"]
	});
}
/** Sign-up scene: a sunrise over soft hills with the iKAN burst as the sun. */
function WelcomeArt() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 320 176",
		preserveAspectRatio: "xMidYMid slice",
		className: "h-full w-full",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: "wa-sky",
				x1: "0",
				y1: "0",
				x2: "0",
				y2: "1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0",
						stopColor: "#DCEBF6"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0.6",
						stopColor: "#EAF4EE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "1",
						stopColor: "#FFF4E0"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
				id: "wa-glow",
				cx: "0.5",
				cy: "0.5",
				r: "0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0",
					stopColor: "#FFD27A",
					stopOpacity: "0.75"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "1",
					stopColor: "#FFD27A",
					stopOpacity: "0"
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "320",
				height: "176",
				fill: "url(#wa-sky)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "214",
				cy: "84",
				r: "70",
				fill: "url(#wa-glow)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				transform: "translate(214 84)",
				stroke: "#E7A93B",
				strokeWidth: "5",
				strokeLinecap: "round",
				children: [Array.from({ length: 12 }, (_, i) => {
					const a = i * Math.PI / 6;
					const r1 = i % 2 ? 18 : 14;
					const r2 = i % 2 ? 34 : 42;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: Math.cos(a) * r1,
						y1: Math.sin(a) * r1,
						x2: Math.cos(a) * r2,
						y2: Math.sin(a) * r2
					}, i);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					r: "10",
					fill: "#E7A93B",
					stroke: "none"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 132 C 60 104, 120 120, 176 110 S 280 96, 320 112 L320 176 L0 176 Z",
				fill: "#9CCBB1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 150 C 70 132, 150 150, 220 138 S 300 132, 320 140 L320 176 L0 176 Z",
				fill: "#6FAE8E"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 166 C 90 156, 190 170, 320 158 L320 176 L0 176 Z",
				fill: "#4E8F75"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				fill: "#4E8F75",
				opacity: "0.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "52",
						cy: "46",
						r: "2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "96",
						cy: "30",
						r: "1.5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "140",
						cy: "52",
						r: "1.8"
					})
				]
			})
		]
	});
}
//#endregion
export { PrimaryButton as a, TermsNote as c, FormError as i, AuthLayout as n, RememberMe as o, Field as r, SocialButtons as s, AuthGate as t };
