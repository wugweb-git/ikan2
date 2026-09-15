import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-email-BsrpcQFr.js
var $$splitComponentImporter = () => import("./verify-email-Rqpig9OE.mjs");
var Route = createFileRoute("/verify-email")({
	validateSearch: (s) => typeof s["email"] === "string" ? { email: s["email"] } : {},
	head: () => pageMeta("Verify your email", "Confirm your email address to finish creating your iKAN account."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
