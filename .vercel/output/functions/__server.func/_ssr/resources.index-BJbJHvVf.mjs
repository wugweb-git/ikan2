import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as Illustration } from "./art-CKGIg2zx.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Search, Gt as BookmarkCheck, Kt as BookOpen, Wt as Bookmark } from "../_libs/lucide-react.mjs";
import { S as useResourceStore, _ as slugOf, b as useHydrated, f as resources, t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { h as useSnack, l as Snackbar, m as stateLayer, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { n as filters, t as Route } from "./resources.index-B3crCaB1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resources.index-BJbJHvVf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var dateLabel = (d) => (/* @__PURE__ */ new Date(`${d}T00:00:00`)).toLocaleDateString("en-IN", {
	day: "numeric",
	month: "short",
	year: "numeric"
});
function ResourcesPage() {
	const hydrated = useHydrated();
	const store = useResourceStore();
	const snack = useSnack();
	const { category } = Route.useSearch();
	const filter = filters.find((f) => f.toLowerCase() === category) ?? "All";
	const setFilter = (f) => navigate({
		to: "/resources",
		search: f === "All" ? {} : { category: f.toLowerCase() },
		replace: true,
		resetScroll: false
	});
	const [query, setQuery] = (0, import_react.useState)("");
	const navigate = useNavigate();
	const open = (r) => navigate({
		to: "/resources/$slug",
		params: { slug: slugOf(r) }
	});
	const featured = resources.filter((r) => r.featured);
	const q = query.trim().toLowerCase();
	const shown = resources.filter((r) => !q || r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)).filter((r) => filter === "All" ? true : filter === "Saved" ? hydrated && store.isSaved(r.id) : r.category === filter);
	const toggle = (r) => {
		const was = store.isSaved(r.id);
		store.toggleSave(r.id);
		snack.show(was ? "Removed from saved" : "Saved for later");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle("calm"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "px-4 pb-1 pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-[32px] font-semibold leading-10",
					children: "Resources"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[15px] text-muted-foreground",
					children: "Articles and guides to support your mental health journey"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mx-4 mt-4 flex h-12 items-center gap-3 rounded-full border border-foreground/15 bg-background px-4 focus-within:border-foreground/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "search",
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search articles and guides",
					"aria-label": "Search articles and guides",
					className: "h-full flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
				})]
			}),
			q ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-5",
				"aria-label": "Featured",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1",
					children: featured.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => open(r),
						className: cn("relative h-[232px] w-[86%] shrink-0 snap-center overflow-hidden rounded-[28px] text-left text-white", stateLayer),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, {
								art: r.art,
								className: "absolute inset-0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "absolute inset-x-0 bottom-0 p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex h-6 items-center gap-1.5 rounded-full bg-white/20 px-2.5 text-[12px] font-semibold backdrop-blur",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3.5 w-3.5" }), i === 0 ? "Featured story" : r.category]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-2 line-clamp-3 font-display text-[20px] font-semibold leading-6",
										children: r.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-2 block text-[13px] opacity-85",
										children: [
											dateLabel(r.date),
											", ",
											r.minutes,
											" min read"
										]
									})
								]
							})
						]
					}, r.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-scrollbar mt-5 flex gap-2 overflow-x-auto px-4",
				role: "tablist",
				"aria-label": "Filter articles",
				children: filters.map((f) => {
					const on = f === filter;
					const count = f === "Saved" && hydrated ? store.saved.length : null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "tab",
						"aria-selected": on,
						onClick: () => setFilter(f),
						className: cn("inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[8px] border px-3.5 text-[14px] font-medium transition-colors", stateLayer, on ? "border-transparent bg-[var(--accent-container)] text-[var(--on-accent-container)]" : "border-foreground/20"),
						children: [
							f === "Saved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-4 w-4" }) : null,
							f,
							count ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] opacity-70",
								children: count
							}) : null
						]
					}, f);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 px-4 text-[13px] text-muted-foreground",
				children: [
					shown.length,
					" ",
					shown.length === 1 ? "article" : "articles"
				]
			}),
			shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-3 overflow-hidden rounded-[24px] bg-secondary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-28",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art: "checkup" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-[17px] font-semibold",
						children: q ? "No articles match" : "Nothing saved yet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[14px] text-muted-foreground",
						children: q ? "Try another word, like sleep or stress." : "Tap the bookmark on any article to keep it here."
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 px-4",
				children: shown.map((r) => {
					const saved = hydrated && store.isSaved(r.id);
					const read = hydrated && Boolean(store.opened[r.id]);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "border-b border-foreground/10 last:border-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => open(r),
								className: cn("flex min-w-0 flex-1 items-center gap-3 rounded-[16px] text-left", stateLayer),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-[84px] w-[84px] shrink-0 overflow-hidden rounded-[16px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art: r.art })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-[12px] font-semibold text-[var(--accent-strong)]",
											children: [r.category, read ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-2 font-normal text-muted-foreground",
												children: "Read"
											}) : null]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-0.5 line-clamp-2 text-[15px] font-semibold leading-5",
											children: r.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-1 block text-[12px] text-muted-foreground",
											children: [
												dateLabel(r.date),
												", ",
												r.minutes,
												" min read"
											]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: saved ? "Remove from saved" : "Save for later",
								onClick: () => toggle(r),
								children: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "h-5 w-5 text-[var(--accent-strong)]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-5 w-5 text-muted-foreground" })
							})]
						})
					}, r.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Snackbar, { message: snack.message })
		]
	}) });
}
//#endregion
export { ResourcesPage as component };
