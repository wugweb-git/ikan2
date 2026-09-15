import { i as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-personal-context-Dw3fv5YZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/** Scroll offset of the app scroller, for header collapse + parallax. */
function useScrollY() {
	const [y, setY] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let frame = 0;
		const onScroll = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => setY(window.scrollY));
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", onScroll);
		};
	}, []);
	return y;
}
//#endregion
export { useScrollY as t };
