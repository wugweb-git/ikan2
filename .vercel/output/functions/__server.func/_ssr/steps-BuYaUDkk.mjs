import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { m as visibleBody, p as useProgramme } from "./programs-DrKO9d_v.mjs";
import { $t as ArrowLeft, Ft as Check, I as PencilLine, Kt as BookOpen, N as Plus, R as NotebookPen, Vt as CalendarCheck, X as ListChecks, jt as CircleCheckBig, p as Trash2 } from "../_libs/lucide-react.mjs";
import { a as Pager, c as SelectRow, d as TextField, h as useSnack, l as Snackbar, m as stateLayer, n as Button, o as Segmented, r as IconButton, t as BottomSheet } from "./m3-Blvbxy5D.mjs";
import { n as formatTime, r as nightMetrics, t as formatDuration } from "./metrics-Gs7QyLlC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/steps-BuYaUDkk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var nextLabel$1 = (ctx) => ctx.finishLabel ?? (ctx.isLast ? `Finish day ${ctx.day}` : "Next");
var display = (f, v) => {
	if (v === null || v === void 0 || v === "") return null;
	if (typeof v === "boolean") return v ? "Yes" : "No";
	if (f?.type === "time") return formatTime(v);
	if (f?.type === "date") return new Date(v).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
	if (f?.type === "datetime") return new Date(v).toLocaleString("en-IN", {
		day: "numeric",
		month: "short",
		hour: "numeric",
		minute: "2-digit"
	});
	return v;
};
function FieldInput({ field, value, onChange, hideLabel, error }) {
	if (field.type === "yesno" || field.type === "select") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [field.label && !hideLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-2 text-[14px] font-semibold",
		children: field.label
	}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
		label: field.label,
		options: field.options ?? [],
		value: typeof value === "string" ? value : void 0,
		onChange
	})] });
	const type = field.type === "time" ? "time" : field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : "text";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
		label: field.label,
		ariaLabel: field.label || "Write here",
		type,
		value: typeof value === "string" ? value : "",
		onChange,
		multiline: field.type === "longtext",
		maxLength: field.type === "longtext" ? 2e3 : field.type === "text" ? 200 : void 0,
		error
	});
}
/** Written fields must have words in them; a date must be a real one within a year either way. */
function entryErrors(fields, values) {
	const errors = {};
	for (const f of fields) {
		const raw = values[f.key];
		const v = typeof raw === "string" ? raw.trim() : "";
		if ((f.type === "text" || f.type === "longtext") && f.key === "text" && !v) errors[f.key] = "Write something here first.";
		if (f.type === "date" && v) {
			const d = /* @__PURE__ */ new Date(`${v}T00:00:00`);
			if (Number.isNaN(d.getTime()) || Math.abs(d.getTime() - Date.now()) > 316224e5) errors[f.key] = "Pick a date within a year of today.";
		}
	}
	return errors;
}
function EntryForm({ fields, onSubmit, submitLabel }) {
	const [values, setValues] = (0, import_react.useState)({});
	const [tried, setTried] = (0, import_react.useState)(false);
	const ready = fields.some((f) => String(values[f.key] ?? "").trim());
	const errors = entryErrors(fields, values);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-4",
		noValidate: true,
		onSubmit: (e) => {
			e.preventDefault();
			setTried(true);
			if (!ready || Object.keys(errors).length) return;
			onSubmit(values);
			setTried(false);
		},
		children: [fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldInput, {
			field: f,
			value: values[f.key],
			onChange: (v) => setValues((p) => ({
				...p,
				[f.key]: v
			})),
			error: tried ? errors[f.key] : void 0
		}, f.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "submit",
			disabled: !ready,
			className: "w-full",
			children: submitLabel
		})]
	});
}
/** Cards older than a retention window (Notion: "deleted after 24 hours") are removed. */
function useVisibleEntries(slug, collection, scope, day, retentionHours) {
	const { entries, removeEntry } = useProgramme(slug);
	const all = entries(collection);
	const now = Date.now();
	const expired = retentionHours ? all.filter((e) => now - Date.parse(e.createdAt) > retentionHours * 36e5) : [];
	(0, import_react.useEffect)(() => {
		expired.forEach((e) => removeEntry(collection, e.id));
	}, [expired.length]);
	return all.filter((e) => !expired.includes(e) && (scope === "all" || e.day === day));
}
function CardShell({ children, tone = "surface" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: cn("min-h-[260px] rounded-[16px] p-5", tone === "surface" ? "bg-secondary" : "bg-[var(--accent-container)] text-[var(--on-accent-container)]"),
		children
	});
}
function Values({ entry, fields }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
		className: "space-y-3",
		children: fields.map((f) => {
			const v = display(f, entry.values[f.key]);
			return v ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [f.label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-[12px] leading-4 opacity-70",
				children: f.label
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "mt-0.5 whitespace-pre-line text-[16px] leading-6",
				children: v
			})] }, f.key) : null;
		})
	});
}
function EmptyCards({ onAdd, canAdd }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center rounded-[16px] border border-dashed border-foreground/25 px-6 py-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[16px] font-medium",
				children: "No entries yet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[14px] text-muted-foreground",
				children: "Each entry gets its own card. Swipe between them."
			}),
			canAdd ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "tonal",
				className: "mt-4",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5" }),
				onClick: onAdd,
				children: "Add New Entry"
			}) : null
		]
	});
}
var countLabel = (n) => `${n} ${n === 1 ? "entry" : "entries"}`;
function EntriesStep({ step, view, ctx }) {
	const { addEntry, removeEntry, patchEntry } = useProgramme(ctx.slug);
	const list = useVisibleEntries(ctx.slug, view.collection, view.scope, ctx.day, view.retentionHours);
	const [sheet, setSheet] = (0, import_react.useState)(false);
	const [page, setPage] = (0, import_react.useState)(0);
	const full = view.limit !== void 0 && list.length >= view.limit;
	const hasExample = Boolean(view.example && Object.keys(view.example).length);
	const snack = useSnack();
	if (view.list) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListEntries, {
		step,
		view,
		ctx,
		list
	});
	const pages = [...hasExample ? [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardShell, {
		tone: "example",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-[13px] font-semibold",
			children: "Entry #1"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Values, {
			entry: { values: view.example },
			fields: view.fields
		})]
	}, "example")] : [], ...list.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[13px] font-semibold text-muted-foreground",
				children: ["Entry #", i + 1]
			}), e.day === ctx.day ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
				label: `Delete entry ${i + 1}`,
				className: "-mr-3 -mt-3",
				onClick: () => removeEntry(view.collection, e.id),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-5 w-5" })
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Values, {
			entry: e,
			fields: view.fields.filter((f) => !view.editable?.includes(f.key))
		}),
		view.fields.filter((f) => view.editable?.includes(f.key)).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldInput, {
				field: f,
				value: e.values[f.key],
				onChange: (v) => patchEntry(view.collection, e.id, { [f.key]: v })
			})
		}, f.key))
	] }, e.id))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockText, {
			block: step.block,
			headline: view.prompt,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotebookPen, {})
		}),
		list.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-[14px] text-muted-foreground",
			children: countLabel(list.length)
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: pages.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
				pages,
				index: Math.min(page, pages.length - 1),
				onIndex: setPage
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyCards, {
				canAdd: !full,
				onAdd: () => setSheet(true)
			})
		}),
		full || !pages.length ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 flex justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "tonal",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5" }),
				onClick: () => setSheet(true),
				children: "Add New Entry"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomSheet, {
			open: sheet,
			onClose: () => setSheet(false),
			title: step.block.title,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryForm, {
				fields: view.fields,
				submitLabel: "Add entry",
				onSubmit: (v) => {
					addEntry(view.collection, v, ctx.day);
					setSheet(false);
					setPage((hasExample ? 1 : 0) + list.length);
					snack.show("Entry added");
				}
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Snackbar, { message: snack.message }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
			onBack: ctx.onBack,
			onNext: ctx.onNext,
			label: nextLabel$1(ctx)
		})
	] });
}
/** Plain lists: "add 3 things with add more once 3 have been entered", "User lists things down. Limit to 10." */
function ListEntries({ step, view, ctx, list }) {
	const initial = view.list?.initial ?? 3;
	const max = view.list?.max ?? Infinity;
	const [extra, setExtra] = (0, import_react.useState)(0);
	const f = view.fields[0];
	const slots = Math.min(max, Math.max(initial, list.length) + extra);
	const filled = list.filter((e) => String(e.values[f.key] ?? "").trim()).length;
	const canAddMore = slots < max;
	const allFilled = filled >= slots;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockText, {
			block: step.block,
			headline: view.prompt,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-6 space-y-3",
			children: Array.from({ length: slots }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mt-4 w-5 shrink-0 text-right text-[15px] tabular-nums text-muted-foreground",
					children: [i + 1, "."]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListSlot, {
						label: `${view.prompt ?? step.block.title} ${i + 1}`,
						entry: list[i],
						fieldKey: f.key,
						collection: view.collection,
						ctx,
						onCreated: () => i >= Math.max(initial, list.length) && setExtra((x) => Math.max(0, x - 1))
					})
				})]
			}, `slot-${i}`))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex items-center justify-between",
			children: [canAddMore ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "text",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5" }),
				disabled: !allFilled,
				onClick: () => setExtra((x) => x + 1),
				children: "Add another"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), max !== Infinity && list.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[13px] tabular-nums text-muted-foreground",
				children: [
					list.length,
					" of ",
					max
				]
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
			onBack: ctx.onBack,
			onNext: ctx.onNext,
			label: nextLabel$1(ctx)
		})
	] });
}
function ListSlot({ label, entry, fieldKey, collection, ctx, onCreated }) {
	const { addEntry, patchEntry } = useProgramme(ctx.slug);
	const id = (0, import_react.useRef)(entry?.id);
	if (entry) id.current = entry.id;
	const [value, setValue] = (0, import_react.useState)(String(entry?.values[fieldKey] ?? ""));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
		label: "",
		ariaLabel: label,
		placeholder: "Write one thing",
		value,
		onChange: (v) => {
			setValue(v);
			if (id.current) patchEntry(collection, id.current, { [fieldKey]: v });
			else if (v.trim()) {
				id.current = addEntry(collection, { [fieldKey]: v }, ctx.day).id;
				onCreated();
			}
		}
	});
}
function ReviewStep({ step, view, ctx }) {
	const { state, addEntry, patchEntry } = useProgramme(ctx.slug);
	const list = useVisibleEntries(ctx.slug, view.collection, view.scope, ctx.day);
	const [sheet, setSheet] = (0, import_react.useState)(false);
	const [page, setPage] = (0, import_react.useState)(0);
	const snack = useSnack();
	const reviewKeys = new Set(view.fields.map((f) => f.key));
	const hydrated = Object.keys(state.answers).length > 0 || Object.keys(state.collections).length > 0;
	const seeded = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (seeded.current || !hydrated) return;
		seeded.current = true;
		const all = state.collections[view.collection] ?? [];
		if (view.seedFrom) {
			const raw = state.answers[view.seedFrom.choiceKey];
			const picks = (Array.isArray(raw) ? raw : []).filter((p) => !/^Other/i.test(p));
			const other = state.answers[`${view.seedFrom.choiceKey}#other`];
			if (typeof other === "string" && other.trim()) picks.push(other.trim());
			const have = new Set(all.map((e) => String(e.values[view.seedFrom.field] ?? "")));
			picks.filter((p) => !have.has(p)).forEach((p) => addEntry(view.collection, { [view.seedFrom.field]: p }, ctx.day));
		}
		if (view.seeds) {
			const have = new Set(all.map((e) => JSON.stringify(Object.values(e.values)[0])));
			view.seeds.filter((s) => !have.has(JSON.stringify(Object.values(s)[0]))).forEach((s) => addEntry(view.collection, s, ctx.day));
		}
	}, [hydrated]);
	const labels = (0, import_react.useMemo)(() => new Map((view.addFields ?? []).map((f) => [f.key, f])), [view.addFields]);
	const infoFields = (e) => Object.keys(e.values).filter((k) => !reviewKeys.has(k) && !k.startsWith("aligns")).map((k) => labels.get(k) ?? {
		key: k,
		label: "",
		type: "longtext"
	});
	const answered = list.filter((e) => view.fields.every((f) => String(e.values[f.key] ?? "").trim())).length;
	const pages = [...view.example ? [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardShell, {
		tone: "example",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-[13px] font-semibold",
			children: "Example Card"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "space-y-2",
			children: view.example.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "text-[16px] leading-6",
				children: [i > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					className: "mr-1 opacity-60",
					children: "→"
				}) : null, line]
			}, i))
		})]
	}, "example")] : [], ...list.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Values, {
		entry: e,
		fields: infoFields(e)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 space-y-4 border-t border-foreground/10 pt-4",
		children: view.fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldInput, {
			field: f,
			hideLabel: f.label === view.prompt,
			value: e.values[f.key],
			onChange: (v) => patchEntry(view.collection, e.id, { [f.key]: v })
		}, f.key))
	})] }, e.id))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockText, {
			block: step.block,
			headline: view.prompt || void 0,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotebookPen, {})
		}),
		list.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-[14px] text-muted-foreground",
			children: [
				answered,
				" of ",
				list.length,
				" done"
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: pages.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
				pages,
				index: Math.min(page, pages.length - 1),
				onIndex: setPage
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyCards, {
				canAdd: Boolean(view.addFields),
				onAdd: () => setSheet(true)
			})
		}),
		view.addFields && pages.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 flex justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "tonal",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5" }),
				onClick: () => setSheet(true),
				children: "Add New Entry"
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomSheet, {
			open: sheet,
			onClose: () => setSheet(false),
			title: step.block.title,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryForm, {
				fields: [...view.addFields ?? [], ...view.fields],
				submitLabel: "Add entry",
				onSubmit: (v) => {
					addEntry(view.collection, v, ctx.day);
					setSheet(false);
					setPage((view.example ? 1 : 0) + list.length);
					snack.show("Entry added");
				}
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Snackbar, { message: snack.message }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
			onBack: ctx.onBack,
			onNext: ctx.onNext,
			label: nextLabel$1(ctx)
		})
	] });
}
function TrackerStep({ step, view, ctx }) {
	const { state, entries, setTracked, addEntry } = useProgramme(ctx.slug);
	const habits = entries(view.collection);
	const today = state.tracker[String(ctx.day)] ?? {};
	const [sheet, setSheet] = (0, import_react.useState)(false);
	const days = Object.keys(state.tracker).map(Number).filter((d) => d < ctx.day).sort((a, b) => a - b).slice(-6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockText, {
			block: step.block,
			headline: view.prompt,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, {})
		}),
		view.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-[15px] text-muted-foreground",
			children: view.note
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "-mx-4 mt-4 divide-y divide-foreground/[0.08]",
			children: habits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[16px] font-medium leading-6",
						children: String(h.values[view.field] ?? "")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex shrink-0 gap-1",
						"aria-label": "Earlier days",
						children: days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							title: `Day ${d}`,
							className: cn("h-2 w-2 rounded-full", state.tracker[String(d)]?.[h.id] ? "bg-[var(--accent)]" : "bg-foreground/15")
						}, d))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
						label: String(h.values[view.field] ?? ""),
						options: ["✅Yes", "❌No"],
						value: today[h.id] === true ? "✅Yes" : today[h.id] === false ? "❌No" : void 0,
						onChange: (v) => setTracked(ctx.day, h.id, v === "✅Yes")
					})
				})]
			}, h.id))
		}),
		habits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-[15px] text-muted-foreground",
			children: "No habits yet. Add the habit you want to build."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 flex justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "tonal",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5" }),
				onClick: () => setSheet(true),
				children: "Add New Entry"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomSheet, {
			open: sheet,
			onClose: () => setSheet(false),
			title: step.block.title,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryForm, {
				fields: [{
					key: view.field,
					label: "Habit I want to inculcate",
					type: "text"
				}],
				submitLabel: "Add entry",
				onSubmit: (v) => {
					addEntry(view.collection, v, ctx.day);
					setSheet(false);
				}
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
			onBack: ctx.onBack,
			onNext: ctx.onNext,
			label: nextLabel$1(ctx)
		})
	] });
}
var answerKey = (b, day) => b.key ?? `${day}.${b.n}`;
function Footer({ onBack, onNext, label, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "fixed inset-x-0 bottom-0 z-30 flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex w-full max-w-app items-center gap-3 border-t border-foreground/[0.08] bg-background px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3",
			children: [onBack ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
				label: "Back",
				onClick: onBack,
				className: "h-14 w-14 bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: onNext,
				disabled,
				className: "h-14 flex-1 text-[16px]",
				children: label
			})]
		})
	});
}
var nextLabel = (ctx) => ctx.finishLabel ?? (ctx.isLast ? `Finish day ${ctx.day}` : "Next");
/** Block title (Notion) and its body text. With no prompt, the title is the headline. */
function BlockText({ block, headline, skip, icon }) {
	const body = visibleBody(block).filter((i) => i.text !== skip);
	const ordered = body.every((i) => i.kind === "ol");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex gap-3", headline ? "items-center" : "flex-col items-start"),
			children: [icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)] [&_svg]:h-5 [&_svg]:w-5",
				children: icon
			}) : null, headline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[14px] font-semibold leading-5 text-[var(--accent-strong)]",
				children: block.title
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-[26px] font-semibold leading-8 tracking-[-0.01em] text-balance",
				children: block.title
			})]
		}),
		body.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 space-y-4 text-[17px] leading-[1.6] text-foreground/90",
			children: body.map((item, i) => item.kind === "p" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "whitespace-pre-line",
				children: item.text
			}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex gap-3 pl-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-5 shrink-0 text-muted-foreground",
					children: item.kind === "ol" || ordered ? `${body.slice(0, i + 1).filter((x) => x.kind !== "p").length}.` : "•"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.text })]
			}, i))
		}) : null,
		headline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-4 font-display text-[26px] font-semibold leading-8 tracking-[-0.01em] text-balance",
			children: headline
		}) : null
	] });
}
function LessonStep({ step, view, ctx }) {
	const bullets = Boolean(step.block.body[0]?.text.includes(" • "));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		bullets ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-[26px] font-semibold leading-8",
				children: step.block.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-foreground/[0.08] rounded-[16px] bg-secondary",
				children: step.block.body[0].text.split(" • ").map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-4 py-3.5 text-[16px]",
					children: item
				}, item))
			}),
			step.block.body.slice(1).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-[16px]",
				children: p.text
			}, p.text))
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockText, {
			block: step.block,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {})
		}),
		view.cards ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "no-scrollbar -mx-4 mt-6 flex snap-x items-start gap-3 overflow-x-auto px-4",
			children: view.cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cn(view.cards.length > 1 ? "w-[85%]" : "w-full", "shrink-0 snap-start rounded-[16px] bg-[var(--accent-container)] p-5 text-[var(--on-accent-container)]"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-[17px] font-semibold",
						children: c.title
					}),
					c.text?.filter(Boolean).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[15px] leading-6",
						children: t
					}, t)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2 text-[15px] leading-6",
						children: c.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								children: "•"
							}), i]
						}, i))
					}),
					c.footer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[15px] leading-6",
						children: c.footer
					}) : null
				]
			}, c.title))
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
			onBack: ctx.onBack,
			onNext: ctx.onNext,
			label: nextLabel(ctx)
		})
	] });
}
function ChoiceStep({ step, view, ctx }) {
	const { state, setAnswer } = useProgramme(ctx.slug);
	const key = answerKey(step.block, ctx.day);
	const raw = state.answers[key];
	const picked = Array.isArray(raw) ? raw : typeof raw === "string" ? [raw] : [];
	const otherKey = `${key}#other`;
	const otherText = typeof state.answers[otherKey] === "string" ? state.answers[otherKey] : "";
	const toggle = (label) => {
		if (!view.multi) return setAnswer(key, label);
		setAnswer(key, picked.includes(label) ? picked.filter((p) => p !== label) : [...picked, label]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockText, {
			block: step.block,
			headline: view.prompt === step.block.title ? void 0 : view.prompt,
			skip: view.prompt,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, {})
		}),
		view.table ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, { rows: view.table }) : null,
		view.cards ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: view.multi ? "group" : "radiogroup",
			"aria-label": view.prompt,
			className: "mt-6 grid grid-cols-2 gap-3",
			children: view.options.map((o) => {
				const on = picked.includes(o.label);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					role: view.multi ? "checkbox" : "radio",
					"aria-checked": on,
					onClick: () => toggle(o.label),
					className: cn("flex min-h-[88px] flex-col justify-between rounded-[16px] border p-4 text-left text-[16px] font-medium transition-colors", stateLayer, on ? "border-transparent bg-[var(--accent-container)] text-[var(--on-accent-container)]" : "border-foreground/15"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("grid h-6 w-6 place-items-center rounded-full", on ? "bg-foreground text-background" : "border-2 border-foreground/40"),
						children: on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: "h-4 w-4",
							strokeWidth: 3
						}) : null
					}), o.label]
				}, o.label);
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: view.multi ? "group" : "radiogroup",
			"aria-label": view.prompt,
			className: "-mx-4 mt-5",
			children: view.options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectRow, {
				multi: view.multi,
				selected: picked.includes(o.label),
				glyph: o.glyph,
				onClick: () => toggle(o.label),
				children: o.label
			}, o.label))
		}),
		view.otherOption && picked.includes(view.otherOption) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: view.otherOption,
				value: otherText,
				onChange: (v) => setAnswer(otherKey, v),
				autoFocus: true,
				maxLength: 200
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
			onBack: ctx.onBack,
			onNext: ctx.onNext,
			label: nextLabel(ctx),
			disabled: picked.length === 0
		})
	] });
}
function DataTable({ rows }) {
	const [head, ...body] = rows;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-5 overflow-hidden rounded-[12px] border border-foreground/15",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-left text-[15px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: head?.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					scope: "col",
					className: "px-4 py-3 font-semibold",
					children: h
				}, h)) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: body.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-t border-foreground/10",
				children: r.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-4 py-3 align-top",
					children: c
				}, i))
			}, r.join())) })]
		})
	});
}
function ScaleStep({ step, view, ctx }) {
	const { state, setAnswer } = useProgramme(ctx.slug);
	const key = answerKey(step.block, ctx.day);
	const value = typeof state.answers[key] === "number" ? state.answers[key] : void 0;
	const ticks = Array.from({ length: view.max - view.min + 1 }, (_, i) => view.min + i);
	const pct = value === void 0 ? 0 : (value - view.min) / (view.max - view.min) * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockText, {
			block: step.block,
			headline: view.prompt
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-10 text-center font-display text-[57px] font-semibold leading-none tabular-nums",
			children: value ?? "–"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mt-10 px-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-y-0 left-0 right-0 my-auto h-4 rounded-full bg-[var(--accent-container)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-y-0 left-0 my-auto h-4 rounded-full bg-[var(--accent)]",
						style: { width: `${pct}%` }
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: view.min,
					max: view.max,
					step: 1,
					value: value ?? view.min,
					"aria-label": view.prompt,
					onChange: (e) => setAnswer(key, Number(e.target.value)),
					onClick: (e) => setAnswer(key, Number(e.target.value)),
					className: "m3-slider absolute inset-x-2 top-[-12px] h-10 w-[calc(100%-1rem)] cursor-pointer appearance-none bg-transparent"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex justify-between text-[13px] tabular-nums text-muted-foreground",
					children: ticks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("w-6 text-center", value === t && "font-semibold text-foreground"),
						children: t
					}, t))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
			onBack: ctx.onBack,
			onNext: ctx.onNext,
			label: nextLabel(ctx),
			disabled: value === void 0
		})
	] });
}
function TextStep({ step, view, ctx }) {
	const { state, setAnswer } = useProgramme(ctx.slug);
	const key = answerKey(step.block, ctx.day);
	const value = typeof state.answers[key] === "string" ? state.answers[key] : "";
	const dep = view.dependsOn ? state.answers[view.dependsOn.key] : void 0;
	const hidden = view.dependsOn && dep !== view.dependsOn.equals;
	(0, import_react.useEffect)(() => {
		if (hidden) ctx.onNext();
	}, [hidden]);
	if (hidden) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockText, {
			block: step.block,
			headline: view.prompt || void 0,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PencilLine, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "",
				ariaLabel: view.prompt || step.block.title,
				placeholder: "Write here",
				value,
				onChange: (v) => setAnswer(key, v),
				multiline: true,
				maxLength: 2e3
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
			onBack: ctx.onBack,
			onNext: ctx.onNext,
			label: nextLabel(ctx)
		})
	] });
}
function ConcludeStep({ step, view, ctx }) {
	const { state, setAnswer } = useProgramme(ctx.slug);
	const key = `${answerKey(step.block, ctx.day)}@${ctx.day}`;
	const value = typeof state.answers[key] === "string" ? state.answers[key] : "";
	const [full, setFull] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(() => setFull(true), 100);
		return () => window.clearTimeout(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center pt-4 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "relative grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-[var(--accent)]",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute inset-0 rounded-full bg-background transition-transform duration-[1400ms] ease-[cubic-bezier(.05,.7,.1,1)] motion-reduce:transition-none",
						style: { transform: full ? "translateX(105%)" : "translateX(30%)" }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
						className: "relative h-10 w-10 text-background transition-opacity delay-500 duration-500",
						style: { opacity: full ? 1 : 0 },
						strokeWidth: 2.5
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-[14px] font-semibold text-[var(--accent-strong)]",
					children: step.block.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 space-y-2",
					children: visibleBody(step.block).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-[22px] font-semibold leading-8 text-balance",
						children: b.text
					}, b.text))
				})
			]
		}),
		view.prompt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-[16px] font-semibold",
				children: view.prompt
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "",
				ariaLabel: view.prompt,
				value,
				onChange: (v) => setAnswer(key, v),
				multiline: true,
				maxLength: 2e3
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
			onBack: ctx.onBack,
			onNext: ctx.onNext,
			label: nextLabel(ctx)
		})
	] });
}
/** Notion comparison-matrix blocks, "showing 2 at a time on 1 card". */
function SortStep({ step, view, ctx }) {
	const { state, setAnswer } = useProgramme(ctx.slug);
	const pages = [];
	for (let i = 0; i < view.items.length; i += view.perCard) pages.push(view.items.slice(i, i + view.perCard));
	const [page, setPage] = (0, import_react.useState)(0);
	const keyOf = (situation, line) => `${answerKey(step.block, ctx.day)}:${situation}:${line}`;
	const pageDone = (p) => p.every((it) => it.lines.every((l) => typeof state.answers[keyOf(it.situation, l)] === "string"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[14px] font-semibold text-[var(--accent-strong)]",
			children: step.block.title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
				index: page,
				onIndex: setPage,
				pages: pages.map((p, pi) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: p.map((it, ii) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-[16px] bg-secondary p-4",
						children: [it.situation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-[18px] font-semibold leading-6",
							children: it.situation
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 space-y-4",
							children: it.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[15px] leading-6",
								children: line
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
									label: line,
									options: it.labels,
									value: state.answers[keyOf(it.situation, line)],
									onChange: (v) => setAnswer(keyOf(it.situation, line), v)
								})
							})] }, line))
						})]
					}, ii))
				}, pi))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
			onBack: page > 0 ? () => setPage(page - 1) : ctx.onBack,
			onNext: () => page + 1 < pages.length ? setPage(page + 1) : ctx.onNext(),
			label: page + 1 < pages.length ? "Next card" : nextLabel(ctx),
			disabled: !pageDone(pages[page] ?? [])
		})
	] });
}
function StatementsStep({ step, view, ctx }) {
	const { state, setAnswer } = useProgramme(ctx.slug);
	const [page, setPage] = (0, import_react.useState)(0);
	const keyOf = (s) => `${answerKey(step.block, ctx.day)}:${s}`;
	const current = view.statements[page];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockText, {
			block: step.block,
			headline: view.prompt
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
				index: page,
				onIndex: setPage,
				pages: view.statements.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex min-h-48 flex-col justify-between rounded-[16px] bg-[var(--accent-container)] p-5 text-[var(--on-accent-container)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-[20px] font-semibold leading-7",
						children: s
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
							label: s,
							options: view.options,
							value: state.answers[keyOf(s)],
							onChange: (v) => setAnswer(keyOf(s), v)
						})
					})]
				}, s))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
			onBack: page > 0 ? () => setPage(page - 1) : ctx.onBack,
			onNext: () => page + 1 < view.statements.length ? setPage(page + 1) : ctx.onNext(),
			label: page + 1 < view.statements.length ? "Next" : nextLabel(ctx),
			disabled: !current || typeof state.answers[keyOf(current)] !== "string"
		})
	] });
}
/** Order and input type for the Notion Day 1 diary rows. */
var diaryKinds = [
	{
		key: "bed",
		kind: "time"
	},
	{
		key: "tried",
		kind: "time"
	},
	{
		key: "latency",
		kind: "minutes"
	},
	{
		key: "wakings",
		kind: "count"
	},
	{
		key: "awake",
		kind: "minutes"
	},
	{
		key: "woke",
		kind: "time"
	},
	{
		key: "up",
		kind: "time"
	},
	{
		key: "quality",
		kind: "rating"
	}
];
function DiaryStep({ ctx, rows }) {
	const { state, saveDiary } = useProgramme(ctx.slug);
	const saved = state.diary[String(ctx.day)];
	const previous = Object.entries(state.diary).filter(([d]) => Number(d) < ctx.day).sort((a, b) => Number(b[0]) - Number(a[0]))[0]?.[1];
	const [entry, setEntry] = (0, import_react.useState)(() => saved ?? {});
	const [q, setQ] = (0, import_react.useState)(0);
	const questions = diaryKinds.map((k, i) => ({
		...k,
		label: (rows[i] ?? "").replace(/:\s*\[.*$/, "").trim()
	}));
	const question = questions[q];
	const set = (patch) => {
		const next = {
			...entry,
			...patch
		};
		setEntry(next);
		saveDiary(ctx.day, next);
	};
	if (!question) {
		const m = nightMetrics(entry);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[14px] font-semibold text-[var(--accent-strong)]",
				children: "Sleep Diary"
			}),
			m ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-[16px] bg-[var(--accent-container)] p-5 text-[var(--on-accent-container)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px]",
						children: "Asleep"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-[32px] font-semibold leading-10 tabular-nums",
						children: formatDuration(m.asleep)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px]",
						children: "In bed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-[32px] font-semibold leading-10 tabular-nums",
						children: formatDuration(m.inBed)
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-[14px]",
					children: ["Sleep efficiency ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold tabular-nums",
						children: [m.efficiency, "%"]
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "-mx-4 mt-4",
				children: questions.map((qq, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setQ(i),
					className: "flex min-h-14 w-full items-center justify-between gap-4 px-4 py-2 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[15px] text-muted-foreground",
						children: qq.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-[15px] font-semibold tabular-nums",
						children: answerText(qq, entry)
					})]
				}) }, qq.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
				onBack: () => setQ(questions.length - 1),
				onNext: ctx.onNext,
				label: ctx.isLast ? `Finish day ${ctx.day}` : "Save diary"
			})
		] });
	}
	const answered = question.kind === "time" ? Boolean(entry[question.key]) : question.kind === "rating" ? entry.quality !== void 0 : true;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[14px] font-semibold text-[var(--accent-strong)]",
				children: "Sleep Diary"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[13px] tabular-nums text-muted-foreground",
				children: [
					q + 1,
					" of ",
					questions.length
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "animate-fade mt-2 font-display text-[28px] font-semibold leading-9 text-balance",
			children: question.label
		}, question.key),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8",
			children: [
				question.kind === "time" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block rounded-[16px] bg-secondary px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[12px] text-muted-foreground",
						children: "Time"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "time",
						"aria-label": question.label,
						value: entry[question.key] ?? "",
						onChange: (e) => set({ [question.key]: e.target.value }),
						className: "block w-full bg-transparent font-display text-[40px] font-semibold tabular-nums outline-none"
					})]
				}), !entry[question.key] && previous?.[question.key] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "tonal",
						onClick: () => set({ [question.key]: previous[question.key] }),
						children: ["Same as last time, ", formatTime(previous[question.key])]
					})
				}) : null] }) : null,
				question.kind === "minutes" || question.kind === "count" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Counter, {
					unit: question.kind === "minutes" ? "minutes" : "times",
					step: question.kind === "minutes" ? 5 : 1,
					max: question.kind === "minutes" ? 720 : 30,
					value: entry[question.key],
					onChange: (v) => set({ [question.key]: v })
				}) : null,
				question.kind === "rating" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
					label: question.label,
					options: [
						"1",
						"2",
						"3",
						"4",
						"5"
					],
					value: entry.quality?.toString(),
					onChange: (v) => set({ quality: Number(v) })
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
			onBack: q === 0 ? ctx.onBack : () => setQ(q - 1),
			onNext: () => {
				if ((question.kind === "minutes" || question.kind === "count") && entry[question.key] === void 0) set({ [question.key]: 0 });
				setQ(q + 1);
			},
			label: "Next",
			disabled: !answered
		})
	] });
}
function Counter({ value, onChange, unit, step, max }) {
	const v = value ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between rounded-[16px] bg-secondary p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "tonal",
				className: "h-14 w-14 px-0 text-2xl",
				onClick: () => onChange(Math.max(0, v - step)),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-label": `Fewer ${unit}`,
					children: "−"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-center",
				"aria-live": "polite",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-[40px] font-semibold tabular-nums",
					children: v
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-2 text-[15px] text-muted-foreground",
					children: unit
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "tonal",
				className: "h-14 w-14 px-0 text-2xl",
				onClick: () => onChange(Math.min(max, v + step)),
				disabled: v >= max,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-label": `More ${unit}`,
					children: "+"
				})
			})
		]
	});
}
function answerText(q, e) {
	const v = e[q.key];
	if (v === void 0) return "–";
	if (q.kind === "time") return formatTime(v);
	if (q.kind === "minutes") return `${v} min`;
	return String(v);
}
function StepView({ step, ctx, diaryRows }) {
	const v = step.view;
	switch (v.ui) {
		case "lesson": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LessonStep, {
			step,
			view: v,
			ctx
		});
		case "choice": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceStep, {
			step,
			view: v,
			ctx
		});
		case "scale": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScaleStep, {
			step,
			view: v,
			ctx
		});
		case "text": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextStep, {
			step,
			view: v,
			ctx
		});
		case "diary": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiaryStep, {
			ctx,
			rows: diaryRows
		});
		case "sort": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortStep, {
			step,
			view: v,
			ctx
		});
		case "statements": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatementsStep, {
			step,
			view: v,
			ctx
		});
		case "entries": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntriesStep, {
			step,
			view: v,
			ctx
		});
		case "review": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewStep, {
			step,
			view: v,
			ctx
		});
		case "tracker": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackerStep, {
			step,
			view: v,
			ctx
		});
		case "conclude": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConcludeStep, {
			step,
			view: v,
			ctx
		});
	}
}
//#endregion
export { StepView as t };
