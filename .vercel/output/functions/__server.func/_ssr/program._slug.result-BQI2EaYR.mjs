import { a as getProgramme } from "./programs-DrKO9d_v.mjs";
import { P as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
import { o as runParam } from "./journey-Muau11lk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/program._slug.result-BQI2EaYR.js
var $$splitComponentImporter = () => import("./program._slug.result-Diliqu8C.mjs");
var Route = createFileRoute("/program/$slug/result")({
	validateSearch: (s) => ({
		...runParam(s["run"]) !== void 0 ? { run: runParam(s["run"]) } : {},
		...s["done"] === true || s["done"] === "true" ? { done: true } : {}
	}),
	loader: ({ params }) => {
		if (!getProgramme(params.slug)) throw notFound();
		return { slug: params.slug };
	},
	head: ({ loaderData }) => pageMeta(`${loaderData ? getProgramme(loaderData.slug)?.name : "Program"} result`, "What you did and learnt in this program."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
