import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "../lib/auth";
import { AuthGate } from "../components/auth-ui";
import { ErrorScreen, NotFoundScreen, OfflineBanner } from "../components/skeleton";
import { registerServiceWorker } from "../lib/device";
import { pageView } from "@/lib/analytics";
import { restoreEvicted } from "@/lib/durable";
import { listenForReminderTaps } from "@/lib/local-reminders";
import { syncStatusBar } from "@/lib/native";
import { refreshStores } from "@/lib/storage-scope";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return <ErrorScreen reset={reset} />;
}

/* One place for what search engines and link previews read. The description says what iKAN
 * does and who it is for, rather than listing features. */
export const SITE_URL = "https://app.ikanhealth.in";
export const SITE_DESCRIPTION =
  "Check in on how you feel, take a validated mental health assessment, and work through " +
  "short daily programmes for sleep, stress and burnout. Private by default.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content",
      },
      { name: "theme-color", content: "#FBFBFD" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "iKAN" },
      { name: "application-name", content: "iKAN" },
      { name: "format-detection", content: "telephone=no" },
      { name: "msapplication-TileColor", content: "#151515" },
      { title: "iKAN — Mental wellness that fits your day" },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "author", content: "iKAN" },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: "iKAN" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:title", content: "iKAN — Mental wellness that fits your day" },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/pwa-512x512.png` },
      // The share image is the square app icon, so the small card is the honest choice: a
      // large-image card would letterbox it into a wide grey band.
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "iKAN — Mental wellness that fits your day" },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: `${SITE_URL}/pwa-512x512.png` },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon", sizes: "any" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundScreen,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => registerServiceWorker(), []);

  /* Screen views for GA4. The router is the source of the path on purpose: its matched route
   * id is the PATTERN ("/assessments/$slug"), so the condition someone screened for never
   * leaves the device. See analytics.ts. */
  const router = useRouter();
  useEffect(() => {
    const send = () => {
      const matches = router.state.matches;
      const last = matches[matches.length - 1];
      if (last) pageView(last.routeId, document.title);
    };
    send();
    return router.subscribe("onResolved", send);
  }, [router]);

  /* Android app only: put back anything the system evicted from the WebView's localStorage,
   * and colour the status bar to match the page. Both no-op on the web. */
  useEffect(() => {
    void restoreEvicted().then((n) => {
      if (n > 0) refreshStores();
    });
    void syncStatusBar(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  // Tapping a scheduled reminder opens the screen it points at.
  useEffect(() => {
    let stop = () => {};
    void listenForReminderTaps((url) => void router.navigate({ href: url })).then((f) => {
      stop = f;
    });
    return () => stop();
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGate>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </AuthGate>
        <OfflineBanner />
      </AuthProvider>
    </QueryClientProvider>
  );
}
