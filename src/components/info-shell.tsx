import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { IconButton, TopAppBar } from "@/components/equip/m3";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

/** About, FAQ, Contact and legal pages are open to everyone. Signed-in people get the app
 * navigation; everyone else gets the page with a back button. */
export function InfoShell({
  title,
  children,
  wide = false,
}: {
  title?: string;
  children: ReactNode;
  /** Long-form pages read at a wider measure on a laptop. */
  wide?: boolean | undefined;
}) {
  const { status } = useAuth();
  const router = useRouter();
  const back = () =>
    window.history.length > 1 ? router.history.back() : router.navigate({ to: "/" });
  const bar = (
    <TopAppBar
      leading={
        <IconButton label="Back" onClick={back}>
          <ArrowLeft className="h-6 w-6" />
        </IconButton>
      }
      {...(title ? { title } : {})}
    />
  );

  if (status === "signedIn") {
    return (
      <IkanShell wide={wide}>
        {bar}
        {children}
      </IkanShell>
    );
  }
  return (
    <div className="min-h-dvh bg-canvas text-foreground">
      <main
        className={cn(
          "mx-auto min-h-dvh w-full bg-background pb-12 shadow-app",
          wide ? "max-w-read" : "max-w-app",
        )}
      >
        {bar}
        {children}
      </main>
    </div>
  );
}
