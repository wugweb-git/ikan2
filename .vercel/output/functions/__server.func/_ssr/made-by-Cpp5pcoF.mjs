import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/made-by-Cpp5pcoF.js
var import_jsx_runtime = require_jsx_runtime();
/** "Made by wugweb", linking to the studio's website. */
function MadeBy({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: cn("text-center text-[12px] text-muted-foreground", className),
		children: [
			"Made by",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "https://wugweb.com",
				target: "_blank",
				rel: "noopener noreferrer",
				className: "font-semibold text-foreground underline-offset-4 hover:underline",
				children: "wugweb"
			})
		]
	});
}
//#endregion
export { MadeBy as t };
