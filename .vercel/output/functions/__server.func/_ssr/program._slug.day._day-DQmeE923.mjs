import { a as getProgramme, i as getDay } from "./programs-DrKO9d_v.mjs";
import { P as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/program._slug.day._day-DQmeE923.js
var $$splitComponentImporter = () => import("./program._slug.day._day-B0jaGqeQ.mjs");
var $$splitNotFoundComponentImporter = () => import("./program._slug.day._day-DhXLzLvk.mjs");
var Route = createFileRoute("/program/$slug/day/$day")({
	loader: ({ params }) => {
		const programme = getProgramme(params.slug);
		const day = programme ? getDay(programme, Number(params.day)) : void 0;
		if (!programme || !day) throw notFound();
		return {
			slug: programme.slug,
			day: day.day
		};
	},
	head: ({ loaderData }) => {
		const p = loaderData ? getProgramme(loaderData.slug) : void 0;
		const d = p && loaderData ? getDay(p, loaderData.day) : void 0;
		return { meta: [{ title: p && d ? `Day ${d.day}: ${d.title} — ${p.name} — iKAN` : "Day — iKAN" }, {
			name: "robots",
			content: "noindex"
		}] };
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
