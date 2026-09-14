import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The person's photo filling its circle; shows `children` (initials) if there is none or it fails. */
export function ProfilePhoto({
  src,
  className,
  children,
}: {
  src?: string | undefined;
  className?: string;
  children: ReactNode;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  if (src && failed !== src) {
    return (
      <img
        src={src}
        alt=""
        onError={() => setFailed(src)}
        className={cn("h-full w-full rounded-full object-cover", className)}
      />
    );
  }
  return <>{children}</>;
}
