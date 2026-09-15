import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as useBackToClose } from "./use-back-close-DdJ3iPJc.mjs";
import { _ as require_react_dom } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ft as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/m3-Blvbxy5D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = require_react_dom();
/** Tonal accent per programme, used only for progress and selection.
* `--accent-strong` is the text-safe shade (4.5:1+ on white) for small labels. */
var accentStyle = (accent) => ({
	night: {
		"--accent": "#5E86B8",
		"--accent-strong": "#2F5580",
		"--accent-container": "#E3ECF8",
		"--on-accent-container": "#1C3553"
	},
	ember: {
		"--accent": "#B98A22",
		"--accent-strong": "#7A5A12",
		"--accent-container": "#FBEFD2",
		"--on-accent-container": "#4F3A0A"
	},
	calm: {
		"--accent": "#4E8F75",
		"--accent-strong": "#2B634D",
		"--accent-container": "#DFF0E8",
		"--on-accent-container": "#173D2F"
	},
	mind: {
		"--accent": "#5D64B4",
		"--accent-strong": "#3B418C",
		"--accent-container": "#E6E7F6",
		"--on-accent-container": "#232761"
	},
	mood: {
		"--accent": "#C2607C",
		"--accent-strong": "#8C3652",
		"--accent-container": "#F9E2E9",
		"--on-accent-container": "#5A1F32"
	}
})[accent];
/** State layer: the pressed/hovered tint M3 puts on interactive surfaces. */
var stateLayer = "relative isolate overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:bg-current after:opacity-0 after:transition-opacity hover:after:opacity-[0.06] active:after:opacity-[0.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";
function IconButton({ label, onClick, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		onClick,
		className: cn("grid h-12 w-12 shrink-0 place-items-center rounded-full", stateLayer, className),
		children
	});
}
function TopAppBar({ leading, title, subtitle, trailing, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cn("sticky top-0 z-30 flex h-16 items-center gap-1 bg-background px-1 print:hidden", className),
		children: [
			leading,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1 px-2",
				children: [title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate font-display text-[20px] font-semibold leading-7",
					children: title
				}) : null, subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-[13px] leading-4 text-muted-foreground",
					children: subtitle
				}) : null]
			}),
			trailing
		]
	});
}
function LinearProgress({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "progressbar",
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		"aria-valuenow": Math.round(value),
		className: "flex h-1 w-full gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full bg-[var(--accent)] transition-[width] duration-500",
			style: { width: `${value}%` }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full flex-1 rounded-full bg-[var(--accent-container)]" })]
	});
}
function Button({ variant = "filled", children, onClick, disabled, type = "button", className, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type,
		onClick,
		disabled,
		className: cn("inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold tracking-[0.01em] transition-colors disabled:pointer-events-none disabled:opacity-40", stateLayer, variant === "filled" && "bg-foreground text-background", variant === "tonal" && "bg-[var(--accent-container)] text-[var(--on-accent-container)]", variant === "outlined" && "border border-foreground/25 text-foreground", variant === "text" && "px-3 text-foreground", className),
		children: [icon, children]
	});
}
/** Radio (single) or checkbox (multi) list row. */
function SelectRow({ selected, multi, onClick, glyph, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		role: multi ? "checkbox" : "radio",
		"aria-checked": selected,
		onClick,
		className: cn("flex min-h-14 w-full items-center gap-4 px-4 py-3 text-left transition-colors", stateLayer, selected && "bg-[var(--accent-container)] text-[var(--on-accent-container)]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: cn("grid h-5 w-5 shrink-0 place-items-center border-2 transition-colors", multi ? "rounded-[3px]" : "rounded-full", selected ? "border-[var(--accent-strong)]" : "border-foreground/55", selected && multi && "bg-[var(--accent-strong)] text-background"),
				children: selected ? multi ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "h-3.5 w-3.5",
					strokeWidth: 3.5
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-[var(--accent-strong)]" }) : null
			}),
			glyph ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[22px] leading-none",
				"aria-hidden": "true",
				children: glyph
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex-1 text-[16px] leading-6",
				children: typeof children === "string" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { text: children }) : children
			})
		]
	});
}
/** Notion writes options like "✅Yes"; give the emoji its own box so it can't overlap the word. */
function Label({ text }) {
	const m = text.match(/^(\p{Extended_Pictographic}\uFE0F?)\s*(.*)$/u);
	if (!m) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: text });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			className: "mr-1.5 inline-block",
			children: m[1]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: text
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			children: m[2]
		})
	] });
}
/** M3 segmented button, e.g. ✅Yes / ❌No. */
function Segmented({ options, value, onChange, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "radiogroup",
		"aria-label": label,
		className: "flex h-12 w-full overflow-hidden rounded-full border border-foreground/25",
		children: options.map((o, i) => {
			const on = value === o;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				role: "radio",
				"aria-checked": on,
				onClick: () => onChange(o),
				className: cn("flex flex-1 items-center justify-center gap-1.5 px-3 text-[14px] font-semibold transition-colors", stateLayer, i > 0 && "border-l border-foreground/25", on && "bg-[var(--accent-container)] text-[var(--on-accent-container)]"),
				children: [on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "h-4 w-4",
					strokeWidth: 3
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { text: o })]
			}, o);
		})
	});
}
/** M3 filled text field. The label sits above the value so long Notion labels can wrap. */
function TextField({ label, value, onChange, type = "text", multiline, autoFocus, ariaLabel, placeholder, error, hint, maxLength, inputMode, autoComplete, max, min, onBlur }) {
	const common = {
		value,
		autoFocus,
		placeholder,
		maxLength,
		inputMode,
		autoComplete,
		onBlur,
		"aria-label": label || ariaLabel,
		"aria-invalid": Boolean(error),
		onChange: (e) => onChange(e.target.value),
		className: cn("w-full bg-transparent px-4 text-[16px] leading-6 outline-none placeholder:text-muted-foreground/70", label ? "pb-2.5 pt-0.5" : "py-4", multiline && "min-h-24 resize-none")
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("block rounded-t-[4px] border-b bg-secondary transition-colors focus-within:border-b-2", error ? "border-[#B3261E]" : "border-foreground/50 focus-within:border-foreground"),
		children: [label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block px-4 pt-2 text-[12px] leading-4 text-muted-foreground",
			children: label
		}) : null, multiline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			...common,
			rows: 3
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			...common,
			type,
			max,
			min
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldMessage, {
		error,
		hint,
		count: multiline && maxLength ? [value.length, maxLength] : void 0
	})] });
}
function FieldMessage({ error, hint, count }) {
	if (!error && !hint && !count) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "mt-1 flex gap-3 px-4 text-[12px] leading-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			role: error ? "alert" : void 0,
			className: cn("flex-1", error ? "text-[#B3261E]" : "text-muted-foreground"),
			children: error ?? hint
		}), count ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "tabular-nums text-muted-foreground",
			children: [
				count[0],
				"/",
				count[1]
			]
		}) : null]
	});
}
/** A native select styled like TextField. */
function SelectField({ label, value, onChange, options, placeholder = "Choose", error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("relative block rounded-t-[4px] border-b bg-secondary transition-colors focus-within:border-b-2", error ? "border-[#B3261E]" : "border-foreground/50 focus-within:border-foreground"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block px-4 pt-2 text-[12px] leading-4 text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value,
				onChange: (e) => onChange(e.target.value),
				"aria-invalid": Boolean(error),
				className: cn("w-full appearance-none bg-transparent px-4 pb-2.5 pt-0.5 pr-10 text-[16px] leading-6 outline-none", !value && "text-muted-foreground/70"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: placeholder
				}), options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: o,
					children: o
				}, o))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				"aria-hidden": "true",
				viewBox: "0 0 24 24",
				className: "pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "m6 9 6 6 6-6",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round"
				})
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldMessage, { error })] });
}
function BottomSheet({ open, onClose, title, children }) {
	useBackToClose(open, onClose);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", onKey);
		const overflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = overflow;
		};
	}, [open, onClose]);
	if (!open || typeof document === "undefined") return null;
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[90] flex items-end justify-center",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": title,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close",
			onClick: onClose,
			className: "absolute inset-0 bg-foreground/40 animate-fade"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "animate-sheet relative max-h-[88dvh] w-full max-w-app overflow-y-auto rounded-t-[28px] bg-background px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-1 w-8 rounded-full bg-foreground/30" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 font-display text-[22px] font-semibold",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5",
					children
				})
			]
		})]
	}), document.body);
}
/** A snackbar that shows for a few seconds each time a new message id arrives. */
function Snackbar({ message }) {
	const [shown, setShown] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!message) return;
		setShown(message);
		const t = window.setTimeout(() => setShown(null), 2800);
		return () => window.clearTimeout(t);
	}, [message?.id]);
	if (!shown) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "status",
		"aria-live": "polite",
		className: "animate-fade pointer-events-none fixed inset-x-0 bottom-[96px] z-50 flex justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "w-full max-w-sm rounded-[8px] bg-foreground px-4 py-3.5 text-[14px] text-background shadow-lg",
			children: shown.text
		})
	});
}
var useSnack = () => {
	const [message, setMessage] = (0, import_react.useState)(null);
	return {
		message,
		show: (text) => setMessage({
			text,
			id: Date.now()
		})
	};
};
/** Horizontal pager, one card per page, with page dots. */
function Pager({ pages, index, onIndex }) {
	const ref = (0, import_react.useRef)(null);
	const programmatic = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const target = index * el.clientWidth;
		if (Math.abs(el.scrollLeft - target) > 4) {
			programmatic.current = true;
			el.scrollTo({
				left: target,
				behavior: "smooth"
			});
			window.setTimeout(() => programmatic.current = false, 450);
		}
	}, [index, pages.length]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		onScroll: (e) => {
			if (programmatic.current) return;
			const el = e.currentTarget;
			const i = Math.round(el.scrollLeft / el.clientWidth);
			if (i !== index) onIndex(i);
		},
		className: "no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto",
		children: pages.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full shrink-0 snap-center px-4",
			"aria-hidden": i !== index,
			children: p
		}, i))
	}), pages.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 flex justify-center gap-2",
		role: "tablist",
		"aria-label": "Cards",
		children: pages.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			role: "tab",
			"aria-selected": i === index,
			"aria-label": `Card ${i + 1} of ${pages.length}`,
			onClick: () => onIndex(i),
			className: cn("h-2 rounded-full transition-all", i === index ? "w-6 bg-foreground" : "w-2 bg-foreground/25")
		}, i))
	}) : null] });
}
/** M3 switch: 52×32 track, thumb grows when on. */
function Switch({ checked, onChange, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "switch",
		"aria-checked": checked,
		"aria-label": label,
		onClick: () => onChange(!checked),
		className: cn("relative h-8 w-[52px] shrink-0 rounded-full border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground", checked ? "border-transparent bg-[var(--accent-strong,#1f2937)]" : "border-foreground/40 bg-secondary"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("absolute top-1/2 grid -translate-y-1/2 place-items-center rounded-full transition-all", checked ? "left-[22px] h-6 w-6 bg-background text-[var(--accent-strong,#1f2937)]" : "left-1.5 h-4 w-4 bg-foreground/55"),
			children: checked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
				className: "h-3.5 w-3.5",
				strokeWidth: 3
			}) : null
		})
	});
}
//#endregion
export { Pager as a, SelectRow as c, TextField as d, TopAppBar as f, useSnack as h, LinearProgress as i, Snackbar as l, stateLayer as m, Button as n, Segmented as o, accentStyle as p, IconButton as r, SelectField as s, BottomSheet as t, Switch as u };
