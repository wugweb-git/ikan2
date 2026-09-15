import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/journal-D6JsC5I0.js
var $$splitComponentImporter = () => import("./journal-BTzeL5MS.mjs");
var Route = createFileRoute("/journal")({
	validateSearch: (search) => {
		const m = Number(search["mood"]);
		return Number.isInteger(m) && m >= 1 && m <= 5 ? { mood: m } : {};
	},
	head: () => pageMeta("Journal", "Track how you feel, one day at a time."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
