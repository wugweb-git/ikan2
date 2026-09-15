import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { S as useAuth } from "./auth-xMCnsA0H.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { G as MailCheck } from "../_libs/lucide-react.mjs";
import { a as PrimaryButton, i as FormError, n as AuthLayout, r as Field } from "./auth-ui-DXj6R5BN.mjs";
import { i as email } from "./validate-DQrl-c4D.mjs";
import { t as Route } from "./forgot-password-D5FtES8D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-password-D__52X9r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ForgotPage() {
	const { sendReset } = useAuth();
	const initial = Route.useSearch().email ?? "";
	const [email$1, setEmail] = (0, import_react.useState)(initial);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [sent, setSent] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthLayout, {
		title: "Reset your password",
		subtitle: sent ? void 0 : "Enter your email and we’ll send a link to set a new password.",
		art: "sleep",
		children: [sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center rounded-[28px] bg-secondary px-6 py-8 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-16 w-16 place-items-center rounded-full bg-[#DDF1E5] text-[#1E6644]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailCheck, { className: "h-8 w-8" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-[16px] leading-6",
				children: [
					"If an account exists for ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: email$1
					}),
					", a reset link is on its way."
				]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			noValidate: true,
			className: "space-y-3",
			onSubmit: async (e) => {
				e.preventDefault();
				const invalid = email(email$1);
				if (invalid) {
					setError(invalid);
					return;
				}
				setBusy(true);
				setError(null);
				try {
					await sendReset(email$1);
					setSent(true);
				} catch (err) {
					setError(err.message);
				} finally {
					setBusy(false);
				}
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormError, { message: error }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Email",
					type: "email",
					autoComplete: "email",
					value: email$1,
					onChange: setEmail,
					maxLength: 254,
					placeholder: "you@example.com"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
					busy,
					children: "Send reset link"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/login",
			className: "mt-6 block text-center text-[15px] font-semibold underline underline-offset-4",
			children: "Back to sign in"
		})]
	});
}
//#endregion
export { ForgotPage as component };
