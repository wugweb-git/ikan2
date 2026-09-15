import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { o as scopedKey } from "./storage-scope-BQ7XsBx5.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { w as ShieldAlert } from "../_libs/lucide-react.mjs";
import { n as Button, t as BottomSheet } from "./m3-Blvbxy5D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-bd7iLj4d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** A top-level group on a detail page. */
function Group({ title, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("mt-10 px-4", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-[20px] font-semibold leading-7",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children
		})]
	});
}
/** A heading inside a group. */
function SubHead({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: "mb-2 mt-5 text-[15px] font-semibold",
		children
	});
}
var tints = [
	{
		bg: "oklch(0.95 0.035 165)",
		fg: "oklch(0.44 0.09 165)"
	},
	{
		bg: "oklch(0.95 0.03 245)",
		fg: "oklch(0.45 0.1 245)"
	},
	{
		bg: "oklch(0.96 0.05 85)",
		fg: "oklch(0.47 0.1 75)"
	},
	{
		bg: "oklch(0.95 0.035 25)",
		fg: "oklch(0.45 0.17 25)"
	}
];
/** Bullet content as a bento grid: two columns, an odd last tile spans the row. Neutral greys
* with alternating depth; only the icon carries the page accent. */
function Bento({ items, offset = 0, colored = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "grid grid-cols-2 gap-2",
		children: items.map((t, i) => {
			const Icon = t.icon;
			const wide = items.length % 2 === 1 && i === items.length - 1;
			const deep = (i + offset) % 3 === 0;
			const tint = tints[(i + offset) % tints.length];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cn("rounded-[20px] p-4", wide && "col-span-2", !colored && (deep ? "bg-foreground/[0.07]" : "bg-foreground/[0.035]")),
				style: colored ? { background: tint.bg } : void 0,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-9 w-9 place-items-center rounded-[12px] bg-background text-[var(--accent-strong)]",
						style: colored ? { color: tint.fg } : void 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
					}),
					t.label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[14px] font-semibold leading-5",
						children: t.label
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-[14px] leading-5", t.label ? "mt-1 text-muted-foreground" : "mt-3 font-medium"),
						children: t.text
					})
				]
			}, t.text);
		})
	});
}
/** One short "good to know" paragraph on a tinted background, with a way to get help. */
function ImportantNote({ text, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("mx-4 mt-10 flex gap-3 rounded-[24px] p-4", className),
		style: { background: tints[2].bg },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-background/70",
			style: { color: tints[2].fg },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[15px] font-semibold",
					children: "Good to know"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[14px] leading-5 text-foreground/80",
					children: text
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/support",
					className: "mt-2 inline-block text-[14px] font-semibold underline underline-offset-4",
					children: "Need help now?"
				})
			]
		})]
	});
}
var ackKey = (id) => scopedKey(`ikan.before-start.${id}`);
function useBeforeStart(id, start) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return {
		open,
		close: () => setOpen(false),
		/** show the notes every time something is started; confirming starts it */
		request: () => setOpen(true),
		confirm: () => {
			try {
				window.localStorage.setItem(ackKey(id), (/* @__PURE__ */ new Date()).toISOString());
			} catch {}
			setOpen(false);
			start();
		}
	};
}
function BeforeYouStart({ open, onClose, onConfirm, items, cta }) {
	const [agreed, setAgreed] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BottomSheet, {
		open,
		onClose,
		title: "Before you start",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: items.map((t, i) => {
					const tint = tints[i % tints.length];
					const Icon = t.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 text-[15px] leading-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-[14px]",
							style: {
								background: tint.bg,
								color: tint.fg
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.text })]
					}, t.text);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-5 flex cursor-pointer items-center gap-3 text-[15px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: agreed,
					onChange: (e) => setAgreed(e.target.checked),
					className: "h-5 w-5 shrink-0 accent-[var(--accent-strong)]"
				}), "I understand"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onConfirm,
					disabled: !agreed,
					children: cta
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "text",
					onClick: onClose,
					children: "Not now"
				})]
			})
		]
	});
}
//#endregion
export { SubHead as a, ImportantNote as i, Bento as n, useBeforeStart as o, Group as r, BeforeYouStart as t };
