import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { S as useAuth } from "./auth-xMCnsA0H.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PrimaryButton, i as FormError, n as AuthLayout, r as Field } from "./auth-ui-DXj6R5BN.mjs";
import { u as password } from "./validate-DQrl-c4D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-B9Rm52Dv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPage() {
	const { status, updatePassword } = useAuth();
	const navigate = useNavigate();
	const [password$1, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	if (status === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLayout, {
		title: "Set a new password",
		art: "sleep",
		children: null
	});
	if (status === "signedOut") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLayout, {
		title: "This link has expired",
		subtitle: "Reset links work once and expire after a while. Ask for a new one.",
		art: "sleep",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/forgot-password",
			className: "flex h-14 w-full items-center justify-center rounded-full bg-foreground text-[16px] font-semibold text-background",
			children: "Send a new link"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLayout, {
		title: "Set a new password",
		subtitle: "Use at least 8 characters with letters and a number. You’ll stay signed in on this device.",
		art: "sleep",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			noValidate: true,
			className: "space-y-3",
			onSubmit: async (e) => {
				e.preventDefault();
				const weak = password(password$1);
				if (weak) return setError(weak);
				if (password$1 !== confirm) return setError("The two passwords don’t match.");
				setBusy(true);
				setError(null);
				try {
					await updatePassword(password$1);
					navigate({
						to: "/",
						replace: true
					});
				} catch (err) {
					setError(err.message);
					setBusy(false);
				}
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormError, { message: error }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "New password",
					type: "password",
					autoComplete: "new-password",
					value: password$1,
					onChange: setPassword
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Confirm new password",
					type: "password",
					autoComplete: "new-password",
					value: confirm,
					onChange: setConfirm
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
					busy,
					children: "Save password"
				})
			]
		})
	});
}
//#endregion
export { ResetPage as component };
