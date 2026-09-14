import { useEffect, useRef } from "react";

/* Android back (gesture or button) closes the open sheet instead of leaving the page.
 * Opening adds a history entry with the same address; back pops it and closes the sheet.
 * Closing any other way removes that entry again, unless the app has moved to another page. */

const MARK = "ikanSheet";
let seq = 0;

export function useBackToClose(open: boolean, close: () => void) {
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    if (!open || typeof window === "undefined") return;
    const id = ++seq;
    const href = window.location.href;
    const isOurs = () => (window.history.state as Record<string, unknown> | null)?.[MARK] === id;
    window.history.pushState({ ...(window.history.state ?? {}), [MARK]: id }, "", href);

    let popped = false;
    const onPop = () => {
      if (isOurs()) return;
      popped = true;
      closeRef.current();
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      if (popped) return;
      // let a navigation that caused the close land first, then tidy up only if we're still here
      window.setTimeout(() => {
        if (isOurs() && window.location.href === href) window.history.back();
      }, 0);
    };
  }, [open]);
}
