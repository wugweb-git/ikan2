import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { Pt as ChevronDown } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/phone-field-Br7a6ZV3.js
var import_jsx_runtime = require_jsx_runtime();
var countries = [
	{
		code: "IN",
		flag: "🇮🇳",
		dial: "+91",
		name: "India"
	},
	{
		code: "AE",
		flag: "🇦🇪",
		dial: "+971",
		name: "United Arab Emirates"
	},
	{
		code: "US",
		flag: "🇺🇸",
		dial: "+1",
		name: "United States"
	},
	{
		code: "GB",
		flag: "🇬🇧",
		dial: "+44",
		name: "United Kingdom"
	},
	{
		code: "CA",
		flag: "🇨🇦",
		dial: "+1",
		name: "Canada"
	},
	{
		code: "AU",
		flag: "🇦🇺",
		dial: "+61",
		name: "Australia"
	},
	{
		code: "SG",
		flag: "🇸🇬",
		dial: "+65",
		name: "Singapore"
	},
	{
		code: "SA",
		flag: "🇸🇦",
		dial: "+966",
		name: "Saudi Arabia"
	},
	{
		code: "QA",
		flag: "🇶🇦",
		dial: "+974",
		name: "Qatar"
	},
	{
		code: "DE",
		flag: "🇩🇪",
		dial: "+49",
		name: "Germany"
	},
	{
		code: "NP",
		flag: "🇳🇵",
		dial: "+977",
		name: "Nepal"
	},
	{
		code: "BD",
		flag: "🇧🇩",
		dial: "+880",
		name: "Bangladesh"
	},
	{
		code: "LK",
		flag: "🇱🇰",
		dial: "+94",
		name: "Sri Lanka"
	}
];
/** "+91 98765 43210", "9876543210", "+1 (415) 555-0100" → country and the last 10 digits. */
function parsePhone(value) {
	const v = value.trim();
	const byDial = [...countries].sort((a, b) => b.dial.length - a.dial.length).find((c) => v.replace(/\s/g, "").startsWith(c.dial));
	const digits = (byDial ? v.replace(/\s/g, "").slice(byDial.dial.length) : v).replace(/\D/g, "");
	return {
		country: byDial ?? countries[0],
		number: digits.slice(-10)
	};
}
var formatPhone = (country, number) => number ? `${country.dial} ${number}` : "";
function PhoneField({ label, value, onChange, error, hint, variant = "auth", autoComplete = "tel-national" }) {
	const { country, number } = parsePhone(value);
	const setCountry = (code) => {
		const next = countries.find((c) => `${c.code}${c.dial}` === code) ?? countries[0];
		onChange(formatPhone(next, number) || `${next.dial} `);
	};
	const setNumber = (raw) => onChange(formatPhone(country, raw.replace(/\D/g, "").slice(0, 10)));
	const select = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "relative flex h-full shrink-0 items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			"aria-hidden": "true",
			className: "pointer-events-none flex items-center gap-1 pr-2 text-[16px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[20px] leading-none",
					children: country.flag
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums",
					children: country.dial
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			"aria-label": "Country code",
			value: `${country.code}${country.dial}`,
			onChange: (e) => setCountry(e.target.value),
			className: "absolute inset-0 cursor-pointer opacity-0",
			children: countries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
				value: `${c.code}${c.dial}`,
				children: [
					c.flag,
					" ",
					c.name,
					" (",
					c.dial,
					")"
				]
			}, c.code))
		})]
	});
	const input = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "tel",
		inputMode: "numeric",
		autoComplete,
		maxLength: 10,
		value: number,
		onChange: (e) => setNumber(e.target.value),
		placeholder: "98765 43210",
		"aria-label": label,
		"aria-invalid": Boolean(error),
		className: "h-full min-w-0 flex-1 border-l border-foreground/15 bg-transparent pl-3 text-[16px] tabular-nums outline-none placeholder:text-muted-foreground/70"
	});
	const message = error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		role: "alert",
		className: "mt-1.5 block px-1 text-[13px] text-[#B3261E]",
		children: error
	}) : hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "mt-1.5 block px-1 text-[13px] text-muted-foreground",
		children: hint
	}) : null;
	if (variant === "m3") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-t-[4px] border-b bg-secondary transition-colors focus-within:border-b-2", error ? "border-[#B3261E]" : "border-foreground/50 focus-within:border-foreground"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block px-4 pt-2 text-[12px] leading-4 text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-10 items-center px-4 pb-1",
			children: [select, input]
		})]
	}), message] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1 block text-[13px] font-medium text-muted-foreground",
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex h-12 items-center rounded-[14px] border bg-secondary px-4 transition-colors focus-within:border-foreground/60 focus-within:bg-background", error ? "border-[#B3261E]" : "border-transparent"),
			children: [select, input]
		}),
		message
	] });
}
//#endregion
export { PhoneField as t };
