//#region node_modules/.nitro/vite/services/ssr/assets/validate-DQrl-c4D.js
var required = (message) => (v) => v.trim() ? void 0 : message;
var email = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? void 0 : "Enter a valid email address.";
var personName = (v) => {
	const t = v.trim();
	if (!t) return "Tell us what to call you.";
	if (t.length < 2) return "Use at least 2 letters.";
	if (t.length > 60) return "Keep it under 60 characters.";
	if (!/^[\p{L}][\p{L}\p{M} .'-]*$/u.test(t)) return "Use letters, spaces, apostrophes or hyphens.";
};
var passwordRules = (v) => [{
	ok: v.length >= 8,
	label: "At least 8 characters"
}, {
	ok: /[A-Za-z]/.test(v) && /\d/.test(v),
	label: "Letters and a number"
}];
var password = (v) => {
	if (v.length < 8) return "Use at least 8 characters.";
	if (!(/[A-Za-z]/.test(v) && /\d/.test(v))) return "Use letters and at least one number.";
	if (v.length > 72) return "Keep it under 72 characters.";
};
/** A national number: exactly 10 digits. */
var DIAL_CODES = [
	"+971",
	"+966",
	"+974",
	"+977",
	"+880",
	"+91",
	"+44",
	"+61",
	"+65",
	"+49",
	"+94",
	"+1"
];
/** Splits "+91 98765 43210" into its country code and national digits ("9876543210"). */
function splitPhone(v) {
	const compact = v.replace(/[\s()-]/g, "");
	const dial = DIAL_CODES.find((d) => compact.startsWith(d)) ?? "";
	return {
		dial,
		digits: compact.slice(dial.length).replace(/\D/g, "")
	};
}
/** The national number only, without the country code. */
var phoneDigits = (v) => splitPhone(v).digits;
/** 10 digits after the country code; an Indian mobile also starts with 6, 7, 8 or 9. */
var phone10 = (v) => {
	const { dial, digits } = splitPhone(v);
	if (!/^\d{10}$/.test(digits)) return "Enter a 10-digit phone number.";
	if ((dial === "+91" || dial === "") && !/^[6-9]/.test(digits)) return "Indian mobile numbers start with 6, 7, 8 or 9.";
};
/** Indian PIN code: 6 digits, not starting with 0. */
var pin = (v) => /^[1-9]\d{5}$/.test(v.trim()) ? void 0 : "Enter a 6-digit PIN code.";
var city = (v) => {
	const t = v.trim();
	if (t.length < 2) return "Enter your city.";
	if (!/^[\p{L}][\p{L}\p{M} .'-]*$/u.test(t)) return "Use letters only.";
};
/** Date of birth as yyyy-mm-dd: a real date, not in the future, age 13 to 110. */
var birthday = (v) => {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "Enter your date of birth.";
	const d = /* @__PURE__ */ new Date(`${v}T00:00:00`);
	if (Number.isNaN(d.getTime())) return "Enter a real date.";
	const now = /* @__PURE__ */ new Date();
	if (d > now) return "Date of birth can’t be in the future.";
	let age = now.getFullYear() - d.getFullYear();
	if (now < new Date(now.getFullYear(), d.getMonth(), d.getDate())) age -= 1;
	if (age < 13) return "You need to be 13 or older to use iKAN.";
	if (age > 110) return "Check the year.";
};
var maxLength = (n, what = "this") => (v) => v.length > n ? `Keep ${what} under ${n} characters.` : void 0;
var minLength = (n, message) => (v) => v.trim().length < n ? message : void 0;
/** Run checks in order, only when there is something to check (for optional fields). */
var optional = (...checks) => (v) => v.trim() && !/^\+\d{1,4}$/.test(v.replace(/\s/g, "")) ? all(...checks)(v) : void 0;
var all = (...checks) => (v) => {
	for (const c of checks) {
		const m = c(v);
		if (m) return m;
	}
};
/** Validate a record of fields at once; `ok` is true when nothing failed. */
function validate(values, rules) {
	const errors = {};
	for (const k of Object.keys(rules)) {
		const m = rules[k](values[k] ?? "");
		if (m) errors[k] = m;
	}
	return {
		errors,
		ok: Object.keys(errors).length === 0
	};
}
var genders = [
	"Woman",
	"Man",
	"Non-binary",
	"Prefer to self-describe",
	"Prefer not to say"
];
var maritalStatuses = [
	"Single",
	"In a relationship",
	"Married",
	"Separated",
	"Divorced",
	"Widowed",
	"Prefer not to say"
];
//#endregion
export { validate as _, genders as a, minLength as c, passwordRules as d, personName as f, required as g, pin as h, email as i, optional as l, phoneDigits as m, birthday as n, maritalStatuses as o, phone10 as p, city as r, maxLength as s, all as t, password as u };
