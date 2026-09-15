import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { S as useAuth } from "./auth-xMCnsA0H.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { G as MailCheck } from "../_libs/lucide-react.mjs";
import { i as FormError, n as AuthLayout } from "./auth-ui-DXj6R5BN.mjs";
import { t as Route } from "./verify-email-BsrpcQFr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-email-Rqpig9OE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifyPage() {
	const { email } = Route.useSearch();
	const { resendConfirmation } = useAuth();
	const [wait, setWait] = (0, import_react.useState)(60);
	const [sent, setSent] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (wait <= 0) return;
		const t = window.setTimeout(() => setWait((w) => w - 1), 1e3);
		return () => window.clearTimeout(t);
	}, [wait]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthLayout, {
		title: "Verify your email",
		art: "checkup",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center rounded-[28px] bg-secondary px-6 py-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-16 w-16 place-items-center rounded-full bg-[#DDF1E5] text-[#1E6644]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailCheck, { className: "h-8 w-8" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-[16px] leading-6",
					children: [
						"We sent a confirmation link to",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: email || "your email"
						}),
						". Open it on this device, then sign in."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[14px] text-muted-foreground",
					children: "Can’t find it? Check spam or promotions."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormError, { message: error }),
				sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-[14px] text-[#1E6644]",
					children: "Sent again. It can take a minute to arrive."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !email || wait > 0,
					onClick: async () => {
						if (!email) return;
						setError(null);
						try {
							await resendConfirmation(email);
							setSent(true);
							setWait(60);
						} catch (e) {
							setError(e.message);
						}
					},
					className: "flex h-14 w-full items-center justify-center rounded-full border border-foreground/20 text-[15px] font-semibold disabled:opacity-50",
					children: wait > 0 ? `Resend link in ${wait}s` : "Resend link"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "flex h-14 w-full items-center justify-center rounded-full bg-foreground text-[16px] font-semibold text-background",
					children: "I’ve confirmed, sign in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/signup",
					className: "block pt-2 text-center text-[14px] font-semibold underline underline-offset-4",
					children: "Use a different email"
				})
			]
		})]
	});
}
//#endregion
export { VerifyPage as component };
