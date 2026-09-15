import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { S as useAuth } from "./auth-xMCnsA0H.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ft as Check } from "../_libs/lucide-react.mjs";
import { a as PrimaryButton, i as FormError, n as AuthLayout, r as Field, s as SocialButtons } from "./auth-ui-DXj6R5BN.mjs";
import { _ as validate, d as passwordRules, f as personName, i as email, l as optional, m as phoneDigits, p as phone10, u as password } from "./validate-DQrl-c4D.mjs";
import { t as PhoneField } from "./phone-field-Br7a6ZV3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-okr8zHlZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignupPage() {
	const { signUp } = useAuth();
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [email$1, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [password$1, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [touched, setTouched] = (0, import_react.useState)({});
	const [agreed, setAgreed] = (0, import_react.useState)(false);
	const checks = passwordRules(password$1);
	const { errors, ok } = validate({
		name,
		email: email$1,
		phone,
		password: password$1
	}, {
		name: personName,
		email,
		phone: optional(phone10),
		password
	});
	const show = (k) => touched[k] || touched["all"] ? errors[k] : void 0;
	const blur = (k) => () => setTouched((t) => ({
		...t,
		[k]: true
	}));
	const agreeError = touched["all"] && !agreed ? "Agree to the terms to create an account." : void 0;
	const submit = async (e) => {
		e.preventDefault();
		setTouched({ all: true });
		if (!ok || !agreed) return;
		setBusy(true);
		setError(null);
		try {
			if (await signUp({
				name: name.trim(),
				email: email$1.trim(),
				password: password$1,
				...phoneDigits(phone).length === 10 ? { phone: phone.trim() } : {}
			}) === "confirm") navigate({
				to: "/verify-email",
				search: { email: email$1.trim() }
			});
		} catch (err) {
			setError(err.message);
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthLayout, {
		title: "Create your account",
		subtitle: "Assessments, programs and mood tracking.",
		art: "welcome",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				noValidate: true,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormError, { message: error }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Full name",
						autoComplete: "name",
						value: name,
						onChange: setName,
						onBlur: blur("name"),
						maxLength: 60,
						error: show("name")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						type: "email",
						autoComplete: "email",
						value: email$1,
						onChange: setEmail,
						onBlur: blur("email"),
						maxLength: 254,
						placeholder: "you@example.com",
						error: show("email")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneField, {
						label: "Phone (optional)",
						value: phone,
						onChange: setPhone,
						error: show("phone")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Password",
						type: "password",
						autoComplete: "new-password",
						value: password$1,
						onChange: setPassword,
						onBlur: blur("password"),
						maxLength: 72,
						error: show("password")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: cn("mt-2 flex flex-wrap gap-2", !password$1 && !show("password") && "hidden"),
						children: checks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cn("inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[12px] font-medium transition-colors", c.ok ? "bg-[#DDF1E5] text-[#1E6644]" : "bg-secondary text-muted-foreground"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("h-3.5 w-3.5", !c.ok && "opacity-30") }),
								" ",
								c.label
							]
						}, c.label))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex cursor-pointer items-start gap-3 text-[14px] leading-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: agreed,
							onChange: (e) => setAgreed(e.target.checked),
							"aria-invalid": Boolean(agreeError),
							className: "mt-0.5 h-5 w-5 shrink-0 accent-foreground"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"I agree to the",
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
							", and I’m 13 or older."
						] })]
					}), agreeError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "mt-1.5 text-[13px] text-[#B3261E]",
						children: agreeError
					}) : null] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
						busy,
						children: "Create account"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialButtons, { onError: setError }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-center text-[15px]",
				children: [
					"Already have an account?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "font-semibold underline underline-offset-4",
						children: "Sign in"
					})
				]
			})
		]
	});
}
//#endregion
export { SignupPage as component };
