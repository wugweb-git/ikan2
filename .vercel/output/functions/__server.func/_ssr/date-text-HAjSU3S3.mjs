import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { zt as CalendarDays } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/date-text-HAjSU3S3.js
var import_jsx_runtime = require_jsx_runtime();
/** A date with a small calendar icon in front, for anywhere a date is shown. */
function DateText({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 align-middle", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
			className: "h-3.5 w-3.5 shrink-0 opacity-70",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children })]
	});
}
//#endregion
export { DateText as t };
