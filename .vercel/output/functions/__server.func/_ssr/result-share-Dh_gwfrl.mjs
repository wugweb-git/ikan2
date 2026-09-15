import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { T as Share2, W as Mail, bt as Download } from "../_libs/lucide-react.mjs";
import { r as IconButton, t as BottomSheet } from "./m3-Blvbxy5D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/result-share-Dh_gwfrl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** iKAN mark and name, for the top row of a result (and its printed copy). */
function BrandTitle({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("flex items-center gap-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/favicon.svg",
			alt: "",
			className: "h-7 w-7 rounded-[8px]"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-[18px] font-semibold",
			children: "iKAN"
		})]
	});
}
/** Only in the printed / downloaded copy: brand and when it was made. */
function PrintHeader({ title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hidden border-b border-foreground/15 px-4 pb-3 pt-2 print:flex print:items-center print:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandTitle, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-[12px] text-muted-foreground",
			children: [
				title,
				" ·",
				" ",
				(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
					day: "numeric",
					month: "short",
					year: "numeric"
				})
			]
		})]
	});
}
/** Small share button: download the result (save as PDF) or email a plain summary. */
function ShareButton({ subject, body }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
		label: "Download or email",
		onClick: () => setOpen(true),
		className: "print:hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-5 w-5" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomSheet, {
		open,
		onClose: () => setOpen(false),
		title: "Save or share",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: [{
				icon: Download,
				label: "Download",
				note: "Save this result as a PDF",
				run: () => {
					setOpen(false);
					window.setTimeout(() => window.print(), 250);
				}
			}, {
				icon: Mail,
				label: "Email",
				note: "Send a summary from your email app",
				run: () => {
					setOpen(false);
					window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${body}\n\nShared from iKAN`)}`;
				}
			}].map((r) => {
				const Icon = r.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: r.run,
					className: "flex w-full items-center gap-3 rounded-[16px] bg-secondary px-4 py-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-10 w-10 place-items-center rounded-[12px] bg-background",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-[15px] font-semibold",
						children: r.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-[13px] text-muted-foreground",
						children: r.note
					})] })]
				}) }, r.label);
			})
		})
	})] });
}
//#endregion
export { PrintHeader as n, ShareButton as r, BrandTitle as t };
