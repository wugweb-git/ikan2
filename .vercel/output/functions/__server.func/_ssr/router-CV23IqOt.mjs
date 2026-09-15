import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { i as faqPage, r as contactPage, t as aboutPage } from "./content-pwglTkg-.mjs";
import { t as AuthProvider } from "./auth-xMCnsA0H.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as RotateCw, O as SearchX, Q as LifeBuoy, Tt as CloudOff } from "../_libs/lucide-react.mjs";
import { t as Route$24 } from "./assessment-flow-nPnlrXtr.mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
import { t as Route$25 } from "./assessments._slug.index-BdaU1TTI.mjs";
import { n as Route$26 } from "./assessments._slug.result._id-BGJ93hSH.mjs";
import { t as Route$27 } from "./consult._id-BbUwRqZ0.mjs";
import { t as Route$28 } from "./consult.index-oWWxyc82.mjs";
import { t as AuthGate } from "./auth-ui-DXj6R5BN.mjs";
import { t as Route$29 } from "./diaries._slug-DiefvHc5.mjs";
import { t as Route$30 } from "./forgot-password-D5FtES8D.mjs";
import { t as Route$31 } from "./history.assessments._slug-pS5fZ7zp.mjs";
import { t as Route$32 } from "./history.program._slug-HfBpAJ2A.mjs";
import { t as Route$33 } from "./journal-D6JsC5I0.mjs";
import { t as Route$34 } from "./legal._slug-DhGmMKSr.mjs";
import { t as Route$35 } from "./login-DP3xr8MQ.mjs";
import { t as Route$36 } from "./program._slug.day._day-DQmeE923.mjs";
import { t as Route$37 } from "./program._slug.index-DiEjoLn5.mjs";
import { t as Route$38 } from "./program._slug.journal-DTp7vGvg.mjs";
import { t as Route$39 } from "./program._slug.result-BQI2EaYR.mjs";
import { t as Route$40 } from "./program._slug.tool._step-CZP7kJBE.mjs";
import { t as Route$41 } from "./resources._slug-pf-zrD3n.mjs";
import { t as Route$42 } from "./resources.index-B3crCaB1.mjs";
import { o as registerServiceWorker } from "./device-DwMF_060.mjs";
import { t as Route$43 } from "./verify-email-BsrpcQFr.mjs";
import { t as Route$44 } from "./welcome-BJFVXA6J.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CV23IqOt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-i9i1ADsF.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function Skeleton({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-hidden": "true",
		className: cn("skeleton", className)
	});
}
/** A page-shaped placeholder: app bar, hero, a row of tiles and a list. */
function PageSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "status",
		"aria-label": "Loading",
		className: "mx-auto min-h-dvh w-full max-w-app bg-background px-4 pt-[max(1rem,env(safe-area-inset-top))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-12 items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-10 rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-40" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-4 h-44 rounded-[28px]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-[20px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-[20px]" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-6 h-5 w-32" }),
			[
				0,
				1,
				2
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-12 rounded-[14px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-3/4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-1/2" })]
				})]
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Loading"
			})
		]
	});
}
function StateScreen({ icon: Icon, title, body, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-canvas px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex w-full max-w-sm flex-col items-center text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-16 w-16 place-items-center rounded-[20px] bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-8 w-8" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 font-display text-[24px] font-semibold leading-8",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[15px] leading-6 text-muted-foreground",
					children: body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex w-full flex-col gap-2",
					children
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/support",
					className: "mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#8C1D18]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "h-4 w-4" }), " Need help now?"]
				})
			]
		})
	});
}
var primary = "flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[15px] font-semibold text-background";
var secondary = "flex h-12 items-center justify-center rounded-full border border-foreground/15 px-6 text-[15px] font-semibold";
function NotFoundScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StateScreen, {
		icon: SearchX,
		title: "This page isn’t here",
		body: "The link may be old, or the page has moved. Everything you saved is safe.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: primary,
			children: "Go to home"
		})
	});
}
function ErrorScreen({ reset }) {
	const router = useRouter();
	const online = useOnline();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StateScreen, {
		icon: online ? RotateCw : CloudOff,
		title: online ? "This page didn’t load" : "You’re offline",
		body: online ? "Something went wrong while opening it. Try again, or go back home." : "Connect to the internet and try again. Anything saved on this phone is still here.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: primary,
			onClick: () => {
				router.invalidate();
				reset?.();
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-4 w-4" }), " Try again"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: "/",
			className: secondary,
			children: "Go to home"
		})]
	});
}
function useOnline() {
	const [online, setOnline] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const update = () => setOnline(navigator.onLine);
		update();
		window.addEventListener("online", update);
		window.addEventListener("offline", update);
		return () => {
			window.removeEventListener("online", update);
			window.removeEventListener("offline", update);
		};
	}, []);
	return online;
}
/** A thin banner at the top while the phone has no connection. */
function OfflineBanner() {
	if (useOnline()) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "status",
		className: "fixed inset-x-0 top-0 z-[95] flex justify-center pt-[env(safe-area-inset-top)] print:hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[13px] font-semibold text-background shadow-dock",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudOff, { className: "h-4 w-4" }), " Offline. Changes save on this phone."]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorScreen, { reset });
}
var Route$23 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
			},
			{
				name: "theme-color",
				content: "#FBFBFD"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "default"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "iKAN"
			},
			{
				name: "application-name",
				content: "iKAN"
			},
			{
				name: "format-detection",
				content: "telephone=no"
			},
			{
				name: "msapplication-TileColor",
				content: "#151515"
			},
			{ title: "iKAN — Personal Wellness" },
			{
				name: "description",
				content: "Personalized mental wellness check-ins, self-help programs, and assessments."
			},
			{
				name: "author",
				content: "iKAN"
			},
			{
				property: "og:title",
				content: "iKAN — Personal Wellness"
			},
			{
				property: "og:description",
				content: "Personalized mental wellness check-ins, self-help programs, and assessments."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon",
				sizes: "any"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundScreen,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$23.useRouteContext();
	(0, import_react.useEffect)(() => registerServiceWorker(), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineBanner, {})] })
	});
}
var $$splitComponentImporter$18 = () => import("./routes-D50--NJR.mjs");
var Route$22 = createFileRoute("/")({
	head: () => pageMeta("Home", "What to do today, your iKAN Score, programs, mood and reading in one place."),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
/** The programme you're in the middle of: the most recently active one that isn't finished. */
/** Things left open: today's programme session, unfinished assessments, today's check-in. */
/** The mood check-in card. Hidden while Today's card is already asking the same question. */
var $$splitComponentImporter$17 = () => import("./about-58mQ2YYP.mjs");
var Route$21 = createFileRoute("/about")({
	head: () => pageMeta("About iKAN", aboutPage.hero.subtitle),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
/** Team photos copied from the old iKan repo (public/team), named by first name. */
var $$splitComponentImporter$16 = () => import("./contact-hbGHgi1R.mjs");
var Route$20 = createFileRoute("/contact")({
	head: () => pageMeta("Contact us", contactPage.heroSubtitle),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./faq-C4gwTCMP.mjs");
var Route$19 = createFileRoute("/faq")({
	head: () => pageMeta(faqPage.heroTitle, faqPage.heroSubtitle),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./notifications-B6kyY6qL.mjs");
var Route$18 = createFileRoute("/notifications")({
	head: () => pageMeta("Notifications", "What needs you, what changed, and what happened."),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./phone-login-DDPY-whd.mjs");
var Route$17 = createFileRoute("/phone-login")({
	head: () => pageMeta("Continue with phone", "Sign in or sign up to iKAN with a code sent by SMS."),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./profile-DEaDv4xM.mjs");
var Route$16 = createFileRoute("/profile")({
	head: () => pageMeta("You", "Your details, emergency contact and archive."),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./reset-password-B9Rm52Dv.mjs");
var Route$15 = createFileRoute("/reset-password")({
	head: () => pageMeta("Set a new password", "Choose a new password for your iKAN account."),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./settings-D6XnSPpp.mjs");
var Route$14 = createFileRoute("/settings")({
	validateSearch: (s) => s["health"] === "connected" || s["health"] === "cancelled" || s["health"] === "error" ? { health: s["health"] } : {},
	head: () => pageMeta("Settings", "Notifications, health data, privacy and legal."),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./signup-okr8zHlZ.mjs");
var Route$13 = createFileRoute("/signup")({
	validateSearch: (s) => typeof s["redirect"] === "string" ? { redirect: s["redirect"] } : {},
	head: () => pageMeta("Create your account", "Join iKAN to take assessments, follow programs and track how you feel."),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./support-_ZQuGGN2.mjs");
var Route$12 = createFileRoute("/support")({
	head: () => pageMeta("Get support now", "Free, confidential crisis helplines in India, available when you need to talk to someone."),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./wellness-CLNlBhIs.mjs");
var Route$11 = createFileRoute("/wellness")({
	head: () => pageMeta("iKAN Score", "Your Collective Wellness Index: one number over everything you log."),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var Route$10 = createFileRoute("/assessment/")({ beforeLoad: () => {
	throw redirect({
		to: "/assessments",
		replace: true
	});
} });
var Route$9 = createFileRoute("/assessment/$slug")({ beforeLoad: ({ params }) => {
	throw redirect({
		to: "/assessments/$slug",
		params: { slug: params.slug },
		replace: true
	});
} });
var $$splitComponentImporter$6 = () => import("./assessments.index-BHFVmXZd.mjs");
var Route$8 = createFileRoute("/assessments/")({
	head: () => pageMeta("Assessments", "Seven short assessments for depression, anxiety, stress, sleep, work balance, burnout and general wellbeing."),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./diaries.index-CmMwGc7q.mjs");
var Route$7 = createFileRoute("/diaries/")({
	head: () => pageMeta("Learning diaries", "One learning diary for each Equip program."),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./history.index-BJD3EnzD.mjs");
var Route$6 = createFileRoute("/history/")({
	head: () => pageMeta("My history", "Everything you’ve done in iKAN, in one place."),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
/** My history covers the three things people come back to: assessments, programs and the journal. */
var $$splitComponentImporter$3 = () => import("./history.journal-5ou8r70n.mjs");
var Route$5 = createFileRoute("/history/journal")({
	head: () => pageMeta("Journal history", "Your mood check-ins, day by day and month by month."),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./program.index-BYj9n8IA.mjs");
var Route$4 = createFileRoute("/program/")({
	head: () => pageMeta("Programs", "iKAN Equip programs for sleep, burnout and stress."),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var Route$3 = createFileRoute("/program/history")({ beforeLoad: () => {
	throw redirect({
		to: "/history/program",
		replace: true
	});
} });
var Route$2 = createFileRoute("/result/$slug")({ beforeLoad: ({ params, search }) => {
	const r = search["r"];
	throw typeof r === "string" ? redirect({
		to: "/assessments/$slug/result/$id",
		params: {
			slug: params.slug,
			id: r
		},
		replace: true
	}) : redirect({
		to: "/history/assessments/$slug",
		params: { slug: params.slug },
		replace: true
	});
} });
var $$splitComponentImporter$1 = () => import("./history.assessments.index-Cr0iVfl5.mjs");
var Route$1 = createFileRoute("/history/assessments/")({
	head: () => pageMeta("Assessment history", "All seven assessments, with your results over time."),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./history.program.index-BapOPBGR.mjs");
var Route = createFileRoute("/history/program/")({
	head: () => pageMeta("Program history", "All three programs, with every run you’ve finished."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$22.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$23
});
var AboutRoute = Route$21.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$23
});
var AssessmentFlowRoute = Route$24.update({
	id: "/assessment-flow",
	path: "/assessment-flow",
	getParentRoute: () => Route$23
});
var ContactRoute = Route$20.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$23
});
var FaqRoute = Route$19.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$23
});
var ForgotPasswordRoute = Route$30.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$23
});
var JournalRoute = Route$33.update({
	id: "/journal",
	path: "/journal",
	getParentRoute: () => Route$23
});
var LoginRoute = Route$35.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$23
});
var NotificationsRoute = Route$18.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => Route$23
});
var PhoneLoginRoute = Route$17.update({
	id: "/phone-login",
	path: "/phone-login",
	getParentRoute: () => Route$23
});
var ProfileRoute = Route$16.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$23
});
var ResetPasswordRoute = Route$15.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$23
});
var SettingsRoute = Route$14.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$23
});
var SignupRoute = Route$13.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$23
});
var SupportRoute = Route$12.update({
	id: "/support",
	path: "/support",
	getParentRoute: () => Route$23
});
var VerifyEmailRoute = Route$43.update({
	id: "/verify-email",
	path: "/verify-email",
	getParentRoute: () => Route$23
});
var WelcomeRoute = Route$44.update({
	id: "/welcome",
	path: "/welcome",
	getParentRoute: () => Route$23
});
var WellnessRoute = Route$11.update({
	id: "/wellness",
	path: "/wellness",
	getParentRoute: () => Route$23
});
var AssessmentIndexRoute = Route$10.update({
	id: "/assessment/",
	path: "/assessment/",
	getParentRoute: () => Route$23
});
var AssessmentSlugRoute = Route$9.update({
	id: "/assessment/$slug",
	path: "/assessment/$slug",
	getParentRoute: () => Route$23
});
var AssessmentsIndexRoute = Route$8.update({
	id: "/assessments/",
	path: "/assessments/",
	getParentRoute: () => Route$23
});
var ConsultIndexRoute = Route$28.update({
	id: "/consult/",
	path: "/consult/",
	getParentRoute: () => Route$23
});
var ConsultIdRoute = Route$27.update({
	id: "/consult/$id",
	path: "/consult/$id",
	getParentRoute: () => Route$23
});
var DiariesIndexRoute = Route$7.update({
	id: "/diaries/",
	path: "/diaries/",
	getParentRoute: () => Route$23
});
var DiariesSlugRoute = Route$29.update({
	id: "/diaries/$slug",
	path: "/diaries/$slug",
	getParentRoute: () => Route$23
});
var HistoryIndexRoute = Route$6.update({
	id: "/history/",
	path: "/history/",
	getParentRoute: () => Route$23
});
var HistoryJournalRoute = Route$5.update({
	id: "/history/journal",
	path: "/history/journal",
	getParentRoute: () => Route$23
});
var LegalSlugRoute = Route$34.update({
	id: "/legal/$slug",
	path: "/legal/$slug",
	getParentRoute: () => Route$23
});
var ProgramIndexRoute = Route$4.update({
	id: "/program/",
	path: "/program/",
	getParentRoute: () => Route$23
});
var ProgramHistoryRoute = Route$3.update({
	id: "/program/history",
	path: "/program/history",
	getParentRoute: () => Route$23
});
var ResourcesIndexRoute = Route$42.update({
	id: "/resources/",
	path: "/resources/",
	getParentRoute: () => Route$23
});
var ResourcesSlugRoute = Route$41.update({
	id: "/resources/$slug",
	path: "/resources/$slug",
	getParentRoute: () => Route$23
});
var ResultSlugRoute = Route$2.update({
	id: "/result/$slug",
	path: "/result/$slug",
	getParentRoute: () => Route$23
});
var AssessmentsSlugIndexRoute = Route$25.update({
	id: "/assessments/$slug/",
	path: "/assessments/$slug/",
	getParentRoute: () => Route$23
});
var HistoryAssessmentsIndexRoute = Route$1.update({
	id: "/history/assessments/",
	path: "/history/assessments/",
	getParentRoute: () => Route$23
});
var HistoryAssessmentsSlugRoute = Route$31.update({
	id: "/history/assessments/$slug",
	path: "/history/assessments/$slug",
	getParentRoute: () => Route$23
});
var HistoryProgramIndexRoute = Route.update({
	id: "/history/program/",
	path: "/history/program/",
	getParentRoute: () => Route$23
});
var HistoryProgramSlugRoute = Route$32.update({
	id: "/history/program/$slug",
	path: "/history/program/$slug",
	getParentRoute: () => Route$23
});
var ProgramSlugIndexRoute = Route$37.update({
	id: "/program/$slug/",
	path: "/program/$slug/",
	getParentRoute: () => Route$23
});
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AssessmentFlowRoute,
	ContactRoute,
	FaqRoute,
	ForgotPasswordRoute,
	JournalRoute,
	LoginRoute,
	NotificationsRoute,
	PhoneLoginRoute,
	ProfileRoute,
	ResetPasswordRoute,
	SettingsRoute,
	SignupRoute,
	SupportRoute,
	VerifyEmailRoute,
	WelcomeRoute,
	WellnessRoute,
	AssessmentSlugRoute,
	ConsultIdRoute,
	DiariesSlugRoute,
	HistoryJournalRoute,
	LegalSlugRoute,
	ProgramHistoryRoute,
	ResourcesSlugRoute,
	ResultSlugRoute,
	AssessmentIndexRoute,
	AssessmentsIndexRoute,
	ConsultIndexRoute,
	DiariesIndexRoute,
	HistoryIndexRoute,
	ProgramIndexRoute,
	ResourcesIndexRoute,
	HistoryAssessmentsSlugRoute,
	HistoryProgramSlugRoute,
	ProgramSlugJournalRoute: Route$38.update({
		id: "/program/$slug/journal",
		path: "/program/$slug/journal",
		getParentRoute: () => Route$23
	}),
	ProgramSlugResultRoute: Route$39.update({
		id: "/program/$slug/result",
		path: "/program/$slug/result",
		getParentRoute: () => Route$23
	}),
	AssessmentsSlugIndexRoute,
	HistoryAssessmentsIndexRoute,
	HistoryProgramIndexRoute,
	ProgramSlugIndexRoute,
	AssessmentsSlugResultIdRoute: Route$26.update({
		id: "/assessments/$slug/result/$id",
		path: "/assessments/$slug/result/$id",
		getParentRoute: () => Route$23
	}),
	ProgramSlugDayDayRoute: Route$36.update({
		id: "/program/$slug/day/$day",
		path: "/program/$slug/day/$day",
		getParentRoute: () => Route$23
	}),
	ProgramSlugToolStepRoute: Route$40.update({
		id: "/program/$slug/tool/$step",
		path: "/program/$slug/tool/$step",
		getParentRoute: () => Route$23
	})
};
var routeTree = Route$23._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultPendingComponent: PageSkeleton,
		defaultPendingMs: 200,
		defaultPendingMinMs: 300,
		defaultErrorComponent: ({ reset }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorScreen, { reset }),
		defaultNotFoundComponent: NotFoundScreen
	});
};
//#endregion
export { getRouter };
