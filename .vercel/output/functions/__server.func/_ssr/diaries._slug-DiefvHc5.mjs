import { a as getProgramme } from "./programs-DrKO9d_v.mjs";
import { P as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
import { o as runParam } from "./journey-Muau11lk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/diaries._slug-DiefvHc5.js
var $$splitComponentImporter = () => import("./diaries._slug-DIS5_9Av.mjs");
var Route = createFileRoute("/diaries/$slug")({
	validateSearch: (s) => runParam(s["run"]) !== void 0 ? { run: runParam(s["run"]) } : {},
	loader: ({ params }) => {
		if (!getProgramme(params.slug)) throw notFound();
		return { slug: params.slug };
	},
	head: ({ loaderData }) => pageMeta(`Learning diary${loaderData ? ` · ${getProgramme(loaderData.slug)?.name}` : ""}`, "Your answers from this program, day by day."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
