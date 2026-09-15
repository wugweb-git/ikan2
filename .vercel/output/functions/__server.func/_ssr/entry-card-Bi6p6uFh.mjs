import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as energyScale, l as stressScale, r as contextTags, s as moodScale } from "./journal-Cd2_QpOm.mjs";
import { p as Trash2 } from "../_libs/lucide-react.mjs";
import { r as IconButton } from "./m3-Blvbxy5D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/entry-card-Bi6p6uFh.js
var import_jsx_runtime = require_jsx_runtime();
/** One journal check-in: mood, energy, stress, note and tags. */
function EntryCard({ entry: e, onDelete, showDate }) {
	const mood = moodScale[e.mood - 1];
	const energy = e.energy ? energyScale[e.energy - 1] : void 0;
	const stress = e.stress ? stressScale[e.stress - 1] : void 0;
	const when = new Date(e.createdAt);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-[20px] border border-foreground/10 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[32px] leading-none",
						"aria-hidden": "true",
						children: mood.emoji
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-[16px] font-semibold",
							children: [
								mood.label,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-sans text-[13px] font-normal text-muted-foreground",
									children: [e.mood, "/5"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[13px] text-muted-foreground",
							children: [showDate ? `${when.toLocaleDateString("en-IN", {
								weekday: "short",
								day: "numeric",
								month: "short"
							})}, ` : "", when.toLocaleTimeString("en-IN", {
								hour: "numeric",
								minute: "2-digit"
							})]
						})]
					}),
					onDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: "Delete entry",
						onClick: onDelete,
						className: "text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-5 w-5" })
					}) : null
				]
			}),
			energy || stress ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [energy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { children: `${energy.emoji} Energy: ${energy.label}` }) : null, stress ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { children: `${stress.emoji} Stress: ${stress.label}` }) : null]
			}) : null,
			e.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-[15px] leading-6",
				children: [
					"“",
					e.note,
					"”"
				]
			}) : null,
			e.tags.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: e.tags.map((id) => {
					const t = contextTags.find((x) => x.id === id);
					return t ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { children: `${t.emoji} ${t.label}` }, id) : null;
				})
			}) : null
		]
	});
}
function Chip({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex h-7 items-center rounded-[8px] bg-secondary px-2.5 text-[13px]",
		children
	});
}
//#endregion
export { EntryCard as t };
