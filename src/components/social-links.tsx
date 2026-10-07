import { Facebook, Instagram, Linkedin, Newspaper, type LucideIcon } from "lucide-react";
import { stateLayer } from "@/components/equip/m3";
import { cn } from "@/lib/utils";

/* Where else to find iKAN, as a row of icons. Shared by Contact and Settings so the two never
 * drift apart.
 *
 * The house rule says an external link ends in an arrow (kit/link.tsx). A row of brand marks is
 * the exception: the marks themselves say "this leaves the app", and five arrows would bury
 * them. Screen readers still get "(opens in a new tab)" on each, as ExternalLink gives them. */

/** X's mark. Lucide's Twitter icon is the retired bird, so it is drawn here, in the same
 * currentColor outline weight as the lucide marks beside it. */
function XMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.17h1.7L7.4 4.73H5.58l11.09 14.44Z" />
    </svg>
  );
}

type Social = { label: string; href: string; Icon: LucideIcon | typeof XMark };

const socials: Social[] = [
  { label: "iKAN on Instagram", href: "https://www.instagram.com/ikanhealth_in/", Icon: Instagram },
  { label: "iKAN on X", href: "https://x.com/ikanhealth_in", Icon: XMark },
  {
    label: "iKAN on LinkedIn",
    href: "https://www.linkedin.com/company/ikan-mental-health/",
    Icon: Linkedin,
  },
  { label: "iKAN on Facebook", href: "https://www.facebook.com/ikanhealth_in", Icon: Facebook },
  { label: "The iKAN newsletter", href: "https://ikanhealth.beehiiv.com/", Icon: Newspaper },
];

export function SocialLinks({ className }: { className?: string }) {
  return (
    <nav aria-label="iKAN elsewhere" className={cn("text-center", className)}>
      <p className="type-label-md text-muted-foreground">Follow @ikanhealth_in</p>
      <ul className="mt-1 flex justify-center gap-1">
        {socials.map(({ label, href, Icon }) => (
          <li key={href}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={label}
              className={cn(
                "grid h-12 w-12 place-items-center rounded-full text-muted-foreground",
                stateLayer,
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">{label} (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
