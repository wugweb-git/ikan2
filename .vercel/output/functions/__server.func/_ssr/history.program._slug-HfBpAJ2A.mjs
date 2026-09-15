import { a as getProgramme } from "./programs-DrKO9d_v.mjs";
import { P as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history.program._slug-HfBpAJ2A.js
var $$splitComponentImporter = () => import("./history.program._slug-7EdtY8On.mjs");
var Route = createFileRoute("/history/program/$slug")({
	loader: ({ params }) => {
		if (!getProgramme(params.slug)) throw notFound();
		return { slug: params.slug };
	},
	head: ({ loaderData }) => pageMeta(`${loaderData ? getProgramme(loaderData.slug)?.name : "Program"} history`, "Every finished run of this program, with a summary."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
