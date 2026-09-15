import { a as getProgramme, n as findStep } from "./programs-DrKO9d_v.mjs";
import { P as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/program._slug.tool._step-CZP7kJBE.js
var $$splitComponentImporter = () => import("./program._slug.tool._step-Bf1UvXbf.mjs");
/** Exercises Notion marks "available for ever, on demand". */
var Route = createFileRoute("/program/$slug/tool/$step")({
	loader: ({ params }) => {
		const programme = getProgramme(params.slug);
		const step = programme ? findStep(programme, params.step) : void 0;
		if (!programme || !step || !programme.tools.some((t) => `${t.day}.${t.n}` === params.step)) throw notFound();
		return {
			slug: programme.slug,
			id: step.id
		};
	},
	head: ({ loaderData }) => {
		const p = loaderData ? getProgramme(loaderData.slug) : void 0;
		const s = p && loaderData ? findStep(p, loaderData.id) : void 0;
		return { meta: [{ title: s && p ? `${s.block.title} — ${p.name} — iKAN` : "Tool — iKAN" }, {
			name: "robots",
			content: "noindex"
		}] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
