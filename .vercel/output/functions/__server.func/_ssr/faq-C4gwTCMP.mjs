import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as faqPage } from "./content-pwglTkg-.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Search, Pt as ChevronDown } from "../_libs/lucide-react.mjs";
import { t as InfoShell } from "./info-shell-_j2_-UyW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-C4gwTCMP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FaqPage() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const q = query.trim().toLowerCase();
	const groups = faqPage.categories.filter((c) => category === "all" || c.id === category).map((c) => ({
		...c,
		items: c.items.filter((i) => !q || i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q))
	})).filter((c) => c.items.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(InfoShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-[32px] font-semibold leading-10",
				children: faqPage.heroTitle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[16px] leading-6 text-muted-foreground",
				children: faqPage.heroSubtitle
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mx-5 mt-5 flex h-12 items-center gap-3 rounded-full border border-foreground/15 px-4 focus-within:border-foreground/40",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "search",
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: faqPage.searchPlaceholder,
				"aria-label": faqPage.searchPlaceholder,
				className: "h-full flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5",
			role: "tablist",
			"aria-label": "Topics",
			children: [{
				id: "all",
				title: "All"
			}, ...faqPage.categories].map((c) => {
				const on = c.id === category;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					role: "tab",
					"aria-selected": on,
					onClick: () => setCategory(c.id),
					className: cn("inline-flex h-9 shrink-0 items-center rounded-[8px] border px-3.5 text-[14px] font-medium", on ? "border-transparent bg-foreground text-background" : "border-foreground/20"),
					children: c.title
				}, c.id);
			})
		}),
		groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mx-5 mt-8 text-center text-[15px] text-muted-foreground",
			children: faqPage.noResultsText
		}) : groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-7 px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-[18px] font-semibold",
				children: g.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 overflow-hidden rounded-[20px] border border-foreground/10",
				children: g.items.map((i, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: cn("group", n > 0 && "border-t border-foreground/10"),
					open: Boolean(q),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
						className: "flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 py-3 text-[15px] font-medium [&::-webkit-details-marker]:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1",
							children: i.question
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-4 pb-4 text-[15px] leading-6 text-muted-foreground",
						children: i.answer
					})]
				}, i.question))
			})]
		}, g.id)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-5 mt-10 rounded-[24px] bg-secondary p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-[19px] font-semibold",
					children: faqPage.ctaTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[15px] leading-6 text-muted-foreground",
					children: faqPage.ctaDescription
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/contact",
					className: "mt-4 inline-flex h-11 items-center rounded-full bg-foreground px-5 text-[15px] font-semibold text-background",
					children: faqPage.ctaButtonText
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6" })
	] });
}
//#endregion
export { FaqPage as component };
