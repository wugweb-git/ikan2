import { i as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as registerPlugin, n as Capacitor } from "../_libs/capacitor__app+capacitor__core.mjs";
import { b as supabase } from "./auth-xMCnsA0H.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/health-connect-C1qEs0Ca.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var IkanHealth = registerPlugin("IkanHealth");
/** true inside the iKAN Android app */
var inAndroidApp = () => Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";
var PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.ikan.wugweb";
var COLUMNS = "date,steps,sleep_minutes,awake_minutes,deep_minutes,rem_minutes,heart_rate,resting_heart_rate,hrv_ms,exercise_minutes";
var LAST_SYNC = "ikan.health-connect.synced";
/** Read the phone and save to the account. Returns how many days were saved. */
async function syncHealthConnect(days = 30) {
	const { data } = await supabase().auth.getSession();
	const user = data.session?.user;
	if (!user) throw new Error("Sign in again to sync health data.");
	const rows = (await IkanHealth.readDaily({ days })).days.map((d) => ({
		user_id: user.id,
		date: d.date,
		steps: d.steps ?? null,
		sleep_minutes: d.sleep_minutes ?? null,
		awake_minutes: d.awake_minutes ?? null,
		deep_minutes: d.deep_minutes ?? null,
		rem_minutes: d.rem_minutes ?? null,
		heart_rate: d.heart_rate ?? null,
		resting_heart_rate: d.resting_heart_rate ?? null,
		hrv_ms: d.hrv_ms ?? null,
		exercise_minutes: d.exercise_minutes ?? null,
		source: "health_connect",
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}));
	if (rows.length) {
		const { error } = await supabase().from("ikan2_health_daily").upsert(rows, { onConflict: "user_id,date" });
		if (error) throw new Error("Couldn’t save your health data. Try again.");
	}
	try {
		localStorage.setItem(LAST_SYNC, (/* @__PURE__ */ new Date()).toISOString());
	} catch {}
	return rows.length;
}
/** Quietly refresh when the app opens, at most every 3 hours, if access was already given. */
async function autoSyncHealthConnect() {
	if (!inAndroidApp()) return;
	try {
		const last = localStorage.getItem(LAST_SYNC);
		if (last && Date.now() - new Date(last).getTime() < 108e5) return;
		const { status } = await IkanHealth.availability();
		if (status !== "available") return;
		const { granted } = await IkanHealth.granted();
		if (granted.length) await syncHealthConnect();
	} catch {}
}
async function healthDays(days = 30) {
	const since = (/* @__PURE__ */ new Date(Date.now() - days * 864e5)).toISOString().slice(0, 10);
	const { data, error } = await supabase().from("ikan2_health_daily").select(COLUMNS).gte("date", since).order("date", { ascending: true });
	if (error) return [];
	return data ?? [];
}
/** Remove the health data iKAN saved (access itself is managed in Health Connect). */
async function deleteHealthData() {
	const { data } = await supabase().auth.getSession();
	if (!data.session) return;
	await supabase().from("ikan2_health_daily").delete().eq("user_id", data.session.user.id);
}
function useHealthConnect() {
	const native = typeof window !== "undefined" && inAndroidApp();
	const [availability, setAvailability] = (0, import_react.useState)(null);
	const [granted, setGranted] = (0, import_react.useState)([]);
	const [days, setDays] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const refresh = (0, import_react.useCallback)(async () => {
		setDays(await healthDays());
		if (!native) return;
		try {
			const { status } = await IkanHealth.availability();
			setAvailability(status);
			if (status === "available") setGranted((await IkanHealth.granted()).granted);
		} catch {
			setAvailability("unavailable");
		}
	}, [native]);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	const run = async (fn) => {
		setBusy(true);
		setError(null);
		try {
			await fn();
			await refresh();
		} catch (e) {
			setError(e.message || "Health Connect didn’t respond. Try again.");
		} finally {
			setBusy(false);
		}
	};
	return {
		native,
		availability,
		granted,
		connected: granted.length > 0,
		days,
		busy,
		error,
		connect: () => run(async () => {
			if ((await IkanHealth.connect()).granted.length) await syncHealthConnect();
		}),
		sync: () => run(() => syncHealthConnect()),
		manage: () => run(() => IkanHealth.openSettings()),
		install: () => run(() => IkanHealth.install()),
		removeData: () => run(deleteHealthData)
	};
}
/** Average of the most recent `n` days that have a value. */
function recentAverage(days, key, n = 7) {
	const values = days.map((d) => d[key]).filter((v) => typeof v === "number" && v > 0).slice(-n);
	return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}
//#endregion
export { useHealthConnect as i, autoSyncHealthConnect as n, recentAverage as r, PLAY_STORE_URL as t };
