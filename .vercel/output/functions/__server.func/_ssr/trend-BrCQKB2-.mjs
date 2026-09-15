import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { s as percentOfRange } from "./store-CsxAZBJN.mjs";
import { a as severityColors } from "./ui-CSQedWKe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trend-BrCQKB2-.js
var import_jsx_runtime = require_jsx_runtime();
/** Headline score over time, oldest to newest, drawn as position within the instrument's range. */
function Trend({ points, className }) {
	const w = 300;
	const h = 72;
	const pad = 8;
	const xy = points.map(({ head }, i) => {
		const p = head?.value != null ? percentOfRange(head.profile, head.value) : 0;
		return {
			x: pad + i * 284 / Math.max(1, points.length - 1),
			y: pad + (1 - p) * 56,
			severity: head?.band?.severity
		};
	});
	const better = points[0]?.head?.profile.direction === "better";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: className ?? "rounded-[12px] bg-background px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: `0 0 ${w} ${h}`,
			className: "h-[72px] w-full",
			role: "img",
			"aria-label": "Score over time",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
				points: xy.map((p) => `${p.x},${p.y}`).join(" "),
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35",
				strokeWidth: "2",
				strokeLinejoin: "round"
			}), xy.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: p.x,
				cy: p.y,
				r: "5",
				fill: p.severity ? severityColors[p.severity].bar : "currentColor",
				stroke: "white",
				strokeWidth: "2"
			}, i))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[12px] text-muted-foreground",
			children: better ? "Higher is better" : "Lower is better"
		})]
	});
}
//#endregion
export { Trend as t };
