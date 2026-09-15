import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resources.index-B3crCaB1.js
var filters = [
	"All",
	"Saved",
	"General",
	"Stress",
	"Sleep"
];
var $$splitComponentImporter = () => import("./resources.index-BJbJHvVf.mjs");
var Route = createFileRoute("/resources/")({
	validateSearch: (s) => {
		const c = typeof s["category"] === "string" ? s["category"].toLowerCase() : "";
		return filters.some((f) => f !== "All" && f.toLowerCase() === c) ? { category: c } : {};
	},
	head: () => pageMeta("Resources", "Articles and guides to support your mental health journey."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { filters as n, Route as t };
