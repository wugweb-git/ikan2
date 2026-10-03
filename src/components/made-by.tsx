import { cn } from "@/lib/utils";

/** "Made by wugweb", linking to the studio's website. */
export function MadeBy({ className }: { className?: string }) {
  return (
    <p className={cn("text-center text-[12px] text-muted-foreground", className)}>
      Made by{" "}
      <a
        href="https://wugweb.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-foreground hover:underline"
      >
        wugweb
      </a>
    </p>
  );
}
