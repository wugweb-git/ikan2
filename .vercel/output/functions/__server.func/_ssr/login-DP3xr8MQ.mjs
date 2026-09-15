import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DP3xr8MQ.js
var $$splitComponentImporter = () => import("./login-0d2wZP6R.mjs");
var Route = createFileRoute("/login")({
	validateSearch: (s) => typeof s["redirect"] === "string" ? { redirect: s["redirect"] } : {},
	head: () => pageMeta("Sign in", "Sign in to continue your mental health journey."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
