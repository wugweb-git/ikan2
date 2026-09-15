import { o as legalPages } from "./content-pwglTkg-.mjs";
import { P as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/legal._slug-DhGmMKSr.js
var $$splitComponentImporter = () => import("./legal._slug-B_cSelLa.mjs");
var Route = createFileRoute("/legal/$slug")({
	loader: ({ params }) => {
		if (!(params.slug in legalPages)) throw notFound();
		return { slug: params.slug };
	},
	head: ({ loaderData }) => {
		const p = loaderData ? legalPages[loaderData.slug] : void 0;
		return p ? pageMeta(p.title, p.subtitle || p.title) : { meta: [{ title: "Legal — iKAN" }] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
