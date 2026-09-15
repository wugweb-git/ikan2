import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assessment-flow-nPnlrXtr.js
var $$splitComponentImporter = () => import("./assessment-flow-CsMXD0X_.mjs");
var Route = createFileRoute("/assessment-flow")({
	validateSearch: (search) => typeof search["id"] === "string" ? { id: search["id"] } : {},
	head: () => ({ meta: [{ title: "Assessment — iKAN" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
