package com.ikan.wugweb.health

import android.content.Intent
import android.net.Uri
import androidx.activity.result.ActivityResult
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.HeartRateVariabilityRmssdRecord
import androidx.health.connect.client.records.Record
import androidx.health.connect.client.records.RestingHeartRateRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.AggregateGroupByPeriodRequest
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.ActivityCallback
import com.getcapacitor.annotation.CapacitorPlugin
import java.time.Duration
import java.time.LocalDate
import java.time.Period
import java.time.ZoneId
import java.util.TreeMap
import kotlin.reflect.KClass
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch

/**
 * Health Connect for the iKAN web app: availability, permission, and a daily summary of steps,
 * sleep, heart rate, resting heart rate, heart rate variability and exercise minutes.
 * Read only. Each data type is read only when its permission is granted, and one failing type
 * never stops the others.
 */
@CapacitorPlugin(name = "IkanHealth")
class IkanHealthPlugin : Plugin() {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    private val types: List<KClass<out Record>> = listOf(
        StepsRecord::class,
        SleepSessionRecord::class,
        HeartRateRecord::class,
        RestingHeartRateRecord::class,
        HeartRateVariabilityRmssdRecord::class,
        ExerciseSessionRecord::class,
    )
    private val permissions = types.map { HealthPermission.getReadPermission(it) }.toSet()

    private fun client() = HealthConnectClient.getOrCreate(context)

    override fun handleOnDestroy() {
        scope.cancel()
        super.handleOnDestroy()
    }

    /** "available", "update_required" (Health Connect needs installing or updating) or "unavailable". */
    @PluginMethod
    fun availability(call: PluginCall) {
        val status = when (HealthConnectClient.getSdkStatus(context)) {
            HealthConnectClient.SDK_AVAILABLE -> "available"
            HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED -> "update_required"
            else -> "unavailable"
        }
        call.resolve(JSObject().put("status", status))
    }

    /** Which of iKAN's health permissions are granted. */
    @PluginMethod
    fun granted(call: PluginCall) {
        scope.launch {
            try {
                call.resolve(grantedResult(client().permissionController.getGrantedPermissions()))
            } catch (e: Exception) {
                call.reject("Couldn’t check Health Connect permissions.", e)
            }
        }
    }

    /** Shows Health Connect's permission screen for iKAN's read permissions. */
    @PluginMethod
    fun connect(call: PluginCall) {
        if (HealthConnectClient.getSdkStatus(context) != HealthConnectClient.SDK_AVAILABLE) {
            call.reject("Health Connect isn’t available on this phone.", "UNAVAILABLE")
            return
        }
        val intent = PermissionController.createRequestPermissionResultContract()
            .createIntent(context, permissions)
        startActivityForResult(call, intent, "onConnectResult")
    }

    @ActivityCallback
    fun onConnectResult(call: PluginCall?, result: ActivityResult) {
        if (call == null) return
        scope.launch {
            try {
                call.resolve(grantedResult(client().permissionController.getGrantedPermissions()))
            } catch (e: Exception) {
                call.reject("Couldn’t check Health Connect permissions.", e)
            }
        }
    }

    /** Opens Health Connect so people can change or remove iKAN's access. */
    @PluginMethod
    fun openSettings(call: PluginCall) {
        try {
            activity.startActivity(Intent(HealthConnectClient.ACTION_HEALTH_CONNECT_SETTINGS))
            call.resolve()
        } catch (e: Exception) {
            call.reject("Couldn’t open Health Connect.", e)
        }
    }

    /** Opens the Play Store listing to install or update Health Connect. */
    @PluginMethod
    fun install(call: PluginCall) {
        val uri = Uri.parse(
            "market://details?id=com.google.android.apps.healthdata&url=healthconnect%3A%2F%2Fonboarding",
        )
        try {
            activity.startActivity(Intent(Intent.ACTION_VIEW, uri).setPackage("com.android.vending"))
        } catch (e: Exception) {
            activity.startActivity(
                Intent(
                    Intent.ACTION_VIEW,
                    Uri.parse("https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata"),
                ),
            )
        }
        call.resolve()
    }

    /** One summary per day for the last `days` days (default 30, at most 90). */
    @PluginMethod
    fun readDaily(call: PluginCall) {
        val days = (call.getInt("days") ?: 30).coerceIn(1, 90)
        scope.launch {
            try {
                call.resolve(readDays(days))
            } catch (e: Exception) {
                call.reject("Couldn’t read Health Connect.", e)
            }
        }
    }

    private fun grantedResult(granted: Set<String>): JSObject {
        val list = JSArray()
        types.forEach { type ->
            if (HealthPermission.getReadPermission(type) in granted) list.put(nameOf(type))
        }
        return JSObject().put("granted", list).put("all", granted.containsAll(permissions))
    }

    private fun nameOf(type: KClass<out Record>) = when (type) {
        StepsRecord::class -> "steps"
        SleepSessionRecord::class -> "sleep"
        HeartRateRecord::class -> "heart_rate"
        RestingHeartRateRecord::class -> "resting_heart_rate"
        HeartRateVariabilityRmssdRecord::class -> "hrv"
        ExerciseSessionRecord::class -> "exercise"
        else -> "other"
    }

    private suspend fun readDays(days: Int): JSObject {
        val client = client()
        val zone = ZoneId.systemDefault()
        val today = LocalDate.now(zone)
        val start = today.minusDays((days - 1).toLong()).atStartOfDay()
        val end = today.plusDays(1).atStartOfDay()
        val granted = client.permissionController.getGrantedPermissions()
        fun has(type: KClass<out Record>) = HealthPermission.getReadPermission(type) in granted

        val out = TreeMap<String, JSObject>()
        fun day(date: LocalDate): JSObject =
            out.getOrPut(date.toString()) { JSObject().put("date", date.toString()) }
        val errors = JSArray()
        suspend fun attempt(label: String, block: suspend () -> Unit) {
            try {
                block()
            } catch (e: Exception) {
                errors.put("$label: ${e.javaClass.simpleName}")
            }
        }

        val dayRange = TimeRangeFilter.between(start, end)
        val oneDay = Period.ofDays(1)

        if (has(StepsRecord::class)) attempt("steps") {
            client.aggregateGroupByPeriod(
                AggregateGroupByPeriodRequest(setOf(StepsRecord.COUNT_TOTAL), dayRange, oneDay),
            ).forEach { r ->
                r.result[StepsRecord.COUNT_TOTAL]?.let { day(r.startTime.toLocalDate()).put("steps", it) }
            }
        }

        if (has(ExerciseSessionRecord::class)) attempt("exercise") {
            client.aggregateGroupByPeriod(
                AggregateGroupByPeriodRequest(
                    setOf(ExerciseSessionRecord.EXERCISE_DURATION_TOTAL),
                    dayRange,
                    oneDay,
                ),
            ).forEach { r ->
                r.result[ExerciseSessionRecord.EXERCISE_DURATION_TOTAL]?.let {
                    day(r.startTime.toLocalDate()).put("exercise_minutes", it.toMinutes())
                }
            }
        }

        if (has(HeartRateRecord::class)) attempt("heart_rate") {
            client.aggregateGroupByPeriod(
                AggregateGroupByPeriodRequest(setOf(HeartRateRecord.BPM_AVG), dayRange, oneDay),
            ).forEach { r ->
                r.result[HeartRateRecord.BPM_AVG]?.let { day(r.startTime.toLocalDate()).put("heart_rate", it) }
            }
        }

        if (has(RestingHeartRateRecord::class)) attempt("resting_heart_rate") {
            client.aggregateGroupByPeriod(
                AggregateGroupByPeriodRequest(
                    setOf(RestingHeartRateRecord.BPM_AVG),
                    dayRange,
                    oneDay,
                ),
            ).forEach { r ->
                r.result[RestingHeartRateRecord.BPM_AVG]?.let {
                    day(r.startTime.toLocalDate()).put("resting_heart_rate", it)
                }
            }
        }

        val startInstant = start.atZone(zone).toInstant()
        val endInstant = end.atZone(zone).toInstant()

        if (has(SleepSessionRecord::class)) attempt("sleep") {
            // a night belongs to the morning it ended; look back 18h for sessions that began the evening before
            val filter = TimeRangeFilter.between(startInstant.minus(Duration.ofHours(18)), endInstant)
            val asleep = HashMap<String, Long>()
            val awake = HashMap<String, Long>()
            val deep = HashMap<String, Long>()
            val rem = HashMap<String, Long>()
            var token: String? = null
            do {
                val page = client.readRecords(
                    ReadRecordsRequest(SleepSessionRecord::class, filter, pageSize = 500, pageToken = token),
                )
                page.records.forEach { s ->
                    val date = s.endTime.atZone(zone).toLocalDate()
                    if (date.isBefore(start.toLocalDate())) return@forEach
                    val key = date.toString()
                    if (s.stages.isEmpty()) {
                        asleep[key] = (asleep[key] ?: 0) + Duration.between(s.startTime, s.endTime).toMinutes()
                    } else {
                        s.stages.forEach { st ->
                            val m = Duration.between(st.startTime, st.endTime).toMinutes()
                            when (st.stage) {
                                SleepSessionRecord.STAGE_TYPE_AWAKE,
                                SleepSessionRecord.STAGE_TYPE_AWAKE_IN_BED,
                                SleepSessionRecord.STAGE_TYPE_OUT_OF_BED -> awake[key] = (awake[key] ?: 0) + m
                                else -> {
                                    asleep[key] = (asleep[key] ?: 0) + m
                                    if (st.stage == SleepSessionRecord.STAGE_TYPE_DEEP) deep[key] = (deep[key] ?: 0) + m
                                    if (st.stage == SleepSessionRecord.STAGE_TYPE_REM) rem[key] = (rem[key] ?: 0) + m
                                }
                            }
                        }
                    }
                }
                token = page.pageToken
            } while (token != null)
            asleep.forEach { (k, v) -> day(LocalDate.parse(k)).put("sleep_minutes", v) }
            awake.forEach { (k, v) -> day(LocalDate.parse(k)).put("awake_minutes", v) }
            deep.forEach { (k, v) -> day(LocalDate.parse(k)).put("deep_minutes", v) }
            rem.forEach { (k, v) -> day(LocalDate.parse(k)).put("rem_minutes", v) }
        }

        if (has(HeartRateVariabilityRmssdRecord::class)) attempt("hrv") {
            val sums = HashMap<String, Pair<Double, Int>>()
            var token: String? = null
            do {
                val page = client.readRecords(
                    ReadRecordsRequest(
                        HeartRateVariabilityRmssdRecord::class,
                        TimeRangeFilter.between(startInstant, endInstant),
                        pageSize = 1000,
                        pageToken = token,
                    ),
                )
                page.records.forEach { r ->
                    val key = r.time.atZone(zone).toLocalDate().toString()
                    val (sum, n) = sums[key] ?: (0.0 to 0)
                    sums[key] = (sum + r.heartRateVariabilityMillis) to (n + 1)
                }
                token = page.pageToken
            } while (token != null)
            sums.forEach { (k, v) -> day(LocalDate.parse(k)).put("hrv_ms", Math.round(v.first / v.second * 10) / 10.0) }
        }

        val list = JSArray()
        out.values.forEach { list.put(it) }
        return JSObject().put("days", list).put("errors", errors)
    }
}
