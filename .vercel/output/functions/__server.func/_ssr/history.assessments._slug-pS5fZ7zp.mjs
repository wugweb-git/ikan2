import { r as getAssessment } from "./store-CsxAZBJN.mjs";
import { P as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history.assessments._slug-pS5fZ7zp.js
var $$splitComponentImporter = () => import("./history.assessments._slug-DeRSisCb.mjs");
var Route = createFileRoute("/history/assessments/$slug")({
	loader: ({ params }) => {
		if (!getAssessment(params.slug)) throw notFound();
		return { slug: params.slug };
	},
	head: ({ loaderData }) => pageMeta(`${loaderData ? getAssessment(loaderData.slug)?.title : "Assessment"} history`, "Every result for this assessment, with a summary and recommendations."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
