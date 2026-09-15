import { n as articles } from "./content-pwglTkg-.mjs";
import { P as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as getResource, s as getResourceBySlug } from "./ikan-shell-BVeIbGxw.mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resources._slug-pf-zrD3n.js
var $$splitComponentImporter = () => import("./resources._slug-CtnmwY5Z.mjs");
var Route = createFileRoute("/resources/$slug")({
	loader: ({ params }) => {
		const r = getResourceBySlug(params.slug);
		if (!r || !articles[r.id]) throw notFound();
		return { id: r.id };
	},
	head: ({ loaderData }) => {
		const r = loaderData ? getResource(loaderData.id) : void 0;
		const a = loaderData ? articles[loaderData.id] : void 0;
		return r ? pageMeta(r.title, a?.description || r.title) : { meta: [{ title: "Article — iKAN" }] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
