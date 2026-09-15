import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as Illustration } from "./art-CKGIg2zx.mjs";
import { n as articles } from "./content-pwglTkg-.mjs";
import { r as getAssessment } from "./store-CsxAZBJN.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, Dt as Clock3, Gt as BookmarkCheck, Mt as ChevronRight, Wt as Bookmark, s as UserRound } from "../_libs/lucide-react.mjs";
import { S as useResourceStore, _ as slugOf, b as useHydrated, f as resources, o as getResource, t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { m as stateLayer, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { t as Route } from "./resources._slug-pf-zrD3n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resources._slug-CtnmwY5Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var dateLabel = (d) => (/* @__PURE__ */ new Date(`${d}T00:00:00`)).toLocaleDateString("en-IN", {
	day: "numeric",
	month: "long",
	year: "numeric"
});
function ArticlePage() {
	const { id } = Route.useLoaderData();
	const r = getResource(id);
	const article = articles[id];
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const store = useResourceStore();
	const saved = hydrated && store.isSaved(id);
	const assessment = r.assessment ? getAssessment(r.assessment) : void 0;
	const more = resources.filter((x) => x.id !== id && (x.category === r.category || x.art === r.art)).slice(0, 3);
	(0, import_react.useEffect)(() => {
		store.markOpened(id);
	}, [id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		style: accentStyle("calm"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-60 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art: r.art })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 top-0 flex items-center justify-between p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
					label: "Back",
					onClick: () => navigate({ to: "/resources" }),
					className: "bg-background/85 backdrop-blur",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
					label: saved ? "Remove from saved" : "Save for later",
					onClick: () => store.toggleSave(id),
					className: "bg-background/85 backdrop-blur",
					children: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "h-5 w-5 text-[var(--accent-strong)]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-5 w-5" })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative -mt-8 rounded-t-[28px] bg-background px-5 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] font-semibold text-[var(--accent-strong)]",
					children: r.category
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-[27px] font-semibold leading-[1.2] tracking-[-0.01em] text-balance",
					children: r.title
				}),
				article.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-[17px] leading-7 text-muted-foreground",
					children: article.description
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-foreground/10 pb-5 text-[13px] text-muted-foreground",
					children: [
						article.author ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-4 w-4" }),
								" ",
								article.author
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dateLabel(r.date) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "h-4 w-4" }),
								" ",
								r.minutes,
								" min read"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "prose-ikan mt-6",
					dangerouslySetInnerHTML: { __html: article.html }
				}),
				assessment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/assessments/$slug",
					params: { slug: assessment.slug },
					className: cn("mt-10 flex items-center gap-4 rounded-[24px] bg-foreground p-5 text-background", stateLayer),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[13px] opacity-70",
								children: "Take the test this article explains"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block font-display text-[18px] font-semibold leading-6",
								children: assessment.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block text-[13px] opacity-70",
								children: [
									assessment.questions.length,
									" questions, about ",
									assessment.minutes,
									" min"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5" })]
				}) : null,
				more.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-[18px] font-semibold",
						children: "Keep reading"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-3",
						children: more.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/resources/$slug",
							params: { slug: slugOf(m) },
							className: cn("flex items-center gap-3 rounded-[16px]", stateLayer),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-16 w-16 shrink-0 overflow-hidden rounded-[14px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art: m.art })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-[12px] font-semibold text-muted-foreground",
									children: [
										m.category,
										", ",
										m.minutes,
										" min read"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "line-clamp-2 text-[15px] font-semibold leading-5",
									children: m.title
								})]
							})]
						}) }, m.id))
					})]
				}) : null
			]
		})]
	}) });
}
//#endregion
export { ArticlePage as component };
