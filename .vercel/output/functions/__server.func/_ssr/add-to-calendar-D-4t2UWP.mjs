import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { Mt as ChevronRight, Rt as CalendarPlus, zt as CalendarDays } from "../_libs/lucide-react.mjs";
import { t as BottomSheet } from "./m3-Blvbxy5D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/add-to-calendar-D-4t2UWP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var pad = (n) => String(n).padStart(2, "0");
/** Floating local time (no zone), so the calendar keeps it at the same clock time. */
var local = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
var utcStamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
var end = (e) => new Date(e.start.getTime() + e.minutes * 6e4);
var rrule = (e) => e.daily ? `RRULE:FREQ=DAILY${typeof e.daily === "number" ? `;COUNT=${e.daily}` : ""}` : null;
var body = (e) => e.url ? `${e.details}\n\nOpen iKAN: ${e.url}` : e.details;
function googleCalendarUrl(e) {
	const q = new URLSearchParams({
		action: "TEMPLATE",
		text: e.title,
		dates: `${local(e.start)}/${local(end(e))}`,
		details: body(e),
		ctz: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata"
	});
	const r = rrule(e);
	if (r) q.set("recur", r);
	return `https://calendar.google.com/calendar/render?${q.toString()}`;
}
var escape = (s) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
/** RFC 5545 lines are folded at 75 octets. */
var fold = (line) => {
	const out = [];
	let rest = line;
	while (rest.length > 74) {
		out.push(rest.slice(0, 74));
		rest = ` ${rest.slice(74)}`;
	}
	out.push(rest);
	return out.join("\r\n");
};
function icsFile(e) {
	return [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//iKAN//Reminders//EN",
		"CALSCALE:GREGORIAN",
		"METHOD:PUBLISH",
		"BEGIN:VEVENT",
		`UID:${`${utcStamp(e.start)}-${Math.random().toString(36).slice(2)}@ikanhealth.in`}`,
		`DTSTAMP:${utcStamp(/* @__PURE__ */ new Date())}`,
		`DTSTART:${local(e.start)}`,
		`DTEND:${local(end(e))}`,
		rrule(e),
		`SUMMARY:${escape(e.title)}`,
		`DESCRIPTION:${escape(body(e))}`,
		e.url ? `URL:${e.url}` : null,
		"BEGIN:VALARM",
		"ACTION:DISPLAY",
		`DESCRIPTION:${escape(e.title)}`,
		`TRIGGER:-PT${e.alertBefore ?? 0}M`,
		"END:VALARM",
		"END:VEVENT",
		"END:VCALENDAR"
	].filter((l) => Boolean(l)).map(fold).join("\r\n") + "\r\n";
}
/** Hands the .ics to the phone, which offers to add it to the default calendar app. */
function openIcs(e, filename) {
	const blob = new Blob([icsFile(e)], { type: "text/calendar;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${filename}.ics`;
	document.body.appendChild(a);
	a.click();
	a.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 1e4);
}
/** The next occurrence of hh:mm from now (today if still ahead, else tomorrow). */
function nextAt(time, from = /* @__PURE__ */ new Date()) {
	const [h, m] = time.split(":").map(Number);
	const d = new Date(from);
	d.setHours(h ?? 20, m ?? 30, 0, 0);
	if (d.getTime() <= from.getTime()) d.setDate(d.getDate() + 1);
	return d;
}
/**
* "Add to calendar" with a choice of Google Calendar or the phone's own calendar.
* When `time` is given the person can change it in the sheet before adding (daily reminders).
*/
function AddToCalendar({ event, time, filename, label = "Add to calendar", className, variant = "outlined" }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [at, setAt] = (0, import_react.useState)(time ?? "");
	const [added, setAdded] = (0, import_react.useState)(null);
	const validTime = !time || /^\d{2}:\d{2}$/.test(at);
	const final = time && validTime ? {
		...event,
		start: nextAt(at)
	} : event;
	const when = time ? `Every day at ${final.start.toLocaleTimeString("en-IN", {
		hour: "numeric",
		minute: "2-digit"
	})}${typeof event.daily === "number" ? ` for ${event.daily} days` : ""}` : final.start.toLocaleString("en-IN", {
		weekday: "short",
		day: "numeric",
		month: "short",
		hour: "numeric",
		minute: "2-digit"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [variant === "row" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: cn("flex min-h-14 w-full items-center gap-4 px-4 py-2 text-left", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "h-5 w-5 shrink-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex-1 text-[15px] font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: cn("inline-flex h-11 items-center justify-center gap-2 rounded-full border border-current/20 px-4 text-[14px] font-semibold", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "h-4 w-4" }),
			" ",
			label
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BottomSheet, {
		open,
		onClose: () => {
			setOpen(false);
			setAdded(null);
		},
		title: "Add to your calendar",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[20px] bg-secondary p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: event.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-[14px] text-muted-foreground",
						children: when
					}),
					time ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[14px]",
							children: "Time"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "time",
							required: true,
							value: at,
							onChange: (e) => setAt(e.target.value),
							"aria-invalid": !validTime,
							className: "h-10 rounded-[10px] bg-background px-3 text-[15px] font-semibold tabular-nums"
						})]
					}) : null,
					!validTime ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "mt-2 text-[13px] text-[#B3261E]",
						children: "Pick a time for the reminder."
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 overflow-hidden rounded-[20px] border border-foreground/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: validTime ? googleCalendarUrl(final) : void 0,
					target: "_blank",
					rel: "noopener noreferrer",
					"aria-disabled": !validTime,
					onClick: (e) => {
						if (!validTime) return e.preventDefault();
						setAdded("Finish saving it in Google Calendar.");
					},
					className: cn("flex min-h-16 items-center gap-3 border-b border-foreground/10 px-4 py-3", !validTime && "pointer-events-none opacity-50"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleCalendarMark, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[15px] font-semibold",
								children: "Google Calendar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[13px] text-muted-foreground",
								children: "Opens a ready-made event to save"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: !validTime,
					onClick: () => {
						openIcs(final, filename);
						setAdded("Open the file to add it to your calendar.");
					},
					className: "flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left disabled:opacity-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-[10px] bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[15px] font-semibold",
								children: "Phone calendar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[13px] text-muted-foreground",
								children: "Apple, Samsung, Outlook and others"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "mt-3 min-h-5 text-center text-[13px] text-muted-foreground",
				children: added ?? "Your calendar reminds you, even when iKAN is closed."
			})
		]
	})] });
}
function GoogleCalendarMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 36 36",
		className: "h-9 w-9",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "3",
				y: "3",
				width: "30",
				height: "30",
				rx: "6",
				fill: "#fff",
				stroke: "#DADCE0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "3",
				y: "3",
				width: "30",
				height: "8",
				rx: "3",
				fill: "#4285F4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "18",
				y: "27",
				textAnchor: "middle",
				fontSize: "13",
				fontWeight: "700",
				fill: "#1A73E8",
				children: "31"
			})
		]
	});
}
//#endregion
export { AddToCalendar as t };
