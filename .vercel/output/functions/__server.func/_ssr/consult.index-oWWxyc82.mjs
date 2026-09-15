import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/consult.index-oWWxyc82.js
var roles = [
	"All",
	"Therapist",
	"Psychiatrist",
	"Counselor",
	"Family Therapist"
];
var when = [
	"Any time",
	"Today",
	"Tomorrow",
	"This week"
];
var param = (v) => v.toLowerCase().replace(/\s+/g, "-");
var $$splitComponentImporter = () => import("./consult.index-BsdcHzMB.mjs");
var Route = createFileRoute("/consult/")({
	validateSearch: (s) => ({
		...typeof s["role"] === "string" && roles.some((r) => r !== "All" && param(r) === s["role"]) ? { role: s["role"] } : {},
		...typeof s["when"] === "string" && when.some((w) => w !== "Any time" && param(w) === s["when"]) ? { when: s["when"] } : {}
	}),
	head: () => pageMeta("Find your consultant", "Connect with experienced mental health professionals who understand your needs."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { when as i, param as n, roles as r, Route as t };
