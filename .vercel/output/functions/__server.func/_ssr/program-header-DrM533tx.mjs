import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/program-header-DrM533tx.js
var import_jsx_runtime = require_jsx_runtime();
var backClass = "grid h-11 w-11 place-items-center rounded-full bg-secondary/70 text-foreground transition-transform active:scale-95";
/** Back to a fixed route, or to a programme page when `slug` is given. */
function BackLink(props) {
	if (props.to === "/program/$slug") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/program/$slug",
		params: { slug: props.slug },
		"aria-label": "Back",
		className: backClass,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: props.to,
		"aria-label": "Back",
		className: backClass,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5" })
	});
}
function ProgramHeader({ back, title, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-center justify-between gap-3 px-5 pb-2 pt-5",
		children: [
			back,
			title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "min-w-0 truncate font-display text-[15px] font-semibold",
				children: title
			}) : null,
			action ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-11 w-11" })
		]
	});
}
var pageMeta = (title, description) => ({ meta: [
	{ title: `${title} — iKAN` },
	{
		name: "description",
		content: description
	},
	{
		property: "og:title",
		content: `${title} — iKAN`
	},
	{
		property: "og:description",
		content: description
	},
	{
		property: "og:type",
		content: "website"
	},
	{
		name: "twitter:card",
		content: "summary_large_image"
	}
] });
//#endregion
export { ProgramHeader as n, pageMeta as r, BackLink as t };
