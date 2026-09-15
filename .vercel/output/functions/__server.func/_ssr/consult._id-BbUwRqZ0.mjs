import { P as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getConsultant } from "./ikan-shell-BVeIbGxw.mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/consult._id-BbUwRqZ0.js
var $$splitComponentImporter = () => import("./consult._id-DWfcx-cJ.mjs");
var Route = createFileRoute("/consult/$id")({
	loader: ({ params }) => {
		const c = getConsultant(params.id);
		if (!c) throw notFound();
		return { id: c.id };
	},
	head: ({ loaderData }) => {
		const c = loaderData ? getConsultant(loaderData.id) : void 0;
		return c ? pageMeta(c.name, `${c.role}, ${c.years} years experience, ${c.city}.`) : { meta: [{ title: "Consultant — iKAN" }] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
