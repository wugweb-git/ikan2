import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "../lib/auth";
import { AuthGate } from "../components/auth-ui";
import { ErrorScreen, NotFoundScreen, OfflineBanner } from "../components/skeleton";
import { registerServiceWorker } from "../lib/device";
import { restoreEvicted } from "@/lib/durable";
import { syncStatusBar } from "@/lib/native";
import { refreshStores } from "@/lib/storage-scope";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return <ErrorScreen reset={reset} />;
}

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
      { title: "iKAN — Personal Wellness" },
      {
        name: "description",
        content: "Personalized mental wellness check-ins, self-help programs, and assessments.",
      },
      { name: "author", content: "iKAN" },
      { property: "og:title", content: "iKAN — Personal Wellness" },
      {
        property: "og:description",
        content: "Personalized mental wellness check-ins, self-help programs, and assessments.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

  /* Android app only: put back anything the system evicted from the WebView's localStorage,
   * and colour the status bar to match the page. Both no-op on the web. */
  useEffect(() => {
    void restoreEvicted().then((n) => {
      if (n > 0) refreshStores();
    });
    void syncStatusBar(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

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
