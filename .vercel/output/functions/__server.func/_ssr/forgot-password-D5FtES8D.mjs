import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-password-D5FtES8D.js
var $$splitComponentImporter = () => import("./forgot-password-D__52X9r.mjs");
var Route = createFileRoute("/forgot-password")({
	validateSearch: (s) => typeof s["email"] === "string" ? { email: s["email"] } : {},
	head: () => pageMeta("Reset your password", "Get a link to set a new iKAN password."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
