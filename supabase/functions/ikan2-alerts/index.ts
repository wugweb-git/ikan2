// iKAN alert emails, sent through the ikanhealth.in mailbox on Hostinger (SMTP, port 465).
//
// Who calls it: database triggers (migration 20261119140000_alert_triggers.sql), one per
// table, after every insert:
//   ikan2_contact_messages        → "pilot_lead" when the subject starts "Pilot enquiry",
//                                   otherwise "contact"
//   ikan2_newsletter_subscribers  → "newsletter"
//   ikan2_partner_applications    → "partner_application"
//   auth.users                    → "new_user"
// Each call carries the x-cron-secret header (the same secret ikan2-push's scheduler uses), so
// nobody else can make it send. POST { "test": true } with the header sends a sample of each.
//
// Settings: host, port and sender are not secret, so they live in DEFAULTS and a Supabase
// secret of the same name overrides them. Set as Supabase secrets: SMTP_PASS (the mailbox
// password), ALERT_TO (comma-separated recipients) and PUSH_CRON_SECRET (already set).
import nodemailer from "npm:nodemailer@6.9.16";

const DEFAULTS: Record<string, string> = {
  SMTP_HOST: "smtp.hostinger.com",
  SMTP_PORT: "465",
  SMTP_USER: "vedanshu@ikanhealth.in",
};
const env = (k: string) => Deno.env.get(k) || DEFAULTS[k] || "";
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

// ── Brand (ikan2 src/styles.css tokens, as hex for mail clients) ─────────────────────────────
const C = {
  canvas: "#EDF0F4",
  card: "#FFFFFF",
  ink: "#0E1217",
  muted: "#5B6470",
  line: "#E3E7EC",
  soft: "#F6F8FA",
};
type Kind = "pilot_lead" | "contact" | "partner_application" | "newsletter" | "new_user";
type Row = Record<string, unknown>;

const ACCENT: Record<Kind, { ink: string; tint: string; label: string }> = {
  pilot_lead: { ink: "#8A5A00", tint: "#FBF0DC", label: "Pilot lead" },
  contact: { ink: "#455B9E", tint: "#E8ECF8", label: "Contact message" },
  partner_application: { ink: "#356B5A", tint: "#DFF3EE", label: "Partner application" },
  newsletter: { ink: "#0C6B4D", tint: "#DAF6E9", label: "Newsletter sign-up" },
  new_user: { ink: "#A83E38", tint: "#FBE6E4", label: "New app user" },
};
const LOGO = "https://app.ikanhealth.in/pwa-192x192.png";
const FONT_BODY = "Manrope, 'Segoe UI', Helvetica, Arial, sans-serif";
const FONT_DISPLAY = "Sora, 'Segoe UI', Helvetica, Arial, sans-serif";

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const str = (v: unknown) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v));
const when = (v: unknown) =>
  (v ? new Date(String(v)) : new Date()).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }) + " IST";
const SOURCE: Record<string, string> = { app: "the app", website: "ikanhealth.in" };
const from = (v: unknown) => SOURCE[str(v)] ?? str(v);

type Email = {
  subject: string;
  replyTo?: string;
  title: string;
  intro: string;
  facts: [string, string][];
  body?: { label: string; text: string };
  cta?: { label: string; href: string };
};

function render(kind: Kind, e: Email, at: string): string {
  const a = ACCENT[kind];
  const facts = e.facts
    .filter(([, v]) => v)
    .map(([k, v], i) => {
      const rule = i ? `border-top:1px solid ${C.line};` : "";
      return `
        <tr>
          <td style="padding:12px 0;${rule}width:38%;vertical-align:top;font:500 13px/20px ${FONT_BODY};color:${C.muted};">${esc(k)}</td>
          <td style="padding:12px 0;${rule}vertical-align:top;font:600 14px/20px ${FONT_BODY};color:${C.ink};word-break:break-word;">${v}</td>
        </tr>`;
    })
    .join("");
  const body = e.body?.text
    ? `
          <tr><td style="padding:8px 32px 0;">
            <div style="font:500 13px/20px ${FONT_BODY};color:${C.muted};margin:0 0 8px;">${esc(e.body.label)}</div>
            <div style="background:${C.soft};border-radius:12px;padding:16px 18px;font:400 14px/22px ${FONT_BODY};color:${C.ink};white-space:pre-wrap;word-break:break-word;">${esc(e.body.text)}</div>
          </td></tr>`
    : "";
  const cta = e.cta
    ? `
          <tr><td style="padding:28px 32px 4px;">
            <a href="${esc(e.cta.href)}" style="display:inline-block;background:${C.ink};color:#FFFFFF;text-decoration:none;font:600 14px/20px ${FONT_BODY};padding:12px 22px;border-radius:999px;">${esc(e.cta.label)}</a>
          </td></tr>`
    : "";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><title>${esc(e.subject)}</title></head>
<body style="margin:0;padding:0;background:${C.canvas};">
<div style="display:none;max-height:0;overflow:hidden;">${esc(e.intro)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.canvas};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
      <tr><td style="padding:0 4px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:middle;"><img src="${LOGO}" width="36" height="36" alt="iKAN" style="display:block;border:0;border-radius:999px;"></td>
          <td style="vertical-align:middle;padding-left:10px;font:700 18px/24px ${FONT_DISPLAY};color:${C.ink};letter-spacing:-0.01em;">iKAN</td>
        </tr></table>
      </td></tr>
      <tr><td style="background:${C.card};border-radius:20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:28px 32px 0;">
            <span style="display:inline-block;background:${a.tint};color:${a.ink};font:700 12px/16px ${FONT_BODY};letter-spacing:0.04em;text-transform:uppercase;padding:6px 12px;border-radius:999px;">${a.label}</span>
          </td></tr>
          <tr><td style="padding:16px 32px 0;font:700 24px/32px ${FONT_DISPLAY};color:${C.ink};letter-spacing:-0.015em;">${esc(e.title)}</td></tr>
          <tr><td style="padding:8px 32px 0;font:400 15px/24px ${FONT_BODY};color:${C.muted};">${esc(e.intro)}</td></tr>
          <tr><td style="padding:20px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${facts}</table>
          </td></tr>${body}${cta}
          <tr><td style="padding:28px 32px;font:400 12px/18px ${FONT_BODY};color:${C.muted};">Received ${esc(at)}</td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:20px 4px 0;font:400 12px/18px ${FONT_BODY};color:${C.muted};">
        An automatic alert from iKAN, sent to the team when something new arrives. Replying goes to the person who sent it, where there is one.
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

const mailto = (address: string, subject: string) =>
  `mailto:${address}?subject=${encodeURIComponent(subject)}`;
const link = (href: string, text: string) =>
  `<a href="${esc(href)}" style="color:${C.ink};text-decoration:underline;">${esc(text)}</a>`;

function compose(kind: Kind, r: Row): Email {
  const name = str(r.name);
  const address = str(r.email);
  const addressLink = address ? link(`mailto:${address}`, address) : "";
  const who = name || address;
  switch (kind) {
    case "pilot_lead": {
      // the calculator's subject is "Pilot enquiry, <company>, <n> people"
      const [, company = "", people = ""] = str(r.subject).split(/,\s*/);
      return {
        subject: `Pilot lead: ${company || who}${people ? ` (${people})` : ""}`,
        replyTo: address,
        title: company || "New pilot enquiry",
        intro: `${name || "Someone"} asked about a pilot from the burnout cost calculator.`,
        facts: [
          ["Name", esc(name)],
          ["Email", addressLink],
          ["Company", esc(company)],
          ["Team size", esc(people)],
          ["From", esc(from(r.source))],
        ],
        body: { label: "What they sent", text: str(r.message) },
        cta: address
          ? { label: `Reply to ${who}`, href: mailto(address, "Re: your iKAN pilot enquiry") }
          : undefined,
      };
    }
    case "contact": {
      const subject = str(r.subject) || "General enquiry";
      return {
        subject: `Contact: ${subject}, from ${who}`,
        replyTo: address,
        title: subject,
        intro: `${name || "Someone"} sent a message through ${from(r.source) || "the contact form"}.`,
        facts: [
          ["Name", esc(name)],
          ["Email", addressLink],
          ["From", esc(from(r.source))],
        ],
        body: { label: "Message", text: str(r.message) },
        cta: address
          ? { label: `Reply to ${who}`, href: mailto(address, `Re: ${subject}`) }
          : undefined,
      };
    }
    case "partner_application": {
      const type = str(r.category);
      const typeLabel = type ? type.charAt(0).toUpperCase() + type.slice(1) : "";
      const langs = Array.isArray(r.languages)
        ? (r.languages as unknown[]).map(str).filter(Boolean).join(", ")
        : "";
      const years = str(r.years_experience) ? `${str(r.years_experience)} years` : "";
      const place = [str(r.location), str(r.pincode)].filter(Boolean).join(", ");
      const phone = str(r.phone);
      return {
        subject: `Partner application: ${who}${typeLabel ? `, ${typeLabel}` : ""}`,
        replyTo: address,
        title: name || "New partner application",
        intro: `A new ${type || "partner"} applied to join iKAN. They were told to expect a reply within 3–5 business days.`,
        facts: [
          ["Partner type", esc(typeLabel)],
          ["Credentials", esc(str(r.credentials))],
          ["Experience", esc(years)],
          ["Location", esc(place)],
          ["Languages", esc(langs)],
          ["Email", addressLink],
          ["Phone", phone ? link(`tel:${phone.replace(/\s+/g, "")}`, phone) : ""],
        ],
        cta: { label: "Review in admin", href: "https://ikanhealth.in/admin" },
      };
    }
    case "newsletter":
      return {
        subject: `Newsletter: ${address}`,
        title: name || address,
        intro: `A new newsletter subscriber, from ${from(r.source) || "a sign-up form"}.`,
        facts: [
          ["Email", addressLink],
          ["Name", esc(name)],
          ["From", esc(from(r.source))],
        ],
      };
    case "new_user": {
      const p = str(r.provider);
      const method =
        p === "google"
          ? "Google"
          : p === "linkedin_oidc"
            ? "LinkedIn"
            : p === "email"
              ? "Email and password"
              : p;
      return {
        subject: `New user: ${who}`,
        title: who || "New account",
        intro: "Someone created an account in the iKAN app.",
        facts: [
          ["Name", esc(name)],
          ["Email", addressLink],
          ["Signed up with", esc(method)],
        ],
        cta: { label: "Open the app", href: "https://app.ikanhealth.in" },
      };
    }
  }
}

const SAMPLE = { name: "Test Person", email: "test@example.com" };
const SAMPLES: [Kind, Row][] = [
  [
    "pilot_lead",
    {
      ...SAMPLE,
      subject: "Pilot enquiry, Example Co, 250 people",
      message: "This is a sample pilot lead.\nHeadcount: 250\nEstimated annual cost: ₹1.2 crore",
      source: "website",
    },
  ],
  [
    "contact",
    {
      ...SAMPLE,
      subject: "General enquiry",
      message: "This is a sample contact message.",
      source: "website",
    },
  ],
  [
    "partner_application",
    {
      ...SAMPLE,
      name: "Dr Test Person",
      phone: "+91 98765 43210",
      category: "counselor",
      credentials: "MA Clinical Psychology",
      years_experience: 6,
      location: "Bengaluru",
      pincode: "560001",
      languages: ["English", "हिन्दी"],
    },
  ],
  ["newsletter", { ...SAMPLE, source: "app" }],
  ["new_user", { ...SAMPLE, provider: "google" }],
];

let transport: ReturnType<typeof nodemailer.createTransport> | null = null;
const mailer = () =>
  (transport ??= nodemailer.createTransport({
    host: env("SMTP_HOST"),
    port: Number(env("SMTP_PORT")),
    secure: Number(env("SMTP_PORT")) === 465,
    auth: { user: env("SMTP_USER"), pass: env("SMTP_PASS") },
  }));

async function send(kind: Kind, r: Row, test = false) {
  const e = compose(kind, r);
  const subject = `${test ? "[Test] " : ""}${e.subject}`;
  const plain = [
    e.title,
    e.intro,
    "",
    ...e.facts.filter(([, v]) => v).map(([k, v]) => `${k}: ${v.replace(/<[^>]+>/g, "")}`),
    e.body?.text ? `\n${e.body.label}:\n${e.body.text}` : "",
    e.cta ? `\n${e.cta.label}: ${e.cta.href}` : "",
  ].join("\n");
  return mailer().sendMail({
    from: `iKAN alerts <${env("SMTP_USER")}>`,
    to: env("ALERT_TO"),
    replyTo: e.replyTo || undefined,
    subject,
    html: render(kind, { ...e, subject }, when(r.created_at)),
    text: plain,
  });
}

const KINDS = new Set<Kind>([
  "pilot_lead",
  "contact",
  "partner_application",
  "newsletter",
  "new_user",
]);

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const secret = Deno.env.get("PUSH_CRON_SECRET") ?? "";
  if (!secret || req.headers.get("x-cron-secret") !== secret)
    return json({ error: "Forbidden" }, 403);
  const missing = ["SMTP_PASS", "ALERT_TO"].filter((k) => !env(k));
  if (missing.length) return json({ sent: false, missing }, 412);

  const body = await req.json().catch(() => ({}));
  try {
    if (body?.test === true) {
      const out = [];
      for (const [kind, row] of SAMPLES)
        out.push({ kind, response: (await send(kind, row, true)).response });
      return json({ sent: true, test: true, out });
    }
    const kind = body?.kind as Kind;
    const record = body?.record as Row;
    if (!KINDS.has(kind) || !record || typeof record !== "object")
      return json({ error: "Expected { kind, record }" }, 400);
    const info = await send(kind, record);
    return json({ sent: true, kind, response: info.response });
  } catch (e) {
    console.error("ikan2-alerts send failed:", e);
    return json({ sent: false, error: e instanceof Error ? e.message : String(e) }, 502);
  }
});
