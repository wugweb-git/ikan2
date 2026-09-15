//#region node_modules/.nitro/vite/services/ssr/assets/storage-scope-BQ7XsBx5.js
var scope = "guest";
var listeners = /* @__PURE__ */ new Set();
var getScope = () => scope;
var scopedKey = (key) => key.replace(/^ikan\./, `ikan.u.${scope}.`);
function onScopeChange(listener) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
function setScope(next) {
	if (next === scope) return;
	scope = next;
	listeners.forEach((l) => l());
}
/** Move pre-account data (`ikan.x`) into this account (`ikan.u.<id>.x`) without overwriting. */
function claimGuestData(userId) {
	if (typeof window === "undefined") return;
	try {
		const legacy = Object.keys(window.localStorage).filter((k) => k.startsWith("ikan.") && !k.startsWith("ikan.u.") && k !== "ikan.claimed");
		if (!legacy.length) return;
		for (const k of legacy) {
			const target = k.replace(/^ikan\./, `ikan.u.${userId}.`);
			const value = window.localStorage.getItem(k);
			if (value !== null && window.localStorage.getItem(target) === null) window.localStorage.setItem(target, value);
			window.localStorage.removeItem(k);
		}
	} catch {}
}
/** Re-read every store from storage, e.g. after account data arrives from the database. */
var refreshStores = () => listeners.forEach((l) => l());
var writeHook = null;
/** Called by the stores after each local save, so it can be queued for the database. */
var reportWrite = (key) => writeHook?.(key);
var setWriteHook = (hook) => {
	writeHook = hook;
};
//#endregion
export { reportWrite as a, setWriteHook as c, refreshStores as i, getScope as n, scopedKey as o, onScopeChange as r, setScope as s, claimGuestData as t };
