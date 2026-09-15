import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { S as useAuth } from "./auth-xMCnsA0H.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { W as Mail } from "../_libs/lucide-react.mjs";
import { a as PrimaryButton, i as FormError, n as AuthLayout } from "./auth-ui-DXj6R5BN.mjs";
import { p as phone10 } from "./validate-DQrl-c4D.mjs";
import { t as PhoneField } from "./phone-field-Br7a6ZV3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/phone-login-DDPY-whd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RESEND_AFTER = 30;
function PhoneLoginPage() {
	const { sendPhoneCode, verifyPhoneCode } = useAuth();
	const [phone, setPhone] = (0, import_react.useState)("+91 ");
	const [code, setCode] = (0, import_react.useState)("");
	const [step, setStep] = (0, import_react.useState)("phone");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [touched, setTouched] = (0, import_react.useState)(false);
	const [wait, setWait] = (0, import_react.useState)(0);
	const codeRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (wait <= 0) return;
		const t = window.setTimeout(() => setWait((w) => w - 1), 1e3);
		return () => window.clearTimeout(t);
	}, [wait]);
	const phoneError = touched ? phone10(phone) : void 0;
	const digits = phone.replace(/[^\d+]/g, "");
	const send = async () => {
		setTouched(true);
		if (phone10(phone)) return;
		setBusy(true);
		setError(null);
		try {
			await sendPhoneCode(digits);
			setStep("code");
			setCode("");
			setWait(RESEND_AFTER);
			window.setTimeout(() => codeRef.current?.focus(), 50);
		} catch (e) {
			setError(e.message);
		} finally {
			setBusy(false);
		}
	};
	const verify = async () => {
		if (!/^\d{6}$/.test(code)) return setError("Enter the 6-digit code.");
		setBusy(true);
		setError(null);
		try {
			await verifyPhoneCode(digits, code);
		} catch (e) {
			setError(e.message);
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthLayout, {
		title: step === "phone" ? "Continue with phone" : "Enter your code",
		subtitle: step === "phone" ? "We’ll text you a 6-digit code. New here? This creates your account." : `We sent it to ${phone.trim()}.`,
		children: [
			step === "phone" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				noValidate: true,
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					send();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormError, { message: error }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneField, {
						label: "Phone number",
						value: phone,
						onChange: setPhone,
						error: phoneError
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						busy,
						children: "Send code"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				noValidate: true,
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					verify();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormError, { message: error }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1.5 block text-[13px] font-medium text-muted-foreground",
							children: "6-digit code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: codeRef,
							inputMode: "numeric",
							autoComplete: "one-time-code",
							maxLength: 6,
							value: code,
							onChange: (e) => {
								const next = e.target.value.replace(/\D/g, "").slice(0, 6);
								setCode(next);
								if (next.length === 6) setError(null);
							},
							placeholder: "••••••",
							className: "h-14 w-full rounded-[16px] border border-transparent bg-secondary px-4 text-center font-display text-[24px] tracking-[0.5em] tabular-nums outline-none focus:border-foreground/60 focus:bg-background"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						busy,
						children: "Verify and continue"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[14px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setStep("phone");
								setError(null);
							},
							className: "font-semibold underline-offset-4 hover:underline",
							children: "Change number"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: wait > 0 || busy,
							onClick: () => void send(),
							className: "font-semibold underline-offset-4 hover:underline disabled:text-muted-foreground disabled:no-underline",
							children: wait > 0 ? `Resend in ${wait}s` : "Resend code"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "my-4 flex items-center gap-3 text-[13px] text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-foreground/10" }),
					" or",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-foreground/10" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/login",
				className: "flex h-12 w-full items-center justify-center gap-2 rounded-full border border-foreground/15 text-[15px] font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-5 w-5" }), " Sign in with email"]
			})
		]
	});
}
//#endregion
export { PhoneLoginPage as component };
