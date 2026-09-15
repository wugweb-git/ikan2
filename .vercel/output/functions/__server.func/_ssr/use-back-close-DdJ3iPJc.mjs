import { i as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-back-close-DdJ3iPJc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var MARK = "ikanSheet";
var seq = 0;
function useBackToClose(open, close) {
	const closeRef = (0, import_react.useRef)(close);
	closeRef.current = close;
	(0, import_react.useEffect)(() => {
		if (!open || typeof window === "undefined") return;
		const id = ++seq;
		const href = window.location.href;
		const isOurs = () => window.history.state?.[MARK] === id;
		window.history.pushState({
			...window.history.state ?? {},
			[MARK]: id
		}, "", href);
		let popped = false;
		const onPop = () => {
			if (isOurs()) return;
			popped = true;
			closeRef.current();
		};
		window.addEventListener("popstate", onPop);
		return () => {
			window.removeEventListener("popstate", onPop);
			if (popped) return;
			window.setTimeout(() => {
				if (isOurs() && window.location.href === href) window.history.back();
			}, 0);
		};
	}, [open]);
}
//#endregion
export { useBackToClose as t };
