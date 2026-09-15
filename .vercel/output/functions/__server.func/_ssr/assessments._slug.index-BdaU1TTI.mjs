import { r as getAssessment } from "./store-CsxAZBJN.mjs";
import { P as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as pageMeta } from "./program-header-DrM533tx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assessments._slug.index-BdaU1TTI.js
var $$splitComponentImporter = () => import("./assessments._slug.index-rj11jYnd.mjs");
var $$splitNotFoundComponentImporter = () => import("./assessments._slug.index-DDBemjqW.mjs");
var Route = createFileRoute("/assessments/$slug/")({
	loader: ({ params }) => {
		const a = getAssessment(params.slug);
		if (!a) throw notFound();
		return { slug: a.slug };
	},
	head: ({ loaderData }) => {
		const a = loaderData ? getAssessment(loaderData.slug) : void 0;
		return a ? pageMeta(a.title, `${a.questions.length} questions, about ${a.minutes} minutes. ${a.instrument}.`) : { meta: [{ title: "Assessment — iKAN" }] };
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
