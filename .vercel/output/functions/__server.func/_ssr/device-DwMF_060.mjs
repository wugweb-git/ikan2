import { i as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as createLocalStore } from "./local-store-Ceu_KPZq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/device-DwMF_060.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var store = createLocalStore("ikan.device.v1", {});
var useDevice = () => store.use();
var hasWindow = () => typeof window !== "undefined";
var notificationAccess = () => {
	if (!hasWindow() || !("Notification" in window)) return "unsupported";
	return Notification.permission === "default" ? "prompt" : Notification.permission;
};
var permissionListeners = /* @__PURE__ */ new Set();
var emitPermissions = () => permissionListeners.forEach((l) => l());
var useNotificationAccess = () => (0, import_react.useSyncExternalStore)((l) => {
	permissionListeners.add(l);
	return () => permissionListeners.delete(l);
}, notificationAccess, () => "prompt");
async function requestNotifications() {
	if (notificationAccess() === "unsupported") return "unsupported";
	try {
		await Notification.requestPermission();
	} catch {}
	emitPermissions();
	return notificationAccess();
}
/** Show a notification through the service worker when there is one, so it works installed. */
async function notify(title, body, url = "/") {
	if (notificationAccess() !== "granted") return false;
	const options = {
		body,
		icon: "/pwa-192x192.png",
		badge: "/pwa-64x64.png",
		data: { url }
	};
	try {
		const reg = await navigator.serviceWorker?.getRegistration();
		if (reg) await reg.showNotification(title, options);
		else new Notification(title, options);
		return true;
	} catch {
		return false;
	}
}
var locationSupported = () => hasWindow() && "geolocation" in navigator;
async function locationAccess() {
	if (!locationSupported()) return "unsupported";
	try {
		return (await navigator.permissions?.query({ name: "geolocation" }))?.state ?? "prompt";
	} catch {
		return "prompt";
	}
}
function useLocationAccess() {
	const [access, setAccess] = (0, import_react.useState)("prompt");
	(0, import_react.useEffect)(() => {
		let alive = true;
		locationAccess().then((a) => alive && setAccess(a));
		return () => {
			alive = false;
		};
	}, []);
	return [access, setAccess];
}
/** Ask for the position, then name the city and fetch today's weather. */
function requestLocation() {
	return new Promise((resolve, reject) => {
		if (!locationSupported()) return reject(/* @__PURE__ */ new Error("Location isn’t available on this device."));
		navigator.geolocation.getCurrentPosition(async (pos) => {
			const lat = Number(pos.coords.latitude.toFixed(3));
			const lon = Number(pos.coords.longitude.toFixed(3));
			let city = "";
			try {
				const j = await (await fetch(`https://api-bdc.io/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)).json();
				city = j.locality || j.city || "";
			} catch {}
			const location = {
				lat,
				lon,
				city,
				at: (/* @__PURE__ */ new Date()).toISOString()
			};
			store.update((s) => ({
				...s,
				location
			}));
			refreshWeather(true);
			resolve(location);
		}, (err) => reject(/* @__PURE__ */ new Error(err.code === err.PERMISSION_DENIED ? "Location is blocked. Allow it for iKAN in your phone’s settings." : "Couldn’t find your location. Try again outside or with Wi-Fi on.")), {
			enableHighAccuracy: false,
			timeout: 15e3,
			maximumAge: 36e5
		});
	});
}
/** Current temperature for the saved location, refreshed at most every 30 minutes. */
async function refreshWeather(force = false) {
	const { location, weather } = store.read();
	if (!location) return;
	if (!force && weather && Date.now() - new Date(weather.at).getTime() < 18e5) return;
	try {
		const j = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code`)).json();
		if (j.current) store.update((s) => ({
			...s,
			weather: {
				temp: Math.round(j.current.temperature_2m),
				code: j.current.weather_code,
				at: (/* @__PURE__ */ new Date()).toISOString()
			}
		}));
	} catch {}
}
/** WMO weather code → a short word. */
var weatherWord = (code) => code === 0 ? "Clear" : code <= 3 ? "Cloudy" : code <= 48 ? "Fog" : code <= 67 ? "Rain" : code <= 77 ? "Snow" : code <= 82 ? "Showers" : "Storms";
/** Step and activity sensing. iPhone asks explicitly; Android allows it without a prompt. */
async function requestMotion() {
	if (!hasWindow() || !("DeviceMotionEvent" in window)) return "unsupported";
	const DM = window.DeviceMotionEvent;
	let access = "granted";
	if (typeof DM.requestPermission === "function") try {
		access = await DM.requestPermission();
	} catch {
		access = "denied";
	}
	store.update((s) => ({
		...s,
		motion: access
	}));
	return access;
}
var isInstalled = () => hasWindow() && (window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches || navigator.standalone === true);
var installPrompt = null;
var installListeners = /* @__PURE__ */ new Set();
if (hasWindow()) window.addEventListener("beforeinstallprompt", (e) => {
	e.preventDefault();
	installPrompt = e;
	installListeners.forEach((l) => l());
});
var useCanInstall = () => (0, import_react.useSyncExternalStore)((l) => {
	installListeners.add(l);
	return () => installListeners.delete(l);
}, () => Boolean(installPrompt), () => false);
async function installApp() {
	if (!installPrompt) return false;
	await installPrompt.prompt();
	const { outcome } = await installPrompt.userChoice;
	installPrompt = null;
	installListeners.forEach((l) => l());
	return outcome === "accepted";
}
function registerServiceWorker() {
	if (!hasWindow() || !("serviceWorker" in navigator) || false) return;
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js").catch(() => {});
	});
}
/** While the app is open: show the daily mood reminder once, after the chosen time,
* if there is no check-in yet today. */
function checkMoodReminder(opts) {
	if (!opts.enabled || opts.loggedToday || notificationAccess() !== "granted") return;
	const now = /* @__PURE__ */ new Date();
	const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
	const [h, m] = opts.time.split(":").map(Number);
	if (now.getHours() * 60 + now.getMinutes() < (h ?? 20) * 60 + (m ?? 30)) return;
	if (store.read().remindedOn === today) return;
	store.update((s) => ({
		...s,
		remindedOn: today
	}));
	notify("How are you feeling today?", "A 30-second check-in keeps your journal up to date.", "/journal");
}
//#endregion
export { refreshWeather as a, requestMotion as c, useDevice as d, useLocationAccess as f, notify as i, requestNotifications as l, weatherWord as m, installApp as n, registerServiceWorker as o, useNotificationAccess as p, isInstalled as r, requestLocation as s, checkMoodReminder as t, useCanInstall as u };
