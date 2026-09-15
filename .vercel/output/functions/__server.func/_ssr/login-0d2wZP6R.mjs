import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { S as useAuth, g as rememberLogin, v as setRememberLogin } from "./auth-xMCnsA0H.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PrimaryButton, c as TermsNote, i as FormError, n as AuthLayout, o as RememberMe, r as Field, s as SocialButtons } from "./auth-ui-DXj6R5BN.mjs";
import { _ as validate, g as required, i as email } from "./validate-DQrl-c4D.mjs";
import { t as Route } from "./login-DP3xr8MQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-0d2wZP6R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { signIn } = useAuth();
	const navigate = useNavigate();
	const { redirect } = Route.useSearch();
	const [email$1, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [touched, setTouched] = (0, import_react.useState)({});
	const [remember, setRemember] = (0, import_react.useState)(() => typeof window === "undefined" ? true : rememberLogin());
	const { errors, ok } = validate({
		email: email$1,
		password
	}, {
		email,
		password: required("Enter your password.")
	});
	const emailError = touched["email"] ? errors.email : void 0;
	const passwordError = touched["password"] ? errors.password : void 0;
	const submit = async (e) => {
		e.preventDefault();
		setTouched({
			email: true,
			password: true
		});
		if (!ok) return;
		setRememberLogin(remember);
		setBusy(true);
		setError(null);
		try {
			await signIn(email$1, password);
		} catch (err) {
			const message = err.message;
			if (/confirm your email/i.test(message)) {
				navigate({
					to: "/verify-email",
					search: { email: email$1.trim() }
				});
				return;
			}
			setError(message);
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthLayout, {
		title: "Welcome back",
		subtitle: "Sign in to continue your mental health journey.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				noValidate: true,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormError, { message: error }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						type: "email",
						autoComplete: "email",
						value: email$1,
						onChange: setEmail,
						onBlur: () => setTouched((t) => ({
							...t,
							email: true
						})),
						maxLength: 254,
						placeholder: "you@example.com",
						error: emailError
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Password",
						type: "password",
						autoComplete: "current-password",
						value: password,
						onChange: setPassword,
						onBlur: () => setTouched((t) => ({
							...t,
							password: true
						})),
						maxLength: 72,
						error: passwordError
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RememberMe, {
							checked: remember,
							onChange: setRemember
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/forgot-password",
							search: email$1 ? { email: email$1 } : {},
							className: "text-[14px] font-semibold underline-offset-4 hover:underline",
							children: "Forgot password?"
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						busy,
						children: "Sign in"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialButtons, { onError: setError }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-center text-[15px]",
				children: [
					"New to iKAN?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signup",
						search: redirect ? { redirect } : {},
						className: "font-semibold underline underline-offset-4",
						children: "Create an account"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TermsNote, {})
		]
	});
}
//#endregion
export { LoginPage as component };
