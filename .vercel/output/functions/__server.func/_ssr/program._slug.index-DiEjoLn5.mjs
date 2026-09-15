import { a as getProgramme } from "./programs-DrKO9d_v.mjs";
import { P as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/program._slug.index-DiEjoLn5.js
var $$splitComponentImporter = () => import("./program._slug.index-CnXBAnWU.mjs");
var Route = createFileRoute("/program/$slug/")({
	loader: ({ params }) => {
		const programme = getProgramme(params.slug);
		if (!programme) throw notFound();
		return { slug: programme.slug };
	},
	head: ({ loaderData }) => {
		const p = loaderData ? getProgramme(loaderData.slug) : void 0;
		return p ? pageMeta(p.name, p.source.description) : { meta: [{ title: "Programme — iKAN" }] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
