import { cn } from "@/lib/utils";
import { ExternalLink } from "@/components/kit/link";

/** "Made by wugweb", linking to the studio's website. */
export function MadeBy({ className }: { className?: string }) {
  return (
    <p className={cn("text-center text-[12px] text-muted-foreground", className)}>
      Made by{" "}
      <ExternalLink
        href="https://wugweb.com"
        underline={false}
        className="font-semibold text-foreground hover:underline"
      >
        wugweb
      </ExternalLink>
    </p>
  );
}
