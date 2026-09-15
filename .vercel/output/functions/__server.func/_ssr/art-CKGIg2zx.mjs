import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/art-CKGIg2zx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var palettes = {
	stress: [
		"#FDE7D8",
		"#F6B48F",
		"#C4552E"
	],
	burnout: [
		"#FBEFD2",
		"#F2C46B",
		"#9A6512"
	],
	work: [
		"#E4ECF7",
		"#9DB8DE",
		"#2F5580"
	],
	anxiety: [
		"#E6E7F6",
		"#A9ADE3",
		"#3B418C"
	],
	mood: [
		"#F9E2E9",
		"#E9A3B9",
		"#8C3652"
	],
	sleep: [
		"#1F2A44",
		"#3D4E7A",
		"#F4E3A1"
	],
	measure: [
		"#DFF0E8",
		"#8CC7AC",
		"#2B634D"
	],
	checkup: [
		"#E3F1F6",
		"#8FC6D8",
		"#236174"
	]
};
function Illustration({ art, className }) {
	const id = (0, import_react.useId)().replace(/:/g, "");
	const [bg, mid, ink] = palettes[art];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 320 200",
		preserveAspectRatio: "xMidYMid slice",
		className: cn("block h-full w-full", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: `g${id}`,
				x1: "0",
				y1: "0",
				x2: "1",
				y2: "1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0",
					stopColor: bg
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "1",
					stopColor: mid,
					stopOpacity: art === "sleep" ? 1 : .55
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "320",
				height: "200",
				fill: `url(#g${id})`
			}),
			art === "stress" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				fill: "none",
				stroke: ink,
				strokeLinecap: "round",
				children: [[
					0,
					1,
					2,
					3,
					4
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: `M-10 ${70 + i * 22} C 60 ${40 + i * 22}, 110 ${110 + i * 22}, 180 ${70 + i * 22} S 290 ${40 + i * 22}, 340 ${80 + i * 22}`,
					strokeWidth: 6 - i,
					strokeOpacity: .9 - i * .15
				}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "250",
					cy: "52",
					r: "22",
					fill: ink,
					fillOpacity: "0.9",
					stroke: "none"
				})]
			}) : null,
			art === "burnout" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "160",
					cy: "118",
					r: "70",
					fill: mid,
					fillOpacity: "0.6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M160 48 C 196 92, 206 120, 184 156 C 176 170, 144 172, 136 156 C 120 128, 132 98, 160 48 Z",
					fill: ink,
					fillOpacity: "0.9"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M160 104 C 174 124, 176 138, 168 152 C 162 160, 154 160, 150 152 C 144 140, 148 126, 160 104 Z",
					fill: bg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "60",
					y: "176",
					width: "200",
					height: "6",
					rx: "3",
					fill: ink,
					fillOpacity: "0.35"
				})
			] }) : null,
			art === "work" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
				[
					0,
					1,
					2,
					3,
					4,
					5
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: 48 + i * 40,
					y: 150 - [
						40,
						70,
						55,
						95,
						80,
						120
					][i],
					width: "24",
					height: [
						40,
						70,
						55,
						95,
						80,
						120
					][i],
					rx: "6",
					fill: ink,
					fillOpacity: .35 + i * .1
				}, i)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M40 150 H 290",
					stroke: ink,
					strokeWidth: "3",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "262",
					cy: "40",
					r: "14",
					fill: "none",
					stroke: ink,
					strokeWidth: "4"
				})
			] }) : null,
			art === "anxiety" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				fill: "none",
				stroke: ink,
				children: [[
					26,
					46,
					66,
					86,
					106
				].map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "160",
					cy: "100",
					r,
					strokeWidth: 3,
					strokeOpacity: 1 - i * .17,
					strokeDasharray: i % 2 ? "6 10" : void 0
				}, r)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "160",
					cy: "100",
					r: "10",
					fill: ink,
					stroke: "none"
				})]
			}) : null,
			art === "mood" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M0 150 C 60 120, 110 170, 170 140 S 270 110, 320 130 V200 H0Z",
					fill: ink,
					fillOpacity: "0.25"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M0 170 C 70 150, 120 190, 190 165 S 280 150, 320 160 V200 H0Z",
					fill: ink,
					fillOpacity: "0.45"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "112",
					cy: "76",
					r: "30",
					fill: "#FFF7E6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "126",
					cy: "70",
					r: "26",
					fill: bg
				}),
				[
					[220, 52],
					[250, 82],
					[196, 92]
				].map(([x, y]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: x,
					cy: y,
					r: "4",
					fill: ink,
					fillOpacity: "0.7"
				}, `${x}`))
			] }) : null,
			art === "sleep" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "222",
					cy: "72",
					r: "34",
					fill: ink
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "238",
					cy: "62",
					r: "30",
					fill: mid
				}),
				[
					[60, 40],
					[96, 80],
					[140, 36],
					[40, 120],
					[290, 140],
					[180, 110]
				].map(([x, y], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: x,
					cy: y,
					r: i % 2 ? 2 : 3,
					fill: ink,
					fillOpacity: "0.9"
				}, i)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M0 170 C 80 140, 160 190, 320 150 V200 H0Z",
					fill: "#141C30"
				})
			] }) : null,
			art === "measure" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M60 150 A 100 100 0 0 1 260 150",
					fill: "none",
					stroke: ink,
					strokeOpacity: "0.2",
					strokeWidth: "18",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M60 150 A 100 100 0 0 1 214 72",
					fill: "none",
					stroke: ink,
					strokeWidth: "18",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "160",
					y1: "150",
					x2: "214",
					y2: "92",
					stroke: ink,
					strokeWidth: "6",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "160",
					cy: "150",
					r: "10",
					fill: ink
				})
			] }) : null,
			art === "checkup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "92",
					y: "36",
					width: "136",
					height: "140",
					rx: "18",
					fill: "#FFFFFF",
					fillOpacity: "0.85"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M112 106 H 138 L 150 80 L 168 132 L 182 100 H 208",
					fill: "none",
					stroke: ink,
					strokeWidth: "6",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}),
				[
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "112",
					y: 144 + i * 0,
					width: [
						60,
						40,
						80
					][i],
					height: "6",
					rx: "3",
					fill: ink,
					fillOpacity: "0.25",
					transform: `translate(0 ${i * 0})`
				}, i)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "228",
					cy: "40",
					r: "18",
					fill: ink
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M221 40 h14 M228 33 v14",
					stroke: "#fff",
					strokeWidth: "4",
					strokeLinecap: "round"
				})
			] }) : null
		]
	});
}
/** Monogram avatar with a soft two-tone gradient from a hue. */
function Avatar({ text, hue, size = 56, className, photo }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	const style = {
		width: size,
		height: size,
		fontSize: size * .36,
		color: `hsl(${hue} 45% 22%)`,
		background: `radial-gradient(circle at 30% 25%, hsl(${hue} 80% 92%), hsl(${hue} 55% 78%))`,
		boxShadow: `inset 0 0 0 2px hsl(${hue} 60% 96%)`
	};
	if (photo && !failed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: photo,
		alt: "",
		loading: "lazy",
		onError: () => setFailed(true),
		className: cn("shrink-0 rounded-full object-cover", className),
		style: {
			width: size,
			height: size,
			background: style.background
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": "true",
		className: cn("grid shrink-0 place-items-center rounded-full font-display font-semibold", className),
		style,
		children: text
	});
}
//#endregion
export { Illustration as n, Avatar as t };
