import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as formatValue, s as percentOfRange } from "./store-CsxAZBJN.mjs";
import { B as Moon, dt as Gauge, i as Waves, k as Scale, mt as Flame, wt as CloudRain, xt as Compass } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-CSQedWKe.js
var import_jsx_runtime = require_jsx_runtime();
var categoryIcon = {
	depression: CloudRain,
	anxiety: Waves,
	stress: Gauge,
	sleep: Moon,
	balance: Scale,
	burnout: Flame,
	general: Compass
};
/** Band tone is authored per band in the spec; these are its colours (text shades 4.5:1+ on their containers). */
var toneColors = {
	success: {
		fg: "#1E6644",
		container: "#DDF1E5",
		bar: "#3E9B6C"
	},
	warning: {
		fg: "#744F00",
		container: "#FCEFCF",
		bar: "#D39B22"
	},
	error: {
		fg: "#9E2A2A",
		container: "#FBE2E0",
		bar: "#D2544F"
	}
};
var severityColors = {
	minimal: {
		fg: "oklch(0.44 0.09 165)",
		container: "oklch(0.95 0.035 165)",
		bar: "oklch(0.68 0.12 165)"
	},
	mild: {
		fg: "oklch(0.45 0.1 245)",
		container: "oklch(0.95 0.03 245)",
		bar: "oklch(0.68 0.11 245)"
	},
	moderate: {
		fg: "oklch(0.47 0.1 75)",
		container: "oklch(0.96 0.05 85)",
		bar: "oklch(0.8 0.14 83)"
	},
	"moderately-severe": {
		fg: "oklch(0.47 0.14 45)",
		container: "oklch(0.95 0.04 50)",
		bar: "oklch(0.72 0.15 50)"
	},
	severe: {
		fg: "oklch(0.45 0.17 25)",
		container: "oklch(0.95 0.035 25)",
		bar: "oklch(0.6 0.19 25)"
	}
};
/** Plain wording for each severity step, rewritten from the old app's catalog descriptions. */
var severityContent = {
	minimal: {
		label: "Minimal",
		description: "Nothing of concern right now"
	},
	mild: {
		label: "Mild",
		description: "A few signs worth keeping an eye on"
	},
	moderate: {
		label: "Moderate",
		description: "Noticeable symptoms. Guided support can help"
	},
	"moderately-severe": {
		label: "Moderately severe",
		description: "Significant symptoms. A guided program is recommended"
	},
	severe: {
		label: "Severe",
		description: "Serious symptoms. Please talk to a professional soon"
	}
};
/** Colours for a band: by its severity, as the old app showed them. */
var bandStyle = (band) => band ? {
	"--tone": severityColors[band.severity].fg,
	"--tone-container": severityColors[band.severity].container,
	"--tone-bar": severityColors[band.severity].bar
} : toneStyle(void 0);
var toneStyle = (tone) => tone ? {
	"--tone": toneColors[tone].fg,
	"--tone-container": toneColors[tone].container,
	"--tone-bar": toneColors[tone].bar
} : {
	"--tone": "var(--muted-foreground)",
	"--tone-container": "var(--secondary)",
	"--tone-bar": "var(--muted-foreground)"
};
function BandChip({ label, tone, severity, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		style: severity ? bandStyle({ severity }) : toneStyle(tone),
		className: cn("inline-flex min-h-7 items-center rounded-[8px] bg-[var(--tone-container)] px-2.5 text-[13px] font-semibold leading-4 text-[var(--tone)]", className),
		children: label
	});
}
/** The instrument's range as band segments, with a marker where the score landed. */
function RangeBar({ result, large }) {
	const { profile, value } = result;
	const span = profile.max - profile.min;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("flex w-full gap-[3px]", large ? "h-3" : "h-2"),
			children: profile.bands.map((band) => {
				const on = result.band === band;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-full rounded-full",
					style: {
						width: `${(band.max - band.min) / span * 100}%`,
						background: severityColors[band.severity].bar,
						opacity: on ? 1 : .22
					}
				}, band.label);
			})
		}), value !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			className: cn("absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-background bg-foreground shadow", large ? "h-6 w-6" : "h-4 w-4"),
			style: { left: `${percentOfRange(profile, value) * 100}%` }
		}) : null]
	});
}
var valueText = (r) => r.value === null ? "—" : `${formatValue(r.profile, r.value)} of ${r.profile.max}`;
//#endregion
export { severityColors as a, toneStyle as c, categoryIcon as i, valueText as l, RangeBar as n, severityContent as o, bandStyle as r, toneColors as s, BandChip as t };
