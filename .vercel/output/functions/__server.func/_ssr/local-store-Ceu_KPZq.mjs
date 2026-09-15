import { i as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as reportWrite, n as getScope, o as scopedKey, r as onScopeChange } from "./storage-scope-BQ7XsBx5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/local-store-Ceu_KPZq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function createLocalStore(key, empty) {
	let cache;
	let cacheScope = "";
	const listeners = /* @__PURE__ */ new Set();
	const read = () => {
		if (cache && cacheScope === getScope()) return cache;
		if (typeof window === "undefined") return empty;
		let state = empty;
		try {
			const raw = window.localStorage.getItem(scopedKey(key));
			if (raw) state = {
				...empty,
				...JSON.parse(raw)
			};
		} catch {}
		cache = state;
		cacheScope = getScope();
		return state;
	};
	const write = (next) => {
		cache = next;
		cacheScope = getScope();
		try {
			window.localStorage.setItem(scopedKey(key), JSON.stringify(next));
		} catch {}
		reportWrite(scopedKey(key));
		listeners.forEach((l) => l());
	};
	const subscribe = (listener) => {
		listeners.add(listener);
		const onStorage = (e) => {
			if (e.key === scopedKey(key)) {
				cache = void 0;
				listener();
			}
		};
		window.addEventListener("storage", onStorage);
		const offScope = onScopeChange(() => {
			cache = void 0;
			listener();
		});
		return () => {
			listeners.delete(listener);
			window.removeEventListener("storage", onStorage);
			offScope();
		};
	};
	return {
		read,
		update: (fn) => write(fn(read())),
		use: () => (0, import_react.useSyncExternalStore)(subscribe, read, () => empty)
	};
}
var newId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
//#endregion
export { newId as n, createLocalStore as t };
