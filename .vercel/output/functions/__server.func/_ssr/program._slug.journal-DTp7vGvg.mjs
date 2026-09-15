import { a as getProgramme } from "./programs-DrKO9d_v.mjs";
import { P as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/program._slug.journal-DTp7vGvg.js
var $$splitComponentImporter = () => import("./program._slug.journal-Dc_Vzws7.mjs");
var Route = createFileRoute("/program/$slug/journal")({
	loader: ({ params }) => {
		const programme = getProgramme(params.slug);
		if (!programme) throw notFound();
		return { slug: programme.slug };
	},
	head: ({ loaderData }) => pageMeta(`Your entries${loaderData ? ` · ${getProgramme(loaderData.slug)?.name}` : ""}`, "Everything you've written in this programme."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
