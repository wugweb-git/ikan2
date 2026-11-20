import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Cross-repo slug aliases from ikan marketing site
      if (pathname === "/equip-programs" || pathname === "/equip-programs/") {
        return Response.redirect(new URL("/program", request.url), 301);
      }
      if (pathname.startsWith("/equip-programs/")) {
        const target = pathname.replace(/^\/equip-programs/, "/program");
        return Response.redirect(new URL(target + url.search, request.url), 301);
      }
      if (pathname === "/consultation" || pathname === "/consultation/") {
        return Response.redirect(new URL("/consult", request.url), 301);
      }
      if (pathname.startsWith("/consultation/")) {
        const target = pathname.replace(/^\/consultation/, "/consult");
        return Response.redirect(new URL(target + url.search, request.url), 301);
      }
      if (pathname === "/burnout-cost-calculator" || pathname === "/burnout-cost-calculator/") {
        return Response.redirect(new URL("https://ikanhealth.in/burnout-cost-calculator/"), 302);
      }
      if (pathname === "/join/partner" || pathname === "/join/partner/") {
        return Response.redirect(new URL("https://ikanhealth.in/join/partner/"), 302);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
