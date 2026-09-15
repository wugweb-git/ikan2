import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { F as Phone, w as ShieldAlert } from "../_libs/lucide-react.mjs";
import { t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { n as ProgramHeader, t as BackLink } from "./program-header-DrM533tx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/support-_ZQuGGN2.js
var import_jsx_runtime = require_jsx_runtime();
var lines = [
	{
		name: "Tele-MANAS",
		body: "Government of India mental health helpline · 24×7 · many languages",
		number: "14416",
		tel: "14416"
	},
	{
		name: "AASRA",
		body: "Suicide prevention and emotional support · 24×7",
		number: "+91 98204 66726",
		tel: "+919820466726"
	},
	{
		name: "Vandrevala Foundation",
		body: "Mental health helpline · 24×7 · call or WhatsApp",
		number: "+91 99996 66555",
		tel: "+919999666555"
	}
];
function SupportPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IkanShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramHeader, {
		back: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackLink, { to: "/" }),
		title: "Get support now"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: "tel:112",
				className: "tile flex items-center gap-4 rounded-[24px] bg-alert p-5 text-alert-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-8 w-8 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-semibold",
							children: "In immediate danger?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm opacity-90",
							children: "Call emergency services on 112"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-11 w-11 place-items-center rounded-full bg-alert-foreground/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm leading-6 text-muted-foreground",
				children: "If you feel overwhelmed, speaking with someone trained can help right now. These lines are free and confidential."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `tel:${line.tel}`,
					className: "surface tile grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-sm font-semibold",
								children: line.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs leading-5 text-muted-foreground",
								children: line.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 font-display text-base font-semibold tabular-nums",
								children: line.number
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-11 w-11 place-items-center rounded-full bg-foreground text-background",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" })
					})]
				}, line.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-6 max-w-xs text-center text-[10px] leading-4 text-muted-foreground",
				children: "iKAN Equip is a self-help tool. It does not replace care from a qualified mental health professional."
			})
		]
	})] });
}
//#endregion
export { SupportPage as component };
