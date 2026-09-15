import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assessments._slug.index-DDBemjqW.js
var import_jsx_runtime = require_jsx_runtime();
/** Each assessment's banner art, in the same illustration style as the library. */
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "grid min-h-[70vh] place-items-center px-8 text-center",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-xl font-semibold",
		children: "We couldn’t find that assessment"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/assessments",
		className: "mt-5 inline-flex h-12 items-center rounded-full bg-foreground px-6 font-semibold text-background",
		children: "See all assessments"
	})] })
}) });
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
