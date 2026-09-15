import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { S as useAuth } from "./auth-xMCnsA0H.mjs";
import { y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as IkanShell } from "./ikan-shell-BVeIbGxw.mjs";
import { f as TopAppBar, r as IconButton } from "./m3-Blvbxy5D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/info-shell-_j2_-UyW.js
var import_jsx_runtime = require_jsx_runtime();
/** About, FAQ, Contact and legal pages are open to everyone. Signed-in people get the app
* navigation; everyone else gets the page with a back button. */
function InfoShell({ title, children }) {
	const { status } = useAuth();
	const router = useRouter();
	const back = () => window.history.length > 1 ? router.history.back() : router.navigate({ to: "/" });
	const bar = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopAppBar, {
		leading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
			label: "Back",
			onClick: back,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-6 w-6" })
		}),
		...title ? { title } : {}
	});
	if (status === "signedIn") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IkanShell, { children: [bar, children] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-canvas text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto min-h-dvh w-full max-w-app bg-background pb-12 shadow-app",
			children: [bar, children]
		})
	});
}
//#endregion
export { InfoShell as t };
