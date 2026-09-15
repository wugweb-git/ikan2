import type { CapacitorConfig } from "@capacitor/cli";

/* The Android app shows the live site (app.ikanhealth.in), so web updates reach it without a
 * Play Store release. Native features (Health Connect, sign-in return) are added in android/. */
const config: CapacitorConfig = {
  appId: "com.ikan.wugweb",
  appName: "iKAN",
  webDir: "native-shell",
  server: {
    url: "https://app.ikanhealth.in",
    errorPath: "index.html",
    allowNavigation: ["app.ikanhealth.in", "*.supabase.co"],
  },
  android: {
    backgroundColor: "#FBFBFD",
  },
};

export default config;
