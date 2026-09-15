import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { c as setWriteHook, i as refreshStores, n as getScope, o as scopedKey, s as setScope, t as claimGuestData } from "./storage-scope-BQ7XsBx5.mjs";
import { t as createLocalStore } from "./local-store-Ceu_KPZq.mjs";
import { a as mergeResults, f as scoreAll, t as assessments } from "./store-CsxAZBJN.mjs";
import { a as getProgramme, c as readProgramme, f as updateProgramme } from "./programs-DrKO9d_v.mjs";
import { o as mergeJournalEntries, r as contextTags } from "./journal-Cd2_QpOm.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { n as Capacitor } from "../_libs/capacitor__app+capacitor__core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-xMCnsA0H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BACKEND_URL = "https://jpfvoevxegnknxoqmwye.supabase.co";
var BACKEND_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZnZvZXZ4ZWdua254b3Ftd3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjIyNDIsImV4cCI6MjA3MzY5ODI0Mn0.VGYSE8LqBEggrQcUHJH9NcvursaoNfQK9K8-ESCo-rc";
/** Edge functions on the backend. */
var functionUrl = (name) => `${BACKEND_URL}/functions/v1/${name}`;
var DB_URL = BACKEND_URL;
var DB_KEY = BACKEND_KEY;
var TABLE = "ikan2_user_state";
/** Store names as saved in the database (the part after `ikan.u.<userId>.`). */
var SYNCED = /* @__PURE__ */ new Set([
	"assessments.v1",
	"journal.v1",
	"equip.sleep-tight.v2",
	"equip.unburn.v2",
	"equip.stress-buster.v2",
	"consult.v1",
	"profile.v1",
	"settings.v1",
	"resources.v1",
	"wellness.v1",
	"onboarding.v1",
	"notifications.v1"
]);
var status$1 = { state: "off" };
var statusListeners = /* @__PURE__ */ new Set();
var setStatus$1 = (s) => {
	status$1 = s;
	statusListeners.forEach((l) => l());
};
var useSyncStatus = () => (0, import_react.useSyncExternalStore)((l) => {
	statusListeners.add(l);
	return () => statusListeners.delete(l);
}, () => status$1, () => status$1);
var prefix = (uid) => `ikan.u.${uid}.`;
var metaKey = (uid) => `${prefix(uid)}sync.meta`;
var readMeta = (uid) => {
	try {
		return JSON.parse(localStorage.getItem(metaKey(uid)) ?? "{}");
	} catch {
		return {};
	}
};
var writeMeta = (uid, m) => {
	try {
		localStorage.setItem(metaKey(uid), JSON.stringify(m));
	} catch {}
};
var readLocal = (uid, name) => {
	try {
		const raw = localStorage.getItem(prefix(uid) + name);
		return raw ? JSON.parse(raw) : void 0;
	} catch {
		return;
	}
};
async function rest(path, token, init = {}) {
	const res = await fetch(`${DB_URL}/rest/v1/${path}`, {
		method: init.method ?? "GET",
		headers: {
			apikey: DB_KEY,
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			...init.prefer ? { Prefer: init.prefer } : {}
		},
		...init.body !== void 0 ? { body: JSON.stringify(init.body) } : {}
	});
	if (!res.ok) {
		let message = `Saving failed (${res.status})`;
		try {
			message = (await res.json()).message ?? message;
		} catch {}
		throw new Error(message);
	}
	const text = await res.text();
	return text ? JSON.parse(text) : null;
}
var byId = (local = [], remote = []) => {
	const seen = new Map(remote.map((x) => [x.id, x]));
	for (const x of local) seen.set(x.id, x);
	return [...seen.values()];
};
/** Both the device and the account changed the same store: keep everything from both. */
function merge(name, local, remote) {
	const l = local ?? {};
	const r = remote ?? {};
	if (name === "journal.v1") return { entries: byId(l["entries"], r["entries"]) };
	if (name === "assessments.v1") return {
		results: byId(l["results"], r["results"]),
		drafts: {
			...r["drafts"],
			...l["drafts"]
		}
	};
	if (name === "consult.v1") return { bookings: byId(l["bookings"], r["bookings"]) };
	if (name === "resources.v1") return {
		saved: [.../* @__PURE__ */ new Set([...r["saved"] ?? [], ...l["saved"] ?? []])],
		opened: {
			...r["opened"],
			...l["opened"]
		}
	};
	if (name === "wellness.v1") return { days: {
		...r["days"],
		...l["days"]
	} };
	if (name === "notifications.v1") return { read: [.../* @__PURE__ */ new Set([...r["read"] ?? [], ...l["read"] ?? []])] };
	if (name.startsWith("equip.")) {
		const lc = l["collections"] ?? {};
		const rc = r["collections"] ?? {};
		const collections = {};
		for (const k of /* @__PURE__ */ new Set([...Object.keys(lc), ...Object.keys(rc)])) collections[k] = byId(lc[k], rc[k]);
		const lt = l["tracker"] ?? {};
		const rt = r["tracker"] ?? {};
		const tracker = {};
		for (const k of /* @__PURE__ */ new Set([...Object.keys(lt), ...Object.keys(rt)])) tracker[k] = {
			...rt[k],
			...lt[k]
		};
		return {
			...r,
			...l,
			completed: [.../* @__PURE__ */ new Set([...r["completed"] ?? [], ...l["completed"] ?? []])].sort((a, b) => a - b),
			completedAt: {
				...r["completedAt"],
				...l["completedAt"]
			},
			answers: {
				...r["answers"],
				...l["answers"]
			},
			diary: {
				...r["diary"],
				...l["diary"]
			},
			collections,
			tracker
		};
	}
	return local;
}
var session = null;
var timer;
var pushing = false;
async function startCloudSync(uid, token) {
	session = {
		uid,
		token
	};
	setWriteHook((key) => {
		const s = session;
		if (!s || !key.startsWith(prefix(s.uid))) return;
		const name = key.slice(prefix(s.uid).length);
		if (!SYNCED.has(name)) return;
		const m = readMeta(s.uid);
		m[name] = {
			...m[name],
			changed: (/* @__PURE__ */ new Date()).toISOString()
		};
		writeMeta(s.uid, m);
		schedulePush();
	});
	await pull();
}
function stopCloudSync() {
	session = null;
	setWriteHook(null);
	window.clearTimeout(timer);
	setStatus$1({ state: "off" });
}
function schedulePush() {
	window.clearTimeout(timer);
	timer = window.setTimeout(() => void push(), 1500);
}
async function pull() {
	const s = session;
	if (!s) return;
	const token = await s.token();
	if (!token) return;
	setStatus$1({ state: "syncing" });
	try {
		const rows = await rest(`${TABLE}?select=key,value,updated_at&user_id=eq.${s.uid}`, token);
		if (session?.uid !== s.uid || getScope() !== s.uid) return;
		const meta = readMeta(s.uid);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		for (const row of rows ?? []) {
			if (!SYNCED.has(row.key)) continue;
			const local = readLocal(s.uid, row.key);
			const m = meta[row.key];
			const localDirty = local !== void 0 && (!m || !m.pushed || m.changed > m.pushed);
			let next;
			if (local === void 0 || !localDirty) {
				next = row.value;
				meta[row.key] = {
					changed: row.updated_at,
					pushed: row.updated_at
				};
			} else {
				next = merge(row.key, local, row.value);
				meta[row.key] = {
					changed: now,
					...m?.pushed ? { pushed: m.pushed } : {}
				};
			}
			try {
				localStorage.setItem(prefix(s.uid) + row.key, JSON.stringify(next));
			} catch {}
		}
		for (const name of SYNCED) if (readLocal(s.uid, name) !== void 0 && !(rows ?? []).some((r) => r.key === name) && !meta[name]?.pushed) meta[name] = { changed: meta[name]?.changed ?? now };
		writeMeta(s.uid, meta);
		refreshStores();
		setStatus$1({
			state: "synced",
			at: now
		});
		await push();
	} catch (e) {
		setStatus$1({
			state: "error",
			message: e.message
		});
	}
}
async function push() {
	const s = session;
	if (!s || pushing || false) return;
	const meta = readMeta(s.uid);
	const dirty = [...SYNCED].filter((name) => meta[name] && (!meta[name].pushed || meta[name].changed > meta[name].pushed));
	if (!dirty.length) return;
	const token = await s.token();
	if (!token) return;
	pushing = true;
	setStatus$1({ state: "syncing" });
	try {
		const items = dirty.map((key) => ({
			key,
			value: readLocal(s.uid, key),
			updated_at: meta[key].changed
		})).filter((i) => i.value !== void 0);
		if (items.length) await rest(`${TABLE}?on_conflict=user_id,key`, token, {
			method: "POST",
			prefer: "resolution=merge-duplicates,return=minimal",
			body: items.map((i) => ({
				user_id: s.uid,
				...i
			}))
		});
		const after = readMeta(s.uid);
		for (const i of items) if (after[i.key]?.changed === i.updated_at) after[i.key] = {
			...after[i.key],
			pushed: i.updated_at
		};
		writeMeta(s.uid, after);
		setStatus$1({
			state: "synced",
			at: (/* @__PURE__ */ new Date()).toISOString()
		});
	} catch (e) {
		setStatus$1({
			state: "error",
			message: e.message
		});
	} finally {
		pushing = false;
	}
	const again = readMeta(s.uid);
	if ([...SYNCED].some((n) => again[n] && (!again[n].pushed || again[n].changed > again[n].pushed))) schedulePush();
}
/** Delete this account's saved data from the database (used by "Clear all data"). */
async function clearCloudData() {
	const s = session;
	if (!s || false) return;
	const token = await s.token();
	if (!token) return;
	await rest(`${TABLE}?user_id=eq.${s.uid}`, token, { method: "DELETE" });
	try {
		localStorage.removeItem(metaKey(s.uid));
	} catch {}
}
/** Retry now, e.g. from Settings after an error. */
var syncNow = () => void pull();
var defaultProfile = {
	avatar: "",
	name: "",
	email: "",
	phone: "",
	city: "",
	zip: "",
	birthday: "",
	maritalStatus: "",
	gender: "",
	bio: "",
	emergencyName: "",
	emergencyPhone: "",
	emergencyRelation: "",
	memberSince: "2026-09-01"
};
var defaultSettings = {
	moodReminders: true,
	moodReminderTime: "20:30",
	assessmentReminders: true,
	programUpdates: true,
	weeklyProgress: true,
	newResources: false,
	healthConnect: false,
	shareWithConsultant: false,
	reduceMotion: false
};
var profileStore = createLocalStore("ikan.profile.v1", defaultProfile);
var settingsStore = createLocalStore("ikan.settings.v1", defaultSettings);
function useProfile() {
	return {
		profile: profileStore.use(),
		save: (patch) => profileStore.update((p) => ({
			...p,
			...patch
		}))
	};
}
function useSettings() {
	return {
		settings: settingsStore.use(),
		set: (key, value) => settingsStore.update((s) => ({
			...s,
			[key]: value
		}))
	};
}
/** "Noida, 201310" → "Noida": the place name without a postal code. */
var cityName = (city) => city.split(",").map((x) => x.trim()).filter((x) => x && !/^\d[\d\s-]*$/.test(x)).join(", ");
var firstName = (p) => p.name.trim().split(/\s+/)[0] || "there";
var profileInitials = (p) => p.name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";
/** Every key this app stores for the signed-in account, for export and "clear all data". */
var storageKeys = () => [
	"ikan.assessments.v1",
	"ikan.journal.v1",
	"ikan.resources.v1",
	"ikan.consult.v1",
	"ikan.profile.v1",
	"ikan.settings.v1",
	"ikan.wellness.v1",
	"ikan.notifications.v1",
	"ikan.onboarding.v1",
	"ikan.equip.sleep-tight.v2",
	"ikan.equip.unburn.v2",
	"ikan.equip.stress-buster.v2"
].map(scopedKey);
var legalLinks = [
	{
		id: "about",
		label: "About iKAN",
		description: "Our mission and story"
	},
	{
		id: "faq",
		label: "FAQ",
		description: "Frequently asked questions"
	},
	{
		id: "privacy-policy",
		label: "Privacy Policy",
		description: "How we handle your data"
	},
	{
		id: "terms",
		label: "Terms of Use",
		description: "Service terms and conditions"
	},
	{
		id: "cancellation-policy",
		label: "Cancellation Policy",
		description: "How to cancel subscriptions"
	},
	{
		id: "return-policy",
		label: "Return Policy",
		description: "Refund and return guidelines"
	}
];
/** Profile details from the old iKan app. The first import fills everything it has; later
* imports only fill fields that are still empty, so edits made here are kept. */
function importProfile(incoming, first) {
	profileStore.update((p) => {
		const next = { ...p };
		for (const [k, v] of Object.entries(incoming)) {
			if (!v) continue;
			if (first || !next[k]) next[k] = v;
		}
		return next;
	});
}
/** Fill a fresh profile from the signed-in account (name, email, phone), once. A photo from
* Google or LinkedIn fills an empty avatar whenever it arrives. */
function seedProfile(account) {
	const current = profileStore.read();
	if (current.email) {
		if (account.avatar && !current.avatar) profileStore.update((p) => ({
			...p,
			avatar: account.avatar
		}));
		return;
	}
	profileStore.update((p) => ({
		...p,
		name: account.name || p.name,
		email: account.email,
		phone: p.phone || account.phone || "",
		avatar: p.avatar || account.avatar || "",
		memberSince: p.memberSince === defaultProfile.memberSince ? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) : p.memberSince
	}));
}
var onboardingStore = createLocalStore("ikan.onboarding.v1", {
	done: false,
	reason: ""
});
/** The "about you" details asked for once after sign-up. */
var aboutYouComplete = (p) => Boolean(p.birthday && p.gender && p.city && p.zip && p.maritalStatus);
var useOnboarding = () => {
	return {
		...onboardingStore.use(),
		finish: (reason) => onboardingStore.update(() => ({
			done: true,
			reason
		}))
	};
};
var onboardingDone = () => onboardingStore.read().done;
/** Skip onboarding for an account that has already been through it elsewhere. */
var markOnboardingDone = () => {
	if (!onboardingStore.read().done) onboardingStore.update((s) => ({
		...s,
		done: true
	}));
};
var API = "https://jpfvoevxegnknxoqmwye.supabase.co/functions/v1/make-server-cc205da9";
/** Old programme ids → programmes here. Productivity Reset (33eae2e2-…) has no programme yet. */
var PROGRAMMES = [
	["68970d31-0ff3-4d73-b137-80e98228d399", "sleep-tight"],
	["416feb50-e73f-4898-a996-f8a4695a708e", "unburn"],
	["9117b308-ff8a-4613-90ef-007841ef0b79", "stress-buster"]
];
var status = { state: "idle" };
var listeners = /* @__PURE__ */ new Set();
var setStatus = (next) => {
	status = next;
	listeners.forEach((l) => l());
};
/** Whether the import is still running, so screens can show a loader instead of "nothing yet". */
var useImportStatus = () => (0, import_react.useSyncExternalStore)((l) => {
	listeners.add(l);
	return () => listeners.delete(l);
}, () => status, () => status);
async function get(path, token) {
	try {
		const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } });
		return res.ok ? await res.json() : null;
	} catch {
		return null;
	}
}
/** Per account: whether the old profile has been brought over once already. */
var imported = createLocalStore("ikan.legacy-import.v1", { profileAt: "" });
function importOldProfile(o) {
	const first = !imported.read().profileAt;
	importProfile({
		name: o.name?.trim(),
		email: o.email?.trim(),
		phone: o.phone?.trim(),
		city: o.location ? cityName(o.location) : void 0,
		birthday: o.dateOfBirth?.slice(0, 10),
		gender: o.gender ? o.gender.charAt(0).toUpperCase() + o.gender.slice(1) : void 0,
		bio: o.bio?.trim(),
		emergencyName: o.emergencyContactName?.trim(),
		emergencyPhone: o.emergencyContactPhone?.trim(),
		emergencyRelation: o.emergencyContactRelationship?.trim(),
		memberSince: o.created_at?.slice(0, 10),
		avatar: /^https:\/\//.test(o.avatar_url ?? "") ? o.avatar_url : void 0
	}, first);
	imported.update(() => ({ profileAt: (/* @__PURE__ */ new Date()).toISOString() }));
}
var scale = (n) => typeof n === "number" && n >= 1 && n <= 5 ? Math.round(n) : void 0;
function journalEntry(o) {
	const mood = scale(o.mood_rating);
	if (!o.id || !o.date || !mood) return null;
	const labels = o.context_tags?.length ? o.context_tags : o.emotions ?? [];
	const tags = [...new Set(labels.map((l) => contextTags.find((t) => t.label.toLowerCase() === l.toLowerCase() || t.id === l)?.id).filter((t) => Boolean(t)))];
	const energy = scale(o.energy);
	const stress = scale(o.stress_level);
	return {
		id: o.id,
		date: o.date,
		createdAt: o.created_at || `${o.date}T12:00:00.000Z`,
		mood,
		...energy ? { energy } : {},
		...stress ? { stress } : {},
		...o.freehand_text_content ? { note: o.freehand_text_content } : {},
		tags
	};
}
/** Only results that score exactly the same here; older answer scales and gaps are left behind. */
function storedResult(o) {
	if (o.record_type === "program_checkin" || o.assessment_id?.startsWith("checkin_")) return null;
	const a = assessments.find((x) => x.id === o.assessment_id);
	if (!a || !o.responses || !o.completed_at) return null;
	const answers = {};
	for (const q of a.questions) {
		const text = o.responses[q.id];
		const option = a.scales[q.scale]?.options.find((opt) => opt.text === text);
		if (option) answers[q.id] = option.value;
	}
	const scores = scoreAll(a, answers);
	if (!scores.length || scores.some((s) => s.value === null)) return null;
	return {
		id: o.id,
		slug: a.slug,
		completedAt: o.completed_at,
		seconds: o.duration_seconds ?? 0,
		answers
	};
}
var clean = (v) => v === null || v === void 0 ? "" : typeof v === "string" ? v.trim() : String(v);
/** One old activity's answer as readable lines. */
function lines(value) {
	if (typeof value === "string" || typeof value === "number") return clean(value) ? [clean(value)] : [];
	if (!Array.isArray(value)) return [];
	return value.map((row) => {
		if (typeof row !== "object" || row === null) return clean(row);
		const r = row;
		if ("Question" in r) {
			const answer = clean(r["Response"]);
			return answer ? `${clean(r["Question"])} ${answer}` : "";
		}
		return Object.entries(r).filter(([, v]) => clean(v)).map(([k, v]) => `${k}: ${clean(v)}`).join(" · ");
	}).filter(Boolean);
}
async function importProgramme(oldId, slug, token) {
	const p = getProgramme(slug);
	if (!p || imported.read().programmes?.includes(slug)) return 0;
	const existing = readProgramme(slug);
	if (existing.completed.length || existing.runs?.length) {
		imported.update((x) => ({
			...x,
			programmes: [...x.programmes ?? [], slug]
		}));
		return 0;
	}
	const [progress, program] = await Promise.all([get(`/user/equip/${oldId}/progress`, token), get(`/equip/programs/${oldId}`, token)]);
	const valid = new Set(p.days.map((d) => d.day));
	const days = (progress?.progress?.days ?? []).filter((d) => d.completed && valid.has(d.day_number));
	if (!days.length) return 0;
	const titleOf = (day, id) => program?.program?.daily_content?.find((d) => d.day === day)?.activities?.find((a) => a.id === id)?.title ?? "Your answer";
	updateProgramme(slug, (s) => {
		const completed = new Set(s.completed);
		const completedAt = { ...s.completedAt };
		const legacy = { ...s.legacy };
		const first = [...days].sort((a, b) => (a.completed_at ?? "").localeCompare(b.completed_at ?? ""))[0];
		if (valid.has(0) && !completed.has(0)) {
			completed.add(0);
			if (first?.completed_at) completedAt["0"] = first.completed_at;
		}
		for (const d of days) {
			const key = String(d.day_number);
			completed.add(d.day_number);
			if (!completedAt[key] && d.completed_at) completedAt[key] = d.completed_at;
			if (!legacy[key]) {
				const blocks = Object.entries(d.block_responses ?? {}).map(([id, v]) => ({
					title: titleOf(d.day_number, id),
					lines: lines(v)
				})).filter((b) => b.lines.length);
				if (blocks.length) legacy[key] = blocks;
			}
		}
		return {
			...s,
			completed: [...completed].sort((a, b) => a - b),
			completedAt,
			legacy
		};
	});
	imported.update((x) => ({
		...x,
		programmes: [...x.programmes ?? [], slug]
	}));
	return days.length;
}
var running = null;
var doneFor = "";
function importLegacyData(userId, token) {
	if (doneFor === userId) return Promise.resolve();
	if (running) return running;
	setStatus({ state: "running" });
	running = (async () => {
		const t = await token();
		if (!t) {
			setStatus({ state: "failed" });
			return;
		}
		let imported = 0;
		const [journal, history, profile] = await Promise.all([
			get("/user/journal?limit=1000", t),
			get("/user/assessments/history", t),
			get("/users/profile", t)
		]);
		if (profile?.profile) importOldProfile(profile.profile);
		const entries = (journal?.entries ?? []).map(journalEntry).filter((e) => e !== null);
		if (entries.length) mergeJournalEntries(entries);
		const results = (history?.history ?? []).map(storedResult).filter((r) => r !== null);
		if (results.length) mergeResults(results);
		imported += entries.length + results.length;
		for (const [oldId, slug] of PROGRAMMES) imported += await importProgramme(oldId, slug, t);
		doneFor = userId;
		setStatus({
			state: journal || history ? "done" : "failed",
			imported
		});
	})().finally(() => {
		running = null;
	});
	return running;
}
function resetLegacyImport() {
	doneFor = "";
	setStatus({ state: "idle" });
}
var NATIVE_REDIRECT = "com.ikan.wugweb://auth-callback";
var isNativeApp = () => Capacitor.isNativePlatform();
async function nativeOAuth(sb, provider) {
	const { data, error } = await sb.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: NATIVE_REDIRECT,
			skipBrowserRedirect: true
		}
	});
	if (error) throw error;
	if (!data.url) throw new Error("Sign-in didn’t start. Try again.");
	const { Browser } = await import("../_libs/capacitor__browser.mjs").then((n) => n.t);
	await Browser.open({
		url: data.url,
		presentationStyle: "popover"
	});
}
/** Finish sign-in when the browser hands control back to the app. */
async function listenForNativeAuth(sb) {
	if (!isNativeApp()) return () => {};
	const { App } = await import("../_libs/capacitor__app+capacitor__core.mjs").then((n) => n.t);
	const handle = await App.addListener("appUrlOpen", async ({ url }) => {
		if (!url.startsWith("com.ikan.wugweb://auth-callback")) return;
		const { Browser } = await import("../_libs/capacitor__browser.mjs").then((n) => n.t);
		Browser.close().catch(() => {});
		const p = new URL(url.replace("#", "?")).searchParams;
		const accessToken = p.get("access_token");
		const refreshToken = p.get("refresh_token");
		const code = p.get("code");
		if (accessToken && refreshToken) await sb.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken
		});
		else if (code) await sb.auth.exchangeCodeForSession(code);
	});
	return () => void handle.remove();
}
var SUPABASE_URL = BACKEND_URL;
var SUPABASE_ANON_KEY = BACKEND_KEY;
/** the old iKan edge function (sign-up and the contact form) */
var LEGACY_API = functionUrl("make-server-cc205da9");
var LEGACY_ANON_KEY = BACKEND_KEY;
var LEGACY_KEY = BACKEND_KEY;
var REMEMBER_KEY = "ikan.remember";
var rememberLogin = () => {
	try {
		return window.localStorage.getItem(REMEMBER_KEY) !== "0";
	} catch {
		return true;
	}
};
var setRememberLogin = (on) => {
	try {
		window.localStorage.setItem(REMEMBER_KEY, on ? "1" : "0");
	} catch {}
};
var sessionStorageAdapter = {
	getItem: (k) => {
		try {
			return window.localStorage.getItem(k) ?? window.sessionStorage.getItem(k);
		} catch {
			return null;
		}
	},
	setItem: (k, v) => {
		try {
			if (rememberLogin()) {
				window.localStorage.setItem(k, v);
				window.sessionStorage.removeItem(k);
			} else {
				window.sessionStorage.setItem(k, v);
				window.localStorage.removeItem(k);
			}
		} catch {}
	},
	removeItem: (k) => {
		try {
			window.localStorage.removeItem(k);
			window.sessionStorage.removeItem(k);
		} catch {}
	}
};
var apiKeyFetch = (key) => (input, init) => {
	const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
	if (init?.headers) new Headers(init.headers).forEach((v, k) => headers.set(k, v));
	if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
	headers.set("apikey", key);
	return fetch(input, {
		...init,
		headers
	});
};
var client = null;
function supabase() {
	if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		global: { fetch: apiKeyFetch(SUPABASE_ANON_KEY) },
		auth: {
			persistSession: true,
			autoRefreshToken: true,
			detectSessionInUrl: true,
			...typeof window !== "undefined" ? { storage: sessionStorageAdapter } : {}
		}
	});
	return client;
}
var AuthContext = (0, import_react.createContext)(null);
var displayName = (u) => u?.user_metadata?.["name"] || u?.user_metadata?.["full_name"] || u?.email?.split("@")[0] || "";
/** Supabase and edge errors, in words a person can act on. */
function friendly(message) {
	if (/invalid login credentials/i.test(message)) return "That email and password don’t match. Check them and try again.";
	if (/not confirmed/i.test(message)) return "Confirm your email first. We’ve sent the link to your inbox.";
	if (/already (been )?registered|already exists|user_already_exists/i.test(message)) return "An account with this email already exists. Sign in instead.";
	if (/rate limit|too many/i.test(message)) return "Too many attempts. Wait a minute and try again.";
	if (/password/i.test(message) && /(short|at least|weak)/i.test(message)) return "Use a password of at least 8 characters.";
	if (/failed to fetch|network/i.test(message)) return "Can’t reach iKAN. Check your connection and try again.";
	return message.replace(/^API Error: \d+\s*/, "") || "Something went wrong. Try again.";
}
function AuthProvider({ children }) {
	const [status, setStatus] = (0, import_react.useState)("loading");
	const [session, setSession] = (0, import_react.useState)(null);
	const [recovering, setRecovering] = (0, import_react.useState)(false);
	const apply = (s) => {
		if (s?.user) {
			const changed = getScope() !== s.user.id;
			claimGuestData(s.user.id);
			setScope(s.user.id);
			if (changed) {
				const token = async () => {
					const { data } = await supabase().auth.getSession();
					return data.session?.access_token ?? null;
				};
				startCloudSync(s.user.id, token).finally(() => importLegacyData(s.user.id, token));
			}
		} else {
			if (getScope() !== "guest") {
				stopCloudSync();
				resetLegacyImport();
			}
			setScope("guest");
		}
		setSession(s);
		setStatus(s ? "signedIn" : "signedOut");
	};
	(0, import_react.useEffect)(() => {
		const sb = supabase();
		let alive = true;
		sb.auth.getSession().then(({ data }) => alive && apply(data.session)).catch(() => alive && apply(null));
		const { data } = sb.auth.onAuthStateChange((event, s) => {
			if (event === "PASSWORD_RECOVERY") setRecovering(true);
			apply(s);
		});
		let stopNative = () => {};
		listenForNativeAuth(sb).then((stop) => {
			if (alive) stopNative = stop;
			else stop();
		});
		return () => {
			alive = false;
			data.subscription.unsubscribe();
			stopNative();
		};
	}, []);
	const origin = () => typeof window === "undefined" ? "" : window.location.origin;
	const value = {
		status,
		session,
		user: session?.user ?? null,
		recovering,
		signIn: async (email, password) => {
			const { error } = await supabase().auth.signInWithPassword({
				email: email.trim(),
				password
			});
			if (error) throw new Error(friendly(error.message));
		},
		signUp: async ({ name, email, password, phone }) => {
			const res = await fetch(`${LEGACY_API}/auth/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${LEGACY_KEY}`
				},
				body: JSON.stringify({
					email: email.trim(),
					password,
					name: name.trim(),
					...phone ? { phone } : {}
				})
			}).catch(() => {
				throw new Error(friendly("Failed to fetch"));
			});
			if (!res.ok) {
				const text = await res.text();
				let message = text;
				try {
					const j = JSON.parse(text);
					message = j.error || j.message || text;
				} catch {}
				throw new Error(friendly(message));
			}
			const { error } = await supabase().auth.signInWithPassword({
				email: email.trim(),
				password
			});
			if (!error) return "signedIn";
			if (/not confirmed/i.test(error.message)) {
				await supabase().auth.resend({
					type: "signup",
					email: email.trim(),
					options: { emailRedirectTo: `${origin()}/login` }
				}).catch(() => {});
				return "confirm";
			}
			throw new Error(friendly(error.message));
		},
		signInWith: async (provider) => {
			if (isNativeApp()) try {
				return await nativeOAuth(supabase(), provider);
			} catch (e) {
				throw new Error(friendly(e.message));
			}
			const { error } = await supabase().auth.signInWithOAuth({
				provider,
				options: { redirectTo: `${origin()}/` }
			});
			if (error) throw new Error(friendly(error.message));
		},
		sendPhoneCode: async (phone) => {
			const { error } = await supabase().auth.signInWithOtp({ phone: phone.replace(/\s/g, "") });
			if (error) {
				if (/unsupported phone provider|phone.*(disabled|not enabled)|sms provider/i.test(error.message)) throw new Error("Phone sign-in isn’t available yet. Use your email instead.");
				throw new Error(friendly(error.message));
			}
		},
		verifyPhoneCode: async (phone, code) => {
			const { error } = await supabase().auth.verifyOtp({
				phone: phone.replace(/\s/g, ""),
				token: code,
				type: "sms"
			});
			if (error) {
				if (/expired|invalid|otp/i.test(error.message)) throw new Error("That code didn’t work. Check it, or send a new one.");
				throw new Error(friendly(error.message));
			}
		},
		resendConfirmation: async (email) => {
			const { error } = await supabase().auth.resend({
				type: "signup",
				email: email.trim(),
				options: { emailRedirectTo: `${origin()}/login` }
			});
			if (error) throw new Error(friendly(error.message));
		},
		sendReset: async (email) => {
			const { error } = await supabase().auth.resetPasswordForEmail(email.trim(), { redirectTo: `${origin()}/reset-password` });
			if (error) throw new Error(friendly(error.message));
		},
		updatePassword: async (password) => {
			const { error } = await supabase().auth.updateUser({ password });
			if (error) throw new Error(friendly(error.message));
			setRecovering(false);
		},
		signOut: async () => {
			await import("./push-BWq7heyH.mjs").then((m) => m.disablePush()).catch(() => {});
			await supabase().auth.signOut({ scope: "local" }).catch(() => {});
			apply(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const v = (0, import_react.useContext)(AuthContext);
	if (!v) throw new Error("useAuth must be used inside AuthProvider");
	return v;
}
//#endregion
export { useImportStatus as C, useSyncStatus as D, useSettings as E, useAuth as S, useProfile as T, seedProfile as _, cityName as a, supabase as b, defaultSettings as c, functionUrl as d, legalLinks as f, rememberLogin as g, profileInitials as h, aboutYouComplete as i, displayName as l, onboardingDone as m, LEGACY_ANON_KEY as n, clearCloudData as o, markOnboardingDone as p, LEGACY_API as r, defaultProfile as s, AuthProvider as t, firstName as u, setRememberLogin as v, useOnboarding as w, syncNow as x, storageKeys as y };
