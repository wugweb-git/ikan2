import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as upcoming, p as useProgramme, s as programmes } from "./programs-DrKO9d_v.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, Mt as ChevronRight, R as NotebookPen } from "../_libs/lucide-react.mjs";
import { b as useHydrated, t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { f as TopAppBar, m as stateLayer, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { i as latestRun, r as journeyOf } from "./journey-Muau11lk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/diaries.index-CmMwGc7q.js
var import_jsx_runtime = require_jsx_runtime();
function DiariesPage() {
	const hydrated = useHydrated();
	const navigate = useNavigate();
	const states = {
		"sleep-tight": useProgramme("sleep-tight").state,
		unburn: useProgramme("unburn").state,
		"stress-buster": useProgramme("stress-buster").state
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IkanShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, {
		leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
			label: "Back",
			onClick: () => navigate({ to: "/history" }),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
		}),
		title: "Learning diaries"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "mt-2 space-y-3 px-4",
		children: [programmes.map((p) => {
			const j = journeyOf(p, latestRun(p, states[p.slug]));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				style: accentStyle(p.accent),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/diaries/$slug",
					params: { slug: p.slug },
					className: cn("flex items-center gap-3 rounded-[24px] border border-foreground/10 p-3 pr-4", stateLayer, hydrated && !j.started && "opacity-55 grayscale"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.cover,
								alt: "",
								className: "h-20 w-20 rounded-[18px] object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-foreground text-background",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotebookPen, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-display text-[18px] font-semibold leading-6",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-[13px] text-muted-foreground",
								children: [hydrated && !j.started ? "Not started yet" : "Learning diary", hydrated && j.responses ? ` · ${j.responses} ${j.responses === 1 ? "entry" : "entries"}` : ""]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
					]
				})
			}, p.slug);
		}), upcoming.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex items-center gap-3 rounded-[24px] border border-dashed border-foreground/20 p-3 pr-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-20 w-20 shrink-0 place-items-center rounded-[18px] bg-secondary text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotebookPen, { className: "h-7 w-7" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-display text-[18px] font-semibold leading-6",
					children: u.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[13px] text-muted-foreground",
					children: "Learning diary · coming soon"
				})]
			})]
		}, u.name))]
	})] });
}
//#endregion
export { DiariesPage as component };
