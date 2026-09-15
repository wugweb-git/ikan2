import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as getAssessment } from "./store-CsxAZBJN.mjs";
import { P as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { J as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assessments._slug.result._id-BGJ93hSH.js
var import_jsx_runtime = require_jsx_runtime();
function ResultLoading({ label = "Loading your result…" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[70dvh] place-items-center px-6 text-center",
		role: "status",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-8 w-8 animate-spin text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[15px] text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mt-6 w-64 space-y-3",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-[24px] bg-secondary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 animate-pulse rounded-full bg-secondary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-2/3 animate-pulse rounded-full bg-secondary" })
				]
			})
		] })
	}) });
}
var $$splitComponentImporter = () => import("./assessments._slug.result._id-DZAC7RfG.mjs");
var Route = createFileRoute("/assessments/$slug/result/$id")({
	loader: ({ params }) => {
		if (!getAssessment(params.slug)) throw notFound();
		return {
			slug: params.slug,
			id: params.id
		};
	},
	head: () => ({ meta: [{ title: "Your result — iKAN" }, {
		name: "robots",
		content: "noindex"
	}] }),
	pendingComponent: ResultLoading,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as n, ResultLoading as t };
