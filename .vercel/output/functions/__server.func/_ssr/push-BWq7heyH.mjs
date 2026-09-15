import { b as supabase, d as functionUrl } from "./auth-xMCnsA0H.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/push-BWq7heyH.js
var pushSupported = () => typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
var keyBytes = (base64url) => {
	const b64 = (base64url + "=".repeat((4 - base64url.length % 4) % 4)).replace(/-/g, "+").replace(/_/g, "/");
	return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
};
async function registration() {
	return await navigator.serviceWorker.getRegistration() ?? await navigator.serviceWorker.register("/sw.js");
}
/** Subscribe this device and save it with the reminder preferences. Needs notification permission. */
async function enablePush(prefs) {
	if (!pushSupported() || Notification.permission !== "granted") return false;
	const { data } = await supabase().auth.getSession();
	const user = data.session?.user;
	if (!user) return false;
	const reg = await registration();
	await navigator.serviceWorker.ready;
	const json = (await reg.pushManager.getSubscription() ?? await reg.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: keyBytes("BFZJsUGDRkErjWc29S7XHhgkO9uw7kZYqBrZVivNZGb7vBltqiOGqAbRSRuw4azz7kc1DD0FsfgSKkgm3jtuPuc")
	})).toJSON();
	const { error } = await supabase().from("ikan2_push_subscriptions").upsert({
		endpoint: json.endpoint,
		user_id: user.id,
		p256dh: json.keys.p256dh,
		auth: json.keys.auth,
		mood_reminder: prefs.moodReminder,
		reminder_time: prefs.time,
		time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
		user_agent: navigator.userAgent.slice(0, 200)
	}, { onConflict: "endpoint" });
	return !error;
}
/** Remove this device's subscription (on sign-out or when reminders are turned off everywhere). */
async function disablePush() {
	if (!pushSupported()) return;
	const sub = await (await navigator.serviceWorker.getRegistration())?.pushManager.getSubscription();
	if (!sub) return;
	await supabase().from("ikan2_push_subscriptions").delete().eq("endpoint", sub.endpoint);
	await sub.unsubscribe().catch(() => {});
}
/** Ask the server to push a test notification to this account's devices. */
async function sendTestPush() {
	const { data } = await supabase().auth.getSession();
	const token = data.session?.access_token;
	if (!token) return 0;
	const res = await fetch(`${functionUrl("ikan2-push")}/test`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: "{}"
	});
	if (!res.ok) return 0;
	return (await res.json()).sent;
}
//#endregion
export { disablePush, enablePush, pushSupported, sendTestPush };
