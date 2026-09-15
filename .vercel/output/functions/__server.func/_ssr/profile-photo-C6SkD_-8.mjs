import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-photo-C6SkD_-8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** The person's photo filling its circle; shows `children` (initials) if there is none or it fails. */
function ProfilePhoto({ src, className, children }) {
	const [failed, setFailed] = (0, import_react.useState)(null);
	if (src && failed !== src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: "",
		referrerPolicy: "no-referrer",
		onError: () => setFailed(src),
		className: cn("h-full w-full rounded-full object-cover", className)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
//#endregion
export { ProfilePhoto as t };
