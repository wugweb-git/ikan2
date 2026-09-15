import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as Illustration } from "./art-CKGIg2zx.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft, E as Settings, Kt as BookOpen, Ot as ClipboardList, Vt as CalendarCheck, Yt as BellOff, _ as Sparkles, a as Watch, st as HeartPulse, v as Smile } from "../_libs/lucide-react.mjs";
import { b as useHydrated, t as IkanShell, x as useNotifications } from "./ikan-shell-BVeIbGxw.mjs";
import { f as TopAppBar, m as stateLayer, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-B6kyY6qL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var noticeIcon = {
	assessment: {
		icon: ClipboardList,
		color: "#3B418C",
		soft: "#E6E7F6"
	},
	mood: {
		icon: Smile,
		color: "#8C3652",
		soft: "#F9E2E9"
	},
	health: {
		icon: Watch,
		color: "#7A5A12",
		soft: "#FBEFD2"
	},
	consult: {
		icon: CalendarCheck,
		color: "#2F5580",
		soft: "#E3ECF8"
	},
	score: {
		icon: HeartPulse,
		color: "#2B634D",
		soft: "#DFF0E8"
	},
	program: {
		icon: Sparkles,
		color: "#2B634D",
		soft: "#DFF0E8"
	}
};
var eventIcon = {
	assessment: ClipboardList,
	mood: Smile,
	program: Sparkles,
	consult: CalendarCheck,
	resource: BookOpen
};
var ago = (iso) => {
	const mins = Math.round((Date.now() - new Date(iso).getTime()) / 6e4);
	if (mins < 1) return "Now";
	if (mins < 60) return `${mins} min`;
	const h = Math.round(mins / 60);
	if (h < 24) return `${h} h`;
	const d = Math.round(h / 24);
	return d < 7 ? `${d} d` : new Date(iso).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short"
	});
};
function NotificationsPage() {
	const hydrated = useHydrated();
	const navigate = useNavigate();
	const n = useNotifications();
	const [tab, setTab] = (0, import_react.useState)("all");
	const [freshIds, setFreshIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		setFreshIds(n.unreadIds);
		const t = window.setTimeout(n.markAllRead, 600);
		return () => window.clearTimeout(t);
	}, [hydrated]);
	const needs = hydrated ? n.needs : [];
	const changed = hydrated ? n.changed : [];
	const happened = hydrated ? n.happened : [];
	const empty = needs.length + changed.length + happened.length === 0;
	const tabs = [
		{
			id: "all",
			label: "All"
		},
		{
			id: "needs",
			label: `Needs you${needs.length ? ` ${needs.length}` : ""}`
		},
		{
			id: "changed",
			label: "Changed"
		},
		{
			id: "happened",
			label: "Happened"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IkanShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: accentStyle("night"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, {
				leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
					label: "Back",
					onClick: () => navigate({ to: "/" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
				}),
				trailing: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/settings",
					"aria-label": "Notification settings",
					className: cn("grid h-12 w-12 place-items-center rounded-full", stateLayer),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-6 w-6" })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-[32px] font-semibold leading-10",
					children: "Notifications"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-scrollbar mt-4 flex gap-2 overflow-x-auto px-4",
				role: "tablist",
				children: tabs.map((t) => {
					const on = t.id === tab;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": on,
						onClick: () => setTab(t.id),
						className: cn("inline-flex h-9 shrink-0 items-center rounded-[8px] border px-3.5 text-[14px] font-medium transition-colors", stateLayer, on ? "border-transparent bg-foreground text-background" : "border-foreground/20"),
						children: t.label
					}, t.id);
				})
			}),
			hydrated && empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-6 overflow-hidden rounded-[24px] bg-secondary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-32",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Illustration, { art: "sleep" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { className: "mx-auto h-6 w-6 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-[17px] font-semibold",
							children: "All quiet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[14px] text-muted-foreground",
							children: "Nothing needs you right now."
						})
					]
				})]
			}) : null,
			(tab === "all" || tab === "needs") && needs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tier, {
				title: "Needs you",
				note: "Things you can act on now.",
				children: needs.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoticeRow, {
					n: x,
					fresh: freshIds.has(x.id),
					strong: true
				}, x.id))
			}) : null,
			(tab === "all" || tab === "changed") && changed.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tier, {
				title: "Changed",
				note: "Worth seeing. These wait here until you open iKAN.",
				children: changed.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoticeRow, {
					n: x,
					fresh: freshIds.has(x.id)
				}, x.id))
			}) : null,
			(tab === "all" || tab === "happened") && happened.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tier, {
				title: "Happened",
				note: "Your activity log. It never notifies.",
				children: happened.map((e) => {
					const Icon = eventIcon[e.type];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						...e.link,
						className: cn("flex min-h-14 items-center gap-3 px-4 py-2.5", stateLayer),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground",
								children: e.emoji ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									children: e.emoji
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-[14px]",
									children: e.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-[12px] text-muted-foreground",
									children: e.detail
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] tabular-nums text-muted-foreground",
								children: ago(e.at)
							})
						]
					}, e.id);
				})
			}) : null
		]
	}) });
}
function Tier({ title, note, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "px-4 font-display text-[16px] font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 text-[12px] leading-5 text-muted-foreground",
				children: note
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-4 mt-2 overflow-hidden rounded-[20px] border border-foreground/10 [&>*+*]:border-t [&>*+*]:border-foreground/10",
				children
			})
		]
	});
}
function NoticeRow({ n, fresh, strong }) {
	const meta = noticeIcon[n.icon];
	const Icon = meta.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		...n.link,
		className: cn("relative flex items-start gap-3 px-4 py-3.5", stateLayer, fresh && "bg-[var(--accent-container)]/40"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-10 w-10 shrink-0 place-items-center rounded-full",
				style: {
					background: meta.soft,
					color: meta.color
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("block text-[15px] leading-5", strong ? "font-semibold" : "font-medium"),
					children: n.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 block text-[13px] leading-5 text-muted-foreground",
					children: n.body
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex flex-col items-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[12px] tabular-nums text-muted-foreground",
					children: ago(n.at)
				}), fresh ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-2.5 w-2.5 rounded-full bg-[var(--accent-strong)]",
					"aria-label": "Unread"
				}) : null]
			})
		]
	});
}
//#endregion
export { NotificationsPage as component };
