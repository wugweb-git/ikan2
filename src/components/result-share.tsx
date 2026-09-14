import { useState } from "react";
import { Download, Mail, Share2 } from "lucide-react";
import { BottomSheet, IconButton } from "@/components/equip/m3";
import { cn } from "@/lib/utils";

/** iKAN mark and name, for the top row of a result (and its printed copy). */
export function BrandTitle({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <img src="/favicon.svg" alt="" className="h-7 w-7 rounded-[8px]" />
      <span className="font-display text-[18px] font-semibold">iKAN</span>
    </span>
  );
}

/** Only in the printed / downloaded copy: brand and when it was made. */
export function PrintHeader({ title }: { title: string }) {
  return (
    <div className="hidden border-b border-foreground/15 px-4 pb-3 pt-2 print:flex print:items-center print:justify-between">
      <BrandTitle />
      <span className="text-[12px] text-muted-foreground">
        {title} ·{" "}
        {new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
    </div>
  );
}

/** Small share button: download the result (save as PDF) or email a plain summary. */
export function ShareButton({ subject, body }: { subject: string; body: string }) {
  const [open, setOpen] = useState(false);
  const rows = [
    {
      icon: Download,
      label: "Download",
      note: "Save this result as a PDF",
      run: () => {
        setOpen(false);
        // let the sheet close before the print dialog opens
        window.setTimeout(() => window.print(), 250);
      },
    },
    {
      icon: Mail,
      label: "Email",
      note: "Send a summary from your email app",
      run: () => {
        setOpen(false);
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
          `${body}\n\nShared from iKAN`,
        )}`;
      },
    },
  ];
  return (
    <>
      <IconButton label="Download or email" onClick={() => setOpen(true)} className="print:hidden">
        <Share2 className="h-5 w-5" />
      </IconButton>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="Save or share">
        <ul className="space-y-2">
          {rows.map((r) => {
            const Icon = r.icon;
            return (
              <li key={r.label}>
                <button
                  type="button"
                  onClick={r.run}
                  className="flex w-full items-center gap-3 rounded-[16px] bg-secondary px-4 py-3 text-left"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-background">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold">{r.label}</span>
                    <span className="block text-[13px] text-muted-foreground">{r.note}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </BottomSheet>
    </>
  );
}
