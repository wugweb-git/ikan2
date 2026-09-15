import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as getProgramme, n as findStep, t as diaryRows } from "./programs-DrKO9d_v.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft } from "../_libs/lucide-react.mjs";
import { f as TopAppBar, p as accentStyle, r as IconButton } from "./m3-Blvbxy5D.mjs";
import { t as StepView } from "./steps-BuYaUDkk.mjs";
import { t as Route } from "./program._slug.tool._step-CZP7kJBE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/program._slug.tool._step-Bf1UvXbf.js
var import_jsx_runtime = require_jsx_runtime();
/** Exercises Notion marks "available for ever, on demand". */
function ToolPage() {
	const { slug, id } = Route.useLoaderData();
	const programme = getProgramme(slug);
	const step = findStep(programme, id);
	const navigate = useNavigate();
	const back = () => navigate({
		to: "/program/$slug",
		params: { slug }
	});
	const day = Number(id.split(".")[0]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-canvas",
		style: accentStyle(programme.accent),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto min-h-dvh w-full max-w-app bg-background",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, {
				leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
					label: "Back",
					onClick: back,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
				}),
				title: step.block.title,
				subtitle: programme.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "px-4 pb-36 pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepView, {
					step: {
						...step,
						view: "scope" in step.view ? {
							...step.view,
							scope: "all"
						} : step.view
					},
					diaryRows: diaryRows(programme),
					ctx: {
						slug,
						day,
						isLast: false,
						onBack: void 0,
						onNext: back,
						finishLabel: "Done"
					}
				})
			})]
		})
	});
}
//#endregion
export { ToolPage as component };
