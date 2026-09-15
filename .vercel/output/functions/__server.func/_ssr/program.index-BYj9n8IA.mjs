import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as upcoming, p as useProgramme, s as programmes } from "./programs-DrKO9d_v.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Mt as ChevronRight, R as NotebookPen, at as History } from "../_libs/lucide-react.mjs";
import { t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { m as stateLayer, p as accentStyle } from "./m3-Blvbxy5D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/program.index-BYj9n8IA.js
var import_jsx_runtime = require_jsx_runtime();
function ProgramsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IkanShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "relative px-4 pb-1 pt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute right-2 top-6 flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/history/program",
						"aria-label": "Equip history",
						title: "Equip history",
						className: cn("grid h-12 w-12 place-items-center rounded-full text-foreground", stateLayer),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-6 w-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/diaries",
						"aria-label": "Learning diaries",
						title: "Learning diaries",
						className: cn("grid h-12 w-12 place-items-center rounded-full text-foreground", stateLayer),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotebookPen, { className: "h-6 w-6" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-[32px] font-semibold leading-10",
					children: "Programs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[15px] text-muted-foreground",
					children: "Short daily sessions, one skill at a time."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3 px-4 pt-4",
			children: programmes.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgrammeCard, { programme: p }) }, p.slug))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8 px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-[16px] font-semibold",
				children: "Coming soon"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2",
				children: upcoming.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex min-h-14 items-center justify-between rounded-[16px] border border-dashed border-foreground/20 px-4 text-[16px] text-muted-foreground",
					children: [u.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[13px]",
						children: "Soon"
					})]
				}, u.name))
			})]
		})
	] });
}
function ProgrammeCard({ programme }) {
	const { state, nextDay } = useProgramme(programme.slug);
	const total = programme.days.length;
	const done = state.completed.length;
	const started = done > 0;
	const src = programme.source;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/program/$slug",
		params: { slug: programme.slug },
		style: accentStyle(programme.accent),
		className: cn("flex overflow-hidden rounded-[24px] bg-secondary", stateLayer),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: programme.cover,
			alt: "",
			className: "w-[112px] shrink-0 object-cover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-[20px] font-semibold leading-7",
					children: programme.name
				}),
				src.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 line-clamp-2 text-[14px] leading-5 text-muted-foreground",
					children: src.description
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-auto pt-3",
					children: started ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 overflow-hidden rounded-full bg-[var(--accent-container)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-[var(--accent)]",
							style: { width: `${done / total * 100}%` }
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 flex items-center justify-between text-[13px] font-medium text-[var(--accent-strong)]",
						children: [nextDay < total ? `Continue with day ${nextDay}` : "All days done", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center justify-between text-[13px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							src.meta.days,
							", ",
							src.meta.level.charAt(0).toUpperCase() + src.meta.level.slice(1)
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
					})
				})
			]
		})]
	});
}
//#endregion
export { ProgramsPage as component };
