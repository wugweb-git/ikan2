import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as legalOrder, o as legalPages } from "./content-pwglTkg-.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as InfoShell } from "./info-shell-_j2_-UyW.mjs";
import { t as Route } from "./legal._slug-DhGmMKSr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/legal._slug-B_cSelLa.js
var import_jsx_runtime = require_jsx_runtime();
function LegalPage() {
	const { slug } = Route.useLoaderData();
	const page = legalPages[slug];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(InfoShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "no-scrollbar flex gap-2 overflow-x-auto px-5 pb-2",
			role: "navigation",
			"aria-label": "Legal pages",
			children: legalOrder.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/legal/$slug",
				params: { slug: s },
				className: cn("inline-flex h-9 shrink-0 items-center rounded-[8px] border px-3.5 text-[14px] font-medium", s === slug ? "border-transparent bg-foreground text-background" : "border-foreground/20"),
				children: legalPages[s].title
			}, s))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "px-5 pt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-[30px] font-semibold leading-9",
				children: page.title
			}), page.subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[16px] leading-6 text-muted-foreground",
				children: page.subtitle
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "prose-ikan mt-6 px-5",
			dangerouslySetInnerHTML: { __html: page.html }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8" })
	] });
}
//#endregion
export { LegalPage as component };
