# R8 rules for the iKAN app.
#
# The thing to understand before touching this file: Capacitor does not call plugins directly.
# It finds them by reflection - scanning for the @CapacitorPlugin annotation, then invoking
# @PluginMethod methods by name from JavaScript. R8 sees no caller for any of it and, left to
# itself, deletes or renames the lot. The app then starts to a blank WebView with no crash and
# no stack trace, which is a miserable thing to debug. Every rule below exists to prevent that.

# Annotations must survive, or the plugin scan finds nothing at all.
-keepattributes *Annotation*, Signature, InnerClasses, EnclosingMethod
# Readable crash reports from Play Console; without these every frame is a synthetic name.
-keepattributes SourceFile, LineNumberTable
-renamesourcefileattribute SourceFile

# ---- Capacitor core -------------------------------------------------------
-keep class com.getcapacitor.** { *; }
-keep interface com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod <methods>;
    @com.getcapacitor.annotation.PermissionCallback <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
}
# Plugins are named as strings in capacitor.plugins.json and resolved by reflection.
-keep class * extends com.getcapacitor.Plugin { *; }

# Anything reachable from JavaScript through the WebView bridge.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ---- Cordova, which Capacitor still hosts ---------------------------------
-keep class org.apache.cordova.** { *; }

# ---- This app's own plugin ------------------------------------------------
-keep class com.ikan.wugweb.** { *; }

# ---- Health Connect -------------------------------------------------------
# Record types are resolved from KClass at runtime (see IkanHealthPlugin.types).
-keep class androidx.health.connect.client.records.** { *; }
-keep class androidx.health.connect.client.permission.** { *; }

# ---- Firebase / FCM -------------------------------------------------------
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }

# ---- Kotlin ---------------------------------------------------------------
-keep class kotlin.Metadata { *; }
-keepclassmembers class **$WhenMappings { <fields>; }

# Quieten warnings for optional dependencies that are never on our classpath.
-dontwarn org.slf4j.**
-dontwarn javax.annotation.**
# A Kotlin-extensions shim the Firebase installations library references but that is not on our
# classpath - we use the Java API. R8 generated this rule itself.
-dontwarn com.google.firebase.ktx.Firebase
