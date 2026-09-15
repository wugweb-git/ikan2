import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/welcome-BJFVXA6J.js
var $$splitComponentImporter = () => import("./welcome-B7nBqfIr.mjs");
var Route = createFileRoute("/welcome")({
	validateSearch: (s) => s["step"] === "about" ? { step: "about" } : {},
	head: () => pageMeta("Welcome to iKAN", "Tell us a little about you and we’ll suggest where to start."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
