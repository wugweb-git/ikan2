import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { IconButton, TopAppBar } from "@/components/equip/m3";
import { useAuth } from "@/lib/auth";

/** About, FAQ, Contact and legal pages are open to everyone. Signed-in people get the app
 * navigation; everyone else gets the page with a back button. */
export function InfoShell({ title, children }: { title?: string; children: ReactNode }) {
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
      <IkanShell>
        {bar}
        {children}
      </IkanShell>
    );
  }
  return (
    <div className="min-h-dvh bg-canvas text-foreground">
      <main className="mx-auto min-h-dvh w-full max-w-app bg-background pb-12 shadow-app">
        {bar}
        {children}
      </main>
    </div>
  );
}
