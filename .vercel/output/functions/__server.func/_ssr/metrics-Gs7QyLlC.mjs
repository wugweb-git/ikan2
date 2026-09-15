//#region node_modules/.nitro/vite/services/ssr/assets/metrics-Gs7QyLlC.js
var toMinutes = (value) => {
	if (!value || !/^\d{1,2}:\d{2}$/.test(value)) return null;
	const [h, m] = value.split(":").map(Number);
	return (h ?? 0) * 60 + (m ?? 0);
};
/** Minutes from a to b, wrapping past midnight. */
var span = (a, b) => b - a <= 0 ? b - a + 1440 : b - a;
/**
* Time in bed: went to bed → got out of bed.
* Time asleep: tried to sleep → woke up, minus time to fall asleep and time awake in the night.
* Descriptive only; no target is prescribed.
*/
function nightMetrics(e) {
	const bed = toMinutes(e.bed);
	const up = toMinutes(e.up);
	const tried = toMinutes(e.tried) ?? bed;
	const woke = toMinutes(e.woke) ?? up;
	if (bed === null || up === null || tried === null || woke === null) return null;
	const inBed = span(bed, up);
	const asleep = Math.max(0, Math.min(inBed, span(tried, woke) - (e.latency ?? 0) - (e.awake ?? 0)));
	return {
		inBed,
		asleep,
		efficiency: Math.round(asleep / inBed * 100)
	};
}
var formatDuration = (min) => {
	const h = Math.floor(min / 60);
	const m = Math.round(min % 60);
	return m ? `${h}h ${m}m` : `${h}h`;
};
var formatTime = (value) => {
	const m = toMinutes(value);
	if (m === null) return "Set time";
	const h = Math.floor(m / 60);
	const suffix = h >= 12 ? "pm" : "am";
	return `${h % 12 || 12}:${String(m % 60).padStart(2, "0")} ${suffix}`;
};
//#endregion
export { formatTime as n, nightMetrics as r, formatDuration as t };
