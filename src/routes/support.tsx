import { createFileRoute } from "@tanstack/react-router";
import { Phone, ShieldAlert } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { ProgramHeader, pageMeta } from "@/components/equip/program-header";

export const Route = createFileRoute("/support")({
  head: () =>
    pageMeta(
      "Get support now",
      "Free, confidential crisis helplines in India, available when you need to talk to someone.",
    ),
  component: SupportPage,
});

const lines = [
  {
    name: "Tele-MANAS",
    body: "Government of India mental health helpline · 24×7 · many languages",
    number: "14416",
    tel: "14416",
  },
  {
    name: "AASRA",
    body: "Suicide prevention and emotional support · 24×7",
    number: "+91 98204 66726",
    tel: "+919820466726",
  },
  {
    name: "Vandrevala Foundation",
    body: "Mental health helpline · 24×7 · call or WhatsApp",
    number: "+91 99996 66555",
    tel: "+919999666555",
  },
];

function SupportPage() {
  return (
    <IkanShell>
      <ProgramHeader back="/" eyebrow="You are not alone" title="Get support now" />

      <section className="px-5">
        <a
          href="tel:112"
          className="tile flex items-center gap-4 rounded-[24px] bg-alert p-5 text-alert-foreground"
        >
          <ShieldAlert className="h-8 w-8 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold">In immediate danger?</p>
            <p className="text-sm opacity-90">Call emergency services on 112</p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-alert-foreground/20">
            <Phone className="h-5 w-5" />
          </span>
        </a>

        <p className="mt-6 text-sm leading-6 text-muted-foreground">
          If you feel overwhelmed, speaking with someone trained can help right now. These lines are
          free and confidential.
        </p>

        <div className="mt-4 space-y-3">
          {lines.map((line) => (
            <a
              key={line.name}
              href={`tel:${line.tel}`}
              className="surface tile grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4"
            >
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold">{line.name}</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{line.body}</p>
                <p className="mt-1.5 font-display text-base font-semibold tabular-nums">
                  {line.number}
                </p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background">
                <Phone className="h-4 w-4" />
              </span>
            </a>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-xs text-center text-[10px] leading-4 text-muted-foreground">
          iKAN Equip is a self-help tool. It does not replace care from a qualified mental health
          professional.
        </p>
      </section>
    </IkanShell>
  );
}
